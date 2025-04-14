import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { API_URL } from "@/lib/constants";
import { useEffect, useState } from "react";

interface Props {
	report: "xreport" | "zreport";
}

function XZReport({ report }: Props) {
	const [orders, setOrders] = useState<any[]>([]);

	useEffect(() => {
		async function getReport() {
			const res = await fetch(`${API_URL}/order/${report}`);
			const json = await res.json();
			setOrders((orders) => (json.length === 0 ? orders : json));
		}

		getReport();
	}, []);

	function countOccurrences(arr: string[]): Record<string, number> {
		const counts: Record<string, number> = {};

		for (const item of arr) {
			counts[item] = (counts[item] || 0) + 1;
		}

		return counts;
	}

	return (
		<div className="flex flex-col p-4 gap-4">
			<div className="font-bold text-2xl">
				Total Revenue: $
				{(orders ?? [])
					.reduce((acc, order) => acc + order.price, 0)
					.toFixed(2)}
			</div>
			{(orders ?? []).map((order, index) => (
				<Card key={index}>
					<CardHeader>
						<CardTitle>{order.customer_name}</CardTitle>
					</CardHeader>
					<CardContent>
						{Object.entries(countOccurrences(order.drinks)).map(
							([item, count], index) => (
								<div key={index}>
									{item} (x{count})
								</div>
							)
						)}
					</CardContent>
					<CardFooter>${order.price.toFixed(2)}</CardFooter>
				</Card>
			))}
		</div>
	);
}

export default XZReport;
