const PORT = 3000;
const SAMPLERATE = 16000;

const listen = async () => {
    // Request session token from backend
    const response = await fetch('http://localhost:8000');
    const data = await response.json();

    if (data.error) {
        alert(data.error);
        return;
    }

    const { token } = data;

    // Create WebSocket for AssemblyAI realtime
    let socket = new WebSocket(`wss://api.assemblyai.com/v2/realtime/ws?sample_rate=${SAMPLERATE}&token=${token}`);

    // Handle incoming messages
    const messages = {};
    
    socket.onmessage = message => {
        let msg = '';
        const res = JSON.parse(message.data);

        messages[res.audio_start] = res.text;
        const keys = Object.keys(messages);
        keys.sort((a, b) => a - b);

        for (const key of keys) {
            if (texts[key]) {
                msg += ` ${texts[key]}`;
            }
        }

        console.log(messages);
    };

    socket.onerror = (event) => {
        console.error(event);
        socket.close();
    }

    socket.onclose = event => {
        console.log(event);
        socket = null;
    }

    socket.onopen = () => {
        navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
            let recorder = new(stream, {
                type: 'audio',
                mimeType: 'audio/webm;codecs=pcm',  // Requires 16 bit PCM audio
                recorderType: StereoAudioRecorder,
                timeSlice: 250,                     // 250 ms data intervals
                desiredSampRate: SAMPLERATE,
                numberOfAudioChannels: 1,
                bufferSize: 4096,
                audioBitsPerSecond: 128000,
                
                ondataavailable: (blob) => {
                    const reader = new FileReader();
                    reader.onload = () => {
                        const base64data = reader.result;

                        // Data must be sent in B64
                        if (socket) {
                            socket.send(JSON.stringify({ audio_data: base64data.split('base64,')[1] }));
                        }
                    };
            
                reader.readAsDataURL(blob);
                }
            });

            recorder.startRecording();
        })
        .catch(err => console.error(err));
    };
}

listen();