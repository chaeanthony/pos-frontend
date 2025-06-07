import { createContext, useContext, useState, ReactNode } from 'react';
import { login as apiLogin, logout as apiLogout } from '../api/auth';

interface AuthContextType {
	isAuthenticated: boolean;
	login: (email: string, password: string) => Promise<void>;
	logout: () => Promise<void>;
	setAuthenticated: (value: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
	const [isAuthenticated, setIsAuthenticated] = useState(false);

	const login = async (email: string, password: string) => {
		try {
			await apiLogin(email, password);
			setIsAuthenticated(true);
		} catch (error) {
			console.error('Login error:', error);
			throw error;
		}
	};

	const logout = async () => {
		try {
			await apiLogout();
			setIsAuthenticated(false);
		} catch (error) {
			console.error('Logout error:', error);
			throw error;
		}
	};

	return (
		<AuthContext.Provider value={{ isAuthenticated, login, logout, setAuthenticated: setIsAuthenticated }}>
			{children}
		</AuthContext.Provider>
	);
}

export function useAuth() {
	const context = useContext(AuthContext);
	if (context === undefined) {
		throw new Error('useAuth must be used within an AuthProvider');
	}
	return context;
}
