import { useState } from 'react';
import './style.css'

import { stopwatchStorageHandler } from "../../storageHandler";
import { stopwatchProps, defaultStopwatchData } from '../../dataTypes';
import { differenceBetween, generateDigitalWatchString } from '../../utils';

function Stopwatch(props : stopwatchProps) {
    let startCounter = stopwatchStorageHandler.getCounter(props.uuid);
    let startLoops = stopwatchStorageHandler.getLoopTimes(props.uuid);

    const [counter, setCounter] = useState<number>(startCounter);
    const [loopTimes, setLoopTimes] = useState<number[]>(startLoops);

    const [runningState, setRuningState] = useState<boolean>(false);

    const stopwatchEventHandler = {
        startAndStopCounter() {
            setRuningState(!runningState);
            stopwatchStorageHandler.setCounter(props.uuid, counter)
        },
        resetCounter() {
            if (!runningState) {
                stopwatchStorageHandler.moveCurrentAttributesToHistory(props.uuid)
                setCounter(defaultStopwatchData.current.counter);
                setLoopTimes([])
            }
        },
        copyCurrentAttributesToClipboard() {
            let digitalStopwatchPassed = generateDigitalWatchString(counter);
            let formatedDigitalStopwatchLoops = loopTimes.map((looptime, index) => {
                return `${(index==0) ? "" : ", "}#${index+1} - ${generateDigitalWatchString(looptime)}`
            })

            navigator.clipboard.writeText(
                `Was passed ${digitalStopwatchPassed} and marked loops: ${formatedDigitalStopwatchLoops.join("")}.`
            )
        },
        loopWithCurrentCounter() {
            setLoopTimes([...loopTimes, counter])
            stopwatchStorageHandler.setLoopTimes(props.uuid, [...loopTimes, counter])
        },
        executeCurrentState() {
            if (runningState) {
                setTimeout(() => setCounter(counter + 0.01), 10);
            } else {
                setTimeout(() => {
                    setCounter(stopwatchStorageHandler.getCounter(props.uuid));
                    setLoopTimes(stopwatchStorageHandler.getLoopTimes(props.uuid));
                }, 50);
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
                <button onClick={stopwatchEventHandler.copyCurrentAttributesToClipboard}>copy to clipboard</button>

                <p>{props.uuid.split("-")[0]}</p>

                {loopTimes.map((looptime, index) => {
                    return <p>#{index + 1} | {generateDigitalWatchString(looptime)} {differenceBetween(looptime, loopTimes[index-1])}</p>
                })}
            </div>
        </div>
    );
}

export { Stopwatch }