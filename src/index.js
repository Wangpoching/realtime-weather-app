import ReactDOM from "react-dom";
import "./index.css";
import WeatherApp from "./WeatherApp";

const rootElement = document.getElementById("root");
function App() {
  return <WeatherApp />;
}
ReactDOM.render(<App />, rootElement);
