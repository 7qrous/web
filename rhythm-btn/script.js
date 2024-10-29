const audio = document.getElementById('audio');
const playButton = document.getElementById('play-button');
const scoreDisplay = document.getElementById('score');
const keys = document.querySelectorAll('.key');
const lines = document.querySelectorAll('.line');
let score = 0;
let audioContext;
let analyser;
let dataArray;

playButton.addEventListener('click', startAudio);

function startAudio() {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const source = audioContext.createMediaElementSource(audio);
    analyser = audioContext.createAnalyser();

    source.connect(analyser);
    analyser.connect(audioContext.destination);

    analyser.fftSize = 2048;
    dataArray = new Uint8Array(analyser.frequencyBinCount);

    audio.play();
    analyzeAudio();
}

function analyzeAudio() {
    requestAnimationFrame(analyzeAudio);
    analyser.getByteFrequencyData(dataArray);

    // 패턴을 생성하는 로직
    const patternIndex = getPatternIndex(dataArray);
    if (patternIndex !== -1) {
        highlightKey(patternIndex);
        dropNote(patternIndex); // 노트 떨어뜨리기
    }
}

function getPatternIndex(data) {
    const threshold = 150; // 패턴 감지 임계값
    for (let i = 0; i < data.length; i++) {
        if (data[i] > threshold) {
            return i % keys.length; // 키 개수에 맞춰 인덱스 조정
        }
    }
    return -1; // 패턴이 감지되지 않음
}

function highlightKey(index) {
    const key = keys[index];
    key.classList.add('active');
    setTimeout(() => {
        key.classList.remove('active');
    }, 300); // 0.3초 동안 강조
}
