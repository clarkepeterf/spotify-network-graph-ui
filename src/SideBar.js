import SearchBar from './SearchBar';
import './SideBar.css'

const SideBar = ({ artistInFocus, toggleClickCallback, searchCallback, searchSuggestionCallback, searchPlaceholderText }) => {
    return (
        <div>
            <div className="side-bar">
                <h3 className="side-bar-title">Spotify Network Graph</h3>
                <div>Initial Graph Size:</div>
                <div onChange={() => toggleClickCallback()}>
                    <input id="small-button" className="radioButton" type="radio" value="small" name="graphSize" /> <label htmlFor="small-button"> Immediate Connections </label>
                    <div />
                    <input id="large-button" className="radioButton" type="radio" value="large" name="graphSize" defaultChecked /> <label htmlFor="large-button"> Secondary Connections </label>
                </div>
                <SearchBar searchCallback={searchCallback} suggestionCallback={searchSuggestionCallback} placeholderText={searchPlaceholderText}></SearchBar>
                <div className="howToUse">
                    <div> • Single-click an artist to view top tracks</div>
                    <div> • Double-click an artist to expand the graph from that artist</div>
                </div>
                {artistInFocus && <h4 className="artistName">{artistInFocus.name}</h4>}
                {artistInFocus && <iframe className="spotifyEmbed" title="spotifyEmbed" src={`https://open.spotify.com/embed/artist/${artistInFocus.id}`} width="250" height="400" frameBorder="0" allowtransparency="true" allow="encrypted-media"></iframe>}
            </div>
        </div>
    );
}

export default SideBar;
