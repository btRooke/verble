import React from "react";

import GridRow from "./GridRow/GridRow"

import "./GameGrid.css";

class GameGrid extends React.Component {

    constructor(props) {

        super(props);

        this.size = {
            i: 6,
            j: 5
        };

        this.state = {
            words: [],
            primedWord: null
        };

    }

    play() {
        return undefined;
    }

    prime(word) {
        return undefined;
    }

    generateRows() {

        let rows = [];

        for (let m = 0; m < i; i++) {

            if (this.state.words[m]) {
                rows.push(<GridRow target={this.props.target} word={this.state.words[m]}/>)
            }

            else {
                rows.push(<GridRow target={this.props.target} word={null}/>) 
            }

        }

        return rows;

    }

    render() {

        return (

            <div className="GameGrid-container">
                {this.generateRows()}
            </div>


        );

    }

}

export default GameGrid;