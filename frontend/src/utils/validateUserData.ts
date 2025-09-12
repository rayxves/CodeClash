export const sanitizeInput = (input: string) => {
  return input.replace(/[<>'";%()&+|-]/g, "");
};

export const validateUsername = (username: string) => {
  const regex = /^[a-zA-Z0-9_-]{3,20}$/;
  return regex.test(username);
};

export const validatePassword = (password: string) => {
  const minLength = 6;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecialChar = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password);

  if (password.length < minLength) {
    return "A senha deve ter pelo menos 6 caracteres";
  }
  if (!hasUpperCase) {
    return "A senha deve conter pelo menos uma letra maiúscula";
  }
  if (!hasLowerCase) {
    return "A senha deve conter pelo menos uma letra minúscula";
  }
  if (!hasNumber) {
    return "A senha deve conter pelo menos um número";
  }
  if (!hasSpecialChar) {
    return "A senha deve conter pelo menos um caractere especial";
  }
  return null;
};
