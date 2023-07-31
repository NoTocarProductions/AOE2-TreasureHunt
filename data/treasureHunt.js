//wait until the webpage is loaded for the DOM. so await function first.

let container = document.querySelector('.blogs');
let searchForm = document.querySelector('.search');

let renderPosts = async(term) => {
    let url = 'http://localhost:3000/posts?_sort=likes&_order=asc';
    if (term) {
        url += `&q=${term}`; // this is going to look through all the info in the json file for the term given in the input form.
    } 

    let res = await fetch(url);
    let posts = await res.json();
    
    let template = '';
    posts.forEach(post => {
        template += `
        <div class="post">
            <h2> ${post.title} </h2>
            <p><small>${post.likes} likes </small></p>
            <p>${post.body.slice(0, 200)}</p>
            <a href="/details.html?id=${post.id}">read more...</a>
        </div>
        `
    });

    container.innerHTML = template;
}


searchForm.addEventListener('submit', (e) => {
    e.preventDefault(); //doesnt referesh the page
    renderPosts(searchForm.term.value.trim()) //term was the name attribute given, trim to remove whitespace
});
window.addEventListener('DOMContentLoaded', () => renderPosts());