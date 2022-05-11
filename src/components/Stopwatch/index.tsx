import { useEffect, useState } from 'react';
import './style.css'

import { stopwatchStorageHandler as storageHandler} from "../../storageHandler";
import { stopwatchProps, defaultStopwatchData } from '../../dataTypes';
import { differenceBetween, generateDigitalWatchString } from '../../utils';

function stopwatchAttributesFromStorage(uuid : string) : [number, number[], boolean, number] {
    const runningState = storageHandler.getRunningstate(uuid);
    const loops = storageHandler.getLoopTimes(uuid);
    const lastInteractionTimeStamp = storageHandler.getLastInteractionTimestamp(uuid);
    const totalTime = storageHandler.getTotalTime(uuid);

    return [lastInteractionTimeStamp, loops, runningState, totalTime]
}

function Stopwatch(props : stopwatchProps) {
    const [startLastInteractionTimeStamp, startLoops, startRunningState, startTotalTime] = stopwatchAttributesFromStorage(props.uuid);

    // Setting stopwatch attributes states
    const [lastInteractionTimestamp, setLastInteractionTimestamp] = useState<number>(startLastInteractionTimeStamp);
    const [totalTime, setTotalTime] = useState<number>(startTotalTime);
    const [runningState, setRuningState] = useState<boolean>(startRunningState);
    const [loopTimes, setLoopTimes] = useState<number[]>(startLoops);

    const time = {
        getTimeElapsedSinceLastInteraction() {
            return Date.now() - lastInteractionTimestamp;
        },
        getTime() {
            if (!lastInteractionTimestamp) {
                return 0;
            }

            if (runningState) {
                return totalTime + this.getTimeElapsedSinceLastInteraction();
            }
            
            return totalTime;
        }
    }

    // Setting stopwatch utilities
    const [temporaryCounter, setTemporaryCounter] = useState<number>(0);
    const [restoredSession, setRestoredSession] = useState<boolean>(false);

    const eventHandler = {
        startAndStopCounter() {
            if (runningState) {
                setTotalTime(time.getTime());
                storageHandler.setTotalTime(props.uuid, time.getTime());
            }
            if (!runningState) {
                setLastInteractionTimestamp(Date.now());
                storageHandler.setLastInteractionTimestamp(props.uuid, Date.now());
            }

            setRuningState(!runningState);
            storageHandler.setRunningstate(props.uuid, !runningState);
        },

        resetCurrentData() {
            if (!runningState) {
                storageHandler.moveCurrentAttributesToHistory(props.uuid)

                setLastInteractionTimestamp(defaultStopwatchData.current.lastInteractionTimestamp);
                setTotalTime(defaultStopwatchData.current.totalTime);
                setRuningState(defaultStopwatchData.current.runningState);
                setLoopTimes([]);

                setTemporaryCounter(defaultStopwatchData.current.totalTime);
            }
        },

        loopWithCurrentCounter() {
            setLoopTimes([...loopTimes, temporaryCounter])
            storageHandler.setLoopTimes(props.uuid, [...loopTimes, temporaryCounter])
        },

        syncAttributesAndStorage() {
            let [newLastInteractionTimestamp, newLoops, newRunningState, newTotalTime] = stopwatchAttributesFromStorage(props.uuid);

            setLastInteractionTimestamp(newLastInteractionTimestamp);
            setLoopTimes(newLoops);
            setRuningState(newRunningState);
            setTotalTime(newTotalTime);
            setTemporaryCounter(time.getTime());
        },

        copyCurrentAttributesToClipboard() {
            let digitalStopwatchPassed = generateDigitalWatchString(temporaryCounter);
            let formatedDigitalStopwatchLoops = loopTimes.map((looptime, index) => {
                let commaOrNot = (index === 0) ? "" : ",";
                let loopNumber = index+1;
                let digitalString = generateDigitalWatchString(looptime);

                return `${commaOrNot} #${loopNumber} - ${digitalString}`
            })

            navigator.clipboard.writeText(
                `Was passed ${digitalStopwatchPassed} and marked loops: ${formatedDigitalStopwatchLoops.join("")}.`
            )
        },
    }

    useEffect(() => {
        if (runningState) {
            setTimeout(() => {
                setTemporaryCounter(time.getTime());
            }, 10);
        }
    })

    useEffect(() => {
        if (!runningState) {
            if (!restoredSession) {
                setTemporaryCounter(totalTime);
                setRestoredSession(true);
            }

            setTimeout(() => {
                if (storageHandler.getTotalTime(props.uuid) !== totalTime) {
                    eventHandler.syncAttributesAndStorage();
                }
            }, 10)
        }
    }, [props.uuid])

    return (
        <div>
            <div className="Stopwatch">
                <span>{generateDigitalWatchString(temporaryCounter)}</span>

                <button onClick={eventHandler.startAndStopCounter}>start/stop</button>
                <button onClick={eventHandler.resetCurrentData}>reset</button>
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