async function getSuggestedSearch(text) {
    const response = await fetch(`http://api.giphy.com/v1/tags/related/${text}?api_key=${apiKey}`);
    const suggestions = await response.json();

    displaySuggestedSearch(suggestions.data);
}

function displaySuggestedSearch(gif) {

    const suggestedGIfContainer = document.querySelector('.container-search .expand');

    // Limpiar container para evitar que se acumulen las busquedas
    suggestedGIfContainer.innerHTML = '';

    for (let i = 0; i < 3; i++) {
        // Crear el container de la sugerencia
        const suggestedGif = document.createElement('div');
        suggestedGif.classList.add('suggested-options');

        // Crear el link de la sugerencia
        const suggestedGifLink = document.createElement('a');
        suggestedGifLink.href = '#search-section';
        suggestedGifLink.innerHTML = gif[i].name;
        suggestedGifLink.onclick = function() {
            getSearchResults(gif[i].name);
            toggleSearchOptions('close');
            searchBox.value = gif[i].name;
        }

        suggestedGif.append(suggestedGifLink);
        suggestedGIfContainer.append(suggestedGif);
    }
}

async function getSuggestedGif() {
    const response = await fetch(`http://api.giphy.com/v1/gifs/random?api_key=${apiKey}`);
    const suggestions = await response.json();

    return suggestions.data;
}

function loadGifSuggestions() {
    const suggestionBox = document.querySelector('#suggestion-box');

    for (let i = 0; i < 4; i++) {
        getSuggestedGif()
            .then(function(suggestedGif) {
                let title;
                if (suggestedGif.title.trim() === '') {
                    title = 'AnimatedGIF';
                } else {
                    title = suggestedGif.title;
                }

                const box = document.createElement('div');
                box.classList.add('box');

                const backGradient = document.createElement('div');
                backGradient.classList.add('back-gradient');

                const gifTitle = document.createElement('span');
                gifTitle.innerHTML = addHash(title);

                const closeBtn = document.createElement('img');
                closeBtn.src = '/assets/images/close.svg';
                closeBtn.alt = 'close';

                const gifContainer = document.createElement('div');
                gifContainer.classList.add('gif');

                const gif = document.createElement('img');
                gif.src = suggestedGif.images.original.url;
                gif.alt = 'loading-gif';

                const blueBtn = document.createElement('a');
                blueBtn.classList.add('blue-button');
                blueBtn.href = '#search-section';
                blueBtn.innerHTML = 'Ver más';
                blueBtn.addEventListener('click', function() {
                    displaySeeMore(title);
                })

                backGradient.append(gifTitle);
                backGradient.append(closeBtn);

                gifContainer.append(gif);
                gifContainer.append(blueBtn);

                box.append(backGradient);
                box.append(gifContainer);

                suggestionBox.append(box);

            });

    }
}

function displaySeeMore(title) {
    getSearchResults(title);
}