const searchBtn = document.querySelector('#search-btn');
const searchInput = document.querySelector('#search-input')
searchBtn.addEventListener('click', function() {
    console.log(searchInput.value)
})

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