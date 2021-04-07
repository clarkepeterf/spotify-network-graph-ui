import React from "react";
import SearchBar from './SearchBar';
import ToggleSwitch from './ToggleSwitch';
import './SideBar.css'
import ArtistDetails from "./ArtistDetails";

const SideBar = ({artistInFocus, toggleClickCallback, searchCallback}) => {
    return(
        <div className="side-bar">
            <h2 className="header">Spotify Network Graph</h2>
            <div>Graph Size:</div>
            <span>small</span><ToggleSwitch onClick={() => toggleClickCallback()}></ToggleSwitch><span>large</span>
            <SearchBar searchCallback={searchCallback}></SearchBar>
            <ArtistDetails artist={artistInFocus}/>
        </div>
    );
}

export default SideBar;