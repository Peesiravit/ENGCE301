const mainParagraphs = document.querySelectorAll('#main p');

for (let i = 0; i < mainParagraphs.length; i++) {
    mainParagraphs[i].style.fontSize = '24px';
    mainParagraphs[i].style.color = 'red';
}