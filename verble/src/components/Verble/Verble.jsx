import React from "react";

import Header from "../Header/Header";
import GameGrid from "../GameGrid/GameGrid";
import Modal from "../Modal/Modal";
import example from "./audio";

import "./Verble.css";

function TestBox(props) {

    return (

        <div>
            <input type="text" id="word"/>
            <button onClick={() => props.primeHandler(document.querySelector("#word").value)}>prime</button>
            <button onClick={() => props.playHandler()}>play</button>
        </div>

    );

}

class Verble extends React.Component {

    constructor(props) {

        super(props);

        this.state = {
            primedWord: null,
            words: []
        }

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

    render() {

        return (

            <div className="Verble-container">

                <Header />

                <div className="Verble-gridContainer">
                    <GameGrid primedWord={this.state.primedWord} words={this.state.words} target={this.props.target} guesses={this.props.guesses}/>
                </div>

                <TestBox playHandler={() => this.play()} primeHandler={word => this.prime(word)}/>

                <Modal/>

            </div>

        );

    }

}

export default Verble;