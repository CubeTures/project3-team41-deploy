import { Row } from "@tanstack/react-table";
import { JSX } from "react";
import { UseFormReturn } from "react-hook-form";
import { z, ZodTypeAny } from "zod";

export interface Definition<T, K = unknown> {
	primaryKey?: boolean;
	accessorKey: keyof T;
	header: string;
	sortable?: boolean;
	cell?: (row: Row<T>) => JSX.Element;
	type: ZodTypeAny;
	preprocess?: (obj: unknown) => K;
}

export type CreateEntry<T> = (entry: T) => void;
export type UpdateEntry<T> = (from: T, to: T) => void;
export type DeleteEntry<T> = (entry: T) => void;
export type OnSubmit<T> = (to: T) => void;

export type SchemaType = z.ZodObject<
	any,
	"strip",
	z.ZodTypeAny,
	{
		[x: string]: any;
	},
	{
		[x: string]: any;
	}
>;
export type FormType = UseFormReturn<
	{
		[x: string]: any;
	},
	any,
	undefined
>;
