document.addEventListener('DOMContentLoaded', () => {
    const postList = document.getElementById('post-list');
    const newPostForm = document.getElementById('new-post-form');
    const newPostTitle = document.getElementById('new-post-title');
    const uploadImg = document.getElementById('upload-img');
    const authSection = document.getElementById('auth-section');
    const blogSection = document.getElementById('blog-section');
    const signUpForm = document.getElementById('sign-up-form');
    const signInForm = document.getElementById('sign-in-form');

    const editModal = document.getElementById('edit-modal');
    const closeBtn = document.querySelector('.close-btn');
    const editPostTitle = document.getElementById('edit-post-title');
    const saveEditBtn = document.getElementById('save-edit-btn');

    const toolbarOptions = [
        ['bold', 'italic', 'underline', 'strike'],
        [{ 'header': 1 }, { 'header': 2 }],
        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
        [{ 'color': [] }, { 'background': [] }],
        [{ 'align': [] }],
        ['image', 'blockquote', 'code-block'],
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }]
    ];

    const editor = new Quill('#editor-container', {
        theme: 'snow',
        modules: {
            toolbar: toolbarOptions
        }
    });

    const editEditor = new Quill('#edit-editor-container', {
        theme: 'snow',
        modules: {
            toolbar: toolbarOptions
        }
    });

    let posts = [];
    let users = [];
    let currentUser = null;
    let currentEditIndex = null;

    signUpForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = document.getElementById('sign-up-username').value;
        const password = document.getElementById('sign-up-password').value;
        users.push({ username, password });
        signUpForm.reset();
        alert('Sign up successful!');
    });

    signInForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = document.getElementById('sign-in-username').value;
        const password = document.getElementById('sign-in-password').value;
        const user = users.find(user => user.username === username && user.password === password);
        if (user) {
            currentUser = user;
            authSection.style.display = 'none';
            blogSection.style.display = 'block';
        } else {
            alert('Invalid credentials!');
        }
    });

    newPostForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const post = {
            title: newPostTitle.value,
            content: editor.root.innerHTML,
            author: currentUser.username
        };
        if (uploadImg.files[0]) {
            const reader = new FileReader();
            reader.onload = function(event) {
                post.image = event.target.result;
                posts.push(post);
                renderPosts();
            }
            reader.readAsDataURL(uploadImg.files[0]);
        } else {
            posts.push(post);
            renderPosts();
        }
        newPostTitle.value = '';
        editor.root.innerHTML = '';
        uploadImg.value = '';
    });

    function renderPosts() {
        postList.innerHTML = '';
        posts.forEach((post, index) => {
            const postDiv = document.createElement('div');
            postDiv.className = 'post';
            postDiv.innerHTML = `
                <h2>${post.title}</h2>
                <p>${post.content}</p>
                ${post.image ? `<img src="${post.image}" alt="Image" style="max-width:100%;">` : ''}
                <p><strong>Author:</strong> ${post.author}</p>
                ${post.author === currentUser.username ? `<button onclick="editPost(${index})">Edit</button>
                <button onclick="deletePost(${index})">Delete</button>` : ''}
            `;
            postList.appendChild(postDiv);
        });
    }

    window.editPost = (index) => {
        currentEditIndex = index;
        const post = posts[index];
        editPostTitle.value = post.title;
        editEditor.root.innerHTML = post.content;
        editModal.style.display = 'block';
    };

    window.deletePost = (index) => {
        posts.splice(index, 1);
        renderPosts();
    };

    closeBtn.addEventListener('click', () => {
        editModal.style.display = 'none';
    });

    saveEditBtn.addEventListener('click', () => {
        posts[currentEditIndex].title = editPostTitle.value;
        posts[currentEditIndex].content = editEditor.root.innerHTML;
        editModal.style.display = 'none';
        renderPosts();
    });

    window.onclick = (event) => {
        if (event.target == editModal) {
            editModal.style.display = 'none';
        }
    };
});
