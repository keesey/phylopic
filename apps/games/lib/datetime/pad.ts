export const pad = (n: number, length: number) => {
    let s = Math.floor(n).toString().slice(0, length)
    while (s.length < length) {
        s = `0${s}`
    }
    return s
}
