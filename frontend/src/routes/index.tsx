import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import EmployeeLogin from "@/components/EmployeeLogin";
import { API_URL } from "@/lib/constants";
import { Translate } from "@/components/translate";

export const Route = createFileRoute("/")({
  component: Index,
});


// Make index.tsx into the login screen
function Index() {
  return (
    <div className = "relative h-screen flex flex-col items-center justify-center bg-black">
      <img src = "PFU.jpg" alt = "Pink Fluffy Unicorns Logo" className= "h-128 w-128 object-scale-down px-20"></img>

      <div className="absolute top-4 right-4"><EmployeeLogin/></div>

      <h1 className = "text-8xl font-bold mb-10">Welcome!</h1>
      <br />

      <Button className = "text-4xl mb-4 py-8" onClick = { () => {
        localStorage.setItem("userRole", "customer");
        window.location.href = `${API_URL}/google`;
      }}>
        Login with Google
      </Button>

    <Link to="/kiosk">
	  <Button className="text-4xl py-8" onClick = { () => {
        localStorage.setItem("userRole", "customer");
      }}>
        Login as Guest
      </Button>
      </Link>

      <div className = "absolute top-4 left-4"><Translate/></div>
    </div>
  );
}
