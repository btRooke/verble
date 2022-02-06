import React from "react";

import Header from "../Header/Header";
import GameGrid from "../GameGrid/GameGrid";
//import Modal from "../Modal/Modal";
import listen from "./Audio";

import "./Verble.css";

// Alphabetised Wordle data sets from https://gist.github.com/cfreshman
import valid_guesses from "./wordle_guesses.txt";
import valid_answers from "./wordle_answers.txt";

const TOKEN_URL = "https://melbourneplace.net/verble";
const SAMPLE_RATE = 16000;

/*function TestBox(props) {

    return (

        <div>
            <input type="text" id="word"/>
            <button onClick={() => props.primeHandler(document.querySelector("#word").value)}>prime</button>
            <button onClick={() => props.playHandler()}>play</button>
        </div>

    );

}*/

class Verble extends React.Component {

    constructor(props) {

        super(props);

        this.state = {
            finished: false,
            primedWord: null,
            words: []
        }
    }

    componentDidMount() {
        let valid_words = new Set();

        // Get all valid words
        fetch(valid_guesses)
        .then(guess_res => guess_res.text())
        .then(guesses => {
            fetch(valid_answers)
            .then(answer_res => answer_res.text())
            .then(answers => {

                guesses.split(/(?:\r?\n)+/).forEach(word => valid_words.add(word.trim()));
                answers.split(/(?:\r?\n)+/).forEach(word => valid_words.add(word.trim()));
                console.log(`Loaded ${valid_words.size} words`);
        
                listen(TOKEN_URL, SAMPLE_RATE, word => this.prime(word, valid_words), () => this.play(), () => this.finish());
            });
        });
    }

    prime(word, valid_guesses) {

        if (word.length === this.props.target.length && valid_guesses.has(word)) {
            this.setState( { primedWord: word } );
            return true;
        }
        
        alert("Invalid guess");
        return false;

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

        alert("No word primed");
        return false;

    }

    finish() {

        // Game is finished if the words match or the number of guesses is exceeded
        if (this.state.primedWord && (this.state.primedWord === this.state.target || this.state.words.length === this.props.guesses)) {
            alert("Done");
            return true;
        }

        return false;

    }

    render() {

        return (

            <div className="Verble-container">

                <Header />

                <div className="Verble-gridContainer">
                    <GameGrid primedWord={this.state.primedWord} words={this.state.words} target={this.props.target} guesses={this.props.guesses}/>
                </div>

                {/* 
                <TestBox playHandler={() => this.play()} primeHandler={word => this.prime(word)}/>

                <Modal>
                    <div style={{height: "100px", width: "100px"}}>test</div>
                </Modal> 
                */}

            </div>

        );

    }

}

export default Verble;