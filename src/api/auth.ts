import {API_BASE_URL} from "@/lib/api";

interface LoginResponse {
	token: string;
	refresh_token: string;
	id: string;
	email: string;
	first_name: string;
	last_name: string;
	role: string;
}

export async function login(email: string, password: string): Promise<LoginResponse> {
	try {
		const response = await fetch(`${API_BASE_URL}/login`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({email, password}),
			credentials: "include",
		});

		if (!response.ok) {
			const error = await response.json();
			throw new Error(error.message || "Failed to login");
		}

		const data = await response.json();
		return data;
	} catch (error) {
		console.error("Login error:", error);
		throw error;
	}
}

export async function logout(): Promise<void> {
	try {
		const response = await fetch(`${API_BASE_URL}/revoke`, {
			method: "POST",
			credentials: "include",
		});

		if (!response.ok) {
			throw new Error("Failed to logout");
		}
	} catch (error) {
		console.error("Logout error:", error);
		throw error;
	}
}

export async function refreshToken(): Promise<LoginResponse> {
	try {
		const response = await fetch(`${API_BASE_URL}/refresh`, {
			method: "POST",
			credentials: "include",
		});

		if (!response.ok) {
			throw new Error("Failed to refresh token");
		}

		const data = await response.json();
		return data;
	} catch (error) {
		console.error("Token refresh error:", error);
		throw error;
	}
}
