import React from "react";

import GameGrid from "../GameGrid/GameGrid";

import "./Verble.css";

let example = [
    ["a", "b", "c", "d", "e"],
    ["a", "b", "c", "d", "e"],
    ["a", "b", "c", "d", "e"],
    ["a", "b", "c", "d", "e"],
    ["a", "b", "c", "d", "e"]
];

class Verble extends React.Component {

    render() {

        return (

            <div className="Verble-container">
                <GameGrid grid={example}/>
            </div>

        );

    }

}

export default Verble;