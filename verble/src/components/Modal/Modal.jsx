import React from "react";

import "./Modal.css";

class Modal extends React.Component {

    render() {

        return (

            <div id="modal" className="Modal-outer">

                <div className="Modal-inner">

                    <div className="Modal-closeContainer Modal-gridCentre">
                        <div onClick={() => this.hide()} className="Modal-closeButton">X</div>
                    </div>

                    <div className="Modal-inner-inner">
                        {this.props.children}
                    </div>

                </div>

            </div>

        );

    }

}

export default Modal;