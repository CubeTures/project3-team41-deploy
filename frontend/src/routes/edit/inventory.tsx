import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import DataTable from "@/components/DataTable/DataTable";
import { Definition } from "@/components/DataTable/DataTableTypes";
import { z } from "zod";

export const Route = createFileRoute("/edit/inventory")({
	component: RouteComponent,
});

interface Ingredient {
	ingredient: string;
	cost: number;
	quantity: number;
}

const definition: Definition<Ingredient>[] = [
	{
		primaryKey: true,
		accessorKey: "ingredient",
		header: "Ingredient",
		sortable: true,
		type: z.string().nonempty(),
	},
	{
		accessorKey: "cost",
		header: "Cost",
		sortable: true,
		cell: (row) => {
			const amount = parseFloat(row.getValue("cost"));
			const formatted = new Intl.NumberFormat("en-US", {
				style: "currency",
				currency: "USD",
			}).format(amount);

			return <div>{formatted}</div>;
		},
		type: z.coerce.number().min(0),
	},
	{
		accessorKey: "quantity",
		header: "Quantity",
		sortable: true,
		cell: (row) => {
			const amount = parseInt(row.getValue("quantity"));
			return <div>{amount.toLocaleString()}</div>;
		},
		type: z.coerce.number().min(0),
	},
];

function RouteComponent() {
	const { status, data, error } = useQuery({
		queryKey: ["inventory"],
		queryFn: get,
	});

	async function get() {
		const res = await fetch("http://localhost:3000/inventory");
		if (!res.ok) {
			throw new Error("Network response was not ok");
		}
		return res.json();
	}

	if (status === "pending") {
		return <h1>Loading...</h1>;
	}

	if (status === "error") {
		return <h1>There was an error when loading the data.</h1>;
	}

	return (
		<div className="px-4 flex flex-col gap-4">
			<h1 className="text-2xl font-bold">Edit Inventory</h1>
			<DataTable<Ingredient>
				definition={definition}
				data={data}
				defaultValues={{
					ingredient: "",
					cost: 0,
					quantity: 0,
				}}
				onCreate={(employee) => {
					console.log(`Create employee ${JSON.stringify(employee)}`);
				}}
				onUpdate={(from, to) =>
					console.log(
						`Update employee ${JSON.stringify(from)} to ${JSON.stringify(to)}`
					)
				}
				onDelete={(employee) =>
					console.log(`Delete employee ${JSON.stringify(employee)}`)
				}
			/>
		</div>
	);
}
