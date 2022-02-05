import React from "react";

import GameGrid from "../GameGrid/GameGrid";

import "./Verble.css";

class Verble extends React.Component {

    render() {

        return (

            <div className="Verble-container">
                <GameGrid target="audio" guesses={6}/>
            </div>

        );

    }

}

export default Verble;