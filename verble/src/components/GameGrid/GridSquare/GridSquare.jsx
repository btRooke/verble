import "./GridSquare.css";

function GridSquare(props) {
    return <div className="GridSquare-square">{props.value}</div>
}

export default GridSquare;