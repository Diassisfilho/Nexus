import { useState } from 'react';
import * as uuid from "uuid";

import { Stopwatch } from './components/Stopwatch';

import './App.css'
import { stopwatchStorageHandler } from './storageHandler';

function App() {
  const [stopwatchsUUIDs, setStopwatchsUUIDs] = useState<string[]>([]);
  const [restore, setRestore] = useState<boolean>(false);

  const stopwatchPainel = {
    createAndSetUUID () {
      let newUUID = uuid.v1()
      stopwatchStorageHandler.createStopwatchData(newUUID)
      setStopwatchsUUIDs([...stopwatchsUUIDs, newUUID])
    },
    restoreUUIDs () {
      let oldUUID = stopwatchStorageHandler.getAllUUIDs()
      setStopwatchsUUIDs([...oldUUID])
    }
  }

  if (!restore) {
    stopwatchPainel.restoreUUIDs()
    setRestore(true)
  }

  return (
    <div className="App">
      <h1>Nexus advanced stopwatch</h1>
      <div>
        <div className="StopwatchPainel">
          <button onClick={stopwatchPainel.createAndSetUUID}>create stopwatch</button>
            {stopwatchsUUIDs.map((uuid, index) => {
              return <Stopwatch key={index} uuid={uuid}/>
            })}
        </div>
      </div>
    </div>
  )
}

export default App
