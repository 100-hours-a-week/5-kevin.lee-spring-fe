const fetchUserData = async () => {
    try {
        const response = await fetch(`http://localhost:4000/users/profile`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${sessionID}`
            },
            credentials: 'include'
        });
        if (response.ok) {
            const data = await response.json();
            document.getElementById('email_input').innerText = data.data.email;
            document.getElementById('nickname_input').placeholder = data.data.nickname;
        } else {
            console.error('Failed to fetch user data:', response.status);
        }
    } catch (error) {
        console.error('Error fetching user data:', error);
    }
};

window.onload = fetchUserData;

document.getElementById('correction').addEventListener('click', () => correction());
document.getElementById('withdrawl').addEventListener('click', () => withdrawl());
document.getElementById('modal_cancel').addEventListener('click', () => closeModal());
document.getElementById('modal_confirm').addEventListener('click', () => deleteUser());

const getCookieID = (name) => {
    const cookieArr = document.cookie.split(";");
    for (let cookie of cookieArr) {
        let [key, value] = cookie.split("=");
        if (name === key.trim()) {
            console.log(decodeURIComponent(value));
            return decodeURIComponent(value);
        }
    }
    return null;
};

const modal = document.getElementById('modal_container');
const sessionID = getCookieID("sessionID");



const correction = async () => {
    const nickname = document.getElementById('nickname_input').value;
    const helper_text = document.getElementById('helper_text');

    if (nickname.length === 0) {
        helper_text.innerHTML = "*닉네임을 입력해주세요";
    } else if (nickname.length >= 11) {
        helper_text.innerHTML = "*닉네임은 최대 10자 까지 작성 가능합니다.";
    } else if (await NickDup(nickname)) {
        helper_text.innerHTML = "*닉네임이 중복되었습니다.";
    } else {
        try {
            const response = await fetch(`http://localhost:4000/users/profile`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${sessionID}`
                },
                credentials: 'include',
                body: JSON.stringify({ nickname })
            });
            if (response.ok) {
                const tostMessage = document.getElementById('tost_message');
                tostMessage.classList.add('active');
                helper_text.innerHTML = "닉네임이 성공적으로 변경되었습니다.";
                setTimeout(() => tostMessage.classList.remove('active'), 1000);
            } else {
                helper_text.innerHTML = "닉네임 변경에 실패했습니다.";
                console.error('닉네임 변경 실패:', response.status);
            }
        } catch (error) {
            console.error('Error correcting nickname:', error);
        }
    }
};

const withdrawl = () => {
    modal.classList.remove('hidden');
};

const closeModal = () => {
    modal.classList.add('hidden');
};

const NickDup = async (nickname) => {
    try {
        const response = await fetch(`http://localhost:4000/users/nickname/check?nickname=${nickname}`);
        const data = await response.json();
        return data.status === 400 && data.message === 'already_exist_nickname';
    } catch (error) {
        console.error('Error checking nickname duplication:', error);
        return false;
    }
};

const deleteUser = async () => {
    try {
        const response = await fetch(`http://localhost:4000/users/profile`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${sessionID}`
            },
            credentials: 'include'
        });
        if (response.ok) {
            alert('회원탈퇴가 완료되었습니다.');
            window.location.href = "/login"; // 탈퇴 후 로그인 페이지로 이동
        } else {
            console.error('회원탈퇴 실패:', response.status);
            alert('회원탈퇴에 실패했습니다.');
        }
    } catch (error) {
        console.error('Error deleting user:', error);
    }
};
