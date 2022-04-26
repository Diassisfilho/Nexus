import { stopwatchData, defaultStopwatchData } from "./dataTypes";

const stopwatchStorageHandler = {
    // Manipulate Stopwatch
    createStopwatchData (key : string) {
        let lastStopwatchPosition = this.getAllUUIDs().length;
        let newStopwatchPosition = lastStopwatchPosition + 1;
        defaultStopwatchData.current.position = newStopwatchPosition;

        localStorage.setItem(key, JSON.stringify(defaultStopwatchData))
    },

    // Manipulate UUIDs
    getAllUUIDs () : string[] {
        let allStorage = [];
        for (let i = 0 ; i < localStorage.length; i++) {
            let uuid = localStorage.key(i)
            if (uuid === null) {
                break
            }
            allStorage.push(uuid)
        }
        return this.sortUUIDsByPosition(allStorage)
    },

    sortUUIDsByPosition (unsortedUUIDs : string[]) {
        const compareFunction = (a : string, b : string) => {
            let object_a = this.filterDataToObject(a);
            let object_b = this.filterDataToObject(b);

            return object_a.current.position - object_b.current.position
        }

        return unsortedUUIDs.sort(compareFunction)
    },

    filterDataToObject(key : string) : stopwatchData {
        let stopwatchBruteData = localStorage.getItem(key);
        if (stopwatchBruteData !== null) {
            let stopwatchData : stopwatchData = JSON.parse(stopwatchBruteData)
            return stopwatchData
        } else {
            return defaultStopwatchData 
            console.log("Null key found")
        }
    },

    // Manipulate Stopwatch Attributes
    // Counter
    setCounter (key : string, newCounter : number) {
        let stopwatchData : stopwatchData = this.filterDataToObject(key);
        stopwatchData.current.counter = newCounter;
        localStorage.setItem(key, JSON.stringify(stopwatchData));
    },

    getCounter (key : string) {
        let stopwatchData : stopwatchData = this.filterDataToObject(key);
        return stopwatchData.current.counter;
    },

    resetCounter (key : string) {
        let stopwatchData : stopwatchData = this.filterDataToObject(key);
        stopwatchData.current.counter = defaultStopwatchData.current.counter;
        localStorage.setItem(key, JSON.stringify(stopwatchData));
    },

    // Position
    setPosition (key : string, newPosition : number) {
        let stopwatchData : stopwatchData = this.filterDataToObject(key);
        stopwatchData.current.position = newPosition;
        localStorage.setItem(key, JSON.stringify(stopwatchData));
    },

    getPosition (key : string) {
        let stopwatchData : stopwatchData = this.filterDataToObject(key)
        return stopwatchData.current.position
    },

    // Loop Times
    setLoopTimes (key : string, newLoopTimes : number[]) {
        let stopwatchData : stopwatchData = this.filterDataToObject(key);
        stopwatchData.current.loops = newLoopTimes;
        localStorage.setItem(key, JSON.stringify(stopwatchData));
    },

    getLoopTimes (key : string) {
        let stopwatchData : stopwatchData = this.filterDataToObject(key)
        return stopwatchData.current.loops
    },
}

export { stopwatchStorageHandler }