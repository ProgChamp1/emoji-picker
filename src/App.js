import { render } from "@hydrophobefireman/ui-lib";
import Picker from "./components/picker";
import "./App.css";

function App() {
  return (
    <main>
      <Picker />
    </main>
  );
}

render(<App />, document.getElementById("app-mount"));
