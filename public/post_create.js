document.getElementById('backward').addEventListener('click', () => {
    window.location.href = "/post/";
});

// 받기만 하고, 전송 기능 없음
document.getElementById('image_input').addEventListener('change', (event) => {
    const file = event.target.files[0];

    if (file) {
        const reader = new FileReader();
        reader.readAsDataURL(file);
    }
});

document.getElementById('complete').addEventListener('click', async (event) => {
    event.preventDefault();

    const title_input = document.getElementById('title_input');
    const content_input = document.getElementById('content_input');
    const post_title = title_input.value;
    const post_content = content_input.value;

    // user_id 임시 입력
    const user_id = 1;

    if (post_title === '' || post_content === '') {
        document.getElementById('helper_text').innerHTML = "제목, 내용을 모두 작성해주세요";
    } else {
        document.getElementById('helper_text').innerHTML = "helper text";
        try {
            const response = await fetch(`http://localhost:4000/posts/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ post_title, post_content, user_id })
            });

            if (response.status != 201) {
                throw new Error('게시글 작성에 실패했습니다.');
            }

            const data = await response.json();
            alert('게시글이 작성되었습니다.');
            window.location.href = `/post/detail/${data.data.post_id}`;
        } catch (error) {
            console.error('Error:', error);
        }
    }
});

const updateCompleteButton = () => {
    const title_value = document.getElementById('title_input').value;
    const content_value = document.getElementById('content_input').value;

    const completeButton = document.getElementById('complete');
    completeButton.style.backgroundColor = (title_value.length !== 0 && content_value.length !== 0) ? "#7f6aee" : "#ACADEB";
};

document.getElementById('title_input').addEventListener('change', updateCompleteButton);
document.getElementById('content_input').addEventListener('change', updateCompleteButton);
