const searchBtn = document.querySelector('#search-btn');
const searchInput = document.querySelector('#search-input');

var search = function() {
    mainSearchContainer.classList.toggle('collapse-z');
    pageLoader.classList.toggle('hidden')
    setTimeout(() => {
        pageLoader.classList.toggle('opacity1')
        mainSearchContainer.classList.toggle('hidden')
        mainContentContainer.classList.toggle('hidden')
        setTimeout(() => {
            pageLoader.classList.toggle('opacity1')
            setTimeout(() => {
                mainContentContainer.classList.toggle('collapse-z')
                pageLoader.classList.toggle('hidden')
            }, 500)
        }, 1000)
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