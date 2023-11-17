const apiUrl = 'https://pokeapi.co/api/v2/pokemon/';

const pokedex = document.getElementById('pokedex');
const loadMoreButton = document.getElementById('load-more');
const typeFilterInput = document.getElementById('type-filter');

let offset = 0;
const limit = 20;

loadMoreButton.addEventListener('click', loadMorePokemon);
typeFilterInput.addEventListener('change', filterPokemonByType);


/* Requisicao */ 
async function fetchPokemon(url) {
    const response = await fetch(url);
    if(!response.ok) {
        throw new Error('Erro na soliticitação da API')
    }
    return response.json();
}




async function displayPokemon(pokemonData) {
    const pokemonList = pokemonData.results;

    pokemonList.forEach(async (pokemon) => {
        const pokemonDetails = await fetchPokemon(pokemon.url);

        const pokemonCard = document.createElement('div');
        pokemonCard.classList.add('pokemon-card');

        const types = pokemonDetails.types.map(typeData => typeData.type.name);
        const typeElements = types.map(type => `<span class="${type.toLowerCase()}">${type}</span>`).join('');

        pokemonCard.innerHTML = `
        <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonDetails.id}.png" alt="${pokemon.name}">
            
            <p class="id-pokemon">ID: ${pokemonDetails.id}</p>
            <h2 class="name-pokemon">${pokemon.name}</h2>
            <p class="type-pokemon">${typeElements}</p>
            
        `;
      
        pokedex.appendChild(pokemonCard);
    });
}


// Pokemons por tipo se deus quiser vai funcionar
async function loadPokemonByType(selectedType) {
    try {
        if (!selectedType) {
            await loadMorePokemon();
            return;
        }
        offset = 0;
        const url = `https://pokeapi.co/api/v2/type/${selectedType}`;
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Erro na solicitação da API. Status: ${response.status}`);
        }

        const data = await response.json();
        const pokemonList = data.pokemon.map(entry => entry.pokemon);

        if (pokemonList.length > 0) {
            await displayPokemon({ results: pokemonList });
        } else {
            console.log(`Não há Pokémon do tipo ${selectedType}`);
        }

    } catch (error) {
        console.error('Erro ao buscar Pokémon do tipo:', error);
    }
}



async function filterPokemonByType() {
    pokedex.innerHTML = '';

    const selectedType = typeFilterInput.value;

    await loadPokemonByType(selectedType);
}




async function loadMorePokemon() {
    offset += limit;
    const nextUrl = `${apiUrl}?offset=${offset}&limit=${limit}`;

    try{
        const pokemonData = await fetchPokemon(nextUrl)
        await displayPokemon(pokemonData)
    } catch( error ){
        console.log('Error ao buscar pokemon:', error);
    }
    
}




// Carrega os primeiros 20 Pokémon ao carregar a página
async function carregarPokemonsIniciais() {
    try {
        const initialPokemonData = await fetchPokemon(`${apiUrl}?offset=${offset}&limit=${limit}`);
        await displayPokemon(initialPokemonData);
    } catch (error) {
        console.error('Erro ao buscar os Pokémon:', error);
    }
}



carregarPokemonsIniciais();