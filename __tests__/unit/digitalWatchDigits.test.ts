import { generateDigitalWatchString } from "../../src/utils";

describe("Basic tests on function generateDigitalWatchString", () => {
    it("seconds", () => {
        const firstResult = generateDigitalWatchString(0)
        expect(firstResult).toBe("00:00:00.00")

        const secondResult = generateDigitalWatchString(1)
        expect(secondResult).toBe("00:00:01.00")
    })

    it("minutes", () => {
        const firstResult = generateDigitalWatchString(59)
        expect(firstResult).toBe("00:00:59.00")
        
        const secondResult = generateDigitalWatchString(61)
        expect(secondResult).toBe("00:01:01.00")
    })

    it("hours", () => {
        const firstResult = generateDigitalWatchString(3599)
        expect(firstResult).toBe("00:59:59.00")

        const secondResult = generateDigitalWatchString(3601)
        expect(secondResult).toBe("01:00:01.00")
    })
})

describe("Decimal tests on function generateDigitalWatchString", () => {
    it("decimal secs", () => {
        const firstResult = generateDigitalWatchString(0.0)
        expect(firstResult).toBe("00:00:00.00")

        const secondResult = generateDigitalWatchString(59.99)
        expect(secondResult).toBe("00:00:59.99")
    })

    it("decimal minutes", () => {
        const firstResult = generateDigitalWatchString(600.48)
        expect(firstResult).toBe("00:10:00.48")

        const secondResult = generateDigitalWatchString(3599.99)
        expect(secondResult).toBe("00:59:59.99")
    })

    it("decimal hours", () => {
        const firstResult = generateDigitalWatchString(9376.99)
        expect(firstResult).toBe("02:36:16.99")

        const secondResult = generateDigitalWatchString(3600)
        expect(secondResult).toBe("01:00:00.00")
    })
})