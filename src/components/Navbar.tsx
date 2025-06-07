import {Link, useLocation, useNavigate} from "react-router-dom";
import {Coffee, Utensils, Cake, Home, ShoppingCart, Plus, Minus, Trash2} from "lucide-react";
import {useCart} from "@/contexts/CartContext";

import {Button} from "./ui/button";
import {Sheet, SheetContent} from "./ui/sheet";
import {useState} from "react";
import Cart from "./Cart";

const Navbar = () => {
	const location = useLocation();
	const {totalItems} = useCart();
	const [isCartOpen, setIsCartOpen] = useState(false);

	const isActive = (path: string) => {
		return location.pathname === path;
	};

	return (
		<>
			<header className="sticky top-0 z-10 w-full border-b bg-background/95 backdrop-blur">
				<div className="container flex h-16 items-center justify-between">
					<div className="flex items-center gap-6">
						<Link to="/" className="flex items-center gap-2">
							<Coffee className="h-6 w-6" />
							<span className="text-xl font-bold">Café Risa</span>
						</Link>

						<nav className="hidden md:flex items-center gap-4">
							<Link
								to="/"
								className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors ${
									isActive("/") ? "bg-primary text-primary-foreground" : "hover:bg-muted"
								}`}
							>
								<Home className="h-4 w-4" />
								<span>Home</span>
							</Link>
							<Link
								to="/menu"
								className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors ${
									isActive("/menu") ? "bg-primary text-primary-foreground" : "hover:bg-muted"
								}`}
							>
								<Utensils className="h-4 w-4" />
								<span>Menu</span>
							</Link>
						</nav>
					</div>

					<div className="flex items-center gap-4">
						<Button
							variant="ghost"
							size="icon"
							onClick={() => setIsCartOpen(true)}
							className="relative"
						>
							<ShoppingCart className="h-5 w-5" />
							{totalItems > 0 && (
								<span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
									{totalItems}
								</span>
							)}
						</Button>
					</div>
				</div>
			</header>

			{/* Cart Sheet */}
			<Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
				<SheetContent>
					<Cart onClose={() => setIsCartOpen(false)} />
				</SheetContent>
			</Sheet>
		</>
	);
};

export default Navbar;
