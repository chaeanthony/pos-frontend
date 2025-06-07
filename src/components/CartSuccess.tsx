import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import { CheckCircle2 } from "lucide-react";

interface CartSuccessProps {
  orderDetails: {
    for_name: string;
    for_email: string;
    order_date: string;
    total: string;
    items: Array<{
      item_id: string;
      item_name: string;
      quantity: number;
      price: number;
      notes: string;
    }>;
  };
}

export default function CartSuccess({ orderDetails }: CartSuccessProps) {
  const navigate = useNavigate();
  const orderDate = new Date(orderDetails.order_date).toLocaleString();

  return (
    <div className="container max-w-2xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold mb-2">Order Placed Successfully!</h1>
        <p className="text-muted-foreground">
          Thank you for your order. We'll start preparing it right away.
        </p>
      </div>

      <div className="bg-card rounded-lg border p-6 space-y-6">
        <div>
          <h2 className="font-semibold mb-2">Order Details</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Order Date:</span>
              <span>{orderDate}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Name:</span>
              <span>{orderDetails.for_name || "Not provided"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Email:</span>
              <span>{orderDetails.for_email}</span>
            </div>
          </div>
        </div>

        <Separator />

        <div>
          <h2 className="font-semibold mb-2">Order Items</h2>
          <div className="space-y-3">
            {orderDetails.items.map((item, index) => (
              <div key={index} className="flex justify-between text-sm">
                <div>
                  <span className="font-medium">{item.item_name}</span>
                  {item.notes && (
                    <p className="text-muted-foreground text-xs italic">
                      Note: {item.notes}
                    </p>
                  )}
                </div>
                <div className="text-right">
                  <div>Qty: {item.quantity}</div>
                  <div className="text-muted-foreground">
                    ${(item.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        <div className="space-y-2">
          <div className="flex justify-between font-semibold">
            <span>Total Amount</span>
            <span>${orderDetails.total}</span>
          </div>
        </div>
      </div>

      <div className="mt-8 flex justify-center gap-4">
        <Button variant="outline" onClick={() => navigate("/menu")}>
          Back to Menu
        </Button>
        <Button variant="outline" onClick={() => navigate("/")}>
          Back to Home
        </Button>
      </div>
    </div>
  );
} 