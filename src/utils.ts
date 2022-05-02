export function differenceBetween(currentLoopCounter : number, lastLoopCounter : number) : string {
    return (lastLoopCounter !== undefined) ? `| ${generateDigitalWatchString(currentLoopCounter - lastLoopCounter)}` : ""
}

export function generateDigitalWatchString(counter : number) : string {
    var msecCounter, secsCounter, minsCounter, hourCounter;
    var counterInSeconds = Math.floor(counter / 1000)

    msecCounter = (counter - (counterInSeconds * 1000)) / 10; // Miliseconds
    secsCounter = counterInSeconds % 60;
    minsCounter = counterInSeconds % 3600 / 60;
    hourCounter = counterInSeconds / 3600;

    // Fix float numbers to integers and turn into strings
    [ msecCounter, secsCounter, minsCounter, hourCounter ] = [msecCounter, secsCounter, minsCounter, hourCounter].map((value) => {
        // The msecCounter and secsCounter not need Math.floor and toFixed methods, it's just to clean the code.
        return Math.floor(value).toFixed().padStart(2, "0");
    })
    
    return `${hourCounter}:${minsCounter}:${secsCounter},${msecCounter}`;
}