import {API_BASE_URL} from "@/lib/api";

export async function getSession() {
	try {
		const response = await fetch(`${API_BASE_URL}/session`, {
			credentials: "include",
		});

		if (!response.ok) {
			throw new Error("Failed to get session");
		}

		return response.json();
	} catch (error) {
		console.error("Error getting session:", error);
		throw error;
	}
}
