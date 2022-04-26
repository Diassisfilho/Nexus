import { useState } from 'react';
import './style.css'

import { stopwatchStorageHandler } from "../../storageHandler";
import { stopwatchProps, defaultStopwatchData } from '../../dataTypes';

function generateDigitalWatchString(counter : number) {
    var secsCounter = counter % 60
    var minsCounter = Math.floor(counter / 60).toFixed();
    var hourCounter = Math.floor(counter / 3600).toFixed();

    return `${hourCounter}:${minsCounter}:${secsCounter}`
}

function Stopwatch(props : stopwatchProps) {
    let startCounter = stopwatchStorageHandler.getCounter(props.uuid);
    let startLoops = stopwatchStorageHandler.getLoopTimes(props.uuid);

    const [counter, setCounter] = useState<number>(startCounter);
    const [runningState, setRuningState] = useState<boolean>(false);
    const [loopTimes, setLoopTimes] = useState<number[]>(startLoops);

    const stopwatchEventHandler = {
        startAndStopCounter() {
            setRuningState(!runningState);
            stopwatchStorageHandler.setCounter(props.uuid, counter)
        },
        resetCounter() {
            if (!runningState) {
                setCounter(defaultStopwatchData.current.counter);
                stopwatchStorageHandler.resetCounter(props.uuid);   
            }
        },
        loopWithCurrentCounter() {
            setLoopTimes([...loopTimes, counter])
            stopwatchStorageHandler.setLoopTimes(props.uuid, [...loopTimes, counter])
        },
        executeCurrentState() {
            if (runningState) {
                setTimeout(() => setCounter(counter + 1), 100);
            }
        }
    }
    
    stopwatchEventHandler.executeCurrentState()

    return (
        <div>
            <div className="Stopwatch">
                <span>{generateDigitalWatchString(counter)}</span>
                <button onClick={stopwatchEventHandler.startAndStopCounter}>start/stop</button>
                <button onClick={stopwatchEventHandler.resetCounter}>reset</button>
                <button onClick={stopwatchEventHandler.loopWithCurrentCounter}>loop</button>
                {loopTimes.map((looptime, index) => {
                    return <p>#{index + 1} | {generateDigitalWatchString(looptime)}</p>
                })}
            </div>
        </div>
    );
}

export { Stopwatch }