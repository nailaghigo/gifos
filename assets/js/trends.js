async function getTrendsResults() {

    const response = await fetch(`http://api.giphy.com/v1/gifs/trending?api_key=${apiKey}`);
    const results = await response.json();

    console.log(results);

    // Limpiar el container antes de mostrar nuevos resultados
    trendsResults.innerHTML = '';

    processGridResults(results, trendsResults);
}