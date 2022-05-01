export type stopwatchCurrentData = {
    lastInteractionTimestamp : number,
    runningState : boolean,
    counter : number,
    loops : number[]
}

export type stopwatchData = {
    current : stopwatchCurrentData,
    history : stopwatchCurrentData[]
}

export const defaultStopwatchData : stopwatchData = {
    current : {
        lastInteractionTimestamp : 0,
        runningState : false,
        counter : 0.0,
        loops : []
    },
    history : []
}

export type stopwatchMainKeyData = [string, stopwatchData]

export const defaultStopwatchMainKeyData = ["", defaultStopwatchData]

export type stopwatchProps = {
    uuid : string
}