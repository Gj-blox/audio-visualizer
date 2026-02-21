window.onload = function() {
    const audioFile = document.getElementById('audioFile');
    const canvas = document.getElementById('visualizer');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth * 0.8;
    canvas.height = window.innerHeight * 0.5;

    let audioContext;
    let audioSource;
    let analyser;
    let bufferLength;
    let dataArray;

    // Function to initialize audio context on user interaction (file selection)
    audioFile.addEventListener('change', function() {
        if (!audioContext) {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
            audioSource = audioContext.createMediaElementSource(new Audio());
            analyser = audioContext.createAnalyser();
            audioSource.connect(analyser);
            analyser.connect(audioContext.destination);
            analyser.fftSize = 256;
            bufferLength = analyser.frequencyBinCount;
            dataArray = new Uint8Array(bufferLength);
        }
        
        const files = this.files;
        if (files.length > 0) {
            const audioUrl = URL.createObjectURL(files[0]);
            audioSource.mediaElement.src = audioUrl;
            audioSource.mediaElement.play();
            document.querySelector('h1').textContent = "Now Playing: " + files[0].name;
            drawVisualizer();
        }
    });

    function drawVisualizer() {
        requestAnimationFrame(drawVisualizer);
        analyser.getByteFrequencyData(dataArray);

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const barWidth = (canvas.width / bufferLength) * 2.5;
        let barHeight;
        let x = 0;

        for (let i = 0; i < bufferLength; i++) {
            barHeight = dataArray[i];

            // Create a simple color gradient for the bars
            const hue = i * 2;
            ctx.fillStyle = 'hsl(' + hue + ', 100%, 50%)';
            ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);

            x += barWidth + 1;
        }
    }
};
