const searchBtn = document.querySelector('#search-btn');
const searchInput = document.querySelector('#search-input');
searchBtn.addEventListener('click', function() {
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
});

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