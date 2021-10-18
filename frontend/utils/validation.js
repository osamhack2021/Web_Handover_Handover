import R from "ramda";

export const validateServiceNumber = (username) => {
  let valid = true;
  let message = "올바른 군번 형식입니다";

  if (!R.match(/^[0-9-]+$/, username).length) {
    message = "숫자와 -로 구성된 군번을 입력해주세요";
    valid = false;
  } else if (username.length < 4) {
    message = "4자리 이상의 군번을 입력해주세요";
    valid = false;
  } else if (username.length > 20) {
    message = "올바른 형식의 군번을 입력해주세요";
    valid = false;
  }
  return { valid, message };
};

export const validatePassword = (username, password) => {
  let valid = true;
  let message = "사용할 수 있는 비밀번호입니다";

  if (password.length < 8) {
    valid = false;
    message = "8자리 이상의 비밀번호를 사용해주세요";
  } else if (username === password) {
    valid = false;
    message = "사용자 이릅과 동일한 비밀번호는 사용할 수 없습니다";
  } else if (!R.match(/[0-9]/, password).length) {
    valid = false;
    message = "한자리 이상의 숫자를 포함한 비밀번호를 사용해주세요";
  }

  return { valid, message };
};

export const validateName = (name) => {
  if (name === "") {
    return true;
  }
  if (!R.match(/^[a-zA-ZÀ-ÿ'.\s]+$/, name).length) {
    return false;
  }
  if (name.length > 20) {
    return false;
  }
  return true;
};
