export type stopwatchCurrentData = {
    createdTimestamp: number,
    runningState : boolean,

    name: string,
    loops : number[],
    totalTime : number,
    lastInteractionTimestamp : number
}

export type stopwatchData = {
    current : stopwatchCurrentData,
    history : stopwatchCurrentData[]
}

export const defaultStopwatchData : stopwatchData = {
    current : {
        createdTimestamp : 0,
        runningState : false,

        name: "Default",
        loops : [],
        totalTime : 0,
        lastInteractionTimestamp : 0,
    },
    history : []
}

export type stopwatchMainKeyData = [string, stopwatchData]

export const defaultStopwatchMainKeyData = ["", defaultStopwatchData]

export type stopwatchProps = {
    uuid : string
}