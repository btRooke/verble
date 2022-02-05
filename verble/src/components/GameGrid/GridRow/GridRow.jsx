import GridSquare from "../GridSquare/GridSquare";

import "./GridRow.css";

const zip = (a, b) => a.map((k, i) => [k, b[i]]);

function GridRow(props) {

    let states = [];

    for (let i = 0; i < props.word.length(); i++) {

        let state;

        if (props.word[i] === props.target[i]) {
            state = "correct";
        }

        else if (props.word[i] in props.target) {
            state = "wrongPlace";

        }

        else {
            state = "incorrect";
        }

        states.push(state);

    }

    return (

        <div className="GridRow-container">
            {this.props.word.foreach(letter => <GridSquare letter={letter} state={}/>)}
        </div>

    );
}

export default GridRow;