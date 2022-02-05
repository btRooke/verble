import React from "react";

import "./GridSquare.css";

function GridSquare(props) {    
    return <div className={`GridSquare-square GridSquare-${props.state}`}>{props.letter}</div>
}

export default GridSquare;