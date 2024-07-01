const getCookieID = (name) => {
    const cookieArr = document.cookie.split(";");
    for (let cookie of cookieArr) {
        const [key, value] = cookie.split("=");
        if (name === key.trim()) {
            console.log(decodeURIComponent(value));
            return decodeURIComponent(value);
        }
    }
    return null;
};

let comment_target = null;
const sessionID = getCookieID("sessionID");
const commant_delete_modal = document.getElementById('commantDelete_container');

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

document.addEventListener("DOMContentLoaded", async () => {
    const pathname = window.location.pathname;
    const postId = pathname.split('/').pop(); // 마지막 부분이 postId
    if (!postId) {
        console.error('No post ID found in the URL');
        return;
    }

    const postsContainer = document.getElementById('post');
    if (!postsContainer) {
        console.error('No element with id "post" found in the DOM');
        return;
    }

    try {
        const response = await fetch(`http://localhost:4000/posts/${postId}`);
        const responseData = await response.json();

        if ((response.status === 200 || response.status === 201) && responseData.data) {
            const post = responseData.data;

            const postDiv = document.createElement('div');
            postDiv.classList.add('post');

            const createdAt = new Date(post.created_at);
            const date_yyyymmdd = createdAt.toISOString().slice(0, 10); // YYYY-MM-DD 형식으로 변환
            const date_time = createdAt.toTimeString().slice(0, 8); // HH:MM:SS 형식으로 변환

            const comment_counts = formatNum(post.comment_counts);
            const hits = formatNum(post.hits);
            const likes = formatNum(post.likes);
            postDiv.innerHTML = `<div class="post_title_category">
                <p class="post_title_txt">${post.post_title}</p>
            </div>
            <div class="post_creator_category">
                <div class="post_creator_img"></div>
                <div class="post_creator_name">${post.nickname}</div>
                <div class="post_creator_date">${date_yyyymmdd} ${date_time}</div>
                <div class="post_creator_modifi">
                    <button id="post_creator_correction">수정</button>
                    <button id="post_creator_delete">삭제</button>
                </div>
            </div>
            <hr class="horizontal-rule2"/>
            <div class="post_body">
                <div class="post_body_img"></div>
                <div class="post_body_txt">${post.post_content}</div>
                <div class="post_body_cnt">
                    <div class="post_body_hits">
                        <p id="hits_cnt">${post.hits}</p>
                        <p class="hits_intro">조회수</p>
                    </div>
                    <div class="post_body_commants">
                        <p id="commants_cnt">${post.comment_counts}</p>
                        <p class="commants_intro">댓글</p>
                    </div>
                </div>
            </div>`;

            postsContainer.appendChild(postDiv);

            const post_delete_modal = document.getElementById('postDelete_container');
            
            document.getElementById('post_creator_delete').addEventListener('click', () => {
                post_delete_modal.classList.remove('hidden');
                document.body.style.overflow = 'hidden';
            });

            document.getElementById('postDelete_cancel').addEventListener('click', () => {
                post_delete_modal.classList.add('hidden');
                document.body.style.overflow = 'auto';
            });

            document.getElementById('post_creator_correction').addEventListener('click', () => {
                window.location.href = `/post/edit/${postId}`;
            });

            document.getElementById('postDelete_confirm').addEventListener('click', async () => {
                try {
                    const response = await fetch(`http://localhost:4000/posts/${postId}`, { 
                        method: 'DELETE',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${sessionID}`
                        },
                        credentials: 'include'
                    });

                    if (response.status === 200) {
                        alert('게시글이 삭제되었습니다.');
                        window.location.href = '/post';
                    } else {
                        alert('게시글 삭제에 실패했습니다.');
                    }
                } catch (error) {
                    console.error('Error deleting post:', error);
                }
            });

        } else {
            console.error('Failed to fetch post details:', responseData);
        }
    } catch (error) {
        console.error('Error fetching posts:', error);
    }

    try {
        const response = await fetch(`http://localhost:4000/posts/${postId}/comments`);
        const responseData = await response.json();

        if (response.status === 200 && responseData.data) {
            const comments = responseData.data;
            const commentsContainer = document.getElementById('comments_container');
            
            comments.forEach(comment => {
                const commentDiv = document.createElement('div');
                commentDiv.classList.add('comments_list1'); // Assuming a class for styling
            
                const createdAt = new Date(comment.created_at);
                const date_yyyymmdd = createdAt.toISOString().slice(0, 10); // YYYY-MM-DD 형식으로 변환
            
                commentDiv.innerHTML = `
                    <div class="comments_list1_top">
                        <p class="comments_list1_creator_name">${comment.nickname}</p>
                        <p class="comments_list1_date">${date_yyyymmdd}</p>
                        <div class="comments_list1_modifi">
                            <button class="comment_correctBtn" id="comments_list1_correctBtn_${comment.comment_id}">수정</button>
                            <button class="comment_deleteBtn" id="comments_list1_deleteBtn_${comment.comment_id}">삭제</button>
                        </div>
                    </div>
                    <div class="comments_list1_content" id="comments_list1_creator_content_${comment.comment_id}">
                        ${comment.comment_content}
                    </div>`;
            
                commentsContainer.appendChild(commentDiv);
            
                document.getElementById(`comments_list1_correctBtn_${comment.comment_id}`).addEventListener('click', () => {
                    correct_comment(comment.comment_id, comment.comment_content);
                });
            
                document.getElementById(`comments_list1_deleteBtn_${comment.comment_id}`).addEventListener('click', () => {
                    delete_comment(postId, comment.comment_id);
                });
            });

            document.getElementById('comments_btn').addEventListener('click', () => {
                if (comment_target == null) {
                    add_comment(postId);
                } else {
                    update_comment(postId, comment_target);
                }
            });

            document.getElementById('commantDelete_cancel').addEventListener('click', () => {
                commant_delete_modal.classList.add('hidden');
                document.body.style.overflow = 'auto';
            });

            document.getElementById('comments_input').addEventListener('change', check_comment);
        } else {
            console.error('Failed to fetch comments:', responseData);
        }
    } catch (error) {
        console.error('Error fetching comments:', error);
    }
});

const add_comment = async (postId) => {
    const content = document.getElementById('comments_input').value;
    const userId = "1"; // Replace with actual user ID

    try {
        const response = await fetch(`http://localhost:4000/posts/${postId}/comments`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${sessionID}`
            },
            credentials: 'include',
            body: JSON.stringify({ userId, content }),
        });
        const responseData = await response.json();

        if (response.status === 201 && responseData.data) {
            alert('댓글이 등록되었습니다.');
            location.reload(); // Reload to fetch the new comment
        } else {
            alert('댓글 등록에 실패했습니다.');
        }
    } catch (error) {
        console.error('Error adding comment:', error);
    }
};

const correct_comment = (commentId, content) => {
    const comment_output = document.getElementById('comments_input');
    comment_output.value = content;

    comment_target = commentId;
    document.getElementById('comments_btn').innerText = "댓글 수정";
};

const update_comment = async (postId, commentId) => {
    const content = document.getElementById('comments_input').value;

    try {
        const response = await fetch(`http://localhost:4000/posts/${postId}/comments/${commentId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${sessionID}`
            },
            credentials: 'include',
            body: JSON.stringify({ content }),
        });
        const responseData = await response.json();

        if (response.status === 200 && responseData.data) {
            alert('댓글이 수정되었습니다.');
            location.reload(); // Reload to reflect the changes
        } else {
            alert('댓글 수정에 실패했습니다.');
        }
    } catch (error) {
        console.error('Error updating comment:', error);
    }
};

const delete_comment = async (postId, commentId) => {
    commant_delete_modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    document.getElementById('commantDelete_confirm').addEventListener('click', async () => {
        try {
            const response = await fetch(`http://localhost:4000/posts/${postId}/comments/${commentId}`, { 
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${sessionID}`
                },
                credentials: 'include'
            });

            if (response.status === 200) {
                alert('댓글이 삭제되었습니다.');
                location.reload(); // Reload to remove the deleted comment
            } else {
                alert('댓글 삭제에 실패했습니다.');
            }
        } catch (error) {
            console.error('Error deleting comment:', error);
        }
    });
};

const check_comment = () => {
    const comment_input = document.getElementById('comments_input');
    const comment_value = comment_input.value;
    const comment_btn = document.getElementById('comments_btn');

    if (comment_value.length === 0) {
        comment_btn.disabled = true;
        comment_btn.style.backgroundColor = "#aca0eb";
    } else if (comment_value.length > 0) {
        comment_btn.disabled = false;
        comment_btn.style.backgroundColor = "#7f6aee";
    }
};

document.getElementById('navigate_icon').addEventListener('click', () => {
    window.location.href = "/post/";
});
