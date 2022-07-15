const searchBtn = document.querySelector('#search-btn');
const searchInput = document.querySelector('#search-input');

var shortenFilmName = function(filmStr) {
    switch(filmStr) {
        case 'A New Hope':
            return 'A.N.H';
        case 'The Empire Strikes Back':
            return 'T.E.S.B';
        case 'Return of the Jedi':
            return 'R.O.T.J'
        case 'Revenge of the Sith':
            return 'R.O.T.S'
    }
    return filmStr
}
var renderFilms = async function(films) {
    const filmsArray = []
    for (let film of films){
        let filmItem = await getFilm(film);
        filmsArray.push(shortenFilmName(filmItem))
    }
    const str = filmsArray.join(', ')
    document.querySelector('#films').innerText = str
}
var getFilm = async function(filmUrl) {
    try {
        let response = await fetch(filmUrl);
        let data = await response.json()
        return data.title
    } catch(error) {
        console.log(error)
    }

}
var centimetersToFeet = function(centimeters) {
    return centimeters * 0.0328084
}
var kilogramsToPounds = function(kilograms) {
    return kilograms * 2.20462
}
var populateData = function() {
    fetch('https://swapi.dev/api/people/1')
    .then(response => response.json())
    .then(data => {
        descriptionContainer.innerHTML = `
        Name: <span class="data">${data.name}</span><br>
        HEIGHT: <span class="data">${parseFloat(centimetersToFeet(data.height)).toFixed(2)}</span> ft<br>
        MASS: <span class="data">${parseFloat(kilogramsToPounds(data.mass)).toFixed(2)}</span> lb<br>
        HAIR COLOR: <span class="data">${data.hair_color}</span><br>
        SKIN COLOR: <span class="data">${data.skin_color}</span><br>
        EYE COLOR: <span class="data">${data.eye_color}</span><br>
        Birth YEAR: <span class="data">${data.birth_year}</span><br>
        GENDER: <span class="data">${data.gender}</span><br>
        FILMS: <span class="data"><span id="films"></span></span>`
        renderFilms(data.films)
    })
    .catch(error => {
        descriptionContainer.innerHTML = 'Failed To Fetch Data'
    })
    .finally(function() {
        pageLoader.classList.toggle('opacity1')
        setTimeout(() => {
            mainContentContainer.classList.toggle('collapse-z')
        }, 500);
    })
}
var search = function() {
    mainSearchContainer.classList.toggle('collapse-z');
    pageLoader.classList.toggle('hidden')
    setTimeout(() => {
        pageLoader.classList.toggle('opacity1')
        mainSearchContainer.classList.toggle('hidden')
        mainContentContainer.classList.toggle('hidden')
        populateData()
    }, 300)
}

/*
    @desc: Reveals all of the nav-items
*/
var toggleNavItems = function() {
    navToggle.classList.toggle('rotate')
    navItems.forEach((element) => {
        element.classList.toggle('reveal')
    })
};
/*
    @desc: Clicking the nav toggle button will reveal all the nav-items
*/
navToggle.addEventListener('click', toggleNavItems)

searchBtn.addEventListener('click', search);

document.addEventListener('keyup', event => {
    if (event.key === 'Enter') {
        search();
    };
    console.log(event.key)
});