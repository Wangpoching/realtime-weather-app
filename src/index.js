import ReactDOM from "react-dom";
import "./index.css";
import WeatherApp from "./WeatherApp";
import * as serviceWorker from './serviceWorker';

const rootElement = document.getElementById("root");
function App() {
  return <WeatherApp />;
}
ReactDOM.render(<App />, rootElement);

serviceWorker.register()