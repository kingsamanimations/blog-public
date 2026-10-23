import { API_URL } from './config.js';


// Logic for index.html
const statusEl = document.getElementById('status');
const listEl = document.getElementById('posts');

// Loading posts
async function loadPosts() {
    try {
        const res = await fetch(`${API_URL}/posts`);
        if (!res.ok) throw new Error(`Request failed (${res.status})`);
        const posts = await res.json();

        if (posts.length === 0) {
            statusEl.textContent = 'No posts yet.';
            return;
        }
        statusEl.hidden = true;

        for (const post of posts) {
            const li = document.createElement('li');

            const link = document.createElement('a');
            link.href = `post.html?id=${post.id}`;
            link.textContent = post.title;

            const date = document.createElement('time');
            date.dateTime = post.createdAt;
            date.textContent = new Date(post.createdAt).toLocaleDateString();

            li.append(link, ' ', date);
            listEl.append(li);
        }
    } catch (err) {
        statusEl.textContent = 'Could not load posts. Is the API running?';
        console.error(err)
    }
}

loadPosts();