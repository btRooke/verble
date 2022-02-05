import "./GridSquare.css";

const stateClasses = {
    correct: "GridSquare-correct",
    incorrect: "GridSquare-incorrect",
    wrongPlace: "GridSquare-wrongPlace",
    none: ""
}


function GridSquare(props) {    
    return <div className={`GridSquare-square ${stateClasses[props.state]}`}>{props.letter}</div>
}

export default GridSquare;