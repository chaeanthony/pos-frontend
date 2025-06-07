import React, {useState, useEffect} from "react";
import {Button} from "./ui/button";
import {Card, CardContent, CardFooter} from "./ui/card";
import {Input} from "./ui/input";
import {Badge} from "./ui/badge";
import {Search, Coffee, Utensils, Cake, Plus, Minus} from "lucide-react";
import {useMenuItems, type MenuItem} from "../api/item";
import {Skeleton} from "./ui/skeleton";
import Navbar from "./Navbar";
import {useCart} from "@/contexts/CartContext";

const Menu = () => {
	const [searchQuery, setSearchQuery] = useState("");
	const {data: items = [], isLoading, error} = useMenuItems();
	const [filteredItems, setFilteredItems] = useState<MenuItem[]>([]);
	const {addItem} = useCart();

	useEffect(() => {
		// Filter items based on category and search query
		let result = items;

		if (searchQuery) {
			const query = searchQuery.toLowerCase();
			result = result.filter(
				(item) =>
					item.name.toLowerCase().includes(query) || item.description.toLowerCase().includes(query)
			);
		}

		setFilteredItems(result);
	}, [searchQuery, items]);

	const handleAddToCart = (item: MenuItem) => {
		addItem(item);
	};

	return (
		<div className="min-h-screen bg-background">
			<Navbar />

			{/* Header */}
			<div className="bg-muted/50 py-8">
				<div className="container">
					<h1 className="text-3xl font-bold mb-2">Our Menu</h1>
					<p className="text-muted-foreground">
						Explore our selection of handcrafted drinks and delicious food
					</p>
				</div>
			</div>

			{/* Search and Filter */}
			<div className="container py-6">
				<div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-8">
					<div className="relative w-full md:w-auto md:min-w-[300px]">
						<Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
						<Input
							placeholder="Search menu..."
							className="pl-9"
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
						/>
					</div>
				</div>

				{/* Error message */}
				{error && (
					<div className="bg-destructive/10 text-destructive p-4 rounded-md mb-6">
						{error instanceof Error ? error.message : "Failed to load menu items"}
					</div>
				)}

				{/* Menu Items */}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
					{isLoading ? (
						// Loading skeletons
						[...Array(6)].map((_, index) => (
							<Card key={index} className="overflow-hidden">
								<Skeleton className="h-48 w-full" />
								<CardContent className="p-4">
									<Skeleton className="h-6 w-3/4 mb-2" />
									<Skeleton className="h-4 w-full mb-2" />
									<Skeleton className="h-4 w-1/2" />
								</CardContent>
							</Card>
						))
					) : filteredItems.length > 0 ? (
						filteredItems.map((item) => (
							<Card key={item.id} className="overflow-hidden h-full flex flex-col">
								{item.image && (
									<div className="h-48 overflow-hidden relative">
										<img
											src={item.image}
											alt={item.name}
											className="w-full h-full object-cover transition-transform hover:scale-105"
										/>
									</div>
								)}
								<CardContent className="p-6 flex-grow">
									<div className="flex justify-between items-start mb-2">
										<h3 className="text-xl font-semibold">{item.name}</h3>
										<span className="text-lg font-bold">${item.cost}</span>
									</div>
									<p className="text-muted-foreground">{item.description}</p>
								</CardContent>
								<CardFooter className="px-6 pb-6 pt-0">
									<Button 
										size="sm" 
										className="w-full" 
										onClick={() => handleAddToCart(item)}
									>
										Add to Cart
									</Button>
								</CardFooter>
							</Card>
						))
					) : (
						<div className="col-span-full text-center py-12">
							<p className="text-muted-foreground">No items found. Try a different search term.</p>
							<Button
								variant="outline"
								className="mt-4"
								onClick={() => {
									setSearchQuery("");
								}}
							>
								Clear filters
							</Button>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default Menu;
