document.addEventListener("DOMContentLoaded", async () => {
    const pathname = window.location.pathname;
    const postId = pathname.split('/').pop(); // 마지막 부분이 postId

    if (!postId) {
        console.error('No post ID found in the URL');
        return;
    }

    const postsContainer = document.getElementById('post_container');

    try {
        const response = await fetch(`http://localhost:4000/posts/${postId}`);
        const responseData = await response.json();

        if (response.status === 200 && responseData.data) {
            const post = responseData.data;

            const postDiv = document.createElement('div');
            postDiv.classList.add('post');

            postDiv.innerHTML = `
                <form class="post_correct">
                    <div class="post_correct_title">제목*</div>
                    <hr class="horizontal-rule2"/>
                    <input value="${post.post_title}" maxlength="26" id="post_correct_titleInput"></input>
                    <hr class="horizontal-rule2"/>
                    <div id="post_correct_content">내용*</div>
                    <hr class="horizontal-rule2"/>
                    <textarea placeholder="내용 입력" id="post_correct_contentInput">${post.post_content}</textarea>
                    <hr class="horizontal-rule2"/>
                    <div class="post_correct_img_category">
                        <div class="post_correct_img_title">이미지</div>
                        <div class="post_correct_img_input_category">
                            <button id="post_correct_img_btn">파일 선택</button>
                            <p class="post_correct_img_txt">기존 파일 명</p>
                        </div>
                    </div>
                </form>`;

            postsContainer.appendChild(postDiv);

            const post_delete_modal = document.getElementById('postDelete_container');

            document.getElementById('backward').addEventListener('click', () => {
                window.location.href = `/post/detail/${postId}`;
            });

            document.getElementById('post_correct_btn').addEventListener('click', async (event) => {
                event.preventDefault();

                const postTitle = document.getElementById('post_correct_titleInput').value;
                const postContent = document.getElementById('post_correct_contentInput').value;

                try {
                    const response = await fetch(`http://localhost:4000/posts/${postId}`, {
                        method: 'PATCH',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        credentials: 'include',
                        body: JSON.stringify({ postTitle, postContent })
                    });

                    if (response.status == 403) {
                        throw new Error('권한이 없습니다.');
                    } else if (response.status != 200) {
                        throw new Error('게시글 수정에 실패했습니다.');
                    }

                    const data = await response.json();
                    alert('게시글이 수정되었습니다.');
                    window.location.href = `/post/detail/${postId}`;
                } catch (error) {
                    console.error('Error:', error);
                    alert('게시글 수정 중 오류가 발생했습니다.');
                }
            });
        } else {
            console.error('Failed to fetch post details:', responseData);
        }
    } catch (error) {
        console.error('Error fetching posts:', error);
    }
});
