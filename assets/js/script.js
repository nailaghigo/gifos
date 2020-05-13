let apiKey,
    optionsMenu,
    searchBox,
    searchBtn,
    searchBtnImg,
    searchResults,
    trendsResults;

function initialize() {
    apiKey = 'duWp1AbaRZc1R09EEFyvRnlgUflkMgmt';

    // Capturar elemento de boton de temas
    optionsMenu = document.querySelector('#theme-options');

    if (localStorage.getItem('theme')) {
        changeCSS(localStorage.getItem('theme'));

    } else {
        localStorage.setItem('theme', 'sailor-day');
    }

    // Capturar input de searchbox
    searchBox = document.querySelector('#searchBox');
    searchBox.addEventListener('keyup', displayContainerSearch);

    // Capturar button de searchbox
    searchBtn = document.querySelector('#searchBtn');
    searchBtn.addEventListener('click', function() {
        getSearchResults();
        toggleSearchOptions('close');

        // cuando presiono buscar, me redirecciona a la seccion de resultados de busqueda
        window.location.href = "#search-section";
    });


    // Capturar imagen del button de searchbox
    searchBtnImg = document.querySelector('#searchBtnImg');

    // Capturar el container de resultados de busqueda
    searchResults = document.querySelector('#search-results');

    // Capturar el container de resultados de tendencias
    trendsResults = document.querySelector('#trends-results');

    // Hacer que el click en el body cierre el menu de temas cuando el click no sea ni el boton de elegir tema, ni en el boton del caret
    document.querySelector('body').addEventListener('click', function(e) {
        const targetEl = e.target;

        if (targetEl !== document.querySelector('#theme-options-btn') && targetEl !== document.querySelector('#theme-options-img') && targetEl !== document.querySelector('#select-theme-btn') && optionsMenu.classList.contains('open')) {
            toggleThemeOptions();
        }

        if (targetEl !== document.querySelector('.suggested-options') && targetEl !== document.querySelector('#searchBtn') && targetEl !== document.querySelector('#searchBox') && targetEl !== document.querySelector('.container-search .expand a')) {
            toggleSearchOptions('close');
        }
    });

    loadGifSuggestions();
    getTrendsResults();
}

function changeCSS(themeName, toggle) {
    const theme = document.querySelector('#theme');
    theme.href = "/assets/styles/" + themeName + ".css";

    localStorage.setItem('theme', themeName);

    if (toggle) {
        toggleThemeOptions();
    }
};

function toggleThemeOptions() {
    if (optionsMenu.classList.contains('open')) {
        // Is open, then close it
        optionsMenu.classList.remove('open');
        optionsMenu.classList.add('close');
    } else {
        // Is closed, then open it
        optionsMenu.classList.remove('close');
        optionsMenu.classList.add('open');
    }
}

// Quita los espacios en blanco al principio de lo ingresado en el input.
function trimWhiteSpaces() {
    searchBox.value = searchBox.value.replace(/^\s+/, "");
}

function addHash(text) {
    return `#${text}`;
}

function renderGif(gifImg, type) {
    // Crea el box contenerdor del gif
    const box = document.createElement('div');
    box.classList.add('gif-box-results');
    box.classList.add(type);

    // Crea el img que carga el gif
    const gif = document.createElement('img');
    gif.src = gifImg.images.original.url;
    gif.classList.add(type);

    // Crea el div para mostrar los hashtags
    const title = document.createElement('div');
    title.classList.add('back-gradient');
    title.classList.add(type);

    // chequeo que el title no sea vacio
    if (gifImg.title.trim() !== '') {
        // con split, separo por palabras. devuelve un array
        const hashtags = gifImg.title.split(' ');

        // por cada palabra del array, evito 'gif', creo un <a>, le agrego el hashtag, wrapeo la funcion de busqueda en el evento onClick para evitar que se autoejecute cuando se renderize.
        for (let e = 0; e < hashtags.length; e++) {
            if (hashtags[e] !== 'GIF') {
                const hashLink = document.createElement('a');
                hashLink.innerHTML = addHash(hashtags[e]);
                hashLink.href = `#search-section`;
                hashLink.onclick = function() {
                    toggleSearchOptions('close');
                    getSearchResults(hashtags[e]);
                };
                title.append(hashLink);
            }
        }
    }

    box.append(gif);
    box.append(title);

    return box;
}

function processGridResults(results, resultsContainer) {
    //  Defino count en 1 y pendingBoxes como array para ir guardando los rectangulos que no entran en el cuarto espacio.
    let count = 1,
        pendingGifs = [];

    // Recorro la data que me devuelve la API
    for (let i = 0; i < results.data.length; i++) {

        const gifImg = results.data[i];

        // chequeo si el gif siguiente completa la suma de 4 o si suma 5
        if (pendingGifs.length && count < 4) {
            const box = renderGif(pendingGifs[0], 'rectangle');
            resultsContainer.append(box);
            pendingGifs.splice(0, 1);
            count += 2;
        }

        // calculo diferencia entre ancho y alto del gif
        const diff = gifImg.images.original.width - gifImg.images.original.height;

        // Determino cuando un gif va a ser rectangulo o cuadrado.
        let type = diff > 75 ? 'rectangle' : 'square';


        // si el gif rectanculo quiere entrar en la cuarta posicion, lo almaceno como pendiente
        if (count === 4 && type === 'rectangle') {
            pendingGifs.push(gifImg);
        } else {
            // si no estoy en la posicion 4, lo renderizo.
            const box = renderGif(gifImg, type);

            if (type === 'rectangle') {
                count += 2;
            } else {
                count++;
            }

            resultsContainer.append(box);
        }
        // cuando el conteo es mayor a 4, lo vuelvo a 1, para empezar nueva fila 
        if (count > 4) {
            count = 1;
        }


    }

}

initialize();