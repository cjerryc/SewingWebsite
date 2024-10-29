let darkmode = localStorage.getItem('darkmode')
const themeSwitch = document.getElementById('darkModeToggle')

const enableDarkmode = () => {
    document.body.classList.add('dark-mode')
    localStorage.setItem('darkmode', 'active')
}

const disableDarkmode = () => {
    document.body.classList.remove('dark-mode')
    localStorage.setItem('darkmode', null)
}

if (darkmode === 'active'){
    document.getElementById('darkModeToggle').checked = true;
    enableDarkmode()
}

themeSwitch.addEventListener("click", () => {
    darkmode = localStorage.getItem('darkmode')
    darkmode !== "active" ? enableDarkmode() : disableDarkmode()
})