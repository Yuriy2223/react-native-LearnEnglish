import * as yup from "yup";

export const registerSchema = yup.object().shape({
  name: yup
    .string()
    .required("Ім'я є обов'язковим")
    .min(3, "Ім'я має містити мінімум 3 символи")
    .max(50, "Ім'я не може перевищувати 50 символів"),
  email: yup
    .string()
    .required("Email є обов'язковим")
    .email("Введіть коректний email"),
  password: yup
    .string()
    .required("Пароль є обов'язковим")
    .min(6, "Пароль має містити мінімум 6 символів")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Пароль має містити велику літеру, малу літеру та цифру"
    ),
  confirmPassword: yup
    .string()
    .required("Підтвердження пароля є обов'язковим")
    .oneOf([yup.ref("password")], "Паролі не співпадають"),
});

export const loginSchema = yup.object().shape({
  email: yup
    .string()
    .required("Email є обов'язковим")
    .email("Введіть коректний email"),
  password: yup
    .string()
    .required("Пароль є обов'язковим")
    .min(6, "Пароль має містити мінімум 6 символів")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Пароль має містити велику літеру, малу літеру та цифру"
    ),
});
