import React from "react";

class AudioTest extends React.Component {

    // runs as the component is being constructed

    constructor(props) {

        super(props);

    }

    // runs once the component is in the DOM

    componentDidMount() {

    }

    someFunction() {

        alert("'ello");
        
    }

    /*
     * Best practice to use () => this.something()... rather than 
     * onClick={this.somthing()} since weird things start happening with
     * the `this` keyword otherwise.
     */

    render() {

        return (

            <div>
                <h1>Audio Test</h1>
                <button onClick={() => this.someFunction()}>Hello</button>
            </div>

        );

    }

}

export default AudioTest;