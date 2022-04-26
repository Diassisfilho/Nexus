export type stopwatchCurrentData = {
    position : number,
    counter : number,
    loops : number[]
}

export type stopwatchData = {
    current : stopwatchCurrentData,
    history : stopwatchCurrentData[]
}

export const defaultStopwatchData : stopwatchData = {
    current : {
        position : 0,
        counter : 0,
        loops : []
    },
    history : []
}

export type stopwatchProps = {
    uuid : string
}