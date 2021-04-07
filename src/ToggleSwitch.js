import React from "react";
import './ToggleSwitch.css'

const ToggleSwitch = ({onClick}) => {
    return(
        <label class="switch">
            <input onClick={() => onClick()} type="checkbox"/>
            <span class="slider round"></span>
        </label>
    );
}

export default ToggleSwitch;