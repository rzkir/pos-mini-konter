import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

import AsyncStorage from '@react-native-async-storage/async-storage';

import Toast from 'react-native-toast-message';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = process.env.EXPO_PUBLIC_ACCOUNTS as string;

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<Account | null>(null);
    const [loading, setLoading] = useState(true);

    // Signup form state
    const [signupEmail, setSignupEmail] = useState('');
    const [signupName, setSignupName] = useState('');
    const [signupPassword, setSignupPassword] = useState('');
    const [signupConfirmPassword, setSignupConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [signupLoading, setSignupLoading] = useState(false);

    // Signin form state
    const [signinEmail, setSigninEmail] = useState('');
    const [signinPassword, setSigninPassword] = useState('');
    const [showSigninPassword, setShowSigninPassword] = useState(false);
    const [signinLoading, setSigninLoading] = useState(false);

    // Load user from local storage on mount
    useEffect(() => {
        loadUser();
    }, []);

    const loadUser = async () => {
        try {
            const storedUser = await AsyncStorage.getItem(AUTH_STORAGE_KEY);
            if (storedUser) {
                const parsedUser = JSON.parse(storedUser);
                // Convert date strings back to Date objects
                if (parsedUser.created_at) {
                    parsedUser.created_at = new Date(parsedUser.created_at);
                }
                if (parsedUser.updated_at) {
                    parsedUser.updated_at = new Date(parsedUser.updated_at);
                }
                // Only set user if logged in
                if (parsedUser.is_logged_in === true) {
                    setUser(parsedUser);
                } else {
                    setUser(null);
                }
            }
        } catch (error) {
            console.error('Error loading user from storage:', error);
        } finally {
            setLoading(false);
        }
    };

    const login = async (account: Account) => {
        try {
            // Set is_logged_in to true and save to local storage
            const accountWithSession = {
                ...account,
                is_logged_in: true,
                updated_at: new Date(),
            };
            await AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(accountWithSession));
            setUser(accountWithSession);
        } catch (error) {
            console.error('Error saving user to storage:', error);
            throw error;
        }
    };

    const logout = async () => {
        try {
            // Get current user from storage
            const storedUser = await AsyncStorage.getItem(AUTH_STORAGE_KEY);
            if (storedUser) {
                const parsedUser = JSON.parse(storedUser);
                // Update is_logged_in to false, but keep the account in storage
                const accountWithSession = {
                    ...parsedUser,
                    is_logged_in: false,
                    updated_at: new Date(),
                };
                await AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(accountWithSession));
            }
            setUser(null);
        } catch (error) {
            console.error('Error updating user session:', error);
            throw error;
        }
    };

    const signup = async () => {
        if (!signupEmail || !signupName || !signupPassword || !signupConfirmPassword) {
            const error = 'Please fill in all fields';
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: error,
            });
            throw new Error(error);
        }

        if (signupPassword.length < 8) {
            const error = 'Password must be at least 8 characters long';
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: error,
            });
            throw new Error(error);
        }

        if (signupPassword !== signupConfirmPassword) {
            const error = 'Passwords do not match';
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: error,
            });
            throw new Error(error);
        }

        setSignupLoading(true);

        try {
            const newAccount: Account = {
                id: Date.now(), // Simple ID generation
                email: signupEmail,
                username: signupName,
                password: signupPassword,
                gender: false,
                date: new Date().toISOString().split('T')[0],
                imageUrl: '',
                role: 'admin' as const,
                created_at: new Date(),
                updated_at: new Date(),
            };

            await login(newAccount);
            Toast.show({
                type: 'success',
                text1: 'Berhasil mendaftar',
                text2: 'Akun Anda berhasil dibuat!',
            });
            clearSignupForm();
        } catch (err: any) {
            const errorMessage = err.message || 'Failed to sign up';
            // Only show toast if error is not already shown
            if (errorMessage !== 'Please fill in all fields' &&
                errorMessage !== 'Password must be at least 8 characters long' &&
                errorMessage !== 'Passwords do not match') {
                Toast.show({
                    type: 'error',
                    text1: 'Error',
                    text2: errorMessage,
                });
            }
            throw err;
        } finally {
            setSignupLoading(false);
        }
    };

    const clearSignupForm = () => {
        setSignupEmail('');
        setSignupName('');
        setSignupPassword('');
        setSignupConfirmPassword('');
        setShowPassword(false);
        setShowConfirmPassword(false);
    };

    const signin = async () => {
        if (!signinEmail || !signinPassword) {
            const error = 'Please fill in all fields';
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: error,
            });
            throw new Error(error);
        }

        setSigninLoading(true);

        try {
            // Get stored account from AsyncStorage
            const storedAccountData = await AsyncStorage.getItem(AUTH_STORAGE_KEY);

            if (!storedAccountData) {
                const error = 'No account found. Please sign up first.';
                Toast.show({
                    type: 'error',
                    text1: 'Error',
                    text2: error,
                });
                setSigninLoading(false);
                throw new Error(error);
            }

            const storedAccount: Account = JSON.parse(storedAccountData);

            // Convert date strings back to Date objects if needed
            if (storedAccount.created_at && typeof storedAccount.created_at === 'string') {
                storedAccount.created_at = new Date(storedAccount.created_at);
            }
            if (storedAccount.updated_at && typeof storedAccount.updated_at === 'string') {
                storedAccount.updated_at = new Date(storedAccount.updated_at);
            }

            // Verify email and password
            if (storedAccount.email.toLowerCase() !== signinEmail.toLowerCase()) {
                const error = 'Invalid email or password';
                Toast.show({
                    type: 'error',
                    text1: 'Error',
                    text2: error,
                });
                setSigninLoading(false);
                throw new Error(error);
            }

            if (storedAccount.password !== signinPassword) {
                const error = 'Invalid email or password';
                Toast.show({
                    type: 'error',
                    text1: 'Error',
                    text2: error,
                });
                setSigninLoading(false);
                throw new Error(error);
            }

            // Login with verified account
            await login(storedAccount);
            Toast.show({
                type: 'success',
                text1: 'Berhasil masuk',
                text2: 'Selamat datang kembali!',
            });
            clearSigninForm();
        } catch (err: any) {
            // If error message is not already shown in toast, show it
            const errorMessage = err.message || 'Failed to sign in';
            if (errorMessage !== 'Please fill in all fields' &&
                errorMessage !== 'No account found. Please sign up first.' &&
                errorMessage !== 'Invalid email or password') {
                Toast.show({
                    type: 'error',
                    text1: 'Error',
                    text2: errorMessage,
                });
            }
            throw err;
        } finally {
            setSigninLoading(false);
        }
    };

    const clearSigninForm = () => {
        setSigninEmail('');
        setSigninPassword('');
        setShowSigninPassword(false);
    };

    const value: AuthContextType = {
        user,
        loading,
        login,
        logout,
        isAuthenticated: !!user,
        // Signup form state
        signupEmail,
        setSignupEmail,
        signupName,
        setSignupName,
        signupPassword,
        setSignupPassword,
        signupConfirmPassword,
        setSignupConfirmPassword,
        showPassword,
        setShowPassword,
        showConfirmPassword,
        setShowConfirmPassword,
        signupLoading,
        signup,
        clearSignupForm,
        // Signin form state
        signinEmail,
        setSigninEmail,
        signinPassword,
        setSigninPassword,
        showSigninPassword,
        setShowSigninPassword,
        signinLoading,
        signin,
        clearSigninForm,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

