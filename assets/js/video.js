let seconds,
    minutes,
    recorder,
    time;

function initialize() {

    apiKey = 'duWp1AbaRZc1R09EEFyvRnlgUflkMgmt';
    abortController = new AbortController();
    signal = abortController.signal;

    if (localStorage.getItem('theme')) {
        changeCSS(localStorage.getItem('theme'));

    }

    swapScreens('step1');

    // Capturar boton de comenzar
    startBtn = document.querySelector('#startBtn');
    startBtn.addEventListener('click', function() {

        swapScreens('step2');

        initStream();

    });

    // Capturar boton de cancelar
    cancelBtn = document.querySelector('#cancelBtn');

    // Capturar controles de comienzo de grabacion
    startRecordingControls = document.querySelector('#startRecordingControls');

    // Capturar controles de finalizacion de grabacion
    stopRecordingControls = document.querySelector('#stopRecordingControls');

    // Capturar controles posteriores a finalizacion de grabacion
    afterRecordingControls = document.querySelector('#afterRecordingControls');

    // Capturar click en boton Capturar
    captureGifBtn = document.querySelector('#captureGifBtn');
    captureGifBtn.addEventListener('click', startRecord);

    // Capturar click en boton Capturar Down
    captureGifBtnDown = document.querySelector('#captureGifBtnDown');
    captureGifBtnDown.addEventListener('click', startRecord);

    // Capturar timer
    timerRecording = document.querySelector('#timerRecording');
    timerReplay = document.querySelector('#timerReplay');

    // Capturar click en boton Listo
    stopGifBtn = document.querySelector('#stopGifBtn');
    stopGifBtn.addEventListener('click', stopRecord);

    // Capturar click en boton Listo Down
    stopGifBtnDown = document.querySelector('#stopGifBtnDown');
    stopGifBtnDown.addEventListener('click', stopRecord);

    // Capturar click del boton de repetir captura
    repeatGifBtn = document.querySelector('#repeatGifBtn');
    repeatGifBtn.addEventListener('click', function() {
        clearInterval(time);
        repeatRecord();
    });

    // capturar boton de subida de gifo
    uploadGifBtn = document.querySelector('#uploadGifBtn');
    uploadGifBtn.addEventListener('click', uploadGifo);

    // Capturar boton Cancelar al subir gifo
    cancelGuifo = document.querySelector('#cancelGifo');
    cancelGuifo.addEventListener('click', function() {
        cancelUpload();
        swapScreens('step2');
    });


    // Caputar elemento de Video e Imagen oculta
    captureGifVideo = document.querySelector('#captureGif');
    captureGifImg = document.querySelector('#captureGifImg');

    // Capturar boton Listo
    finishBtn = document.querySelector('#finishBtn');
    finishBtn.addEventListener('click', function() {
        loadGifsFromStorage();
        swapScreens('step1');
        swapCommands('startRecordingControls');
    });

    // Capturar texto en viñetas
    titleWindowBar = document.querySelector('#titleWindowBar');

    loadGifsFromStorage();
}

function changeCSS(themeName, toggle) {
    const theme = document.querySelector('#theme');
    theme.href = "/assets/styles/" + themeName + ".css";

    localStorage.setItem('theme', themeName);

    if (toggle) {
        toggleThemeOptions();
    }
};

function loadGifsFromStorage() {
    const myGifos = [],
        storage = window.localStorage;

    for (let i = 0; i < storage.length; i++) {
        if (storage.key(i) !== 'theme') {
            myGifos.push(storage.getItem(storage.key(i)));
        }
    }

    renderMyGifos(myGifos);
}

function swapScreens(screen) {
    const step1 = document.querySelector('#step1'),
        step2 = document.querySelector('#step2'),
        step3 = document.querySelector('#step3'),
        step4 = document.querySelector('#step4');

    switch (screen) {
        case 'step1':
            // Muestra screen de instrucciones
            step1.classList.remove('hidden');
            step2.classList.add('hidden');
            step3.classList.add('hidden');
            step4.classList.add('hidden');
            break;

        case 'step2':
            // / Muestra screen de video
            titleWindowBar.innerHTML = 'Un Chequeo Antes de Empezar';
            step1.classList.add('hidden');
            step2.classList.remove('hidden');
            step3.classList.add('hidden');
            step4.classList.add('hidden');
            break;

        case 'step3':
            // Muestra screen de subida

            step1.classList.add('hidden');
            step2.classList.add('hidden');
            step3.classList.remove('hidden');
            step4.classList.add('hidden');
            break;

        case 'step4':
            // Muestra screen de gif subido
            step1.classList.add('hidden');
            step2.classList.add('hidden');
            step3.classList.add('hidden');
            step4.classList.remove('hidden');
            break;
    }
}

function swapCommands(command) {
    const startRecordingControls = document.querySelector('#startRecordingControls'),
        stopRecordingControls = document.querySelector('#stopRecordingControls'),
        afterRecordingControls = document.querySelector('#afterRecordingControls');

    switch (command) {
        case 'startRecordingControls':
            // Muestra botones de Capturar gif

            startRecordingControls.classList.remove('hidden');
            stopRecordingControls.classList.add('hidden');
            afterRecordingControls.classList.add('hidden');
            break;

        case 'stopRecordingControls':
            // Muestra boton de Listo
            titleWindowBar.innerHTML = 'Capturando Tu Guifo';
            startRecordingControls.classList.add('hidden');
            stopRecordingControls.classList.remove('hidden');
            afterRecordingControls.classList.add('hidden');
            break;

        case 'afterRecordingControls':
            // Muestra botones de Recapturar gif
            titleWindowBar.innerHTML = 'Vista Previa';
            startRecordingControls.classList.add('hidden');
            stopRecordingControls.classList.add('hidden');
            afterRecordingControls.classList.remove('hidden');
            break;
    }
}

function initStream() {
    return navigator.mediaDevices.getUserMedia({
            audio: false,
            video: {
                height: 434,
                width: 832
            }
        })
        .then(function(stream) {
            captureGifVideo.style.display = 'block';
            captureGifImg.style.display = 'none';

            captureGifVideo.srcObject = stream;
            captureGifVideo.play();

            recorder = RecordRTC(stream, {
                type: 'gif',
                frameRate: 1,
                quality: 10,
                width: 360,
                hidden: 240,

                onGifRecordingStarted: function() {
                    console.log('start recording');
                    stopGifBtn.disabled = false;
                    stopGifBtnDown.disabled = false;
                },
            });

            recorder.stream = stream;

            captureGifBtn.disabled = false;
            captureGifBtnDown.disabled = false;
        });
}


function startRecord() {
    stopGifBtn.disabled = true;
    stopGifBtnDown.disabled = true;

    swapCommands('stopRecordingControls');

    recorder.startRecording();

    minutes = seconds = 0;

    displayTime(timerRecording);

    time = setInterval(calculateTimer, 1000);
}

// agregar stop --> buscar en dcumentacion 

function calculateTimer() {
    seconds++;

    if (seconds === 60) {
        seconds = 0;
        minutes++;
    }

    displayTime(timerRecording);
}

function displayTime(timerElement) {
    let displaySeconds = (seconds < 10) ? `0${seconds}` : seconds,
        displayMinutes = (minutes < 10) ? `0${minutes}` : minutes;

    timerElement.innerHTML = `00:00:${displayMinutes}:${displaySeconds}`;
}


function stopRecord() {
    swapCommands('afterRecordingControls');

    recorder.stopRecording(function() {
        captureGifVideo.style.display = 'none';
        captureGifImg.style.display = 'block';
        captureGifImg.src = URL.createObjectURL(recorder.getBlob());

        clearInterval(time);
        recorder.stream.stop();

        displayTime(timerReplay);

        animateProgressBar();
    });
}

function repeatRecord() {
    recorder.clearRecordedData();
    initStream()
        .then(startRecord);
}

function animateProgressBar() {
    const squares = document.querySelectorAll('.progress-square');

    squares.forEach(function(square, index) {
        setTimeout(function() { square.classList.add('active') }, index * 500);
    });
}

function cancelUpload() {
    abortController.abort();
    window.location.reload();
}

function uploadGifo() {

    swapScreens('step3');

    const form = new FormData();
    form.append('file', recorder.getBlob(), 'myGif.gif');

    gifURL = URL.createObjectURL(recorder.getBlob());

    fetch(`https://upload.giphy.com/v1/gifs?api_key=${apiKey}&source_image_url=${gifURL}`, {
            method: "POST",
            body: form,
            signal: signal
        })
        .then(function(res) {
            return res.json();
        })
        .then(function(res) {
            const gifId = res.data.id;

            getMyUploadedGif(gifId)
                .then(function(res) {
                    const gifUrl = res.data.images.original.url;

                    // Guardar en Local Storage
                    window.localStorage.setItem(gifId, gifUrl);

                    swapScreens('step4');
                    // capturar el gf box del preview
                    uploadedGifo = document.querySelector('#uploadedGifo');
                    // asignar el nuevo gif
                    uploadedGifo.src = gifUrl;

                    //capturar boton de copiar enlace 
                    copyUrlGif = document.querySelector('#copyUrlGif');
                    copyUrlGif.addEventListener('click', function() {
                        navigator.clipboard.writeText(gifUrl);
                    });

                    // capturar  boton de descargar gifo y asignarlo
                    downloadGif = document.querySelector('#downloadGif');
                    downloadGif.href = gifUrl;


                });

            return res;
        });
}

function getMyUploadedGif(id) {
    return fetch(`https://api.giphy.com/v1/gifs/${id}?api_key=${apiKey}`)
        .then(function(res) {
            return res.json();
        })
        .then(function(res) {
            return res;
        });
}

function renderMyGifos(gifos) {
    myGifosContainer = document.querySelector('#myGifosContainer');
    myGifosContainer.innerHTML = "";

    for (let i = 0; i < gifos.length; i++) {
        myGifosContainer.append(renderGif(gifos[i]))
    }
}

function renderGif(gifUrl) {
    // Crea el box contenerdor del gif
    const box = document.createElement('div');
    box.classList.add('gif-box-results');
    box.classList.add('square');

    // Crea el img que carga el gif
    const gif = document.createElement('img');
    gif.src = gifUrl;
    gif.classList.add('square');

    box.append(gif);

    return box;
}

initialize();