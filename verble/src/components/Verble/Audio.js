import { RecordRTCPromisesHandler, StereoAudioRecorder } from "recordrtc";

const prime_keywords = ["guess", "try", "use", "pick", "consider", "perhaps"];
const play_keywords = ["cool", "good", "submit", "go", "confirm", "okay", "nice"];
const close_keywords = ["close", "exit", "quit"];

let alertHandler = msg => alertHandler(msg);

export function setalertHandler(func) {
    alertHandler = func;
}

const handleAudioStream = (socket, stream, samples) => {
    let recorder = new RecordRTCPromisesHandler(stream, {
        type: "audio",
        mimeType: "audio/webm;codecs=pcm",  // Require 16 bit PCM audio
        recorderType: StereoAudioRecorder,
        timeSlice: 250,                     // 250 ms intervals
        desiredSampRate: samples,
        numberOfAudioChannels: 1,
        bufferSize: 4096,
        audioBitsPerSecond: 128000,

        ondataavailable: blob => {
            const reader = new FileReader();
            
            reader.onload = () => {
                const base64data = reader.result;

                // Data must be sent as B64
                if (socket && socket.readyState === socket.OPEN) {
                    socket.send(JSON.stringify({ 
                        audio_data: base64data.split("base64,")[1]
                    }));
                }
            };
            
            reader.readAsDataURL(blob);
        }
    });

    recorder.startRecording();
    console.log("Started recording audio");
    return recorder;
}

export default async function listen(token_url, samples, prime_cb, play_cb, phrase_cb, finish_cb, close_cb, err_cb) {

    // Ensure the microphone can be accessed
    if (!navigator.mediaDevices.getUserMedia) {
        alertHandler("Browser does not support required microphone access method");
        return;
    }

    // Query token server for session token
    let data;

    try {
        const response = await fetch(token_url);
        data = await response.json();
    }
    catch {
        alertHandler("Failed to get session token");
        return;
    }
    
    // Create WebSocket for AssemblyAI realtime
    let params = {
        token: data.token,
        sample_rate: samples,
        word_boost: JSON.stringify(prime_keywords.concat(play_keywords))   // Give priority to keywords
    }

    let socket = new WebSocket(`wss://api.assemblyai.com/v2/realtime/ws?${new URLSearchParams(params).toString()}`);
    let recorder;
    
    // Handle incoming transcripts
    socket.onmessage = message => {
        const res = JSON.parse(message.data);

        // Ignore partial transcripts
        if (res?.message_type?.endsWith("Transcript")) {
            console.log(`Received transcript: ${res.text}`);

            if (res.message_type === "FinalTranscript") {
                phrase_cb(res.text);
            }

            let matched = false;

            for (const [index, word] of res.words.entries()) {
                // Prime guess
                if (prime_keywords.includes(word.text.toLowerCase()) && index + 1 < res.words.length) {
                    matched = true;
                    let guess = res.words[index + 1].text.toLowerCase();
                    prime_cb(guess);
                }

                // Play guess
                else if (play_keywords.includes(word.text.toLowerCase())) {
                    matched = true;
                    play_cb();

                    if (finish_cb()) {
                        socket.close();
                    }
                }

                // Close modal message
                else if (close_keywords.includes(word.text.toLowerCase())) {
                    matched = true;
                    close_cb();
                }
            }

            if (res.text.length > 0 && !matched) {
                err_cb();
            }

        }

        else if (res?.hasOwnProperty("error")) {
            alertHandler(res.error);
        }

        return false;
    };

    socket.onerror = event => {
        console.error(event);
        socket.close();
    }

    socket.onclose = () => {
        if (recorder) {
            recorder.stopRecording();
        }
        socket = null;
    }

    socket.onopen = () => {
        navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => recorder = handleAudioStream(socket, stream, samples))
        .catch(() => alertHandler("Permission to use the microphone must be granted to access this page"));

        alertHandler(
            "<h2>VERBLE</h2> <br/><br/>" + 
            "<p>To prepare a guess, say a prepare keyword followed by your guess.</p> <br/>" +
            "<p>If it is a valid guess, it will appear in the grid</p> <br/>" +
            `<p>Valid keywords are: ${prime_keywords.join(", ")}</p> <br/><br/>` +
            `<p>To submit the guess, say one of: ${play_keywords.join(", ")}</p> <br/><br/>` +
            `<p>These dialogues can also be voice controlled while the microphone is recording - try closing it using one of: ${close_keywords.join(", ")}</p>`);
    };
}