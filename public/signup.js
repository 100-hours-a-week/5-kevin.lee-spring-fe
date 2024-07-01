let pwInput;
let eliEmail = false;
let eliPw = false;
let eliRPw = false;
let eliNick = false;

document.getElementById('navigate_icon').addEventListener('click', go_login);
document.getElementById('login_btn').addEventListener('click', go_login);
document.getElementById('file_input').addEventListener('change', (event) => {
    const file = event.target.files[0];

    if (file) {
        const reader = new FileReader();
        reader.onload = () => {
            const imageDataUrl = reader.result;
            document.getElementById('insert_img').src = imageDataUrl;
        };
        reader.readAsDataURL(file);
    } else {
        document.getElementById('insert_img').src = "/img/insert_img.png";
    }
});

const eInputChange = document.getElementById('eInput');
const pInputChange = document.getElementById('pInput');
const rpInputChange = document.getElementById('rpInput');
const nInputChange = document.getElementById('nInput');
eInputChange.addEventListener('change', validateEmail);
pInputChange.addEventListener('change', validatePw);
rpInputChange.addEventListener('change', validateRPW);
nInputChange.addEventListener('change', validateNick);

document.getElementById('eInput').addEventListener('blur', async function () {
    const email = this.value;
    const emailHelper = document.getElementById('email_helper');

    if (email) {
        try {
            const response = await fetch(`http://localhost:4000/users/email/check?email=${email}`);
            const result = await response.json();

            if (response.ok && result.status === 200) {
                emailHelper.textContent = "사용 가능한 이메일입니다.";
                emailHelper.style.color = "red";
                eliEmail = true;
            } else {
                emailHelper.textContent = "이미 사용 중인 이메일입니다.";
                emailHelper.style.color = "red";
                eliEmail = false;
            }
        } catch (error) {
            console.error('Error checking email duplication:', error);
        }
    }
});

document.getElementById('nInput').addEventListener('blur', async function () {
    const nickname = this.value;
    const nicknameHelper = document.getElementById('nickname_helper');

    if (nickname) {
        try {
            const response = await fetch(`http://localhost:4000/users/nickname/check?nickname=${nickname}`);
            const result = await response.json();

            if (response.ok && result.status === 200) {
                nicknameHelper.textContent = "사용 가능한 닉네임입니다.";
                nicknameHelper.style.color = "red";
                eliNick = true;
            } else {
                nicknameHelper.textContent = "이미 사용 중인 닉네임입니다.";
                nicknameHelper.style.color = "red";
                eliNick = false;
            }
        } catch (error) {
            console.error('Error checking nickname duplication:', error);
        }
    }
});

const go_login = () => {
    window.location.href = '/user/login';
};

const validateEmail = () => {
    const email = document.getElementById('eInput').value;

    if (email.length === 0) {
        document.getElementById('email_helper').textContent = '이메일을 입력해주세요';
        eliEmail = false;
    } else if (email.length < 5 || !email.includes('@')) {
        document.getElementById('email_helper').textContent = '올바른 이메일이 아닙니다.(예: example@example.com)';
        eliEmail = false;
    } else {
        document.getElementById('email_helper').textContent = '* helper';
        eliEmail = true;
        final_check();
    }
};

const validatePw = () => {
    const pw = document.getElementById('pInput').value;
    const eliLength = pw.length > 7 && pw.length < 20;
    const eliUpper = /[A-Z]/.test(pw);
    const eliLower = /[a-z]/.test(pw);
    const eliNumber = /\d/.test(pw);
    const eliSpecialChar = /[!@#$%^&*()\-_=+{};:,<.>]/.test(pw);
    const eligible = eliLength && eliUpper && eliLower && eliNumber && eliSpecialChar;

    if (pw.length === 0) {
        document.getElementById('pw_helper').textContent = '비밀번호를 입력해주세요';
        eliPw = false;
    } else if (!eligible) {
        document.getElementById('pw_helper').textContent = '올바른 비밀번호가 아닙니다.';
        eliPw = false;
    } else {
        document.getElementById('pw_helper').textContent = '* helper';
        eliPw = true;
        final_check();
    }

    pwInput = pw;
};

const validateRPW = () => {
    const rpw = document.getElementById('rpInput').value;

    if (rpw.length === 0) {
        document.getElementById('rePw_helper').textContent = '비밀번호를 한번 더 입력해주세요';
        eliRPw = false;
    } else if (rpw !== pwInput) {
        document.getElementById('rePw_helper').textContent = '비밀번호가 다릅니다.';
        eliRPw = false;
    } else {
        document.getElementById('rePw_helper').textContent = '* helper';
        eliRPw = true;
        final_check();
    }
};

const validateNick = () => {
    const nickname = document.getElementById('nInput').value;

    if (nickname.length === 0) {
        document.getElementById('nickname_helper').textContent = '닉네임을 입력해주세요';
        eliNick = false;
    } else if (nickname.includes(' ')) {
        document.getElementById('nickname_helper').textContent = '띄어쓰기를 없애주세요';
        eliNick = false;
    } else if (nickname.length > 10) {
        document.getElementById('nickname_helper').textContent = '닉네임은 최대 10자 까지 작성 가능합니다.';
        eliNick = false;
    } else {
        document.getElementById('nickname_helper').textContent = '* helper';
        eliNick = true;
        final_check();
    }
};

const final_check = () => {
    console.log(eliEmail, eliNick, eliPw, eliRPw);
    const signup_btn = document.getElementById('signup_btn');
    if (eliEmail && eliNick && eliPw && eliRPw) {
        signup_btn.style.backgroundColor = '#7f6aee';
        signup_btn.disabled = false;
    } else {
        signup_btn.style.backgroundColor = '#aca0eb';
        signup_btn.disabled = true;
    }
};

document.getElementById('input_submit').addEventListener('submit', (event) => submitForm(event));

const submitForm = async (event) => {
    event.preventDefault();
    const email = document.getElementById('eInput').value;
    const password = document.getElementById('pInput').value;
    const nickname = document.getElementById('nInput').value;
    const fileInput = document.getElementById('file_input').value; // 파일 경로를 문자열로 가져오기

    const data = {
        email,
        password,
        nickname,
        profileImagePath: fileInput // 파일 경로 문자열로 전송
    };

    try {
        const response = await fetch('http://localhost:4000/users/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }

        const result = await response.json();
        if (result.message === 'register_success') {
            window.location.href = '/user/login';  // 성공 시 이동할 페이지
        } else {
            console.error('회원가입 실패:', result.message);
        }
    } catch (error) {
        console.error('회원가입 중 오류 발생:', error);
    }
};
