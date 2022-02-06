import React from "react";

import GridRow from "./GridRow/GridRow"

import "./GameGrid.css";

class GameGrid extends React.Component {

    //constructor(props) {
    //    super(props);
    //}

    generateRows() {

        let rows = [];

        this.props.words.forEach(word => {
            rows.push(<GridRow primed={false} target={this.props.target} word={word}/>)
        });

        if (this.props.primedWord) {
            console.log(this.props.primedWord);
            rows.push(<GridRow primed={true} target={this.props.target} word={this.props.primedWord}/>);
        }

        while (rows.length < this.props.guesses) {
            rows.push(<GridRow primed={false} target={this.props.target} word={null}/>)
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