import React from "react";

import Header from "../Header/Header";
import GameGrid from "../GameGrid/GameGrid";
import Modal from "../Modal/Modal";
import listen, { setalertHandler }from "./Audio";

import "./Verble.css";

// Alphabetised Wordle data sets from https://gist.github.com/cfreshman
import solutions from "./wordle_solutions.txt";
import valid_guesses from "./wordle_guesses.txt";
import valid_answers from "./wordle_answers.txt";

const TOKEN_URL = "https://verble.herokuapp.com/token";
const SAMPLE_RATE = 16000;

function Indicator(props) {

    if (props.succ) {
        setTimeout(
            () => props.resetCb(),
            400
        );
    }

    if (props.error) {
        setTimeout(
            () => props.resetCb(),
            400
        );
    }

    return (

        <div className={`Verble-micContainer ${props.succ ? "Verble-succ" : ""} ${props.error ? "Verble-error" : ""}`}>
            <span class="material-icons Verble-mic">mic</span>
        </div>
        
    );
    
}

class Verble extends React.Component {

    constructor(props) {

        super(props);

        this.state = {
            succ: false,
            target: null,
            finished: false,
            primedWord: null,
            words: [],
            modalMessage: null,
            vocalError: false
        }

    }

    vocalError() {
        this.setState({vocalError: true});
    }

    componentDidMount() {
        let valid_words = new Set();

        const prime_cb = word => this.prime(word, valid_words);
        const play_cb = () => this.play();
        const finish_cb = () => this.finish(); 
        const err_cb = () => this.vocalError();

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
        
                listen(TOKEN_URL, SAMPLE_RATE, prime_cb, play_cb, finish_cb, err_cb);
            });
        });

        setalertHandler(msg => this.setState({modalMessage: msg}));

        let today = new Date().getTime() - 18000000;
        let firstDay = new Date(2021, 5, 19, 0, 0, 0, 0).getTime();
        let index = Math.floor((today - firstDay) / 864e5);

        fetch(solutions)
        .then(solution_res => solution_res.text())
        .then(targets => this.setState({target: targets.split(/(?:\r?\n)+/).map(word => word.trim())[index]}));
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
        if (this.state.words.length > 0 && this.state.words[this.state.words.length - 1] === this.state.target) {
            this.setState({ modalMessage: `The game is over. You guessed the word in ${this.state.words.length} guesses!`});
            return true;
        }

        else if (this.state.words.length === this.props.guesses) {
            this.setState({ modalMessage: `The game is over. You didn't guess the word - it was ${this.state.target}.`});
            return true;
        }

        return false;

    }

    renderModal() {

        if (this.state.modalMessage) {

            return (

                <Modal emptyHandler={() => this.setState({modalMessage: null})}>
                    <div>{this.state.modalMessage}</div>
                </Modal> 

            );

        }

    }

    renderGrid() {

        if (this.state.target) {
            return <GameGrid primedWord={this.state.primedWord} words={this.state.words} target={this.state.target} guesses={this.props.guesses}/>;
        }

        else {
            return <div><span>hourglass_bottom</span></div>
        }
        
    }

    render() {
        if (this.state.target === null) {
            return null;
        }

        return (

            <div className="Verble-container">

                <Header />

                <div className="Verble-gridContainer">
                    {this.renderGrid()}
                    <Indicator error={this.state.vocalError} resetCb={() => this.setState({succ: false, vocalError: false})}/>
                </div>

                
                {/* <TestBox playHandler={() => this.play()} primeHandler={word => this.prime(word)}/> */}

                {this.renderModal()}               

            </div>

        );

    }

}

export default Verble;