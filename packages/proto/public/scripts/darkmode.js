let darkmode = localStorage.getItem('darkmode')
const themeSwitch = document.getElementById('darkModeToggle')

const enableDarkmode = () => {
    document.body.classList.add('body-dark-mode')
    // document.head.classList.add('header-dark')
    localStorage.setItem('darkmode', 'active')
}

const disableDarkmode = () => {
    document.body.classList.remove('body-dark-mode')
    // document.head.classList.remove('header-dark')
    localStorage.setItem('darkmode', null)
}

if (darkmode === 'active'){
    enableDarkmode()
}

themeSwitch.addEventListener("click", () => {
    darkmode = localStorage.getItem('darkmode')
    darkmode !== "active" ? enableDarkmode() : disableDarkmode()
})