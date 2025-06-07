import axios from "axios";
import {API_BASE_URL} from "@/lib/api";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";

export interface OrderItem {
	id: number;
	order_id: number;
	item_name: string;
	item_description: string;
	quantity: number;
	price: string;
	notes: string;
}

export interface Order {
	id: number;
	created_at: string;
	updated_at: string;
	for_name: string;
	email: string; 
	order_date: string;
	status: string;
	total: string;
	items: OrderItem[];
}

export const getOrders = async (): Promise<Order[]> => {
	const response = await axios.get(`${API_BASE_URL}/orders`, {
		withCredentials: true,
	});
	return response.data;
};

export interface CreateOrderItem {
	item_id: string;
	quantity: number;
	price: string;
	notes: string;
}

export interface CreateOrder {
	for_name: string;
	for_email: string;
	order_date: string;
	status: string;
	total: string;
	notes?: string;
	items: CreateOrderItem[];
}

export const useCreateOrder = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (orderData: CreateOrder) => {
			const response = await fetch(`${API_BASE_URL}/orders`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(orderData),
			});

			if (!response.ok) {
				const error = await response.json();
				throw new Error(error.message || "Failed to create order");
			}

			return response.json();
		},
		onSuccess: () => {
			// Invalidate and refetch orders after creating a new one
			queryClient.invalidateQueries({queryKey: ["orders"]});
		},
	});
};

export const updateOrder = async ({ id, status }: { id: number; status: string }) => {
	const response = await fetch(`${API_BASE_URL}/orders`, {
		method: "PUT",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ id, status }),
	});

	if (!response.ok) {
		const error = await response.json();
		throw new Error(error.message || "Failed to update order");
	}

	return response.json();
};
