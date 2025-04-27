import { createFileRoute, useRouterState, useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import { API_URL } from "@/lib/constants";

export const Route = createFileRoute("/payment")({
	component: PaymentComponent,
});

interface UserRole {
	role: string;
}

function redirectPage(userRole: UserRole): string {
	if (userRole.role == "manager") {
		return "/order";
	} else if (userRole.role == "employee") {
		return "/order";
	} else if (userRole.role == "customer") {
		return "/";
	}

	return "/";
}

function PaymentComponent() {
	const navigate = useNavigate()
	const [userRole, setUserRole] = useState<UserRole>({ role: "customer" });

	useEffect(() => {
		const r = localStorage.getItem("userRole");
		if (r) {
			setUserRole({ role: r });
		}
	}, []);

	const {
		location: {
			state: {
				customerName = "",
				drinks = [],
				total = 0
			}
		}
	} = useRouterState()

	const [cardNumber, setCardNumber] = useState("")
	const [error, setError] = useState("")
	const [loading, setLoading] = useState(false)

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		setError("")
		setLoading(true)

		const raw = cardNumber.replace(/\s/g, "")
		if (!/^\d{16}$/.test(raw)) {
			setError("Please enter a valid 16-digit card number.")
			setLoading(false)
			return
		}

		try {
			const res = await fetch(`${API_URL}/order`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify({
					customer_name: customerName,
					credit_card: raw,
					drinks,
					price: total
				}),
			})

			const data = await res.json()

			if (!res.ok || !data.success) {
				setError(data.message || "Payment failed.")
			} else {
				alert("Payment successful!")
				navigate({ to: redirectPage(userRole) })
			}
		} catch (err) {
			console.error("err:", err)
			setError("Server error. Please try again.")
		} finally {
			setLoading(false)
		}
	}

	return (
		<div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
			<form
				onSubmit={handleSubmit}
				className="bg-black rounded-xl shadow p-6 w-full max-w-md space-y-4"
			>
				<Label className="text-2xl font-bold text-center text-white">
					Payment for {customerName}
				</Label>

				<div>
					<Label className="text-white mb-1 block">Card #</Label>
					<input
						type="text"
						value={cardNumber}
						onChange={(e) => setCardNumber(e.target.value)}
						placeholder="1234 5678 9012 3456"
						className="w-full p-2 border rounded-lg focus:outline-none text-white"
						required
					/>
				</div>

				<div>
					<p className="text-white text-base font-medium">Items:</p>
					<ul className="text-sm text-gray-300 list-disc pl-5">
						{drinks.map((d, i) => (
							<li key={i}>{d}</li>
						))}
					</ul>
				</div>

				<p className="text-white text-lg font-semibold">
					Total: ${total.toFixed(2)}
				</p>

				{error && (
					<p className="text-red-400 text-sm">{error}</p>
				)}

				<Button
					type="submit"
					disabled={loading}
					className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
				>
					{loading ? "Processing..." : "Submit Payment"}
				</Button>
			</form>
		</div>
	)
}
