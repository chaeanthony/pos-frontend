import React from "react";
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert";
import {AlertCircle} from "lucide-react";

const Maintenance = () => {
	return (
		<div className="min-h-screen flex items-center justify-center bg-background p-4">
			<Alert className="max-w-md">
				<AlertCircle className="h-4 w-4" />
				<AlertTitle>Site Maintenance</AlertTitle>
				<AlertDescription>
					We are currently performing maintenance on our systems. Please check back later.
					<div className="mt-4 text-sm text-muted-foreground">
						We apologize for any inconvenience this may cause.
					</div>
				</AlertDescription>
			</Alert>
		</div>
	);
};

export default Maintenance;
