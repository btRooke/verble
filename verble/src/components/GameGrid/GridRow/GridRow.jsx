import React from "react";

import GridSquare from "../GridSquare/GridSquare";

import "./GridRow.css";

const zip = (a, b) => a.map((k, i) => [k, b[i]]);

function GridRow(props) {

    if (props.word) {

        let states = [];

        for (let i = 0; i < props.word.length; i++) {
    
            let state;
    
            if (props.primed) {
                state = "none";
            }

            else if (props.word[i] === props.target[i]) {
                state = "correct";
            }
    
            else if (props.target.includes(props.word[i])) {
                state = "wrongPlace";
    
            }
    
            else {
                state = "incorrect";
            }
    
            states.push(state);
    
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