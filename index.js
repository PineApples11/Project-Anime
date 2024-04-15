document.addEventListener("DOMContentLoaded", function() {
    const apiUrl = 'https://kitsu.io/api/edge/anime';
    const searchInput = document.getElementById('searchInput');
    const animeContainer = document.getElementById('animeContainer');

    if (!animeContainer) {
        console.error('Anime container element not found in the DOM.');
        return;
    }

    // Function to fetch anime data based on search input
    async function fetchAnimeData(query) {
        try {
            const response = await fetch(`${apiUrl}?filter[text]=${encodeURIComponent(query)}`);
            const data = await response.json();

//just a default catch error  for any error that may arise befor the data is pushed


            if (!data || !data.data || !Array.isArray(data.data)) {
                throw new Error('Invalid response from the server');
            }


//returns a modify new array with the following properties only
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
       //innerHTML refreshes the content of the webpage
        animeContainer.innerHTML = ''; 

        //used an array iterator to create an anime card
        //an anime card is a container that just contains the anime poster
        //creates a more neat work
        animeData.forEach(anime => {
            const animeCard = createAnimeCard(anime);
            animeContainer.appendChild(animeCard);
        });
    }

    // Function to create an anime card element
    function createAnimeCard(anime) {
        const animeCard = document.createElement('div');
        animeCard.classList.add('anime-card');

        //these shows the specified properties that i want my anime card to show
        // these properties are image of the anime,title, a brief description,rating and runtime


        const imageContainer = document.createElement('div');
        imageContainer.classList.add('image-container');

        const imageElement = document.createElement('img');
        imageElement.src = anime.posterImage || 'placeholder.jpg';
        imageElement.alt = anime.title;

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
        

        //appendchild attaches a list of specified properties to the infocontainer
        // it also make the presentation better

        infoContainer.appendChild(titleElement);
        infoContainer.appendChild(descriptionElement);
        infoContainer.appendChild(ratingElement);
        infoContainer.appendChild(runtimeElement);

        animeCard.appendChild(imageContainer);
        animeCard.appendChild(infoContainer);

        //after all these conditions are met, we shall have a well displayed animecard
        return animeCard;
    }

    // Function to fetch and display initial anime suggestions for any newbies visiting the webpage
    //and dont know where to start in the anime world

    async function displayInitialSuggestions() {
        try {
            
            //introduces a nw const called suggestions to show various animes that my interest the client
            const suggestions = await fetchAnimeData('action');
            displayAnimeData(suggestions);
        } catch (error) {
            console.error('Error fetching initial anime suggestions:', error);
        }
    }

    // invokes the function so that it runs when the page is reloaded
    displayInitialSuggestions();

    // Function to handle search
    //this is function that helps to understand the user input

    function handleSearch() {

        //introduced a new constant to search through the anime data for any input that have same
        //or almost the same output as the client's input

        const searchTerm = searchInput.value.trim();

        // use of if to set the two conditions that need to be met for the desired data to be fetched
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

    // Since i always find the search button an elderly feature to use, i opted to add the enter
    // enter is represent by the keypress (e) so that the process should be initialized

    searchInput.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            handleSearch();
        }
    });
});


//still need to add a video as trailer for each anime in the animecard without redirects
//still need to add floating character image as a footer.
//still need to add a background video as the landing page.
