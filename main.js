// --- Web Component for Post Cards ---
class PostCard extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        // Use getAttribute for date to ensure it's passed correctly
        const title = this.getAttribute('title');
        const content = this.innerHTML;
        const date = this.getAttribute('date');

        this.shadowRoot.innerHTML = `
            <style>
                :host { display: block; color: var(--font-color); }
                .card { padding: 30px; border-bottom: 1px solid var(--border-color); }
                h3 { margin: 0 0 10px 0; font-size: 1.8rem; color: inherit; }
                p { margin: 0 0 15px 0; font-size: 1.1rem; white-space: pre-wrap; }
                .date { font-size: 0.9rem; color: #7f8c8d; }
            </style>
            <div class="card">
                <h3>${title}</h3>
                <p>${content}</p>
                <div class="date">${date}</div>
            </div>
        `;
        this.innerHTML = ''; // Clear original content to prevent duplication
    }
}
customElements.define('post-card', PostCard);

// --- DOM Elements ---
const writePostBtn = document.getElementById('write-post-btn');
const modal = document.getElementById('post-modal');
const closeModalBtn = document.querySelector('.close-btn');
const postForm = document.getElementById('post-form');
const postContainer = document.getElementById('post-container');
const postTitleInput = document.getElementById('post-title');
const postContentInput = document.getElementById('post-content');
const themeToggleBtn = document.getElementById('theme-toggle-btn');

// --- Post Persistence ---
const POSTS_STORAGE_KEY = 'retie-posts';

function getPosts() {
    const postsJSON = localStorage.getItem(POSTS_STORAGE_KEY);
    return postsJSON ? JSON.parse(postsJSON) : null;
}

function savePosts(posts) {
    localStorage.setItem(POSTS_STORAGE_KEY, JSON.stringify(posts));
}

function renderPost(post) {
    const newPostElement = document.createElement('post-card');
    newPostElement.setAttribute('title', post.title);
    newPostElement.setAttribute('date', post.date);
    newPostElement.textContent = post.content;
    postContainer.prepend(newPostElement); // Prepend to show newest first
}

function loadPosts() {
    let posts = getPosts();
    if (!posts || posts.length === 0) {
        // If no posts exist, create initial dummy posts and save them
        posts = [
            {
                title: "나의 첫 번째 글",
                content: "은퇴 후 새로운 삶을 시작하며, 이곳 'retie'에 저의 작은 생각들을 기록해보려 합니다. 앞으로 많은 분들과 소통하고 싶습니다.",
                date: new Date().toLocaleDateString('ko-KR')
            },
            {
                title: "정원 가꾸기에서 얻는 교훈",
                content: "작은 텃밭을 가꾸기 시작했습니다. 씨앗이 싹트고 자라나는 모습을 보며, 삶의 새로운 활력과 인내의 가치를 배웁니다. 자연은 언제나 최고의 스승입니다.",
                date: new Date(Date.now() - 86400000).toLocaleDateString('ko-KR') // Yesterday
            }
        ];
        savePosts(posts);
    }
    // Clear container and render all posts from storage
    postContainer.innerHTML = '';
    // Reverse the array to show oldest first, then prepend will put newest at top
    posts.slice().reverse().forEach(renderPost);
}


// --- Modal and Form Functions ---
function openModal() {
    modal.style.display = 'flex';
}

function closeModal() {
    modal.style.display = 'none';
}

function handlePostSubmit(event) {
    event.preventDefault();

    const title = postTitleInput.value.trim();
    const content = postContentInput.value.trim();

    if (title && content) {
        const newPost = {
            title,
            content,
            date: new Date().toLocaleDateString('ko-KR')
        };

        // Add to UI
        renderPost(newPost);

        // Add to localStorage
        const posts = getPosts() || [];
        posts.push(newPost);
        savePosts(posts);

        // Reset and close
        postForm.reset();
        closeModal();
    }
}

// --- Theme Toggling ---
function setInitialTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.body.setAttribute('data-theme', savedTheme);
    themeToggleBtn.textContent = savedTheme === 'dark' ? '☀️' : '🌙';
}

function toggleTheme() {
    const currentTheme = document.body.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    document.body.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    themeToggleBtn.textContent = newTheme === 'dark' ? '☀️' : '🌙';
}

// --- Event Listeners ---
writePostBtn.addEventListener('click', openModal);
closeModalBtn.addEventListener('click', closeModal);
postForm.addEventListener('submit', handlePostSubmit);
themeToggleBtn.addEventListener('click', toggleTheme);

window.addEventListener('click', (event) => {
    if (event.target === modal) {
        closeModal();
    }
});

document.addEventListener('DOMContentLoaded', () => {
    setInitialTheme();
    loadPosts();
});
