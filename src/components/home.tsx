import React from "react";
import {Separator} from "@/components/ui/separator";
import {Coffee} from "lucide-react";
import Navbar from "./Navbar";

const Home = () => {

	return (
		<div className="min-h-screen bg-background">
			<Navbar />

			{/* About Section */}
			<section className="py-16 bg-muted/50">
				<div className="container">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
						<div>
							<h2 className="text-3xl font-bold mb-4">Our Story</h2>
							<p className="mb-4">
								Café Risa was founded in 2020 with a simple mission: to create a welcoming space
								where quality coffee meets delicious food and friendly service.
							</p>
							<p className="mb-4">
								We source our beans from ethical farms around the world and roast them in small
								batches to ensure the freshest flavor in every cup.
							</p>
							<p>
								Our food menu features locally sourced ingredients whenever possible, supporting our
								community while delivering exceptional taste.
							</p>
						</div>
						<div className="rounded-lg overflow-hidden">
							<img
								src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&q=80"
								alt="Coffee beans"
								className="w-full h-full object-cover"
							/>
						</div>
					</div>
				</div>
			</section>

			{/* Footer */}
			<footer className="bg-background border-t py-12">
				<div className="container">
					<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
						<div>
							<div className="flex items-center gap-2 mb-4">
								<Coffee className="h-5 w-5" />
								<span className="text-lg font-bold">Café Risa</span>
							</div>
							<p className="text-muted-foreground">
								Serving quality coffee and food in a cozy atmosphere since 2020.
							</p>
						</div>

						<div>
							<h3 className="font-semibold mb-4">Hours</h3>
							<p className="text-muted-foreground">Monday - Friday: 7am - 7pm</p>
							<p className="text-muted-foreground">Saturday - Sunday: 8am - 8pm</p>
						</div>

						<div>
							<h3 className="font-semibold mb-4">Contact</h3>
							<p className="text-muted-foreground">123 Coffee Street</p>
							<p className="text-muted-foreground">Beantown, CA 90210</p>
							<p className="text-muted-foreground">info@caferisa.com</p>
						</div>
					</div>

					<Separator className="my-8" />

					<div className="flex flex-col md:flex-row justify-between items-center">
						<p className="text-sm text-muted-foreground">© 2023 Café Risa. All rights reserved.</p>
						<div className="flex space-x-4 mt-4 md:mt-0">
							<a href="#" className="text-muted-foreground hover:text-foreground">
								Privacy Policy
							</a>
							<a href="#" className="text-muted-foreground hover:text-foreground">
								Terms of Service
							</a>
						</div>
					</div>
				</div>
			</footer>
		</div>
	);
};

export default Home;
