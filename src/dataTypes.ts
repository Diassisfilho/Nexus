export type stopwatchCurrentData = {
    createdTimestamp: number,
    lastInteractionTimestamp : number,

    runningState : boolean,

    name: string,
    initialCounter : number,
    counter : number,
    loops : number[]
}

export type stopwatchData = {
    current : stopwatchCurrentData,
    history : stopwatchCurrentData[]
}

export const defaultStopwatchData : stopwatchData = {
    current : {
        createdTimestamp : 0,
        lastInteractionTimestamp : 0,

        runningState : false,

        name: "Default",
        initialCounter : 0.0,
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