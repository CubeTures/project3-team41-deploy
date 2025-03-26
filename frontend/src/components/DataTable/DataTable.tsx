import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "./DataTableColumnHeader";
import DataTableRender from "./DataTableRender";
import {
	Definition,
	CreateEntry,
	UpdateEntry,
	DeleteEntry,
} from "./DataTableTypes";
import { DataTableCreate, DataTableUpdateDelete } from "./DataTableOptions";

interface Props<T> {
	data: T[];
	definition: Definition<T>[];
	defaultValues: T;
	onCreate: CreateEntry<T>;
	onUpdate: UpdateEntry<T>;
	onDelete: DeleteEntry<T>;
}

function DataTable<T extends object>({
	data,
	definition,
	defaultValues,
	onCreate,
	onUpdate,
	onDelete,
}: Props<T>) {
	const columnDef = getColumnDef();

	function getColumnDef(): ColumnDef<T>[] {
		return definition
			.map((def): ColumnDef<T> => {
				const cd: ColumnDef<T> = {
					accessorKey: def.accessorKey,
					header: def.sortable
						? ({ column }) => (
								<DataTableColumnHeader
									column={column}
									title={def.header}
								/>
							)
						: def.header,
				};

				if (def.cell) {
					cd["cell"] = ({ row }) => def.cell!(row);
				}

				return cd;
			})
			.concat({
				id: "actions",
				header: () =>
					DataTableCreate(data, definition, defaultValues, onCreate),
				cell: ({ row }) =>
					DataTableUpdateDelete(
						data,
						definition,
						defaultValues,
						row,
						onUpdate,
						onDelete
					),
			});
	}

	return (
		<DataTableRender
			data={data}
			columns={columnDef}
		/>
	);
}

export default DataTable;
