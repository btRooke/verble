import React from "react";

import GridRow from "./GridRow/GridRow"

import "./GameGrid.css";

class GameGrid extends React.Component {

    constructor(props) {

        super(props);

        this.state = {
            words: [],
            primedWord: "hello"
        };

    }

    play() {

        if (this.state.primedWord) {

            let words = this.state.words;
            words.push(this.state.primedWord);
    
            this.setState({
                words: words,
                primedWord: null
            });

            return true;

        }

        else {
            return false;
        }

    }

    prime(word) {

        if (word.length === this.props.target.length) {
            this.setState( { primedWord: word } );
            return true;
        }

        else {
            return false;
        }

    }

    generateRows() {

        let rows = [];

        this.state.words.forEach(word => {
            rows.push(<GridRow primed={false} target={this.props.target} word={word}/>)
        });

        if (this.state.primedWord) {
            console.log(this.state.primedWord);
            rows.push(<GridRow primed={true} target={this.props.target} word={this.state.primedWord}/>);
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
                <input type="text" id="word"></input>
                <button onClick={() => this.prime(document.querySelector("#word").value)}>prime</button>
                <button onClick={() => this.play()}>play</button>
            </div>


        );

    }

}

export default GameGrid;