import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    updateProfile,
    User as FirebaseUser
} from 'firebase/auth';
import { auth } from '../firebase';
import { User } from '../types';

const mapFirebaseUser = (firebaseUser: FirebaseUser): User => {
    const name = firebaseUser.displayName || firebaseUser.email || 'Anonymous';
    const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
    return {
        id: firebaseUser.uid,
        name,
        email: firebaseUser.email || '',
        initials,
    };
};

const getFirebaseErrorMessage = (error: any): string => {
    if (error.code) {
        switch (error.code) {
            case 'auth/invalid-email':
                return 'Please enter a valid email address.';
            case 'auth/user-disabled':
                return 'This user account has been disabled.';
            case 'auth/user-not-found':
            case 'auth/wrong-password':
            case 'auth/invalid-credential':
                return 'Invalid email or password.';
            case 'auth/email-already-in-use':
                return 'An account with this email already exists.';
            case 'auth/weak-password':
                return 'The password is too weak. Please use at least 6 characters.';
            default:
                return 'An unexpected authentication error occurred.';
        }
    }
    return error.message || 'An unknown error occurred.';
}

export const login = async (email: string, pass: string): Promise<User> => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, pass);
        return mapFirebaseUser(userCredential.user);
    } catch (error) {
        throw new Error(getFirebaseErrorMessage(error));
    }
};

export const signup = async (name: string, email: string, pass: string): Promise<User> => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
        await updateProfile(userCredential.user, { displayName: name });
        
        const user = userCredential.user;
        const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
        const appUser: User = {
            id: user.uid,
            name,
            email: user.email || '',
            initials
        };
        return appUser;

    } catch (error) {
        throw new Error(getFirebaseErrorMessage(error));
    }
};

export const logout = (): Promise<void> => {
    return signOut(auth);
};