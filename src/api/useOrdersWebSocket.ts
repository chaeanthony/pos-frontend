import {useRef, useEffect, useState} from "react";
import {WEBSOCKET_BASE_URL} from "@/lib/api";

interface WebSocketMessage {
	type: string;
	message?: string;
}

export function useOrdersWebSocket(onMessage: (data: WebSocketMessage) => void) {
	const wsRef = useRef<WebSocket | null>(null);
	const [isConnected, setIsConnected] = useState(false);
	const onMessageRef = useRef(onMessage);

	// Update the ref when onMessage changes
	useEffect(() => {
		onMessageRef.current = onMessage;
	}, [onMessage]);

	useEffect(() => {
		const wsUrl = WEBSOCKET_BASE_URL;
		const ws = new WebSocket(wsUrl);
		wsRef.current = ws;

		ws.onopen = () => {
			console.log("Orders WebSocket connected");
			setIsConnected(true);
		};

		ws.onmessage = (event) => {
			try {
				const data = JSON.parse(event.data);
				onMessageRef.current(data);
			} catch (error) {
				console.error("Error parsing WebSocket message:", error);
			}
		};

		ws.onerror = (error) => {
			console.error("Orders WebSocket error:", error);
		};

		ws.onclose = () => {
			console.log("Orders WebSocket disconnected");
			setIsConnected(false);
			wsRef.current = null;
		};

		// Cleanup function
		return () => {
			ws.close();
		};
	}, []); // Empty dependency array is fine now since we use the ref

	return {
		isConnected,
		cleanup: () => {
			wsRef.current?.close();
			wsRef.current = null;
		},
	};
}
