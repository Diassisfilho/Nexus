import {
    stopwatchData,
    defaultStopwatchData,
    stopwatchMainKeyData,
    stopwatchCurrentData,
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

    // Basic methods to set, get, exist and delete stopwatch content
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

    get (key : string) : [stopwatchData, boolean] {
        this.initialize()

        let stopwatchMainData : stopwatchMainKeyData[];
        let stopwatchMainKeyData : stopwatchData = defaultStopwatchData;
        let stopwatchStringData = localStorage.getItem(stopwatchMainKeyString);
        let stopwatchExist = false;

        if (stopwatchStringData !== null) {
            stopwatchMainData = JSON.parse(stopwatchStringData)
            stopwatchMainData.forEach((stopwatch) => {
                if (stopwatch[0] === key) {
                    stopwatchMainKeyData = stopwatch[1]
                    stopwatchExist = true;
                }
            })
        } else {
            stopwatchExist = false;
            console.log("Null key found")
        }

        return [stopwatchMainKeyData, stopwatchExist]
    },

    exist(key : string) : boolean {
        let [stopwatchData, stopwatchExist] = this.get(key);
        return stopwatchExist
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
    createStopwatchData (key : string, newDefaultCurrentContent?: stopwatchCurrentData) {
        let modifiedDefaultStopwatchData = defaultStopwatchData;
        modifiedDefaultStopwatchData.current = (newDefaultCurrentContent !== undefined)? newDefaultCurrentContent : defaultStopwatchData.current;
        modifiedDefaultStopwatchData.current.createdTimestamp = new Date().getTime();
        this.set(key, modifiedDefaultStopwatchData);
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
    
    // Move running state to history
    moveCurrentAttributesToHistory (key : string) {
        let [stopwatchData, stopwatchExist] = this.get(key);
        stopwatchData.history.push(stopwatchData.current);
        stopwatchData.current = defaultStopwatchData.current;
        this.set(key, stopwatchData);
    },

    // Manipulate Stopwatch Attributes
    // Last Interaction Timestamp
    setLastInteractionTimestamp (key : string, newTimestamp : number) {
        let [stopwatchData, stopwatchExist] = this.get(key);
        stopwatchData.current.lastInteractionTimestamp = newTimestamp;
        this.set(key, stopwatchData);
    },

    getLastInteractionTimestamp(key : string) {
        let [stopwatchData, stopwatchExist] = this.get(key);
        return stopwatchData.current.lastInteractionTimestamp
    },

    resetLastInteractionTimestamp(key : string) {
        let [stopwatchData, stopwatchExist] = this.get(key);
        stopwatchData.current.lastInteractionTimestamp = defaultStopwatchData.current.lastInteractionTimestamp;
        this.set(key, stopwatchData)
    },
    
    // Created Timestamp
    getCreatedTimestamp(key : string) {
        let [stopwatchData, stopwatchExist] = this.get(key);
        return stopwatchData.current.createdTimestamp
    },

    // Name
    setName(key : string, newName : string) {
        let [stopwatchData, stopwatchExist] = this.get(key);
        stopwatchData.current.name = newName;
        this.set(key, stopwatchData);
    },

    getName(key : string) {
        let [stopwatchData, stopwatchExist] = this.get(key);
        return stopwatchData.current.name
    },

    resetName(key : string) {
        let [stopwatchData, stopwatchExist] = this.get(key);
        stopwatchData.current.name = defaultStopwatchData.current.name;
        this.set(key, stopwatchData)
    },

    // Running state
    setRunningstate (key : string, newRunningstate : boolean) {
        let [stopwatchData, stopwatchExist] = this.get(key);
        stopwatchData.current.runningState = newRunningstate;
        this.set(key, stopwatchData);
    },

    getRunningstate(key : string) {
        let [stopwatchData, stopwatchExist] = this.get(key);
        return stopwatchData.current.runningState
    },

    resetRunningstate(key : string) {
        let [stopwatchData, stopwatchExist] = this.get(key);
        stopwatchData.current.runningState = defaultStopwatchData.current.runningState;
        this.set(key, stopwatchData)
    },

    // Counter
    setTotalTime (key : string, newTotalTime : number) {
        let [stopwatchData, stopwatchExist] = this.get(key);
        stopwatchData.current.totalTime = newTotalTime;
        this.set(key, stopwatchData);
    },

    getTotalTime (key : string) {
        let [stopwatchData, stopwatchExist] = this.get(key);
        return stopwatchData.current.totalTime;
    },

    resetTotalTime (key : string) {
        let [stopwatchData, stopwatchExist] = this.get(key);
        stopwatchData.current.totalTime = defaultStopwatchData.current.totalTime;
        this.set(key, stopwatchData);
    },

    // Loop Times
    setLoopTimes (key : string, newLoopTimes : number[]) {
        let [stopwatchData, stopwatchExist] = this.get(key);
        stopwatchData.current.loops = newLoopTimes;
        this.set(key, stopwatchData);
    },

    getLoopTimes (key : string) {
        let [stopwatchData, stopwatchExist] = this.get(key);
        return stopwatchData.current.loops
    },
}

export { stopwatchStorageHandler, stopwatchMainKeyString }