import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import Verble from "./components/Verble/Verble";

ReactDOM.render(
  <React.StrictMode>
    <Verble target="audio" guesses={6}/>
  </React.StrictMode>,
  document.getElementById("root")
);