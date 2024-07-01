
document.addEventListener("DOMContentLoaded", () => {
    const postsContainer = document.getElementById('posts-container');

    // 서버에서 postInfo 데이터를 가져옵니다.
    fetch('/getPosts')
        .then(response => response.json())
        .then(postInfo => {
            postInfo.forEach(post => {
                const postDiv = document.createElement('div');
                postDiv.classList.add('post');
                
                postDiv.innerHTML = `
                    <h2>${post.post_title}</h2>
                    <p>댓글: ${post.comment_count}</p>
                    <p>조회수: ${post.hits}</p>
                    <p>좋아요: ${post.like}</p>
                `;
                
                postsContainer.appendChild(postDiv);
            });
        })
        .catch(error => {
            console.error('Error fetching posts:', error);
        });
});
