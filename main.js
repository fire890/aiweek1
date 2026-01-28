// --- Web Component for Post Cards ---
class PostCard extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        const title = this.getAttribute('title');
        const content = this.innerHTML;
        const date = new Date().toLocaleDateString('ko-KR');

        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                    /* Inherit variables from the light/dark theme */
                    color: var(--font-color);
                }
                .card {
                    padding: 30px;
                    border-bottom: 1px solid var(--border-color);
                }
                h3 {
                    margin: 0 0 10px 0;
                    font-size: 1.8rem;
                    /* Use a specific color for titles or inherit */
                    color: inherit; 
                }
                p {
                    margin: 0 0 15px 0;
                    font-size: 1.1rem;
                    white-space: pre-wrap;
                }
                .date {
                    font-size: 0.9rem;
                    color: #7f8c8d; /* This can also be a variable if needed */
                }
            </style>
            <div class="card">
                <h3>${title}</h3>
                <p>${content}</p>
                <div class="date">${date}</div>
            </div>
        `;
        this.innerHTML = ''; // Clear original content
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

// --- Functions ---
function openModal() {
    modal.style.display = 'flex';
}

function closeModal() {
    modal.style.display = 'none';
}

function addPost(event) {
    event.preventDefault();

    const title = postTitleInput.value.trim();
    const content = postContentInput.value.trim();

    if (title && content) {
        const newPost = document.createElement('post-card');
        newPost.setAttribute('title', title);
        newPost.textContent = content; // Pass content via textContent

        postContainer.prepend(newPost);
        postForm.reset();
        closeModal();
    }
}

function addInitialPosts() {
    // Check if there are already posts to avoid duplication on hot reloads
    if (postContainer.children.length > 0) return;

    const posts = [
        {
            title: "나의 첫 번째 글",
            content: "은퇴 후 새로운 삶을 시작하며, 이곳 'retie'에 저의 작은 생각들을 기록해보려 합니다. 앞으로 많은 분들과 소통하고 싶습니다."
        },
        {
            title: "정원 가꾸기에서 얻는 교훈",
            content: "작은 텃밭을 가꾸기 시작했습니다. 씨앗이 싹트고 자라나는 모습을 보며, 삶의 새로운 활력과 인내의 가치를 배웁니다. 자연은 언제나 최고의 스승입니다."
        }
    ];

    posts.forEach(post => {
        const newPost = document.createElement('post-card');
        newPost.setAttribute('title', post.title);
        newPost.textContent = post.content;
        postContainer.appendChild(newPost);
    });
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
postForm.addEventListener('submit', addPost);
themeToggleBtn.addEventListener('click', toggleTheme);

window.addEventListener('click', (event) => {
    if (event.target === modal) {
        closeModal();
    }
});

document.addEventListener('DOMContentLoaded', () => {
    setInitialTheme();
    addInitialPosts();
});