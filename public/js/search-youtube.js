const injectToHtml = document.querySelector('form');
const inputForm = document.querySelector('input');
const links = document.querySelector('#youtube__links');

injectToHtml.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const value = inputForm.value;
    let outHTML = "";
    links.innerHTML = '<li class="youtube_link waiting">Loading..</li>';

    fetch('/youtube-api?movie=' + value)
    .then((response) => {
        if (response.status > 200) {
            links.innerHTML = '<li class="youtube_link error">Try later! Some problem with network connection.</li>';
        } else {
            response.json()
           .then(({ movie }) => {
               movie.map(node => {
                   outHTML += `
                        <li class="youtube__link my-1">
                            <div class="card">
                                <div class="card__img">
                                    <img src=${node?.img ? node.img: 'empty.png'} alt=${node.title} />
                                </div>
                                <div class="card__meta">
                                    <a href=${node.link}><h3>${node.title}</h3></a>
                                    <div class="d-flex">
                                        <div class="author__img">
                                            <a href=${node.authorLink}><img src=${node?.authorLogo ? node.authorLogo : 'empty.png'} alt=${node.channelName} /></a>
                                        </div>
                                        <p>${node.channelName}</p>
                                    </div>
                                </div>
                            </div>
                        </li>
                    `;
               });

               links.innerHTML = outHTML;
           })
        }
    });
});
