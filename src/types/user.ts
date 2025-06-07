export interface User {
	ID: string;
	Email: string;
	FirstName: string;
	LastName: string;
	Role?: "store" | "admin" | "customer";
}
