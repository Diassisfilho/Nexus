import { useState } from 'react';
import './style.css'

import { stopwatchStorageHandler as storageHandler} from "../../storageHandler";
import { stopwatchProps, defaultStopwatchData } from '../../dataTypes';
import { differenceBetween, generateDigitalWatchString } from '../../utils';

function defineCounterBasedOnStates(startCounter : number, startRunningState : boolean, startTimeStamp : number) : number {
    let toReturn : number = startCounter;
    if (startRunningState) {
        let currentTimestamp = new Date().getTime();
        toReturn = ((currentTimestamp/1000) - (startTimeStamp/1000)) + startCounter;
    }

    return toReturn;
}

function definingStopwatchAttributesFromLocalstorage(uuid : string) : [number, number[], boolean, number] {
    const timeStamp = storageHandler.getTimestamp(uuid);
    const loops = storageHandler.getLoopTimes(uuid);
    const runningState = storageHandler.getRunningstate(uuid);

    const oldCounter = storageHandler.getCounter(uuid);
    const counter = defineCounterBasedOnStates(oldCounter, runningState, timeStamp);

    return [timeStamp, loops, runningState, counter]
}

function Stopwatch(props : stopwatchProps) {
    const [startTimeStamp, startLoops, startRunningState, startCounter] = definingStopwatchAttributesFromLocalstorage(props.uuid);

    // Setting react attributes states
    const [deletedUUID, setDeletedUUID] = useState<boolean>(false);

    const [timestamp, setTimestamp] = useState<number>(startTimeStamp);
    const [counter, setCounter] = useState<number>(startCounter);
    const [loopTimes, setLoopTimes] = useState<number[]>(startLoops);

    const [runningState, setRuningState] = useState<boolean>(startRunningState);

    const eventHandler = {
        startAndStopCounter() {
            let currentTimestamp = new Date().getTime();
            setTimestamp(currentTimestamp);
            storageHandler.setTimestamp(props.uuid, currentTimestamp);

            setRuningState(!runningState);
            storageHandler.setRunningstate(props.uuid, !runningState)
            storageHandler.setCounter(props.uuid, counter)
        },
        resetCounter() {
            if (!runningState) {
                storageHandler.moveCurrentAttributesToHistory(props.uuid)
                setCounter(defaultStopwatchData.current.counter);
                setLoopTimes([])
                setTimestamp(defaultStopwatchData.current.lastInteractionTimestamp);
            }
        },
        loopWithCurrentCounter() {
            setLoopTimes([...loopTimes, counter])
            storageHandler.setLoopTimes(props.uuid, [...loopTimes, counter])
        },
        executeCurrentState() {
            if (runningState) {
                setTimeout(() => {
                    setCounter(counter + 10);
                }, 10);

                setTimeout(() => {
                    if (!storageHandler.exist(props.uuid)) {
                        setRuningState(false)
                        setDeletedUUID(true)
                    }
                }, 50)

            } else {
                if (deletedUUID) {
                    let [currentTimeStamp, currentLoops, currentRunningState, currentCounter] = definingStopwatchAttributesFromLocalstorage(props.uuid);
                    currentCounter = defineCounterBasedOnStates(currentCounter, currentRunningState, currentTimeStamp)

                    setCounter(currentCounter);
                    setLoopTimes(currentLoops);
                    setDeletedUUID(false);
                    setRuningState(true);
                }

                setTimeout(() => {
                    setCounter(storageHandler.getCounter(props.uuid));
                    setLoopTimes(storageHandler.getLoopTimes(props.uuid));
                }, 50);
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
        }
    }
    
    eventHandler.executeCurrentState()

    return (
        <div>
            <div className="Stopwatch">
                <span>{generateDigitalWatchString(counter)}</span>

                <button onClick={eventHandler.startAndStopCounter}>start/stop</button>
                <button onClick={eventHandler.resetCounter}>reset</button>
                <button onClick={eventHandler.loopWithCurrentCounter}>loop</button>
                <button onClick={eventHandler.copyCurrentAttributesToClipboard}>copy to clipboard</button>

                <p>{props.uuid.split("-")[0]}</p>

                {loopTimes.map((looptime, index) => {
                    return <p>#{index + 1} | {generateDigitalWatchString(looptime)} {differenceBetween(looptime, loopTimes[index-1])}</p>
                })}
            </div>
        </div>
    );
}

export { Stopwatch }