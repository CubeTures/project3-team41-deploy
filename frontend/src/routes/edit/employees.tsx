import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import DataTable from "@/components/DataTable/DataTable";
import { Definition } from "@/components/DataTable/DataTableTypes";
import { z } from "zod";

export const Route = createFileRoute("/edit/employees")({
	component: RouteComponent,
});

interface Employee {
	employee_id: number;
	hours_worked: number;
	manager_id: number;
	name: string;
	password: string;
	wage: number;
}

const definition: Definition<Employee>[] = [
	{
		primaryKey: true,
		accessorKey: "employee_id",
		header: "Employee ID",
		sortable: true,
		type: z.coerce.number().min(0),
	},
	{
		accessorKey: "manager_id",
		header: "Manager ID",
		sortable: true,
		type: z.coerce.number().min(0),
	},
	{
		accessorKey: "name",
		header: "Name",
		sortable: true,
		type: z.string().nonempty(),
	},
	{
		accessorKey: "password",
		header: "Password",
		sortable: true,
		type: z.string().nonempty(),
	},
	{
		accessorKey: "hours_worked",
		header: "Hours Worked",
		sortable: true,
		cell: (row) => {
			const amount = parseInt(row.getValue("hours_worked"));
			return <div>{amount.toLocaleString()}</div>;
		},
		type: z.coerce.number().min(0),
	},
	{
		accessorKey: "wage",
		header: "Wage",
		sortable: true,
		cell: (row) => {
			const amount = parseFloat(row.getValue("wage"));
			const formatted = new Intl.NumberFormat("en-US", {
				style: "currency",
				currency: "USD",
			}).format(amount);

			return <div>{formatted}</div>;
		},
		type: z.coerce
			.number()
			.min(7.25, "You cannot pay your employee below minimum wage."),
	},
];

function RouteComponent() {
	const { status, data, error } = useQuery({
		queryKey: ["employees"],
		queryFn: get,
	});

	async function get() {
		const res = await fetch("http://localhost:3000/employees");
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
			<h1 className="text-2xl font-bold">Edit Employees</h1>
			<DataTable<Employee>
				definition={definition}
				data={data}
				defaultValues={{
					employee_id: 0,
					hours_worked: 0,
					manager_id: 0,
					name: "Name",
					password: "Password",
					wage: 0,
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
