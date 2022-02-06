import React from "react";

import Header from "../Header/Header";
import GameGrid from "../GameGrid/GameGrid";
//import Modal from "../Modal/Modal";
import listen from "./Audio";

import "./Verble.css";

// Alphabetised Wordle data sets from https://gist.github.com/cfreshman
import solutions from "./wordle_solutions.txt";
import valid_guesses from "./wordle_guesses.txt";
import valid_answers from "./wordle_answers.txt";

const TOKEN_URL = "token";
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
            target: null,
            finished: false,
            primedWord: null,
            words: []
        }

        let today = new Date().getTime() - 18000000;
        let firstDay = new Date(2021, 5, 19, 0, 0, 0, 0).getTime();
        let index = Math.floor((today - firstDay) / 864e5);

        this.setState(() => ({
            target: fetch(solutions)
                .then(solution_res => solution_res.text())
                .then(targets => targets.split(/(?:\r?\n)+/).map(word => word.trim())[index])
        }));
    }

    componentDidMount() {
        let valid_words = new Set();

        const prime_cb = word => this.prime(word, valid_words);
        const play_cb = () => this.play();
        const finish_cb = () => this.finish();

        // Get all valid words and solutions
        fetch(valid_guesses)
        .then(guess_res => guess_res.text())
        .then(guesses => {
            fetch(valid_answers)
            .then(answer_res => answer_res.text())
            .then(answers => { 
                guesses.split(/(?:\r?\n)+/).forEach(word => valid_words.add(word.trim()));
                answers.split(/(?:\r?\n)+/).forEach(word => valid_words.add(word.trim()));
                console.log(`Loaded ${valid_words.size} words`);
        
                listen(TOKEN_URL, SAMPLE_RATE, prime_cb, play_cb, finish_cb);
            });
        });
    }

    prime(word, valid_words) {

        if (word.length === this.state.target.length && valid_words.has(word)) {
            this.setState( { primedWord: word } );
            return true;
        }
        
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

        return false;

    }

    finish() {

        // Game is finished if the words match or the number of guesses is exceeded
        if (this.state.primedWord && (this.state.primedWord === this.state.target || this.state.words.length === this.props.guesses)) {
            return true;
        }

        return false;

    }

    render() {
        if (this.state.target === null) {
            return null;
        }

        return (

            <div className="Verble-container">

                <Header />

                <div className="Verble-gridContainer">
                    <GameGrid primedWord={this.state.primedWord} words={this.state.words} target={this.state.target} guesses={this.props.guesses}/>
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