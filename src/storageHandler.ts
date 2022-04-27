import {
    stopwatchData,
    defaultStopwatchData,
    stopwatchMainKeyData,
    defaultStopwatchMainKeyData 
} from "./dataTypes";

const stopwatchMainKeyString = "stopwatchData";

const stopwatchStorageHandler = {
    initialize () {
        if (localStorage.getItem(stopwatchMainKeyString) === null) {
            localStorage.setItem(
                stopwatchMainKeyString,
                JSON.stringify([])
            )
        }
    },

    // Basic methods to set, get and delete stopwatch content
    set (key : string, value : stopwatchData) {
        this.initialize()

        let lastValues = localStorage.getItem(stopwatchMainKeyString)
        lastValues = lastValues !== null? lastValues : ""

        const stopwatchKeyValue : stopwatchMainKeyData[] = JSON.parse(lastValues)

        let indexToChange = stopwatchKeyValue.findIndex((value, index) => {
            return value[0] === key
        })

        if (indexToChange !== -1) {
            // Replacing old values
            stopwatchKeyValue[indexToChange] = [key, value]
        } else {
            // Creating new values
            stopwatchKeyValue.push([key, value])
        }

        localStorage.setItem(stopwatchMainKeyString, JSON.stringify(stopwatchKeyValue))
    },

    get (key : string) : stopwatchData {
        this.initialize()

        let stopwatchMainData : stopwatchMainKeyData[];
        let stopwatchMainKeyData : stopwatchData = defaultStopwatchData;
        let stopwatchStringData = localStorage.getItem(stopwatchMainKeyString);

        if (stopwatchStringData !== null) {
            stopwatchMainData = JSON.parse(stopwatchStringData)
            stopwatchMainData.forEach((stopwatch) => {
                if (stopwatch[0] === key) {
                    stopwatchMainKeyData = stopwatch[1]
                }
            })
        } else {
            console.log("Null key found")
        }

        return stopwatchMainKeyData
    },

    delete (key : string) {
        this.initialize()

        let lastValues = localStorage.getItem(stopwatchMainKeyString)
        lastValues = lastValues !== null? lastValues : ""

        let stopwatchKeyValue : stopwatchMainKeyData[] = JSON.parse(lastValues)
        stopwatchKeyValue = stopwatchKeyValue.filter((value) => {
            return value[0] !== key
        })

        localStorage.setItem(stopwatchMainKeyString, JSON.stringify(stopwatchKeyValue))
    },

    // Manipulate Stopwatch
    createStopwatchData (key : string) {
        this.set(key, defaultStopwatchData)
    },

    deleteStopwatchesData (key : string) {
        this.delete(key);
    },

    // Manipulate UUIDs
    getAllUUIDs () : string[] {
        this.initialize()

        let stopwatchMainKeyValueString = localStorage.getItem(stopwatchMainKeyString)
        stopwatchMainKeyValueString = stopwatchMainKeyValueString !== null? stopwatchMainKeyValueString : ""

        let stopwatchMainKeyValue : stopwatchMainKeyData[] = JSON.parse(stopwatchMainKeyValueString);

        let allStorage : string[] = [];
        stopwatchMainKeyValue.forEach((value) => allStorage.push(value[0]) )

        return allStorage
    },

    // Manipulate Stopwatch Attributes
    // Counter
    setCounter (key : string, newCounter : number) {
        let stopwatchData : stopwatchData = this.get(key);
        stopwatchData.current.counter = newCounter;
        this.set(key, stopwatchData);
    },

    getCounter (key : string) {
        let stopwatchData : stopwatchData = this.get(key);
        return stopwatchData.current.counter;
    },

    resetCounter (key : string) {
        let stopwatchData : stopwatchData = this.get(key);
        stopwatchData.current.counter = defaultStopwatchData.current.counter;
        this.set(key, stopwatchData);
    },

    // Loop Times
    setLoopTimes (key : string, newLoopTimes : number[]) {
        let stopwatchData : stopwatchData = this.get(key);
        stopwatchData.current.loops = newLoopTimes;
        this.set(key, stopwatchData);
    },

    getLoopTimes (key : string) {
        let stopwatchData : stopwatchData = this.get(key)
        return stopwatchData.current.loops
    },

    // Move running state to history
    moveCurrentAttributesToHistory (key : string) {
        let stopwatchData : stopwatchData = this.get(key)
        stopwatchData.history.push(stopwatchData.current);
        stopwatchData.current = defaultStopwatchData.current;
        this.set(key, stopwatchData);
    },
}

export { stopwatchStorageHandler }