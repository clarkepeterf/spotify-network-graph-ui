import React from "react";
import "./App.css"
import { library } from '@fortawesome/fontawesome-svg-core'
import { faSearch, faPlus, faMinus, faTimes, faBars, faUndo, faChevronUp, faChevronDown, faInfo, faTimesCircle, faCompressAlt, faCircle, faMousePointer } from '@fortawesome/free-solid-svg-icons'
import Graph from "./Graph";

library.add(faSearch, faPlus, faMinus, faTimes, faBars, faUndo, faChevronUp, faChevronDown, faInfo, faTimesCircle, faCompressAlt, faCircle, faMousePointer);

export default function App() {

  return (
    <div className="app">
      <div className="graph">
        <Graph />
      </div>
    </div>
  );
}
