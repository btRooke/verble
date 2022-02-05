import React from "react";

import Header from "../Header/Header";
import GameGrid from "../GameGrid/GameGrid";

import "./Verble.css";

class Verble extends React.Component {

    render() {

        return (

            <div className="Verble-container">

                <Header />

                <div className="Verble-gridContainer">
                    <GameGrid target="adieu" guesses={6}/>
                </div>
                
            </div>

        );

    }

}

export default Verble;