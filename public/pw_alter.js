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

const validatePw = () => {
    const correction_btn = document.getElementById('correction');
    const pwValue = document.getElementById('pw_input').value;
    const rePwValue = document.getElementById('rePw_input').value;
    const eliLength = pwValue.length > 7 && pwValue.length < 20;
    const eliUpper = /[A-Z]/.test(pwValue);
    const eliLower = /[a-z]/.test(pwValue);
    const eliNumber = /\d/.test(pwValue);
    const eliSpecialChar = /[!@#$%^&*()\-_=+{};:,<.>]/.test(pwValue);
    const eligible = eliLength && eliUpper && eliLower && eliNumber && eliSpecialChar;

    if (pwValue.length === 0) {
        correction_btn.style.backgroundColor = "#aca0eb";
        document.getElementById('helper_text_pw').innerHTML = '비밀번호를 입력해주세요';
    } else if (!eligible) {
        correction_btn.style.backgroundColor = "#aca0eb";
        document.getElementById('helper_text_pw').innerHTML = '*비밀번호는 8자 이상, 20자 이하이며, 대문자, 소문자, 숫자, 특수문자를 각각 최소 1개 포함해야 합니다.';
    } else if (pwValue !== rePwValue) {
        correction_btn.style.backgroundColor = "#aca0eb";
        document.getElementById('helper_text_pw').innerHTML = '비밀번호 확인과 다릅니다.';
    } else {
        correction_btn.style.backgroundColor = "#7f6aee";
        document.getElementById('helper_text_pw').innerHTML = 'helper text';
        document.getElementById('helper_text_rePw').innerHTML = 'helper text';
        correction();
    }
};

const validateRePw = () => {
    const correction_btn = document.getElementById('correction');
    const pwValue = document.getElementById('pw_input').value;
    const rePwValue = document.getElementById('rePw_input').value;
    const eliLength = rePwValue.length > 7 && rePwValue.length < 20;
    const eliUpper = /[A-Z]/.test(rePwValue);
    const eliLower = /[a-z]/.test(rePwValue);
    const eliNumber = /\d/.test(rePwValue);
    const eliSpecialChar = /[!@#$%^&*()\-_=+{};:,<.>]/.test(rePwValue);
    const eligible = eliLength && eliUpper && eliLower && eliNumber && eliSpecialChar;

    if (rePwValue.length === 0) {
        correction_btn.style.backgroundColor = "#aca0eb";
        document.getElementById('helper_text_rePw').innerHTML = '비밀번호를 한번 더 입력해주세요';
    } else if (!eligible) {
        document.getElementById('helper_text_rePw').innerHTML = '*비밀번호는 8자 이상, 20자 이하이며, 대문자, 소문자, 숫자, 특수문자를 각각 최소 1개 포함해야 합니다.';
    } else if (pwValue !== rePwValue) {
        document.getElementById('helper_text_rePw').innerHTML = '비밀번호와 다릅니다.';
    } else {
        document.getElementById('helper_text_pw').innerHTML = 'helper text';
        document.getElementById('helper_text_rePw').innerHTML = 'helper text';
        correction();
    }
};

document.getElementById('pw_input').addEventListener('change', validatePw);
document.getElementById('rePw_input').addEventListener('change', validateRePw);
document.getElementById('correction').addEventListener('click', async () => {
    const newPassword = document.getElementById('pw_input').value;
    const confirmPassword = document.getElementById('rePw_input').value;
    const sessionID = getCookieID('sessionID');

    if (newPassword.length === 0 || confirmPassword.length === 0) {
        helperText.innerHTML = "*비밀번호를 입력해주세요";
    } else if (newPassword !== confirmPassword) {
        helperText.innerHTML = "*비밀번호가 일치하지 않습니다";
    } else {
        try {
            const response = await fetch(`http://localhost:4000/users/profile/password`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${sessionID}`
                },
                credentials: 'include',
                body: JSON.stringify({ password: newPassword })
            });
            if (response.ok) {
                const tostMessage = document.getElementById('tost_message');
                tostMessage.classList.add('active');
                setTimeout(() => tostMessage.classList.remove('active'), 1000);
            }
        } catch (error) {
            console.error('Error updating password:', error);
        }
    }
});



const correction = () => {
    const correction_btn = document.getElementById('correction');
    correction_btn.style.backgroundColor = "#7f6aee";
};
