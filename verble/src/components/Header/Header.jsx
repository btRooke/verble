import React from "react";

import "./Header.css";

function show(message) {

    const thing = document.querySelector("#thing");
    thing.innerHTML = message;
    thing.setAttribute("class", "Header-textThing active");

    setTimeout(
        () => thing.setAttribute("class", "Header-textThing"),
        3000 
    );

}

function Header() {

    return (

        <div className="Header-container">

            <div className="Header-title">Verble</div>
            <div className="Header-divider"/>
            <div id="thing" className="Header-textThing">perhaps spear</div>

        </div>

    );

}

export default Header;