import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { API_URL } from "@/lib/constants";
import { useEffect, useState } from "react";
import { ok } from "@/lib/fetchUtils";
import { SquareMinus, SquarePlus, Trash2 } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import { useAllergenMenu } from "@/hooks/useAllergenMenu";
import { calculateAdjustedPrice } from "@/components/dynamicPricing";

interface MenuItem {
	item: string;
	price: number;
	description: string;
	image_url: string;
	ingredients: string[];
}

interface OrderItem {
	item: MenuItem;
	quantity: number;
	totalPrice: number;
}

interface WeatherData {
	location: string;
	temp: number;
	condition: string;
}

export const Route = createFileRoute("/order")({
	component: RouteComponent,
});

function RouteComponent() {
	const navigate = useNavigate();

	const fullMenu = useAllergenMenu();
	let [order, setOrder] = useState<OrderItem[]>([]);
	const [weather, setWeather] = useState<WeatherData | null>(null);
	const [customerName, setCustomerName] = useState("");

	useEffect(() => {
		async function fetchWeather() {
			const response = await fetch(`${API_URL}/weather`);
			const data = await response.json();
			setWeather(data);
		}

		fetchWeather();
	}, []);

	function ItemWidget(o_item: OrderItem, index: number) {
		const item = o_item.item;

		return (
			<div
				className="flex flex-col items-center justify-center bg-gray-800 p-4 rounded-lg shadow-md w-64"
				style={{ marginLeft: "15%" }}
				key={index}
			>
				<h2 className="text-xl font-bold text-white">{item.item}</h2>
				<p className="text-gray-400">{item.description}</p>
				<p className="text-green-500 font-semibold">
					$
					{(
						calculateAdjustedPrice(item.price, weather?.temp) *
						o_item.quantity
					).toFixed(2)}
				</p>
				<div className="flex flex-row justify-between items-center w-full mt-4">
					<div className="flex gap-2 mt-4 margin-left-2 items-center">
						<Button
							className="hover:bg-gray-600 size-7"
							onClick={() => {
								setOrder((prevOrder) => {
									const prev = [...prevOrder];
									const index = order.findIndex(
										(o_item) =>
											o_item.item.item === item.item
									);
									prev[index!].quantity -= 1;
									prev[index!].totalPrice -= item.price;
									return prev;
								});
							}}
							disabled={o_item.quantity <= 1}
						>
							<SquareMinus />
						</Button>

						<Label className="text-white text-lg">
							{o_item.quantity}
						</Label>

						<Button
							className="hover:bg-gray-600 size-7"
							onClick={() => {
								setOrder((prevOrder) => {
									const prev = [...prevOrder];
									const index = order.findIndex(
										(o_item) =>
											o_item.item.item === item.item
									);
									prev[index!].quantity += 1;
									prev[index!].totalPrice += item.price;
									return prev;
								});
							}}
						>
							<SquarePlus />
						</Button>
					</div>

					<div className="flex gap-2 mt-4 items-center">
						<Button
							className="hover:bg-red-700 size-7 bg-red-400"
							onClick={() => {
								setOrder((prevOrder) => {
									const prev = [...prevOrder];
									const index = order.findIndex(
										(o_item) =>
											o_item.item.item === item.item
									);
									prev.splice(index!, 1);
									return prev;
								});
							}}
						>
							<Trash2></Trash2>
						</Button>
					</div>
				</div>
			</div>
		);
	}

	function flattenOrder(order: OrderItem[]) {
		let flattenedOrder: string[] = [];
		order.forEach((item) => {
			for (let i = 0; i < item.quantity; i++) {
				flattenedOrder.push(item.item.item);
			}
		});
		return flattenedOrder;
	}

	function sendOrder() {
		if (order.length === 0) {
			alert("Please add items to your order before submitting.");
			return;
		}
		if (customerName === "") {
			const name = prompt("Please enter your name:");
			if (name) {
				setCustomerName(name);
			} else {
				alert("Please enter a valid name.");
				return;
			}
		}

		const total = order.reduce(
			(acc, i) =>
				(acc +=
					i.quantity *
					calculateAdjustedPrice(i.item.price, weather?.temp)),
			0
		);
		const drinks = flattenOrder(order);

		navigate({
			to: "/payment",
			state: {
				customerName,
				drinks,
				total,
			},
		});
	}

	return (
		<div className="flex flex-col">
			{weather && (
				<div className="w-full text-white p-2 text-center mb-4">
					{weather.location}: {weather.temp}°F
				</div>
			)}

			<div className="flex gap-8">
				<div
					className="grid grid-cols-4 gap-6"
					style={{
						width: "70%",
					}}
				>
					{fullMenu.map((item, index) => (
						<Button
							key={index}
							className="col-span-1 hover:bg-[url({fullMenu[index].image_url})]"
							onClick={() => {
								if (
									!order.find(
										(o_item) =>
											o_item.item.item === item.item
									)
								) {
									let newItem: OrderItem = {
										item: item,
										quantity: 1,
										totalPrice: item.price,
									};
									setOrder((prevOrder) => [
										...prevOrder,
										newItem,
									]);
								} else {
									setOrder((prevOrder) => {
										const prev = [...prevOrder];
										const index = order.findIndex(
											(o_item) =>
												o_item.item.item === item.item
										);
										prev[index!].quantity += 1;
										return prev;
									});
								}
							}}
							onMouseOver={(event) => {
								const button =
									event.currentTarget as HTMLButtonElement;
								if (button) {
									// button.style.backgroundColor = "#f7a663";
									button.style.backgroundImage = `url(${fullMenu[index].image_url})`;
									button.style.backgroundSize = "cover";
									button.style.backgroundPosition = "center";
									button.style.transition =
										"background-image 0.3s ease";
									button.style.color = "rgba(0, 0, 0, 0)";
								}
								// console.log("Hovering over button:", label);
							}}
							onMouseOut={(event) => {
								const button =
									event.currentTarget as HTMLButtonElement;
								if (button) {
									// button.style.backgroundColor = "#f0f0f0";
									button.style.backgroundImage = "none";
									button.style.transition =
										"background-image 0.3s ease";
									button.style.color = "black";
								}
							}}
							style={{
								width: "100%",
								height: "100px",
								backgroundColor: "#f0f0f0",
								borderRadius: "15px",
								fontSize: "13px",
								fontWeight: "bold",
							}}
						>
							<div className="flex flex-col gap-2">
								<div>{item.item}</div>
								<div className="flex gap-2 justify-center">
									{item.allergens.map(
										(al: any, index: number) => (
											<div key={index}>{al}</div>
										)
									)}
								</div>
							</div>
						</Button>
					))}
				</div>
				<div
					className="flex flex-col gap-4"
					style={{
						width: "30%",
						height: "95%",
						backgroundColor: "#27272a",
						borderRadius: "15px",
						fontSize: "13px",
						fontWeight: "bold",
						overflowY: "auto",
					}}
				>
					<Label
						className="text-white text-2xl font-bold"
						id="subtotal-label"
						style={{
							textAlign: "center",
							marginTop: "10px",
							marginLeft: "10px",
						}}
					>
						Total: $
						{order
							.reduce(
								(acc, i) =>
									(acc +=
										i.quantity *
										calculateAdjustedPrice(
											i.item.price,
											weather?.temp
										)),
								0
							)
							.toFixed(2)}
					</Label>

					{order.map((o_item, index) => ItemWidget(o_item, index))}

					<Button
						className="text-black bg-green-500 hover:bg-green-700 rounded-lg"
						style={{
							width: "80%",
							height: "50px",
							fontSize: "20px",
							fontWeight: "bold",
							marginLeft: "10%",
						}}
						onClick={() => {
							sendOrder();
						}}
					>
						Checkout
					</Button>
				</div>
			</div>
		</div>
	);
}
