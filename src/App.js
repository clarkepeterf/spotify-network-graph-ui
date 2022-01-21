import React from "react";
import "./App.css"
import { library } from '@fortawesome/fontawesome-svg-core'
import { faSearch, faPlus, faMinus, faTimes, faBars, faUndo, faChevronUp, faChevronDown, faInfo, faTimesCircle, faCompressAlt, faCircle, faMousePointer } from '@fortawesome/free-solid-svg-icons'
import PeterGraph from "./PeterGraph";

library.add(faSearch, faPlus, faMinus, faTimes, faBars, faUndo, faChevronUp, faChevronDown, faInfo, faTimesCircle, faCompressAlt, faCircle, faMousePointer);

const App = () => {

  return (
    <div className="app">
      <div className="graph">
        <PeterGraph />
      </div>
    </div>
  );
}

export default App;
