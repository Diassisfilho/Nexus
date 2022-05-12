import {
    defaultStopwatchData
} from "../../src/dataTypes";

import { stopwatchStorageHandler, stopwatchMainKeyString} from "../../src/storageHandler";
import * as uuid from "uuid";

describe("Basic methods", () => {
    beforeEach(() => {
        localStorage.removeItem(stopwatchMainKeyString)
    })

    afterEach(() => {
        localStorage.removeItem(stopwatchMainKeyString)
    })

    it("initialize", () => {
        stopwatchStorageHandler.initialize()

        const operation = localStorage.getItem("stopwatchData");
        const result = JSON.stringify([]) 

        expect(operation).toBe(result)
    })

    it("set, when adding new value", () => {
        const randomUUID = uuid.v1();
        stopwatchStorageHandler.set(randomUUID, defaultStopwatchData)

        const operation = localStorage.getItem(stopwatchMainKeyString)
        const result = JSON.stringify([[randomUUID, defaultStopwatchData]]);

        expect(operation).toBe(result)
    })

    it("set, when updating value", () => {
        const randomUUID = uuid.v1();
        stopwatchStorageHandler.set(randomUUID, defaultStopwatchData)

        defaultStopwatchData.current.name = "Modified"
        stopwatchStorageHandler.set(randomUUID, defaultStopwatchData)

        
        const operation = JSON.stringify(
            JSON.parse(localStorage.getItem("stopwatchData"))[0]
        )
        const result = JSON.stringify([randomUUID, defaultStopwatchData]);

        expect(operation).toBe(result)
    })

    it("get, when exist", () => {
        const randomUUID = uuid.v1();
        stopwatchStorageHandler.set(randomUUID, defaultStopwatchData)

        const [operation, exist] = stopwatchStorageHandler.get(randomUUID)
        const result = defaultStopwatchData;

        expect(operation).toStrictEqual(result)
        expect(exist).toBe(true)
    })

    it("get, when not exist", () => {
        const randomUUID = uuid.v1();

        const [operation, exist] = stopwatchStorageHandler.get(randomUUID)
        const result = defaultStopwatchData;

        expect(operation).toStrictEqual(result)
        expect(exist).toBe(false)
    })

    it("exist, when exist", () => {
        const randomUUID = uuid.v1();
        stopwatchStorageHandler.set(randomUUID, defaultStopwatchData);

        const operation = stopwatchStorageHandler.exist(randomUUID)
        const result = true;

        expect(operation).toStrictEqual(result)
    })

    it("exist, when not exist", () => {
        const randomUUID = uuid.v1();

        const operation = stopwatchStorageHandler.exist(randomUUID)
        const result = false;

        expect(operation).toStrictEqual(result)
    })
    
    it("delete", () => {
        const randomUUID = uuid.v1();
        stopwatchStorageHandler.set(randomUUID, defaultStopwatchData);

        let [operation, exist] = stopwatchStorageHandler.get(randomUUID);
        let result = defaultStopwatchData;
        expect(operation).toStrictEqual(result);
        expect(exist).toBeTruthy();

        stopwatchStorageHandler.delete(randomUUID);

        let [secondOperation, secondExist] = stopwatchStorageHandler.get(randomUUID);
        let secondResult = defaultStopwatchData;
        expect(secondOperation).toBe(secondResult);
        expect(secondExist).toBeFalsy();
    })
})

describe("Manipulate stopwatches", () => {
    beforeEach(() => {
        localStorage.removeItem(stopwatchMainKeyString)
    })

    afterEach(() => {
        localStorage.removeItem(stopwatchMainKeyString)
    })

    it("create stopwatch data", () => {
        const randomUUID = uuid.v1();
        const firstTimestamp = Date.now();
        stopwatchStorageHandler.createStopwatchData(randomUUID);
        const secondTimestamp = Date.now();
        
        const [operation, exist] = stopwatchStorageHandler.get(randomUUID);

        expect(operation !== defaultStopwatchData).toBeTruthy()
        expect(exist).toBe(true);
        expect(operation.current.createdTimestamp).toBeLessThanOrEqual(secondTimestamp);
        expect(operation.current.createdTimestamp).toBeGreaterThanOrEqual(firstTimestamp);
    })

    it("delete stopwatch data", () => {
        const randomUUID = uuid.v1();
        stopwatchStorageHandler.createStopwatchData(randomUUID);
        stopwatchStorageHandler.deleteStopwatchesData(randomUUID);

        const [defaultSWD, exist] = stopwatchStorageHandler.get(randomUUID);
        const operation = localStorage.getItem(stopwatchMainKeyString)
        const result = JSON.stringify([])

        expect(exist).toBe(false);
        expect(operation).toBe(result);
    })
})

beforeEach(() => {
    localStorage.removeItem(stopwatchMainKeyString)
})

afterEach(() => {
    localStorage.removeItem(stopwatchMainKeyString)
})

test("getAllUUIDs", () => {
    const randomUUIDs = Array(20).map(() => uuid.v1());
    randomUUIDs.forEach((randomUUID) => stopwatchStorageHandler.createStopwatchData(randomUUID));

    const allUUIDs = stopwatchStorageHandler.getAllUUIDs();
    expect(allUUIDs).toEqual(randomUUIDs)
})

test("moveCurrentAttributesToHistory", () => {
    const randomUUID = uuid.v1();
    stopwatchStorageHandler.set(randomUUID, defaultStopwatchData);
    expect(stopwatchStorageHandler.get(randomUUID)[0]).toEqual(defaultStopwatchData)

    stopwatchStorageHandler.moveCurrentAttributesToHistory(randomUUID)
    const operation = stopwatchStorageHandler.get(randomUUID)[0].history[0];
    const result = defaultStopwatchData.current

    expect(operation).toEqual(result)
})