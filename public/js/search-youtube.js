const weatherForm = document.querySelector('form');
const inputForm = document.querySelector('input');
const links = document.querySelector('#youtube__links');

weatherForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const name = inputForm.value;
    let outHTML = "";
    links.innerHTML = '<li class="youtube_link waiting">Loading..</li>';

    fetch('/youtube-api?movie=' + name)
    .then((response) => {
        if (response.status > 200) {
            links.innerHTML = '<li class="youtube_link error">Try later! Some problem with network connection.</li>';
        } else {
            response.json()
           .then(({ movie }) => {
               movie.map(node => {
                   outHTML += `<li class="youtube__link">${node.title} - <a href=${node.link}>${node.link}</a></li>`;
               });

               links.innerHTML = outHTML;
           })
        }
    });
});