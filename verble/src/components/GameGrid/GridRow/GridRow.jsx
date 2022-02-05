import React from "react";

import GridSquare from "../GridSquare/GridSquare";

import "./GridRow.css";

const zip = (a, b) => a.map((k, i) => [k, b[i]]);

function GridRow(props) {

    if (props.word) {
        let states;

        // If the word is being primed, no formatting is given
        if (props.primed) {
            states = [...props.word].map(() => "none");
        }

        // If the word is being guessed, display correct/contains/incorrect tiles
        else {
            // Flag exact matches
            states = [...props.word].map((char, index) => props.target.charAt(index) === char ? "correct" : "incorrect");
        
            // Identify unmatched characters contained in the word
            let remaining = [...props.target]
                .map((char, index) => states[index] === "incorrect" ? char : null)
                .filter(x => x ?? false);

            for (let i = 0; i < states.length; i++) {
                // Check if character is not in the correct position, but is the same as an unmatched character
                if (states[i] === "incorrect" && remaining.includes(props.word.charAt(i))) {
                    states[i] = "contains";
                    remaining.splice(i, 1);
                }
            }
        }

        let squares = zip(props.word.split(""), states).map(([letter, state]) => <GridSquare letter={letter} state={state}/>);

        return (

            <div key={props.word} className="GridRow-container">
                {squares}
            </div>
    
        );

    }

    else {

        let emptyRows = [];

        for (let i = 0; i < props.target.length; i++) {
            emptyRows.push(<GridSquare letter={null} state={"none"}/>);
        }

        return (

            <div key={props.word} className="GridRow-container">
                {emptyRows}
            </div>

        );

    }

}

export default GridRow;