import { createFileRoute } from "@tanstack/react-router";
import DataTable from "@/components/DataTable/DataTable";
import { Definition } from "@/components/DataTable/DataTableTypes";
import { z } from "zod";
import { ok } from "@/lib/fetchUtils";
import { API_URL } from "@/lib/constants";

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
	async function onGet(): Promise<Employee[]> {
		const res = await ok(
			fetch(`${API_URL}/edit/employees`, {
				method: "GET",
			})
		);
		return res.json();
	}

	async function onCreate(employee: Employee) {
		await ok(
			fetch(`${API_URL}/edit/employees`, {
				method: "POST",
				body: JSON.stringify(employee),
			})
		);
	}

	async function onUpdate(from: Employee, to: Employee) {
		await ok(
			fetch(`${API_URL}/edit/employees`, {
				method: "PUT",
				body: JSON.stringify({ from, to }),
			})
		);
	}

	async function onDelete(employee: Employee) {
		await ok(
			fetch(`${API_URL}/edit/employees`, {
				method: "DELETE",
				body: JSON.stringify(employee),
			})
		);
	}

	return (
		<div className="px-4 flex flex-col gap-4">
			<h1 className="text-2xl font-bold">Edit Employees</h1>
			<DataTable<Employee>
				queryKey={["edit", "employees"]}
				definition={definition}
				defaultValues={{
					employee_id: 0,
					hours_worked: 0,
					manager_id: 0,
					name: "Name",
					password: "Password",
					wage: 0,
				}}
				onGet={onGet}
				onCreate={onCreate}
				onUpdate={onUpdate}
				onDelete={onDelete}
			/>
		</div>
	);
}
