import { createContext } from "react";

export type Mode = "CREATE" | "UPDATE" | "DELETE";
interface ContextType {
	mode: Mode;
	setMode: React.Dispatch<React.SetStateAction<Mode>>;
}

export const DataTableContext = createContext<ContextType>({
	mode: "DELETE",
	setMode: unimplemented,
});

function unimplemented() {
	throw new Error("This function was not defined.");
}
