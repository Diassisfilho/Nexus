import { generateDigitalWatchString } from "../../utils";

describe("Basic tests on function generateDigitalWatchString", () => {
    it("seconds", () => {
        const firstResult = generateDigitalWatchString(0)
        expect(firstResult).toBe("00:00:00.00")

        const secondResult = generateDigitalWatchString(1 * 1000)
        expect(secondResult).toBe("00:00:01.00")
    })

    it("minutes", () => {
        const firstResult = generateDigitalWatchString((59) * 1000)
        expect(firstResult).toBe("00:00:59.00")
        
        const secondResult = generateDigitalWatchString((60 + 1) * 1000)
        expect(secondResult).toBe("00:01:01.00")
    })

    it("hours", () => {
        const firstResult = generateDigitalWatchString(((59 * 60) + 59) * 1000)
        expect(firstResult).toBe("00:59:59.00")

        const secondResult = generateDigitalWatchString(((60 * 60) + 1) * 1000)
        expect(secondResult).toBe("01:00:01.00")
    })
})

describe("Decimal tests on function generateDigitalWatchString", () => {
    it("decimal secs", () => {
        const firstResult = generateDigitalWatchString(0)
        expect(firstResult).toBe("00:00:00.00")

        const secondResult = generateDigitalWatchString((59 * 1000) + 990)
        expect(secondResult).toBe("00:00:59.99")
    })

    it("decimal minutes", () => {
        const firstResult = generateDigitalWatchString(((10 * 60) * 1000) + 480)
        expect(firstResult).toBe("00:10:00.48")

        const secondResult = generateDigitalWatchString((((59 * 60) + 59) * 1000) + 990)
        expect(secondResult).toBe("00:59:59.99")
    })

    it("decimal hours", () => {
        const firstResult = generateDigitalWatchString((((2 * 60 * 60) + (36 * 60) + 16) * 1000) + 990)
        expect(firstResult).toBe("02:36:16.99")

        const secondResult = generateDigitalWatchString((60 * 60) * 1000)
        expect(secondResult).toBe("01:00:00.00")
    })
})