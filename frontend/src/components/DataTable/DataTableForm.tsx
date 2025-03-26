import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Definition, FormType, OnSubmit, SchemaType } from "./DataTableTypes";
import { z } from "zod";

interface Props<T> {
	definition: Definition<T>[];
	form: FormType;
	onSubmit: OnSubmit<T>;
}

// TODO - make dialog have a scroll (it's too long)
function DataTableForm<T>({ definition, form, onSubmit }: Props<T>) {
	function _onSubmit(values: z.infer<SchemaType>) {
		onSubmit(values as T);
	}

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(_onSubmit)}
				className="space-y-8"
			>
				{definition.map(({ accessorKey: id, header: name }, index) => (
					<FormField
						key={`${name}-${index}`}
						control={form.control}
						name={id as string}
						render={({ field }) => (
							<FormItem>
								<FormLabel>{name}</FormLabel>
								<FormControl>
									<Input
										placeholder={name}
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				))}
				<Button type="submit">Submit</Button>
			</form>
		</Form>
	);
}

export default DataTableForm;
