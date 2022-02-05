import React from "react";

import GridSquare from "./GridSquare/GridSquare"

// import "./GameGrid.css";

class GameGrid extends React.Component {

    generateGrid() {

        let rowElements = [];

        for (let row in this.props.grid) {

            

        }

        return rows;

    }

    render() {

        return (

            <div className="GameGrid-container">
                {this.generateGrid()}
            </div>


        );

    }

}

export default GameGrid;