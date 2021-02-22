/* Switch to Dark Mode Only */
function modeSwitcher() {
    sessionStorage.setItem('theme', 'dark');
    let theme = sessionStorage.getItem('theme');
    document.documentElement.setAttribute('data-theme', 'dark');
}
 $(document).ready(function () {
   modeSwitcher();
 });