const formatNum = (num) => {
    if (num >= 100000) {
        return '100k';
    } else if (num >= 10000) {
        return '10k';
    } else if (num >= 1000) {
        return '1k';
    } else {
        return num;
    }
};

const formatTitle = (title) => {
    return title.slice(0, 26);
};

document.addEventListener("DOMContentLoaded", async () => {
    const postsContainer = document.getElementById('posts-container');

    try {
        const response = await fetch('http://localhost:4000/posts/');
        const responseData = await response.json();

        if (response.status === 200 && Array.isArray(responseData.data)) {
            responseData.data.forEach(post => {
                const postDiv = document.createElement('div');
                postDiv.classList.add('post');

                const createdAt = new Date(post.created_at);
                const date_yyyymmdd = createdAt.toISOString().slice(0, 10); // YYYY-MM-DD 형식으로 변환
                const date_time = createdAt.toTimeString().slice(0, 8); // HH:MM:SS 형식으로 변환

                const title = formatTitle(post.post_title);
                const comment_counts = formatNum(post.comment_counts);
                const hits = formatNum(post.hits);
                const likes = formatNum(post.likes);

                postDiv.setAttribute('data-id', post.post_id);
                postDiv.innerHTML = `<div class="post">
                    <p class="post_title">${title}</p>
                    <div class="post_list">
                        <div class="good">
                            <p>좋아요</p> <p class="good_number">${likes}</p>
                        </div>
                        <div class="comment">
                            <p>댓글</p> <p class="comment_number">${comment_counts}</p>
                        </div>
                        <div class="hits">
                            <p>조회수</p>
                            <p class="hits_number">${hits}</p>
                        </div>
                        <div class="date">
                            <p class="date_yyyymmdd">${date_yyyymmdd}</p>
                            <p class="date_time">${date_time}</p>
                        </div>
                    </div>
                    <hr class="horizontal-rule"/>
                    <div class="creator_list">
                        <div id="circle"></div>
                        <p class="creator">${post.nickname}</p>
                    </div>
                </div>`;
                postsContainer.appendChild(postDiv);

                postDiv.addEventListener('click', () => {
                    window.location.href = `/post/detail/${post.post_id}`;
                });
            });
        } else {
            console.error('Unexpected response format or status:', responseData);
        }
    } catch (error) {
        console.error('Error fetching posts:', error);
    }
});

const post_create_btn = document.getElementById('postCreate');

post_create_btn.addEventListener('click', () => window.location.href = '/post/create');
post_create_btn.addEventListener('mouseenter', () => post_create_btn.style.backgroundColor = '#7f6aee');
post_create_btn.addEventListener('mouseleave', () => post_create_btn.style.backgroundColor = '#aca0eb');
