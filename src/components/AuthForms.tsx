import React, {useState} from "react";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {z} from "zod";
import {useNavigate} from "react-router-dom";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {Label} from "@/components/ui/label";
import {Alert, AlertDescription} from "@/components/ui/alert";
import {AlertCircle, Loader2} from "lucide-react";
import {useAuth} from "@/contexts/AuthContext";
import {signup, SignupData} from "@/api/auth";

// Form validation schemas
const loginSchema = z.object({
	email: z.string().email({message: "Please enter a valid email address"}),
	password: z.string().min(5, {message: "Password must be at least 5 characters"}),
});

const signupSchema = z
	.object({
		firstName: z.string().min(2, {message: "First name must be at least 2 characters"}),
		lastName: z.string().min(2, {message: "Last name must be at least 2 characters"}),
		email: z.string().email({message: "Please enter a valid email address"}),
		password: z.string().min(5, {message: "Password must be at least 5 characters"}),
		confirmPassword: z.string().min(5, {message: "Password must be at least 5 characters"}),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords don't match",
		path: ["confirmPassword"],
	});

type LoginFormValues = z.infer<typeof loginSchema>;
type SignupFormValues = z.infer<typeof signupSchema>;

interface AuthFormsProps {
	onClose?: () => void;
}

const AuthForms = ({onClose}: AuthFormsProps) => {
	const [activeTab, setActiveTab] = useState<"login" | "signup">("login");
	const [error, setError] = useState<string | null>(null);
	const navigate = useNavigate();
	const {login} = useAuth();

	const loginForm = useForm<LoginFormValues>({
		resolver: zodResolver(loginSchema),
		defaultValues: {
			email: "",
			password: "",
		},
	});

	const signupForm = useForm<SignupFormValues>({
		resolver: zodResolver(signupSchema),
		defaultValues: {
			firstName: "",
			lastName: "",
			email: "",
			password: "",
			confirmPassword: "",
		},
	});

	const handleLogin = async (data: LoginFormValues) => {
		setError(null);
		try {
			await login(data.email, data.password);
			if (onClose) onClose();
		} catch (err) {
			if (err instanceof Error) {
				setError(err.message);
			} else if (typeof err === "object" && err !== null && "message" in err) {
				setError(String(err.message));
			} else {
				setError("Failed to login. Please check your credentials and try again.");
			}
		}
	};

	const handleSignup = async (data: SignupFormValues) => {
		setError(null);
		try {
			const signupData: SignupData = {
				firstName: data.firstName,
				lastName: data.lastName,
				email: data.email,
				password: data.password,
			};
			await signup(signupData);
			navigate("/");
			if (onClose) onClose();
		} catch (err) {
			setError(err instanceof Error ? err.message : "An error occurred during signup");
		}
	};

	return (
		<div className="w-full max-w-md mx-auto bg-background">
			<Card>
				<CardHeader>
					<CardTitle className="text-2xl text-center">Welcome</CardTitle>
					<CardDescription className="text-center">
						{activeTab === "login" ? "Sign in to your account" : "Create a new account"}
					</CardDescription>
				</CardHeader>
				<CardContent>
					<Tabs
						value={activeTab}
						onValueChange={(value) => setActiveTab(value as "login" | "signup")}
					>
						<TabsList className="grid w-full grid-cols-2">
							<TabsTrigger value="login">Login</TabsTrigger>
							<TabsTrigger value="signup">Sign Up</TabsTrigger>
						</TabsList>

						{error && (
							<Alert variant="destructive" className="mt-4">
								<AlertCircle className="h-4 w-4" />
								<AlertDescription>{error}</AlertDescription>
							</Alert>
						)}

						<TabsContent value="login" className="mt-4">
							<form onSubmit={loginForm.handleSubmit(handleLogin)} className="space-y-4">
								<div className="space-y-2">
									<Label htmlFor="login-email">Email</Label>
									<Input
										id="login-email"
										type="email"
										placeholder="you@example.com"
										{...loginForm.register("email")}
									/>
									{loginForm.formState.errors.email && (
										<p className="text-sm text-destructive">
											{loginForm.formState.errors.email.message}
										</p>
									)}
								</div>

								<div className="space-y-2">
									<div className="flex items-center justify-between">
										<Label htmlFor="login-password">Password</Label>
										<Button variant="link" className="p-0 h-auto text-xs" type="button">
											Forgot password?
										</Button>
									</div>
									<Input id="login-password" type="password" {...loginForm.register("password")} />
									{loginForm.formState.errors.password && (
										<p className="text-sm text-destructive">
											{loginForm.formState.errors.password.message}
										</p>
									)}
								</div>

								<Button
									type="submit"
									className="w-full"
									disabled={loginForm.formState.isSubmitting}
								>
									{loginForm.formState.isSubmitting ? (
										<>
											<Loader2 className="mr-2 h-4 w-4 animate-spin" />
											Signing in...
										</>
									) : (
										"Sign In"
									)}
								</Button>
							</form>
						</TabsContent>

						<TabsContent value="signup" className="mt-4">
							<form onSubmit={signupForm.handleSubmit(handleSignup)} className="space-y-4">
								<div className="space-y-2">
									<Label htmlFor="signup-first-name">First Name</Label>
									<Input
										id="signup-first-name"
										type="text"
										placeholder="John"
										{...signupForm.register("firstName")}
									/>
									{signupForm.formState.errors.firstName && (
										<p className="text-sm text-destructive">
											{signupForm.formState.errors.firstName.message}
										</p>
									)}
								</div>

								<div className="space-y-2">
									<Label htmlFor="signup-last-name">Last Name</Label>
									<Input
										id="signup-last-name"
										type="text"
										placeholder="Doe"
										{...signupForm.register("lastName")}
									/>
									{signupForm.formState.errors.lastName && (
										<p className="text-sm text-destructive">
											{signupForm.formState.errors.lastName.message}
										</p>
									)}
								</div>

								<div className="space-y-2">
									<Label htmlFor="signup-email">Email</Label>
									<Input
										id="signup-email"
										type="email"
										placeholder="you@example.com"
										{...signupForm.register("email")}
									/>
									{signupForm.formState.errors.email && (
										<p className="text-sm text-destructive">
											{signupForm.formState.errors.email.message}
										</p>
									)}
								</div>

								<div className="space-y-2">
									<Label htmlFor="signup-password">Password</Label>
									<Input
										id="signup-password"
										type="password"
										{...signupForm.register("password")}
									/>
									{signupForm.formState.errors.password && (
										<p className="text-sm text-destructive">
											{signupForm.formState.errors.password.message}
										</p>
									)}
								</div>

								<div className="space-y-2">
									<Label htmlFor="signup-confirm-password">Confirm Password</Label>
									<Input
										id="signup-confirm-password"
										type="password"
										{...signupForm.register("confirmPassword")}
									/>
									{signupForm.formState.errors.confirmPassword && (
										<p className="text-sm text-destructive">
											{signupForm.formState.errors.confirmPassword.message}
										</p>
									)}
								</div>

								<Button
									type="submit"
									className="w-full"
									disabled={signupForm.formState.isSubmitting}
								>
									{signupForm.formState.isSubmitting ? (
										<>
											<Loader2 className="mr-2 h-4 w-4 animate-spin" />
											Creating account...
										</>
									) : (
										"Create Account"
									)}
								</Button>
							</form>
						</TabsContent>
					</Tabs>
				</CardContent>
				<CardFooter className="flex justify-center">
					<p className="text-sm text-muted-foreground">
						{activeTab === "login" ? (
							<>
								Don't have an account?{" "}
								<Button
									variant="link"
									className="p-0 h-auto"
									onClick={() => setActiveTab("signup")}
								>
									Sign up
								</Button>
							</>
						) : (
							<>
								Already have an account?{" "}
								<Button variant="link" className="p-0 h-auto" onClick={() => setActiveTab("login")}>
									Sign in
								</Button>
							</>
						)}
					</p>
				</CardFooter>
			</Card>
		</div>
	);
};

export default AuthForms;
