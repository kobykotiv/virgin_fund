export interface FormState {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  successMessage: string;
}

export interface ValidationErrors {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  submit?: string;
}
