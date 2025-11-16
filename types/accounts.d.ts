interface Account {
  id: number;
  email: string;
  username: string;
  password: string;
  date: string;
  gender: boolean;
  imageUrl: string;
  role: "admin" | "employee";
  created_at: Date;
  updated_at: Date;
  is_logged_in?: boolean;
}

interface AuthContextType {
  user: Account | null;
  loading: boolean;
  login: (account: Account) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  // Signup form state
  signupEmail: string;
  setSignupEmail: (email: string) => void;
  signupName: string;
  setSignupName: (name: string) => void;
  signupPassword: string;
  setSignupPassword: (password: string) => void;
  signupConfirmPassword: string;
  setSignupConfirmPassword: (confirmPassword: string) => void;
  showPassword: boolean;
  setShowPassword: (show: boolean) => void;
  showConfirmPassword: boolean;
  setShowConfirmPassword: (show: boolean) => void;
  signupLoading: boolean;
  signup: () => Promise<void>;
  clearSignupForm: () => void;
  // Signin form state
  signinEmail: string;
  setSigninEmail: (email: string) => void;
  signinPassword: string;
  setSigninPassword: (password: string) => void;
  showSigninPassword: boolean;
  setShowSigninPassword: (show: boolean) => void;
  signinLoading: boolean;
  signin: () => Promise<void>;
  clearSigninForm: () => void;
}
