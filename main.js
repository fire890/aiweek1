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
                }
                .card {
                    padding: 30px;
                    border-bottom: 1px solid #eee;
                }
                h3 {
                    margin: 0 0 10px 0;
                    font-size: 1.8rem;
                    color: #2c3e50;
                }
                p {
                    margin: 0 0 15px 0;
                    font-size: 1.1rem;
                    white-space: pre-wrap;
                    color: #555;
                }
                .date {
                    font-size: 0.9rem;
                    color: #7f8c8d;
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

        // Add new post to the top of the container
        postContainer.prepend(newPost);

        // Clear form and close modal
        postForm.reset();
        closeModal();
    }
}

// --- Initial Dummy Content ---
function addInitialPosts() {
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


// --- Event Listeners ---
writePostBtn.addEventListener('click', openModal);
closeModalBtn.addEventListener('click', closeModal);
postForm.addEventListener('submit', addPost);

// Close modal if user clicks outside of the content area
window.addEventListener('click', (event) => {
    if (event.target === modal) {
        closeModal();
    }
});

// Load initial content when the page loads
document.addEventListener('DOMContentLoaded', addInitialPosts);
