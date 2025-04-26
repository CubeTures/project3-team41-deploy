import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { API_URL } from "@/lib/constants";
import logo from "/PFU.jpg";
import { useAllergenMenu } from "@/hooks/useAllergenMenu";
import { calculateAdjustedPrice } from "@/components/dynamicPricing";

export const Route = createFileRoute("/kiosk")({
	component: RouteComponent,
});

interface MenuItem {
	item: string;
	price: number;
	description: string;
	ingredients: string[];
	image_url: string;
	allergens: any[];
}

interface OrderItem {
	item: string;
	quantity: number;
	price: number;
}

interface WeatherData {
	location: string;
	temp: number;
	condition: string;
}

function RouteComponent() {
	const menu = useAllergenMenu();
	const [cart, setCart] = useState<OrderItem[]>([]);
	const [showPopup, setShowPopup] = useState(false);
	const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
	const [quantity, setQuantity] = useState<number>(1);
	const [customerName, setCustomerName] = useState("");
	const [editIndex, setEditIndex] = useState<number | null>(null);
	const [editQuantity, setEditQuantity] = useState(1);
	const [weather, setWeather] = useState<WeatherData | null>(null);
	const navigate = useNavigate();

	useEffect(() => {
		async function fetchWeather() {
			const response = await fetch(`${API_URL}/weather`);
			const data = await response.json();
			setWeather(data);
		}

		fetchWeather();
	}, []);

	//*****************Begin user token************************* */
	useEffect(() => {
		const params = new URLSearchParams(window.location.search);
		const token = params.get("token");
		const userString = params.get("user");

		if (token && userString) {
			try {
				const user = JSON.parse(decodeURIComponent(userString));
				console.log("Logged in user:", user.name);
				setCustomerName(user.name);
			} catch (err) {
				console.error("Error parsing user object:", err);
			}
		}
		//***********************End user token************************* */
	}, []);

	const openPopup = (item: MenuItem) => {
		setSelectedItem(item);
		setQuantity(1);
		setShowPopup(true);
	};

	const addToCart = () => {
		if (selectedItem) {
			const newItem = {
				item: selectedItem.item,
				quantity,
				price: selectedItem.price,
			};
			setCart((prev) => [...prev, newItem]);
			setShowPopup(false);
		}
	};

	const openEditPopup = (i: number) => {
		setEditIndex(i);
		setEditQuantity(cart[i].quantity);
	};

	const total = cart.reduce(
		(acc, curr) =>
			acc +
			calculateAdjustedPrice(curr.price, weather?.temp) * curr.quantity,
		0
	);

	const goToPayment = () => {
		const drinks = cart.flatMap((c) => {
			return Array(c.quantity).fill(c.item);
		});

		// console.log("Going to payment...")
		navigate({
			to: "/payment",
			state: {
				customerName,
				drinks,
				total,
			},
		});
	};

	return (
		<div className="flex flex-col">
			{weather && (
				<div className="w-full text-white p-2 text-center mb-4">
					{weather.location}: {weather.temp}°F
				</div>
			)}

			<div className="p-6 min-h-screen bg-gradient-to-br from-white to-blue-50">
				<h1 className="text-4xl font-bold text-center mb-4 text-black">
					Order Boba
				</h1>

				<input
					type="text"
					value={customerName}
					placeholder="Enter name"
					onChange={(e) => setCustomerName(e.target.value)}
					className="w-full p-2 mb-3 border border-gray-300 rounded-xl shadow-sm text-black"
				/>
				{customerName && (
					<p className="text-center text-black mb-5">
						Welcome, <b>{customerName}</b> 👋
					</p>
				)}

				<div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
					{menu.map((m, i) => (
						<button
							key={i}
							className="bg-white border rounded-xl shadow-md p-3 flex flex-col items-center hover:shadow-lg transition"
							onClick={() => openPopup(m)}
						>
							<img
								src={m.image_url ?? logo}
								alt={m.item}
								className="w-24 h-24 object-cover rounded-lg"
							/>
							<span className="text-black font-semibold mt-2">
								{m.item}
							</span>
							<span
								className="flex gap-2"
								style={{
									filter: "brightness(0) saturate(100%) invert(0%) sepia(3%) saturate(0%) hue-rotate(220deg) brightness(99%) contrast(104%)",
								}}
							>
								{m.allergens.map((al, index) => (
									<div key={index}>{al}</div>
								))}
							</span>
							<span className="text-blue-500">
								$
								{calculateAdjustedPrice(
									m.price,
									weather?.temp
								).toFixed(2)}
							</span>
						</button>
					))}
				</div>

				{/* Add Popup */}
				{showPopup && selectedItem && (
					<div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
						<div className="bg-white p-5 rounded-xl shadow-lg w-80 flex flex-col gap-4">
							<h2 className="text-lg font-bold text-center text-gray-800">
								Add {selectedItem.item}
							</h2>
							<input
								type="number"
								min={1}
								value={quantity}
								onChange={(e) =>
									setQuantity(parseInt(e.target.value))
								}
								className="p-2 border rounded text-black"
							/>
							<button
								className="bg-green-500 text-white rounded p-2 hover:bg-green-600"
								onClick={addToCart}
							>
								Add
							</button>
							<button
								className="bg-gray-300 text-gray-700 rounded p-2 hover:bg-gray-400"
								onClick={() => setShowPopup(false)}
							>
								Cancel
							</button>
						</div>
					</div>
				)}

				{/* Edit Popup */}
				{editIndex !== null && (
					<div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
						<div className="bg-white p-5 rounded-xl shadow-lg w-80 flex flex-col gap-4">
							<h2 className="text-lg font-bold text-center text-gray-800">
								Edit {cart[editIndex].item}
							</h2>
							<input
								type="number"
								min={1}
								value={editQuantity}
								onChange={(e) =>
									setEditQuantity(parseInt(e.target.value))
								}
								className="p-2 border rounded text-black"
							/>
							<div className="flex gap-2">
								<button
									className="flex-1 bg-green-500 text-white rounded p-2 hover:bg-green-600"
									onClick={() => {
										const updated = [...cart];
										updated[editIndex].quantity =
											editQuantity;
										setCart(updated);
										setEditIndex(null);
									}}
								>
									Update
								</button>
								<button
									className="flex-1 bg-red-500 text-white rounded p-2 hover:bg-red-600"
									onClick={() => {
										const updated = cart.filter(
											(_, i) => i !== editIndex
										);
										setCart(updated);
										setEditIndex(null);
									}}
								>
									Remove
								</button>
								<button
									className="flex-1 bg-gray-300 text-gray-700 rounded p-2 hover:bg-gray-400"
									onClick={() => setEditIndex(null)}
								>
									Cancel
								</button>
							</div>
						</div>
					</div>
				)}

				<div className="mt-10 bg-white p-5 shadow rounded-xl">
					<h2 className="text-xl font-semibold mb-3 text-gray-800">
						Your Cart
					</h2>
					{cart.length === 0 ? (
						<p className="text-black italic">Cart is empty</p>
					) : (
						<ul className="mb-4">
							{cart.map((c, i) => (
								<li
									key={i}
									className="p-2 text-black hover:bg-gray-100 cursor-pointer rounded"
									onClick={() => openEditPopup(i)}
								>
									{c.quantity} × {c.item}{" "}
									<span className="text-gray-500">
										($
										{calculateAdjustedPrice(
											c.price,
											weather?.temp
										).toFixed(2)}{" "}
										each)
									</span>
								</li>
							))}
						</ul>
					)}
					<div className="flex justify-between items-center">
						<p className="font-bold text-black">
							Total: ${total.toFixed(2)}
						</p>
						<button
							className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
							onClick={goToPayment}
							disabled={cart.length === 0 || !customerName}
						>
							Pay
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}

export default RouteComponent;
