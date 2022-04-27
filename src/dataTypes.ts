export type stopwatchCurrentData = {
    counter : number,
    loops : number[]
}

export type stopwatchData = {
    current : stopwatchCurrentData,
    history : stopwatchCurrentData[]
}

export const defaultStopwatchData : stopwatchData = {
    current : {
        counter : 0,
        loops : []
    },
    history : []
}

export type stopwatchMainKeyData = [string, stopwatchData]

export const defaultStopwatchMainKeyData = ["", defaultStopwatchData]

export type stopwatchProps = {
    uuid : string
}