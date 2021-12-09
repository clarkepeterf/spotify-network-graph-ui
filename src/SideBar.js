import SearchBar from './SearchBar';
import './SideBar.css'

const SideBar = ({ artistInFocus, toggleClickCallback, searchCallback, searchSuggestionCallback, searchPlaceholderText }) => {
    return (
        <div>
            <div className="side-bar">
                <h2 className="side-bar-title">Spotify Network Graph</h2>
                <div>Initial Graph Size:</div>
                <div onChange={() => toggleClickCallback()}>
                    <input className="radioButton" type="radio" value="small" name="graphSize" defaultChecked /> Immediate Connections
                    <div />
                    <input className="radioButton" type="radio" value="large" name="graphSize" /> Secondary Connections
                </div>
                <SearchBar searchCallback={searchCallback} suggestionCallback={searchSuggestionCallback} placeholderText={searchPlaceholderText}></SearchBar>
                <div className="howToUse">
                    <div> • Single-click an artist to view top tracks</div>
                    <div> • Double-click an artist to expand the graph from that artist</div>
                </div>
                {artistInFocus && <h3 className="artistName">{artistInFocus.name}</h3>}
                {artistInFocus && <iframe className="spotifyEmbed" title="spotifyEmbed" src={`https://open.spotify.com/embed/artist/${artistInFocus.id}`} width="300" height="400" frameBorder="0" allowtransparency="true" allow="encrypted-media"></iframe>}
            </div>
        </div>
    );
}

export default SideBar;
