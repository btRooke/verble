import React from "react";

import GridRow from "./GridRow/GridRow"

import "./GameGrid.css";

class GameGrid extends React.Component {

    render() {

        return (

            <div className="GameGrid-container">
                {this.props.grid.map(row => <GridRow row={row} />)}
            </div>


        );

    }

}

export default GameGrid;