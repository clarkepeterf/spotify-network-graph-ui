import React, {useState} from "react";
import SearchBar from './SearchBar';
import './SideBar.css'

const SideBar = ({artistInFocus, toggleClickCallback, searchCallback, sideBarHidden, setSideBarHidden}) => {
    return(
        <div>
            {sideBarHidden &&
            <div className="side-bar">
                <div className="hamburger" onClick={() => setSideBarHidden(!sideBarHidden)}>☰</div>
            </div>}
            {!sideBarHidden &&
            <div className="side-bar">
                <div className="hamburger" onClick={() => setSideBarHidden(!sideBarHidden)}>☰</div>
                <h2 className="side-bar-title">Spotify Network Graph</h2>
                <div>Initial Graph Size:</div>
                {/* <span>small</span><ToggleSwitch onClick={() => toggleClickCallback()}></ToggleSwitch><span>large</span> */}
                <div onChange={() => toggleClickCallback()}>
                    <input className="radioButton" type="radio" value="small" name="graphSize" defaultChecked/> Immediate Connections
                    <div/>
                    <input className="radioButton" type="radio" value="large" name="graphSize"/> Secondary Connections
                </div>
                <SearchBar searchCallback={searchCallback}></SearchBar>
                {artistInFocus && <h3 className="artistName">{artistInFocus.name}</h3>}
                {artistInFocus && <iframe className="spotifyEmbed" title="spotifyEmbed" src={`https://open.spotify.com/embed/artist/${artistInFocus.id}`} width="300" height="400" frameborder="0" allowtransparency="true" allow="encrypted-media"></iframe>}
                <div>How to Use This Page:</div>
                <div> - Choose whether you want to initially generate a small graph (immediate connections) or large graph (secondary connections)</div>
                <div> - Search for an artist in the seach box</div>
                <div> - Explore the graph:</div>
                <div className="tabbed">   - Click an artist to highlight connections to that artist</div>
                <div className="tabbed">   - Double click an artist to expand the graph to include related artists</div>
                <div className="tabbed">   - Drag artists around to reorganize the graph and play around with the physics</div>
                <div> - Listen and explore more with Spotify</div>
                <div className="tabbed">   - There is an embedded Spotify media player above. You can listen to artists' top songs or click the embedded title bar to view the artist profile on Spotify</div>
            </div>}
        </div>
    );
}

export default SideBar;