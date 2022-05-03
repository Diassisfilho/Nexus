import { useState } from 'react';
import './style.css'

import { stopwatchStorageHandler as storageHandler} from "../../storageHandler";
import { stopwatchProps, defaultStopwatchData } from '../../dataTypes';
import { differenceBetween, generateDigitalWatchString } from '../../utils';

function defineCounterBasedOnStates(startCounter : number, startRunningState : boolean, startTimeStamp : number) : number {
    let toReturn : number = startCounter;
    if (startRunningState) {
        let currentTimestamp = new Date().getTime();
        toReturn = (currentTimestamp - startTimeStamp) + startCounter;
    }
    return toReturn;
}

function definingStopwatchAttributesFromLocalstorage(uuid : string) : [number, number[], boolean, number] {
    const lastInteractionTimeStamp = storageHandler.getLastInteractionTimestamp(uuid);
    const loops = storageHandler.getLoopTimes(uuid);
    const runningState = storageHandler.getRunningstate(uuid);

    const oldCounter = storageHandler.getOverAllCounter(uuid);
    const counter = defineCounterBasedOnStates(oldCounter, runningState, lastInteractionTimeStamp);

    return [lastInteractionTimeStamp, loops, runningState, counter]
}

function Stopwatch(props : stopwatchProps) {
    const [startLastInteractionTimeStamp, startLoops, startRunningState, startCounter] = definingStopwatchAttributesFromLocalstorage(props.uuid);

    // Setting react attributes states
    const [deletedUUID, setDeletedUUID] = useState<boolean>(false);

    const [lastInteractionTimestamp, setLastInteractionTimestamp] = useState<number>(startLastInteractionTimeStamp);
    const [overAllCounter, setOverAllCounter] = useState<number>(startCounter);
    const [counter, setCounter] = useState<number>(startCounter);
    const [loopTimes, setLoopTimes] = useState<number[]>(startLoops);

    const [runningState, setRuningState] = useState<boolean>(startRunningState);

    const eventHandler = {
        startAndStopCounter() {
            let currentTimestamp = new Date().getTime();
            setLastInteractionTimestamp(currentTimestamp);
            storageHandler.setLastInteractionTimestamp(props.uuid, currentTimestamp);

            setRuningState(!runningState);
            storageHandler.setRunningstate(props.uuid, !runningState)

            setCounter((!runningState)? counter + this.time.getTimeElapsedSinceLastInteraction(): overAllCounter)
            storageHandler.setOverAllCounter(props.uuid, overAllCounter)
        },
        resetCounter() {
            if (!runningState) {
                storageHandler.moveCurrentAttributesToHistory(props.uuid)
                setOverAllCounter(defaultStopwatchData.current.initialCounter);
                setCounter(defaultStopwatchData.current.initialCounter);
                setLoopTimes([]);
                setLastInteractionTimestamp(defaultStopwatchData.current.lastInteractionTimestamp);
            }
        },
        loopWithCurrentCounter() {
            setLoopTimes([...loopTimes, overAllCounter])
            storageHandler.setLoopTimes(props.uuid, [...loopTimes, overAllCounter])
        },
        executeCurrentState() {
            if (runningState) {
                setTimeout(() => {
                    setOverAllCounter(this.time.getTime());
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
                    currentCounter = this.time.getTime();

                    setOverAllCounter(currentCounter);
                    setLoopTimes(currentLoops);
                    setDeletedUUID(false);
                    setRuningState(true);
                }

                setTimeout(() => {
                    setOverAllCounter(storageHandler.getOverAllCounter(props.uuid));
                    setLoopTimes(storageHandler.getLoopTimes(props.uuid));
                }, 50);
            }
        },
        copyCurrentAttributesToClipboard() {
            let digitalStopwatchPassed = generateDigitalWatchString(overAllCounter);
            let formatedDigitalStopwatchLoops = loopTimes.map((looptime, index) => {
                return `${(index==0) ? "" : ", "}#${index+1} - ${generateDigitalWatchString(looptime)}`
            })

            navigator.clipboard.writeText(
                `Was passed ${digitalStopwatchPassed} and marked loops: ${formatedDigitalStopwatchLoops.join("")}.`
            )
        },
        time : {
            getTimeElapsedSinceLastInteraction() {
                return lastInteractionTimestamp - storageHandler.getInitialCounter(props.uuid);
            },
            getTime() {
                let currentTimestamp = new Date().getTime();
                let timeElapsedSinceLastInteraction = this.getTimeElapsedSinceLastInteraction();
                return (currentTimestamp - timeElapsedSinceLastInteraction) + counter
            }
        }
    }
    
    eventHandler.executeCurrentState()

    return (
        <div>
            <div className="Stopwatch">
                <span>{generateDigitalWatchString(overAllCounter)}</span>

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