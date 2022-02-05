import GridSquare from "../GridSquare/GridSquare";

import "./GridRow.css";

const zip = (a, b) => a.map((k, i) => [k, b[i]]);

function GridRow(props) {

    if (props.word) {

        let states = [];

        for (let i = 0; i < props.word.length; i++) {
    
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
                {zip(props.word, states).foreach((letter, state) => <GridSquare letter={letter} state={state}/>)}
            </div>
    
        );

    }

    else {

        let emptyRows = [];

        for (let i = 0; i < props.target.length; i++) {
            emptyRows.push(<GridSquare letter={null} state={"none"}/>);
        }

        return (

            <div className="GridRow-container">
                {emptyRows}
            </div>

        );

    }

}

export default GridRow;