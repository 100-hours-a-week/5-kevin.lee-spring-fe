document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('email_input').addEventListener('input', (e) => validateEmail(e.target.value));
    document.getElementById('pw_input').addEventListener('input', (e) => validatePw(e.target.value));
    document.getElementById('signup').addEventListener('click', go_sign);
    document.getElementById('email_input').addEventListener('change', changeColor);
    document.getElementById('pw_input').addEventListener('change', changeColor);
    document.getElementById('input_submit').addEventListener('submit', async (event) => {
        event.preventDefault(); // 기본 제출 동작 방지
        await go_login(event);
    });
});

let emailInput;
let pwInput;
let eliEmail = false;
let eliPw = false;

const validateEmail = (email) => {
    emailInput = email;

    if (emailInput.length === 0) {
        document.getElementById('helper_text').textContent = '이메일을 입력해주세요';
        eliEmail = false;
    } else if (emailInput.length < 5 || !emailInput.includes('@')) {
        document.getElementById('helper_text').textContent = '올바른 이메일이 아닙니다.(예: example@example.com)';
        eliEmail = false;
    } else {
        document.getElementById('helper_text').textContent = 'helper text';
        eliEmail = true;
    }
};

const validatePw = (pw) => {
    pwInput = pw;
    const eliLength = pwInput.length > 7 && pwInput.length < 20;
    const eliUpper = /[A-Z]/.test(pwInput);
    const eliLower = /[a-z]/.test(pwInput);
    const eliNumber = /\d/.test(pwInput);
    const eliSpecialChar = /[!@#$%^&*()\-_=+{};:,<.>]/.test(pwInput);
    const eligible = eliLength && eliUpper && eliLower && eliNumber && eliSpecialChar;

    if (pwInput.length === 0) {
        document.getElementById('helper_text').textContent = '비밀번호를 입력해주세요';
        eliPw = false;
    } else if (!eligible) {
        document.getElementById('helper_text').textContent = '비밀번호는 8자 이상, 20자 이하이며, 대문자, 소문자, 숫자, 특수문자를 각각 최소 1개 포함해야 합니다.';
        eliPw = false;
    } else {
        document.getElementById('helper_text').textContent = 'helper text';
        eliPw = true;
    }
};

const changeColor = () => {
    if (eliEmail && eliPw) {
        document.getElementById('login_btn').style.backgroundColor = "#7F6AEE";
    }
};

const go_sign = () => {
    window.location.href = "/user/signin";
};

const go_login = async (event) => {
    const email = document.getElementById('email_input').value;
    const password = document.getElementById('pw_input').value;

    try {
        const response = await fetch('http://localhost:4000/users/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password }),
            credentials: 'include'  // 쿠키를 포함하여 요청
        });

        const data = await response.json();

        if (response.ok) {
            window.location.href = "/post/";
        } else {
            document.getElementById('helper_text').textContent = data.message || '로그인 중 오류가 발생했습니다.';
        }
    } catch (error) {
        console.error('Error logging in:', error);
    }
};
