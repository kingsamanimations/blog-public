import { API_URL } from './config.js';

const id = new URLSearchParams(location.search).get('id');

const statusEl = document.getElementById('status');
const postEl = document.getElementById('post');
const commentsSection = document.getElementById('comments-section');
const commentsEl = document.getElementById('comments');
const form = document.getElementById('comment-form');
const formError = document.getElementById('form-error');

// Rendering the comments
function renderComment(comment) {
    const li = document.createElement('li');

    const name = document.createElement('strong');
    name.textContent = comment.username;

    const date = document.createElement('time');
    date.dateTime = comment.createdAt;
    date.textContent = new Date(comment.createdAt).toLocaleDateString();

    const body = document.createElement('p');
    body.textContent = comment.content;

    li.append(name, ' ', date, body);
    return li;
}

// Loading page
async function loadPage() {
    if (!id) {
        statusEl.textContent = 'No post specified.';
        return;
    }

    try {
        const postRes = await fetch(`${API_URL}/posts/${id}`);
        if (postRes.status === 404) {
            statusEl.textContent = 'Post not found.';
            return;
        }
        if (!postRes.ok) throw new Error(`Request failed (${postRes.status})`);
        const post = await postRes.json();

        document.title = `${post.title} | My Blog`;
        document.getElementById('title').textContent = post.title;
        document.getElementById('date').textContent = new Date(post.createdAt).toLocaleDateString();
        document.getElementById('content').textContent = post.content;

        const commentsRes = await fetch(`${API_URL}/posts/${id}/comments`);
        const comments = commentsRes.ok ? await commentsRes.json() : [];
        commentsEl.replaceChildren(...comments.map(renderComment));

        statusEl.hidden = true;
        postEl.hidden = false;
        commentsSection.hidden = false;
    } catch (err) {
        statusEl.textContent = 'Could not load this post. Is your API running';
        console.error(err);
    }
}

// Form
form.addEventListener('submit', async (e) => {
    e.preventDefault();
    formError.textContent = '';

    const data = Object.fromEntries(new FormData(form));

    try {
        const res = await fetch(`${API_URL}/posts/${id}/comments`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        const body = await res.json();

        if (!res.ok) {
            formError.textContent = body.error || 'Sorry, could not post your comment.';
            return;
        }
        commentsEl.append(renderComment(body));
        form.reset();
    } catch (err) {
        formError.textContent = 'Could not reach the server.';
        console.error(err);
    }
});

loadPage();