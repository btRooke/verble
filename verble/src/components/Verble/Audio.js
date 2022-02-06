import { RecordRTCPromisesHandler, StereoAudioRecorder } from "recordrtc";

// Alphabetised Wordle data sets from https://gist.github.com/cfreshman
import valid_guesses from "./wordle_guesses.txt";
import valid_answers from "./wordle_answers.txt";

const prime_keywords = ["guess"];
const play_keywords = ["cool"];

class Audio {
    static async listen(token_url, samples, prime_cb, play_cb) {
        // Ensure the microphone can be accessed
        if (!navigator.mediaDevices.getUserMedia) {
            alert("Browser does not support required microphone access method");
            return;
        }

        // Get all valid words
        let words = new Set();

        let guess_res = await fetch(valid_guesses);
        let guesses = await guess_res.text();

        let answer_res = await fetch(valid_answers);
        let answers = await answer_res.text();
        
        guesses.split(/(?:\r?\n)+/).forEach(word => words.add(word.trim()));
        answers.split(/(?:\r?\n)+/).forEach(word => words.add(word.trim()));
        console.log(`Loaded ${words.size} words`);

        // Query token server for session token
        const response = await fetch(token_url);
        const data = await response.json();

        // Create WebSocket for AssemblyAI realtime
        let params = {
            token: data.token,
            sample_rate: samples,
            word_boost: JSON.stringify(prime_keywords.concat(play_keywords))   // Give priority to keywords
        }

        let socket = new WebSocket(`wss://api.assemblyai.com/v2/realtime/ws?${new URLSearchParams(params).toString()}`);
        
        // Handle incoming transcripts
        socket.onmessage = message => {
            const res = JSON.parse(message.data);

            // Ignore partial transcripts
            if (res?.message_type?.endsWith("Transcript")) {
                console.log(`Received transcript: ${res.text}`);

                for (const [index, word] of res.words.entries()) {
                    // Guess keyword - check if the next word is 5 letters
                    if (prime_keywords.includes(word.text.toLowerCase()) && index + 1 < res.words.length) {
                        let guess = res.words[index + 1].text.toLowerCase();
                        prime_cb(guess);
                        break;
                    }

                    else if (play_keywords.includes(word.text.toLowerCase())) {
                        play_cb();
                        break;
                    }
                }
            }

            return false;
        };

        socket.onerror = (event) => {
            console.error(event);
            socket.close();
        }

        socket.onclose = event => {
            socket = null;
        }

        socket.onopen = () => {
            navigator.mediaDevices.getUserMedia({ audio: true })
            .then(stream => this.handleAudioStream(socket, stream))
            .catch(() => alert("Permission to use the microphone must be granted to access this page"));
        };
    }

    static handleAudioStream(socket, stream, samples) {
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
    }
}

export default Audio;