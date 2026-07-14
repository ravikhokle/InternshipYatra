export const validateName = (name) => {
  const trimmed = name.trim();
  if (!trimmed) return "Name is required";
  if (trimmed.length < 3) return "Name must be at least 3 characters";
  if (trimmed.length > 100) return "Name cannot exceed 100 characters";
  if (!/^[a-zA-Z\s]+$/.test(trimmed)) return "Name can only contain letters and spaces";
  return "";
};

export const validateEmail = (email) => {
  const trimmed = email.trim();
  if (!trimmed) return "Email is required";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) return "Please enter a valid email address";
  return "";
};

export const validatePassword = (password) => {
  if (!password) return "Password is required";
  if (password.length < 8) return "Password must be at least 8 characters";
  if (!/[a-z]/.test(password)) return "Password must include a lowercase letter";
  if (!/[A-Z]/.test(password)) return "Password must include an uppercase letter";
  if (!/\d/.test(password)) return "Password must include a number";
  return "";
};

export const validateConfirmPassword = (password, confirmPassword) => {
  if (!confirmPassword) return "Please confirm your password";
  if (password !== confirmPassword) return "Passwords do not match";
  return "";
};

export const getPasswordStrength = (password) => {
  if (!password) return { label: "", color: "", width: "0%", score: 0 };

  let score = 0;
  if (password.length >= 8) score++;
  if (/[a-z]/.test(password)) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[^a-zA-Z0-9]/.test(password)) score++;

  if (score <= 2) return { label: "Weak", color: "bg-red-400", width: "33%", score };
  if (score <= 3) return { label: "Fair", color: "bg-yellow-400", width: "66%", score };
  if (score <= 4) return { label: "Good", color: "bg-blue-400", width: "85%", score };
  return { label: "Strong", color: "bg-green-500", width: "100%", score };
};

export const validateSignupForm = (form) => {
  const errors = {
    name: validateName(form.name),
    email: validateEmail(form.email),
    password: validatePassword(form.password),
    confirmPassword: validateConfirmPassword(form.password, form.confirmPassword),
  };

  return errors;
};
