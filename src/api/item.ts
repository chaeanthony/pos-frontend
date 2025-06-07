import {useQuery} from "@tanstack/react-query";
import {API_BASE_URL} from "@/lib/api";

export interface MenuItem {
	id: string;
	name: string;
	description: string;
	cost: string;
	category: string;
	image: string;
}

export interface UpdateItemData {
	id: string;
	name: string;
	description: string;
	cost: number;
}

export interface CreateItemData {
	name: string;
	description: string;
	cost: number;
}

// Menu Items API
export const useMenuItems = () => {
	return useQuery<MenuItem[]>({
		queryKey: ["menuItems"],
		queryFn: async () => {
			const response = await fetch(`${API_BASE_URL}/items`);

			if (!response.ok) {
				throw new Error("Failed to fetch menu items");
			}

			return response.json();
		},
	});
};

export async function getItems(): Promise<MenuItem[]> {
	try {
		const response = await fetch(`${API_BASE_URL}/items`);
		if (!response.ok) {
			throw new Error("Failed to fetch items");
		}
		return response.json();
	} catch (error) {
		console.error("Error fetching items:", error);
		throw error;
	}
}

export async function updateItem(data: UpdateItemData): Promise<MenuItem> {
	try {
		const response = await fetch(`${API_BASE_URL}/items`, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(data),
			credentials: "include",
		});

		if (!response.ok) {
			const error = await response.json();
			throw new Error(error.message || "Failed to update item");
		}

		return response.json();
	} catch (error) {
		console.error("Error updating item:", error);
		throw error;
	}
}

export async function createItem(data: CreateItemData): Promise<MenuItem> {
	try {
		const response = await fetch(`${API_BASE_URL}/items`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(data),
			credentials: "include",
		});

		if (!response.ok) {
			const error = await response.json();
			throw new Error(error.message || "Failed to create item");
		}

		return response.json();
	} catch (error) {
		console.error("Error creating item:", error);
		throw error;
	}
}

export async function deleteItem(id: string): Promise<void> {
	try {
		const response = await fetch(`${API_BASE_URL}/items/${id}`, {
			method: "DELETE",
			credentials: "include",
		});

		if (!response.ok) {
			const error = await response.json();
			throw new Error(error.message || "Failed to delete item");
		}
	} catch (error) {
		console.error("Error deleting item:", error);
		throw error;
	}
}
