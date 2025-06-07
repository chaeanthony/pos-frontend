import {useNavigate} from "react-router-dom";
import {Button} from "./ui/button";
import {useCart} from "@/contexts/CartContext";
import {Plus, Minus, Trash2} from "lucide-react";
import {Separator} from "./ui/separator";

interface CartProps {
	onClose: () => void;
}

export default function Cart({onClose}: CartProps) {
	const navigate = useNavigate();
	const {items, removeItem, updateQuantity, totalItems, totalPrice} = useCart();

	const handleProceed = () => {
		onClose();
		navigate("/cart");
	};

	if (items.length === 0) {
		return (
			<div className="flex flex-col items-center justify-center h-full py-8">
				<h2 className="text-xl font-semibold mb-2">Your Cart is Empty</h2>
				<p className="text-muted-foreground mb-4">Add some items to your cart to continue.</p>
				<Button onClick={onClose}>Browse Menu</Button>
			</div>
		);
	}

	return (
		<div className="flex flex-col h-full">
			<div className="flex-1 overflow-y-auto">
				<div className="space-y-4">
					{items.map((item) => (
						<div key={item.id} className="flex items-center gap-4">
							<div className="flex-1">
								<h3 className="font-medium">{item.name}</h3>
								<p className="text-sm text-muted-foreground">${item.cost} each</p>
								{item.specialInstructions && (
									<p className="text-sm text-muted-foreground mt-1 italic">
										Note: {item.specialInstructions}
									</p>
								)}
							</div>
							<div className="flex items-center gap-2">
								<Button
									variant="outline"
									size="icon"
									className="h-8 w-8"
									onClick={() => updateQuantity(item.id, item.quantity - 1)}
								>
									<Minus className="h-4 w-4" />
								</Button>
								<span className="w-8 text-center">{item.quantity}</span>
								<Button
									variant="outline"
									size="icon"
									className="h-8 w-8"
									onClick={() => updateQuantity(item.id, item.quantity + 1)}
								>
									<Plus className="h-4 w-4" />
								</Button>
								<Button
									variant="ghost"
									size="icon"
									className="h-8 w-8 text-destructive"
									onClick={() => removeItem(item.id)}
								>
									<Trash2 className="h-4 w-4" />
								</Button>
							</div>
						</div>
					))}
				</div>
			</div>

			<div className="mt-4 pt-4 border-t">
				<div className="space-y-2">
					<div className="flex justify-between text-sm">
						<span className="text-muted-foreground">Subtotal</span>
						<span>${totalPrice.toFixed(2)}</span>
					</div>
					<div className="flex justify-between text-sm">
						<span className="text-muted-foreground">Tax (8%)</span>
						<span>${(totalPrice * 0.08).toFixed(2)}</span>
					</div>
					<Separator className="my-2" />
					<div className="flex justify-between font-bold">
						<span>Total</span>
						<span>${(totalPrice * 1.08).toFixed(2)}</span>
					</div>
				</div>

				<div className="flex flex-col gap-2 mt-4">
					<Button onClick={handleProceed} className="w-full">
						Proceed to Checkout
					</Button>
					<Button variant="outline" onClick={onClose} className="w-full">
						Continue Shopping
					</Button>
				</div>
			</div>
		</div>
	);
}
