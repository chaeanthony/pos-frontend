import React, {Suspense} from "react";
import {Routes, Route, Navigate} from "react-router-dom";
import {Toaster} from "@/components/ui/toaster";
import {AuthProvider} from "@/contexts/AuthContext";
import {CartProvider} from "@/contexts/CartContext";
import {ProtectedRoute} from "@/components/ProtectedRoute";

// Lazy load components
const Home = React.lazy(() => import("@/components/home"));
const Login = React.lazy(() => import("@/components/Login"));
const Cart = React.lazy(() => import("@/components/Cart"));
const CartPage = React.lazy(() => import("@/components/CartPage"));
const Orders = React.lazy(() => import("@/components/Orders"));
const Menu = React.lazy(() => import("@/components/Menu"));
const EditMenu = React.lazy(() => import("@/components/EditMenu"));

function AppRoutes() {
	return (
		<Routes>
			<Route path="/" element={<Home />} />
			<Route path="/store/orders" element={<Orders />} />
			<Route path="/menu" element={<Menu />} />
			<Route path="/store/menu" element={
				<ProtectedRoute>
					<EditMenu />
				</ProtectedRoute>
			} />
			<Route path="/cart" element={<CartPage />} />
			<Route path="/login" element={<Login />} />
			<Route path="*" element={<Navigate to="/" replace />} />
		</Routes>
	);
}

function App() {
	return (
		<AuthProvider>
			<CartProvider>
				<Suspense fallback={<div>Loading...</div>}>
					<AppRoutes />
				</Suspense>
				<Toaster />
			</CartProvider>
		</AuthProvider>
	);
}

export default App;
