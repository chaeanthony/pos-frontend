import React, {useState, useEffect} from "react";
import {useNavigate} from "react-router-dom";
import {Button} from "./ui/button";
import {Input} from "./ui/input";
import {Label} from "./ui/label";
import {useCart} from "@/contexts/CartContext";
import {useCreateOrder} from "@/api/orders";
import {toast} from "./ui/use-toast";
import {Separator} from "./ui/separator";
import {Plus, Minus, Trash2} from "lucide-react";
import CartSuccess from "./CartSuccess";

export default function CartPage() {
	const navigate = useNavigate();
	const {items, removeItem, updateQuantity, totalPrice, clearCart} = useCart();
	const [email, setEmail] = useState("");
	const [name, setName] = useState("");
	const [isProcessing, setIsProcessing] = useState(false);
	const [orderSuccess, setOrderSuccess] = useState<any>(null);
	const createOrderMutation = useCreateOrder();

	useEffect(() => {
		return () => {
			setOrderSuccess(null);
		};
	}, []);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!email) {
			toast({
				title: "Email required",
				description: "Please enter your email address to continue.",
				variant: "destructive",
			});
			return;
		}

		setIsProcessing(true);
		const orderData = {
			for_name: name || "",
			for_email: email,
			order_date: new Date().toLocaleString('en-US', {
				year: 'numeric',
				month: '2-digit',
				day: '2-digit',
				hour: '2-digit',
				minute: '2-digit',
				second: '2-digit',
				hour12: false
			}).replace(/(\d+)\/(\d+)\/(\d+),\s(\d+):(\d+):(\d+)/, '$3-$1-$2 $4:$5:$6'),
			status: "pending",
			total: totalPrice.toFixed(2),
			notes: "",
			items: items.map((item) => ({
				item_id: item.id,
				item_name: item.name,
				quantity: item.quantity,
				price: item.cost,
				notes: item.specialInstructions || "",
			})),
		};

		createOrderMutation.mutate(orderData, {
			onSuccess: (response) => {
				setOrderSuccess(orderData);
				clearCart();
				toast({
					title: "Order placed successfully!",
					description: "Your order has been submitted and is being prepared.",
				});
			},
			onError: (error) => {
				toast({
					title: "Error placing order",
					description:
						error.message || "There was a problem submitting your order. Please try again.",
					variant: "destructive",
				});
			},
			onSettled: () => {
				setIsProcessing(false);
			},
		});
	};

	if (orderSuccess) {
		return <CartSuccess orderDetails={orderSuccess} />;
	}

	if (items.length === 0) {
		return (
			<div className="container max-w-2xl mx-auto px-4 py-8">
				<div className="text-center py-12">
					<h1 className="text-2xl font-bold mb-4">Your Cart is Empty</h1>
					<p className="text-muted-foreground mb-6">Add some items to your cart to continue.</p>
					<Button onClick={() => navigate("/menu")}>Browse Menu</Button>
				</div>
			</div>
		);
	}

	return (
		<div className="container max-w-2xl mx-auto px-4 py-8">
			<h1 className="text-2xl font-bold mb-6">Checkout</h1>

			<div className="grid gap-8 md:grid-cols-[1fr,300px]">
				{/* Cart Items */}
				<div className="space-y-4">
					{items.map((item) => (
						<div key={item.id} className="flex items-center gap-4 p-4 bg-card rounded-lg border">
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

				{/* Order Form */}
				<div className="space-y-6">
					<form onSubmit={handleSubmit} className="space-y-4">
						<div>
							<Label htmlFor="email">Email *</Label>
							<Input
								id="email"
								type="email"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								placeholder="Enter your email"
								required
							/>
						</div>
						<div>
							<Label htmlFor="name">Name (Optional)</Label>
							<Input
								id="name"
								value={name}
								onChange={(e) => setName(e.target.value)}
								placeholder="Enter your name"
							/>
						</div>

						<Separator className="my-4" />

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

						<Button
							type="submit"
							className="w-full"
							disabled={isProcessing || !email}
						>
							{isProcessing ? "Processing..." : "Place Order"}
						</Button>
					</form>
				</div>
			</div>
		</div>
	);
} 