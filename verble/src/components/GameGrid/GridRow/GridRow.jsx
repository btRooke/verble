import GridSquare from "../GridSquare/GridSquare";

import "./GridRow.css";

function GridRow(props) {

    return (

        <div className="GridRow-container">
            {props.row.map(element =><GridSquare value={element} /> )}
        </div>

    );
}

export default GridRow;