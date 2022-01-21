import "./Menu.css"
import { useState } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
export default function Menu({ storeSetOpenCallBack, setNumberOfStepsCallback }) {
    const [numberOfSteps, setNumberOfSteps] = useState(2)
    const [isOpen, setIsOpen] = useState(false)
    storeSetOpenCallBack(setIsOpen)
    const maxInitialConnections = 2;
    function decrease() {
        if (numberOfSteps > 1) {
            setNumberOfSteps(numberOfSteps - 1)
        }
    }

    function increase() {
        if (numberOfSteps < maxInitialConnections) {
            setNumberOfSteps(numberOfSteps + 1)
        }
    }
    setNumberOfStepsCallback(numberOfSteps)
    return (
        <div
            className="menu"
            style={{
                width: isOpen ? "400px" : "0px",
                visibility: isOpen ? "visible" : "hidden",
                transition: "width 0.15s, visibility 0.15s",
            }}
        >
            <section id="settings-section">
                <FontAwesomeIcon className="close-icon" onClick={() => { setIsOpen(false) }} icon={["fas", "times"]} size="lg" />
                <h2>Settings</h2>
                <h4>Number of Steps From Initial Artist:</h4>
                <div>
                    <button
                        className="minus-button"
                        onClick={() => { decrease() }}
                    >
                        <FontAwesomeIcon icon={["fas", "minus"]} size="sm" />
                    </button>
                    {numberOfSteps}
                    <button
                        className="plus-button"
                        onClick={() => { increase() }}
                    >
                        <FontAwesomeIcon icon={["fas", "plus"]} size="sm" />
                    </button>
                </div>
            </section>
            <section id="about-section">
                <h2>About</h2>
                <p>Audiograph lets you explore Spotify's related artists as a visual network.</p>
                <p>Check out how artists cluster, find new connections, and listen to top songs!</p>
            </section>
            <section id="controls-section">
                <h2>Controls</h2>
                <div className="controls-grid">
                    <button className="example-button" title="Example Add Artist"><FontAwesomeIcon icon={["fas", "plus"]} size="lg" /></button>
                    <p>Add an artist to the graph</p>

                    <button className="example-button" title="Example Search Graph"><FontAwesomeIcon icon={["fas", "search"]} size="lg" /></button>
                    <p>Search artists within the graph</p>

                    <button className="example-button" title="Example Fit Graph" ><FontAwesomeIcon icon={["fas", "compress-alt"]} size="lg" /></button>
                    <p>Fit the graph to the screen</p>

                    <button className="example-button" title="Example Clear Graph"><FontAwesomeIcon icon={["fas", "times"]} size="lg" /></button>
                    <p>Clear the graph</p>

                    <span className="example-span fa-layers fa-fw">
                        <FontAwesomeIcon icon={["fas", "circle"]} size="lg" style={{ color: "#7299fc" }} />
                        <FontAwesomeIcon icon={["fas", "mouse-pointer"]} size='sm' style={{ marginLeft: "8px" }} />
                    </span>
                    <p>Single clicking a node selects an artist to see connections and top songs</p>

                    <span className="example-span fa-layers fa-fw">
                        <FontAwesomeIcon icon={["fas", "circle"]} size="lg" style={{ color: "#7299fc" }} />
                        <FontAwesomeIcon icon={["fas", "mouse-pointer"]} size='sm' />
                        <FontAwesomeIcon icon={["fas", "mouse-pointer"]} size='sm' style={{ marginLeft: "10px" }} />
                    </span>
                    <p>Double clicking a node adds related artists, if they are not already added to the graph</p>
                </div>
            </section>
        </div>
    )
}