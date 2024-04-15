document.addEventListener("DOMContentLoaded", function() {
    const apiUrl = 'https://kitsu.io/api/edge/anime'; // API endpoint for anime data
    const searchInput = document.getElementById('searchInput');
    const animeContainer = document.getElementById('animeContainer');

    if (!animeContainer) {
        console.error('Anime container element not found in the DOM.');
        return;
    }


    // Function to fetch anime data based on search query
    async function fetchAnimeData(query) {
        try {
            const response = await fetch(`${apiUrl}?filter[text]=${encodeURIComponent(query)}`);
            const data = await response.json();

            if (!data || !data.data || !Array.isArray(data.data)) {
                throw new Error('Invalid response from the server');
            }

            return data.data.map(anime => ({
                id: anime.id,
                title: anime.attributes.canonicalTitle || 'N/A',
                description: anime.attributes.synopsis || 'N/A',
                rating: anime.attributes.averageRating || 'N/A',
                runtime: anime.attributes.episodeLength || 'N/A',
                posterImage: anime.attributes.posterImage ? anime.attributes.posterImage.original : null
            }));
        } catch (error) {
            console.error('Error fetching anime data:', error);
            return [];
        }
    }

    // Function to display anime data on the webpage
    function displayAnimeData(animeData) {
        animeContainer.innerHTML = ''; // Clear previous content

        animeData.forEach(anime => {
            const animeCard = document.createElement('div');
            animeCard.classList.add('anime-card');

            const imageContainer = document.createElement('div');
            imageContainer.classList.add('image-container');

            const imageElement = document.createElement('img');
            imageElement.src = anime.posterImage || 'placeholder.jpg';
            imageElement.alt = anime.title;

            imageElement.addEventListener('click', function() {
                alert(`Title: ${anime.title}\nRating: ${anime.rating}\nDescription: ${anime.description}\nRuntime: ${anime.runtime}`);
            });

            imageContainer.appendChild(imageElement);

            const infoContainer = document.createElement('div');
            infoContainer.classList.add('info-container');

            const titleElement = document.createElement('h2');
            titleElement.textContent = anime.title;

            const descriptionElement = document.createElement('p');
            descriptionElement.textContent = anime.description;

            const ratingElement = document.createElement('p');
            ratingElement.textContent = `Rating: ${anime.rating}`;

            const runtimeElement = document.createElement('p');
            runtimeElement.textContent = `Runtime: ${anime.runtime}`;

            infoContainer.appendChild(titleElement);
            infoContainer.appendChild(descriptionElement);
            infoContainer.appendChild(ratingElement);
            infoContainer.appendChild(runtimeElement);

            animeCard.appendChild(imageContainer);
            animeCard.appendChild(infoContainer);

            animeContainer.appendChild(animeCard);
        });
    }

    // Function to handle search
    function handleSearch() {
        const searchTerm = searchInput.value.trim();
        if (searchTerm !== '') {
            fetchAnimeData(searchTerm)
                .then(animeData => {
                    displayAnimeData(animeData);
                })
                .catch(error => {
                    console.error('Error:', error);
                    animeContainer.innerHTML = '<p>An error occurred while fetching data. Please try again later.</p>';
                });
        } else {
            animeContainer.innerHTML = '<p>Please enter a search term</p>';
        }
    }

    // Add event listener for the search input
    searchInput.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            handleSearch();
        }
    });
});
