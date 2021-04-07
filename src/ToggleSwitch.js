import React from "react";
import './ToggleSwitch.css'

const ToggleSwitch = ({onClick}) => {
    return(
        <label className="switch">
            <input onClick={() => onClick()} type="checkbox" defaultChecked/>
            <span className="slider round"></span>
        </label>
    );
}

export default ToggleSwitch;