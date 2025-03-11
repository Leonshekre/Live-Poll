import { isRecord } from "./record";

// Invariant: SHOULD MIRROR poll type in SERVER! (w/o readonly status)
export type Poll = {
    // Invariant: questionName should be unique in each poll!
    readonly questionName: string,
    readonly endTime: number,
    readonly options: string[],
    // Invariant: voters & optionVoted should act like a map with key,value pair for each index!
    // voters[] has unique values and has the same length as options voted
    readonly voters: string[],
    // Invariant: optionsVoted contains only options from options!
    readonly optionsVoted: string[]
};

/**
 * Parses data from given val into valid poll data.
 * Will return undefined and console.error() if not valid
 * @param val, includes val... questionName, entTime, options, voters, optionsVoted
 * @throws if val params are invalid, should reflect type Poll values shown above
 * @returns undefined if the params are invalid, else returns a valid poll object
 */
export const parsePoll = (val: unknown): undefined | Poll => {
    if (!isRecord(val)) {
        console.error("val is not a record!", val);
        return undefined;
    }
    if (typeof val.questionName !== "string") {
        console.error("val.name is not a string!", val);
        return undefined;
    }
    if (typeof val.endTime !== "number") {
        console.error("val.endTime is not a number!", val);
        return undefined;
    }
    if (!Array.isArray(val.options)) {
        console.error("val.options is not a string[]!", val);
        return undefined;
    }   
    for (const str of val.options) {
        if (typeof str !== "string") {
            console.error("val.options[x] is not a string!", str);
            return undefined;
        }
    }
    if (!Array.isArray(val.voters)) {
        console.error("val.options is not a string[]!", val);
        return undefined;
    }   
    for (const str of val.voters) {
        if (typeof str !== "string") {
            console.error("elements of val.voters are not a string!", str);
            return undefined;
        }
    }
    if (!Array.isArray(val.optionsVoted)) {
        console.error("val.optionsVoted is not a string[]!", val);
        return undefined;
    }   
    for (const str of val.optionsVoted) {
        if (typeof str !== "string") {
            console.error("val.optionsVoted elements are not a string!", str);
            return undefined;
        }
    }
    return {questionName: val.questionName, endTime: val.endTime, options: val.options, voters: val.voters, optionsVoted: val.optionsVoted};
};