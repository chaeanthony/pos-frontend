import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Minus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface OrderItemProps {
  item?: {
    id: string;
    name: string;
    description: string;
    price: number;
    image: string;
    category: string;
  };
  isOpen?: boolean;
  onClose?: () => void;
  onAddToCart?: (item: any) => void;
  isAuthenticated?: boolean;
}

const OrderItem: React.FC<OrderItemProps> = ({
  item = {
    id: "1",
    name: "Cappuccino",
    description: "Rich espresso with steamed milk and a layer of foam",
    price: 4.5,
    image:
      "https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400&q=80",
    category: "coffee",
  },
  isOpen = true,
  onClose = () => {},
  onAddToCart = () => {},
  isAuthenticated = true,
}) => {
  const [quantity, setQuantity] = useState(1);
  const [size, setSize] = useState("medium");
  const [additions, setAdditions] = useState<string[]>([]);
  const [specialInstructions, setSpecialInstructions] = useState("");

  // Define addition prices
  const additionPrices = {
    "Extra Shot": 0.75,
    "Vanilla Syrup": 0.5,
    Caramel: 0.5,
    "Whipped Cream": 0.25,
  };

  const handleQuantityChange = (value: number) => {
    if (quantity + value > 0) {
      setQuantity(quantity + value);
    }
  };

  const handleAdditionToggle = (value: string) => {
    setAdditions((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value],
    );
  };

  const calculateTotalPrice = () => {
    let basePrice = item.price;

    // Adjust price based on size
    if (size === "large") basePrice += 1.0;
    if (size === "small") basePrice -= 0.5;

    // Add price for each addition based on its individual price
    const additionPrice = additions.reduce((total, addition) => {
      return (
        total + (additionPrices[addition as keyof typeof additionPrices] || 0)
      );
    }, 0);

    return (basePrice + additionPrice) * quantity;
  };

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      // Handle unauthenticated user
      alert("Please log in to add items to your cart");
      return;
    }

    const orderItem = {
      itemId: item.id,
      name: item.name,
      price: item.price,
      image: item.image,
      quantity,
      size,
      additions,
      specialInstructions,
      totalPrice: calculateTotalPrice(),
      additionPrices: additions.map((addition) => ({
        name: addition,
        price: additionPrices[addition as keyof typeof additionPrices],
      })),
    };

    onAddToCart(orderItem);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] bg-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">{item.name}</DialogTitle>
          <DialogDescription className="text-gray-500">
            {item.description}
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
          <div>
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-48 object-cover rounded-md"
            />
            <p className="mt-2 text-lg font-semibold">
              ${item.price.toFixed(2)}
            </p>
          </div>

          <div className="space-y-6">
            {/* Size Selection */}
            <div className="space-y-2">
              <h3 className="font-medium">Size</h3>
              <RadioGroup
                value={size}
                onValueChange={setSize}
                className="flex flex-col space-y-1"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="small" id="small" />
                  <Label htmlFor="small">Small (-$0.50)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="medium" id="medium" />
                  <Label htmlFor="medium">Medium</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="large" id="large" />
                  <Label htmlFor="large">Large (+$1.00)</Label>
                </div>
              </RadioGroup>
            </div>

            {/* Additions */}
            <div className="space-y-2">
              <h3 className="font-medium">Additions</h3>
              <div className="grid grid-cols-2 gap-2">
                {[
                  "Extra Shot",
                  "Vanilla Syrup",
                  "Caramel",
                  "Whipped Cream",
                ].map((addition) => (
                  <div key={addition} className="flex items-center space-x-2">
                    <Checkbox
                      id={addition.toLowerCase().replace(" ", "-")}
                      checked={additions.includes(addition)}
                      onCheckedChange={() => handleAdditionToggle(addition)}
                    />
                    <Label htmlFor={addition.toLowerCase().replace(" ", "-")}>
                      {addition} (+$
                      {additionPrices[
                        addition as keyof typeof additionPrices
                      ].toFixed(2)}
                      )
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Special Instructions */}
            <div className="space-y-2">
              <Label htmlFor="instructions">Special Instructions</Label>
              <Textarea
                id="instructions"
                placeholder="Any special requests?"
                value={specialInstructions}
                onChange={(e) => setSpecialInstructions(e.target.value)}
                className="resize-none"
              />
            </div>

            {/* Quantity Selector */}
            <div className="space-y-2">
              <h3 className="font-medium">Quantity</h3>
              <div className="flex items-center space-x-3">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleQuantityChange(-1)}
                  disabled={quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-8 text-center">{quantity}</span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleQuantityChange(1)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Total Price */}
        <Card className="mt-4">
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <span className="font-medium">Total:</span>
              <span className="text-lg font-bold">
                ${calculateTotalPrice().toFixed(2)}
              </span>
            </div>
          </CardContent>
        </Card>

        <DialogFooter className="mt-6">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleAddToCart}>
            {isAuthenticated ? "Add to Cart" : "Login to Order"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default OrderItem;
