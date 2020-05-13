function displayContainerSearch() {
    trimWhiteSpaces();

    const activeTheme = localStorage.getItem('theme');

    if (searchBox.value !== '') {
        searchBtn.disabled = false;
        searchBtnImg.src = (activeTheme === 'sailor-day') ? '/assets/images/lupa.svg' : '/assets/images/lupa_light.svg';

        if (searchBox.value.length >= 2) {
            getSuggestedSearch(searchBox.value);

            toggleSearchOptions('open')
        }
    } else {
        searchBtn.disabled = true;
        searchBtnImg.src = (activeTheme === 'sailor-day') ? '/assets/images/lupa_inactive.svg' : '/assets/images/Combined_Shape.svg';

        toggleSearchOptions('close');
    }

}

function toggleSearchOptions(state) {
    const suggestionsContainer = document.querySelector('.container-search .expand')
    if (state === 'close') {
        suggestionsContainer.style.display = 'none';
    } else {
        suggestionsContainer.style.display = 'block';
    }
}

async function getSearchResults(text) {
    if (!text) {
        text = searchBox.value;
    }

    const response = await fetch(`http://api.giphy.com/v1/gifs/search?q=${text}&api_key=${apiKey}`);
    const results = await response.json();

    console.log(results);

    // Limpiar el container antes de mostrar nuevos resultados
    searchResults.innerHTML = '';

    processGridResults(results, searchResults);

    document.querySelector('#search-results-container').style.display = 'block';
}