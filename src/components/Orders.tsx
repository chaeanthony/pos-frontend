import {useEffect, useState, useRef} from "react";
import {getOrders, Order, updateOrder} from "../api/orders";
import {format} from "date-fns";
import {WEBSOCKET_BASE_URL} from "@/lib/api";

export default function Orders() {
	const [orders, setOrders] = useState<Order[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const wsRef = useRef<WebSocket | null>(null);

	const fetchOrders = async () => {
		try {
			console.log("Fetching orders");
			const data = await getOrders();
			console.log("Received orders:", data);
			setOrders(data);
		} catch (err) {
			console.error("Error fetching orders:", err);
			setError(err instanceof Error ? err.message : "Failed to fetch orders");
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		// Initial fetch
		fetchOrders();

		// WebSocket setup
		const ws = new WebSocket(WEBSOCKET_BASE_URL);
		wsRef.current = ws;

		ws.onopen = () => {
			console.log("Orders WebSocket connected");
		};

		ws.onmessage = (event) => {
			try {
				const data = JSON.parse(event.data);
				if (data.type === "refresh_orders") {
					fetchOrders();
				}
			} catch (error) {
				console.error("Error parsing WebSocket message:", error);
			}
		};

		ws.onerror = (error) => {
			console.error("Orders WebSocket error:", error);
		};

		ws.onclose = () => {
			console.log("Orders WebSocket disconnected");
		};

		// Cleanup
		return () => {
			ws.close();
		};
	}, []); // Empty dependency array since we're using refs and stable functions

	if (isLoading) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<div className="text-red-500">Error: {error}</div>
			</div>
		);
	}

	return (
		<div className="container mx-auto px-4 py-8">
			<h1 className="text-2xl font-bold mb-6">Orders</h1>
			{orders.length === 0 ? (
				<div className="text-center text-gray-500">No orders found</div>
			) : (
				<div className="grid gap-4">
					{orders.map((order) => (
						<div
							key={order.id}
							className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow"
						>
							<div className="flex justify-between items-start mb-4">
								<div>
									<h2 className="text-xl font-semibold">{order.for_name}</h2>
									<p className="text-gray-600">{order.email}</p>
									<p className="text-sm text-gray-500">Order ID: {order.id}</p>
								</div>
								<div className="text-right">
									<p className="text-lg font-medium">${order.total}</p>
									<p className="text-sm text-gray-500">
										{format(new Date(order.order_date), "MMM d, yyyy h:mm a")}
									</p>
								</div>
							</div>

							{/* Order Items */}
							<div className="mt-4 space-y-2">
								{order.items.map((item, index) => (
									<div key={index} className="flex justify-between items-start text-sm">
										<div className="flex-1">
											<p className="font-medium">{item.item_name}</p>
											{item.item_description && (
												<p className="text-gray-600 text-xs mt-0.5">
													{item.item_description}
												</p>
											)}
											{item.notes && (
												<p className="text-gray-500 text-xs italic mt-0.5">
													Note: {item.notes}
												</p>
											)}
										</div>
										<div className="text-right ml-4">
											<p className="font-medium">${item.price}</p>
											<p className="text-gray-500">× {item.quantity}</p>
										</div>
									</div>
								))}
							</div>

							<div className="mt-4 pt-3 border-t border-gray-100 flex justify-between items-center">
								<span
									className={`px-3 py-1 rounded-full text-sm ${
										order.status === "completed"
											? "bg-green-100 text-green-800"
											: order.status === "cancelled"
											? "bg-red-100 text-red-800"
											: "bg-yellow-100 text-yellow-800"
									}`}
								>
									{order.status.charAt(0).toUpperCase() + order.status.slice(1)}
								</span>
								{order.status !== "completed" && (
									<button
										onClick={() => updateOrder({ id: order.id, status: "completed" })}
										className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm"
									>
										Complete Order
									</button>
								)}
							</div>
						</div>
					))}
				</div>
			)}
		</div>
	);
}
