const weatherForm = document.querySelector('form');
const inputForm = document.querySelector('input');
const links = document.querySelector('#youtube__links');
let outHTML = "";

weatherForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const name = inputForm.value;
    links.innerHTML = '<li class="youtube_link waiting">Loading..</li>';

    fetch('/youtube-api?movie=' + name)
    .then((response) => {
        response.json()
           .then(({ movie }) => {
               movie.map(node => {
                   outHTML += `<li class="youtube__link">${node.title} - <a href=${node.link}>${node.link}</a></li>`;
               });

               links.innerHTML = outHTML;
           })
    });
});