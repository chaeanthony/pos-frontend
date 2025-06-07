import React, {createContext, useContext, useState} from "react";
import {MenuItem} from "@/types/menu";

export interface CartItem {
	id: string;
	name: string;
	cost: string;
	quantity: number;
	specialInstructions?: string;
}

interface CartContextType {
	items: CartItem[];
	addItem: (item: MenuItem) => void;
	removeItem: (itemId: string) => void;
	updateQuantity: (itemId: string, quantity: number) => void;
	clearCart: () => void;
	totalItems: number;
	totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{children: React.ReactNode}> = ({children}) => {
	const [items, setItems] = useState<CartItem[]>([]);

	const addItem = (item: MenuItem) => {
		setItems((currentItems) => {
			const existingItem = currentItems.find((i) => i.id === item.id);
			if (existingItem) {
				return currentItems.map((i) => (i.id === item.id ? {...i, quantity: i.quantity + 1} : i));
			}
			return [...currentItems, {...item, quantity: 1}];
		});
	};

	const removeItem = (itemId: string) => {
		setItems((currentItems) => currentItems.filter((item) => item.id !== itemId));
	};

	const updateQuantity = (itemId: string, quantity: number) => {
		if (quantity < 1) {
			removeItem(itemId);
			return;
		}
		setItems((currentItems) =>
			currentItems.map((item) => (item.id === itemId ? {...item, quantity} : item))
		);
	};

	const clearCart = () => {
		setItems([]);
	};

	const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
	const totalPrice = items.reduce((sum, item) => sum + parseFloat(item.cost) * item.quantity, 0);

	return (
		<CartContext.Provider
			value={{
				items,
				addItem,
				removeItem,
				updateQuantity,
				clearCart,
				totalItems,
				totalPrice,
			}}
		>
			{children}
		</CartContext.Provider>
	);
};

export const useCart = () => {
	const context = useContext(CartContext);
	if (context === undefined) {
		throw new Error("useCart must be used within a CartProvider");
	}
	return context;
};
