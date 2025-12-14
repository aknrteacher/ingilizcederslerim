import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Root element not found. Make sure there's a <div id='root'></div> in your HTML.");
}

console.log("Mounting React app...");
createRoot(rootElement).render(<App />);
console.log("React app mounted successfully");
