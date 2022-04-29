export function differenceBetween(currentLoopCounter : number, lastLoopCounter : number) : string {
    return (lastLoopCounter !== undefined) ? `| ${generateDigitalWatchString(currentLoopCounter - lastLoopCounter)}` : ""
}

export function generateDigitalWatchString(counter : number) : string {
    function filtringPadAndFloatPointsErrorsToSecsCounter(counter : number) : string {
        var toReturn : string;
        const counterString = String(counter);

        let [secLeftDigitsString, secRightDigitsString] = counterString.split(".");
        let [secLeftDigitsNumber, secRightDigitsNumber] = [parseFloat(secLeftDigitsString) % 3600 % 60, parseFloat(secRightDigitsString)];
        let [secLeftDigitsStringFormated, secRightDigitsStringFormated] = [String(secLeftDigitsNumber).padStart(2,"0"), String(secRightDigitsNumber).padEnd(2, "0")];
    
        if (counterString.includes(".")) {
            toReturn = (secLeftDigitsStringFormated + "." + secRightDigitsStringFormated).slice(0,5);
        } else {
            toReturn = secLeftDigitsStringFormated + "." + "00";
        }

        return toReturn
    }
    var secsCounter, minsCounter, hourCounter;

    secsCounter = filtringPadAndFloatPointsErrorsToSecsCounter(counter)
    minsCounter = Math.floor(counter % 3600 / 60).toFixed().padStart(2, "0");
    hourCounter = Math.floor( counter / 3600 ).toFixed().padStart(2, "0");
    
    return `${hourCounter}:${minsCounter}:${secsCounter}`;
}