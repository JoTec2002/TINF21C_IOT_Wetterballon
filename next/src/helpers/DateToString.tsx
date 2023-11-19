'use client'

export const DateToString = (input: Date) => {
    const value = new Date(input)
    return numberToTowLetter(value.getDay())  + "." + numberToTowLetter(value.getMonth()) + "." + value.getFullYear() + " " +  numberToTowLetter(value.getHours()) + ":" +  numberToTowLetter(value.getMinutes());
}

export const parseDate = (input: Date) => {
    const value = new Date(input)
    return numberToTowLetter(value.getDay()) + '.' + numberToTowLetter(value.getMonth()) + '.' + value.getFullYear().toString()
}

export const parseClockTime = (input: Date) => {
    const value = new Date(input)
    return numberToTowLetter(value.getHours()) + ':' + numberToTowLetter(value.getMinutes()) + ':' + numberToTowLetter(value.getSeconds())
}

const numberToTowLetter= (value: number) =>{
    return value < 10 ? "0" + value.toString() : value.toString()
}