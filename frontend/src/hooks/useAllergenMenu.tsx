import { API_URL } from "@/lib/constants";
import {
	Bean,
	Egg,
	Fish,
	Hand,
	Milk,
	Nut,
	Shrimp,
	Snowflake,
} from "lucide-react";
import { useEffect, useState } from "react";

const allergenIconMap: { [allergen: string]: any } = {
	latex: <Hand />,
	shellfish: <Shrimp />,
	egg: <Egg />,
	milk: <Milk />,
	soy: <Bean />,
	nut: <Nut />,
	fish: <Fish />,
	fent: <Snowflake />,
};

interface MenuItem {
	item: string;
	price: number;
	description: string;
	ingredients: string[];
	image_url: string;
	allergens: any[];
}

export function useAllergenMenu() {
	const [menu, setMenu] = useState<MenuItem[]>([]);

	useEffect(() => {
		async function get() {
			const res = await Promise.all([
				fetch(`${API_URL}/edit/menu`),
				fetch(`${API_URL}/edit/inventory`),
			]);
			const json = await Promise.all(res.map((r) => r.json()));

			const m = json[0];
			const i = Object.fromEntries(
				(json[1] ?? {}).map((ing: any) => [
					ing.ingredient,
					ing.allergens,
				])
			);

			setMenu(() =>
				m.map((item: any) => ({
					...item,
					allergens: Array.from(
						new Set(
							item.ingredients
								.map((ing: string) =>
									(i[ing] ?? []).map(
										(al: string) => allergenIconMap[al]
									)
								)
								.flat()
						)
					),
				}))
			);
		}

		get();
	}, []);

	return menu;
}
