import { RecordRTCPromisesHandler, StereoAudioRecorder } from "recordrtc";

const prime_keywords = ["guess, try"];
const play_keywords = ["cool, good, submit, go, confirm, okay"];

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
                        audio_data: base64data.split("base64,")[1],
                        punctuate: false,
                        format_text: false
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

export default async function listen(token_url, samples, prime_cb, play_cb, finish_cb) {
    // Ensure the microphone can be accessed
    if (!navigator.mediaDevices.getUserMedia) {
        alert("Browser does not support required microphone access method");
        return;
    }

    // Query token server for session token
    let data;

    try {
        const response = await fetch(token_url);
        data = await response.json();
    }
    catch {
        alert("Failed to get session token");
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

            for (const [index, word] of res.words.entries()) {
                // Prime guess
                if (prime_keywords.includes(word.text.toLowerCase()) && index + 1 < res.words.length) {
                    let guess = res.words[index + 1].text.toLowerCase();     
                    prime_cb(guess);
                    break;
                }

                // Play guess
                else if (play_keywords.includes(word.text.toLowerCase())) {
                    play_cb();

                    if (finish_cb()) {
                        socket.close();
                    }

                    break;
                }
            }
        }

        else if (res?.hasOwnProperty("error")) {
            alert(res.error);
        }

        return false;
    };

    socket.onerror = event => {
        console.error(event);
        socket.close();
    }

    socket.onclose = () => {
        if (!recorder) {
            recorder.stopRecording();
        }
        socket = null;
    }

    socket.onopen = () => {
        navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => recorder = handleAudioStream(socket, stream, samples))
        .catch(() => alert("Permission to use the microphone must be granted to access this page"));
    };
}