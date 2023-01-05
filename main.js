/////    LOCAL STORAGE FUNCTIONS /////
/*
    @desc: Recursive function to iterate through all the characters in swapi/people endpoint.
    The charactersStr array is populated with the character names. Saves array to local storage to decrease load time in subsequent visits
    @param: url (api endpoint)
*/
let charactersStr = [];
var populateCharacterArray = async function (
  url = "https://swapi.dev/api/people/?page=1"
) {
  await fetch(url)
    .then((response) => response.json())
    .then((data) => {
      for (let i = 0; i < data.results.length; i++) {
        const characterName = data.results[i].name;
        const lowercaseCharacterName = characterName.toLowerCase();
        charactersStr.push(lowercaseCharacterName);
      }
      if (data.next) {
        return populateCharacterArray(data.next);
      } else {
        localStorage.storedCharacterArray = JSON.stringify(charactersStr);
        return;
      }
    })
    .catch((error) => {
      console.log(error);
    });
};
/*
    @desc: If the character array is stored in local storage it will populate the charactersStr array with the data
    If not we will execute the populateCharacterArray
*/
if (localStorage.storedCharacterArray) {
  charactersStr = JSON.parse(localStorage.storedCharacterArray);
} else {
  populateCharacterArray();
}

/////     HELPER FUNCTIONS     /////
/*
    @desc: Converts one Unit to another ex: cm -> ft, kg -> lb
*/
var centimetersToFeet = function (centimeters) {
  return centimeters * 0.0328084;
};
var kilogramsToPounds = function (kilograms) {
  return kilograms * 2.20462;
};

/////     GETTING DATA/ RENDERING DATA     /////
/*
    @desc: Converts the inputed film name string to a predetermined abbreviation
    @param: The film name str to convert to abbreviation
*/
var shortenFilmName = function (filmStr) {
  switch (filmStr) {
    case "A New Hope":
      return "A.N.H";
    case "The Empire Strikes Back":
      return "T.E.S.B";
    case "Return of the Jedi":
      return "R.O.T.J";
    case "Revenge of the Sith":
      return "R.O.T.S";
  }
  return filmStr;
};
/*
    @desc: Takes a give array of film endpoints and fetches the data at each URL.
    It then pushes a comma separated list as the innerText of the #films element
    @param: films: The array of endpoint URLS
*/
var renderFilms = async function (films) {
  const filmsArray = [];
  for (let film of films) {
    let filmItem = await getFilm(film);
    filmsArray.push(shortenFilmName(filmItem));
  }
  const str = filmsArray.join(", ");
  document.querySelector("#films").innerText = str;
};
/* 
    @desc: Uses the fetch API and returns the title of the film
    @param: The films API endpoint
*/
var getFilm = async function (filmUrl) {
  try {
    let response = await fetch(filmUrl);
    let data = await response.json();
    return data.title;
  } catch (error) {
    descriptionContainer.innerHTML = "Failed To Fetch Data";
    console.log(error);
  }
};
/*
    @desc: fetches the data from the API endpoint corresponding to the inputed character number.
        Populates the character description with the data and executes the renderFilm function 
        with the array of films as the argument 
    @param: The character number
    @catch: populates the character description with a failed message
    @finally: removes the page loader and toggles the main content collapse class to have the content appear
*/
var populateData = function (characterNum) {
  fetch(`https://swapi.dev/api/people/${characterNum}`)
    .then((response) => response.json())
    .then((data) => {
      descriptionContainer.innerHTML = `
                Name: <span class="data">${data.name}</span><br>
                HEIGHT: <span class="data">${parseFloat(
                  centimetersToFeet(data.height)
                ).toFixed(2)}</span> ft<br>
                MASS: <span class="data">${parseFloat(
                  kilogramsToPounds(data.mass)
                ).toFixed(2)}</span> lb<br>
                HAIR COLOR: <span class="data">${data.hair_color}</span><br>
                SKIN COLOR: <span class="data">${data.skin_color}</span><br>
                EYE COLOR: <span class="data">${data.eye_color}</span><br>
                Birth YEAR: <span class="data">${data.birth_year}</span><br>
                GENDER: <span class="data">${data.gender}</span><br>
                FILMS: <span class="data"><span id="films"></span></span>`;
      renderFilms(data.films);
      fetch(
        `https://www.googleapis.com/customsearch/v1?key=AIzaSyCxWsi6wy4sn7183CTeJbasmPbf7P1BvVY&cx=42b1c343ba6f94e57&q=${data.name}&searchType=image&alt=json`
      )
        .then((response) => response.json())
        .then((data) => {
          imageContainer.style.backgroundImage = `url(${data.items[0].link})`;
        });
    })
    .catch((error) => {
      descriptionContainer.innerHTML = "Failed To Fetch Data";
      console.error(error);
    })
    .finally(function () {
      pageLoader.classList.toggle("opacity1");
      setTimeout(() => {
        mainContentContainer.classList.toggle("collapse-z");
      }, 500);
    });
};

/////     SEARCH/ANIMATIONS     /////
/*
    @desc: class toggled animations and executes the populate data function
*/
var search = async function (characterName) {
  let indexOfCharacter = charactersStr.indexOf(characterName);
  if (indexOfCharacter >= 16) {
    indexOfCharacter += 1;
  }
  if (indexOfCharacter != -1) {
    mainSearchContainer.classList.toggle("collapse-z");
    pageLoader.classList.toggle("hidden");
    await populateData(indexOfCharacter + 1);
    setTimeout(() => {
      pageLoader.classList.toggle("opacity1");
      mainSearchContainer.classList.toggle("hidden");
      mainContentContainer.classList.toggle("hidden");
    }, 300);
  } else {
    alert("not a character");
  }
};

var clearSuggestedList = function () {
  recommendedSearch.innerHTML = "";
};

var renderToSuggestedList = function (suggestedSearchResults) {
  clearSuggestedList();
  suggestedSearchResults.forEach((element) => {
    const newLi = document.createElement("li");
    newLi.innerText = element;
    recommendedSearch.append(newLi);
  });
};
/*
    @desc: Reveals all of the nav-items
*/
// var toggleNavItems = function () {
//     navToggle.classList.toggle('rotate')
//     navItems.forEach((element) => {
//         element.classList.toggle('reveal')
//     })
// };

/////     EVENT LISTENERS     /////
/*
    @desc: Clicking the nav toggle button will reveal all the nav-items
*/
// navToggle.addEventListener('click', toggleNavItems)

searchBtn.addEventListener("click", function () {
  search(search.firstSuggestedInput);
});

document.addEventListener("keyup", (event) => {
  if (event.key === "Enter") {
    search(search.firstSuggestedInput);
  }
});

searchInput.addEventListener("input", async function () {
  let inputValueStr = searchInput.value.toLowerCase();
  if (inputValueStr != "") {
    let suggestedSearchResults = charactersStr.filter((element) =>
      element.includes(inputValueStr)
    );
    search.firstSuggestedInput = suggestedSearchResults[0];
    renderToSuggestedList(suggestedSearchResults);
  } else {
    search.firstSuggestedInput = undefined;
    clearSuggestedList();
  }
});

recommendedSearch.addEventListener("click", function (e) {
  const targetElement = e.target.innerText;
  searchInput.value = targetElement;
  search.firstSuggestedInput = targetElement;
  clearSuggestedList();
  renderToSuggestedList([targetElement]);
});
