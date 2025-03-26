import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Plus } from "lucide-react";
import { useState } from "react";
import { Row } from "@tanstack/react-table";
import {
	CreateEntry,
	Definition,
	DeleteEntry,
	UpdateEntry,
} from "./DataTableTypes";
import { Mode } from "./DataTableContext";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import DataTableForm from "./DataTableForm";
import { useForm } from "react-hook-form";

export function DataTableCreate<T>(
	data: T[],
	definition: Definition<T>[],
	defaultValues: T,
	onCreate: CreateEntry<T>
) {
	const [open, setOpen] = useState(false);
	const schema = getSchema();
	const form = useForm<z.infer<typeof schema>>({
		resolver: zodResolver(schema),
		defaultValues: defaultValues as { [x: string]: any },
	});

	function getSchema() {
		function map({ primaryKey, accessorKey, type }: Definition<T>) {
			if (primaryKey === undefined) {
				return [accessorKey, type];
			} else {
				return [
					accessorKey,
					type.refine(
						(value) => uniquePrimaryKey(accessorKey, value),
						"This Primary Key conflicts with another item in the database."
					),
				];
			}
		}

		return z.object(Object.fromEntries(definition.map(map)));
	}

	function uniquePrimaryKey(pk: keyof T, value: any): boolean {
		for (let i = 0; i < data.length; i++) {
			if (data[i][pk] === value) {
				return false;
			}
		}

		return true;
	}

	function onSubmit(to: T) {
		onCreate(to);
		setOpen(false);
		// TODO - create entry in table
	}

	return (
		<Dialog
			open={open}
			onOpenChange={setOpen}
		>
			<DialogTrigger asChild>
				<Button
					variant="ghost"
					size="sm"
					className="h-8 data-[state=open]:bg-accent"
				>
					<Plus />
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Create Entry</DialogTitle>
					<DialogDescription>
						Create a new entry in the database.
					</DialogDescription>
				</DialogHeader>
				<DataTableForm
					definition={definition}
					form={form}
					onSubmit={onSubmit}
				/>
			</DialogContent>
		</Dialog>
	);
}

export function DataTableUpdateDelete<T extends object>(
	data: T[],
	definition: Definition<T>[],
	defaultValues: T,
	row: Row<T>,
	onUpdate: UpdateEntry<T>,
	onDelete: DeleteEntry<T>
) {
	const [mode, setMode] = useState<Mode>("DELETE");
	const [open, setOpen] = useState(false);
	const defaultValuesRow = defaultValuesFromRow();
	const schema = getSchema();
	const form = useForm<z.infer<typeof schema>>({
		resolver: zodResolver(schema),
		defaultValues: defaultValuesRow as { [x: string]: any },
	});

	function defaultValuesFromRow(): T {
		let t: any = {};

		for (const key of Object.keys(defaultValues)) {
			t[key] = row.getValue(key);
		}

		return t;
	}

	function getSchema() {
		function map({ primaryKey, accessorKey, type }: Definition<T>) {
			if (primaryKey === undefined) {
				return [accessorKey, type];
			} else {
				return [
					accessorKey,
					type.refine(
						(value) => uniquePrimaryKey(accessorKey, value),
						"This Primary Key conflicts with another item in the database."
					),
				];
			}
		}

		return z.object(Object.fromEntries(definition.map(map)));
	}

	function uniquePrimaryKey(pk: keyof T, value: any): boolean {
		if (defaultValuesRow[pk] === value || mode === "DELETE") {
			return true;
		}

		for (let i = 0; i < data.length; i++) {
			if (data[i][pk] === value) {
				return false;
			}
		}

		return true;
	}

	function EditTableUpdate() {
		function onSubmit(to: T) {
			onUpdate(defaultValues, to);
			setOpen(false);
			// TODO - update entry in table
			// TODO - update default values
		}

		return (
			<>
				<DialogHeader>
					<DialogTitle>Update Entry</DialogTitle>
					<DialogDescription>
						Update the values of an entry in the database.
					</DialogDescription>
				</DialogHeader>
				<DataTableForm
					definition={definition}
					form={form}
					onSubmit={onSubmit}
				/>
			</>
		);
	}

	function EditTableDelete() {
		function onSubmit() {
			onDelete(data[parseInt(row.id)]);
			setOpen(false);
			// TODO - remove entry from table
		}

		return (
			<>
				<DialogHeader>
					<DialogTitle>Delete Entry</DialogTitle>
					<DialogDescription>
						This action cannot be undone. Are you sure you want to
						permanently delete this entry from the database?
					</DialogDescription>
				</DialogHeader>
				<DialogFooter>
					<Button
						type="submit"
						onClick={onSubmit}
					>
						Confirm
					</Button>
				</DialogFooter>
			</>
		);
	}

	return (
		<Dialog
			open={open}
			onOpenChange={setOpen}
		>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button
						variant="ghost"
						className="h-8 w-8 p-0"
					>
						<span className="sr-only">Open menu</span>
						<MoreHorizontal className="h-4 w-4" />
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="end">
					<DialogTrigger asChild>
						<DropdownMenuItem onClick={() => setMode("UPDATE")}>
							Edit Entry
						</DropdownMenuItem>
					</DialogTrigger>
					<DialogTrigger asChild>
						<DropdownMenuItem onClick={() => setMode("DELETE")}>
							Delete Entry
						</DropdownMenuItem>
					</DialogTrigger>
				</DropdownMenuContent>
			</DropdownMenu>
			<DialogContent>
				{mode === "UPDATE" ? EditTableUpdate() : EditTableDelete()}
			</DialogContent>
		</Dialog>
	);
}
