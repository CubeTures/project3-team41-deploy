import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { API_URL } from "@/lib/constants";
import { useEffect, useState } from "react";
import { ok } from "@/lib/fetchUtils";
// import { ItemWidget } from "@/components/ItemWidget";
import { SquareMinus, SquarePlus } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";

// import { set } from "react-hook-form";

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

export const Route = createFileRoute("/kiosk")({
	component: RouteComponent,
});

function RouteComponent() {
	const navigate = useNavigate();
	async function getMenu(): Promise<MenuItem[]> {
		const res = await ok(
			fetch(`${API_URL}/edit/menu`, {
				method: "GET",
			})
		);
		return res.json();
	}
	// console.log("Fetching menu...");
	const [fullMenu, setFullMenu] = useState<MenuItem[]>([]);
	let [order, setOrder] = useState<OrderItem[]>([]);

	useEffect(() => {
		async function fetchMenu() {
			const f_menu = await getMenu();
			setFullMenu(f_menu);
			console.log("Menu fetched:", f_menu);
		}
		fetchMenu();
	}, []);

	//*****************Begin user token************************* */
	const params = new URLSearchParams(window.location.search);
	const token = params.get("token");
	const userString = params.get("user");
	let usersName = "";

	if (token && userString) {
		try {
			const user = JSON.parse(decodeURIComponent(userString));
			console.log("Logged in user:", user.name);
			usersName = user.name;
		} catch (err) {
			console.error("Error parsing user object:", err);
		}
	}
	//***********************End user token************************* */

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
					${(item.price * o_item.quantity).toFixed(2)}
				</p>
				<div className="flex gap-2 mt-4">
					<Button
						className="hover:bg-gray-600 size-7"
						onClick={() => {
							setOrder((prevOrder) => {
								const prev = [...prevOrder];
								const index = order.findIndex(
									(o_item) => o_item.item.item === item.item
								);
								prev[index!].quantity += 1;
								prev[index!].totalPrice += item.price;
								return prev;
							});
						}}
					>
						<SquarePlus />
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
									(o_item) => o_item.item.item === item.item
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
		console.log("Users name:", usersName);
		if (order.length === 0) {
			alert("Please add items to your order before submitting.");
			return;
		}
		if (usersName === "") {
			const name = prompt("Please enter your name:");
			if (name) {
				usersName = name;
			} else {
				alert("Please enter a valid name.");
				return;
			}
		}
		const total = order.reduce((acc, i) => acc + i.quantity * i.item.price, 0);
		const drinks = flattenOrder(order);
	
		navigate({
			to: "/payment",
			state: {
				customerName: usersName,
				drinks,
				total,
			},
		});
	}

	return (
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
									(o_item) => o_item.item.item === item.item
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
						{item.item}
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
							(acc, i) => (acc += i.quantity * i.item.price),
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
	);
}
