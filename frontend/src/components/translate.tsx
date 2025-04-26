import * as React from "react";
import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";

declare global {
  interface Window {
    googleTranslateElementInit: () => void;
    google: {
      translate: {
        TranslateElement: new (
          options: { pageLanguage: string },
          elementId: string
        ) => void;
      };
    };
  }
}

export function Translate() { //Its all one component
  const [isVisible, setIsVisible] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  // Load Google Translate script once
  React.useEffect(() => {
    if (document.getElementById("google-translate-script")) return;

    window.googleTranslateElementInit = () => {
      new window.google.translate.TranslateElement(
        { pageLanguage: "en" },
        "google_translate_element"
      );
    };

    const script = document.createElement("script");
    script.id = "google-translate-script";
    script.src =
      "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  return (
    <div className="relative inline-block">
      <Button //Make the transaltion thing hidden
        onClick={() => setIsVisible((prev) => !prev)}
        className="z-50"
      >
        <Globe/>
      </Button>

      <div
        id="google_translate_element"
        ref={containerRef}
        className={`absolute left-0 mt-2 z-40 bg-white p-2 rounded shadow ${
          isVisible ? "visible" : "invisible"
        }`}
      />
    </div>
  );
}
