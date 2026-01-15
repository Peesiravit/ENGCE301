const navLinks = document.querySelectorAll('nav a');

for (let i = 0; i < navLinks.length; i++) {
    navLinks[i].addEventListener('click', function (event) {
        event.preventDefault();
        alert("clicked!");
    });
}