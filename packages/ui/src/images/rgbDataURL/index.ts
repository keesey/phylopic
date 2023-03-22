const KEY = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/="
const triplet = (e1: number, e2: number, e3: number) =>
    KEY.charAt(e1 >> 2) +
    KEY.charAt(((e1 & 3) << 4) | (e2 >> 4)) +
    KEY.charAt(((e2 & 15) << 2) | (e3 >> 6)) +
    KEY.charAt(e3 & 63)
export const rgbDataURL = (r: number, g: number, b: number) =>
    `data:image/gif;base64,R0lGODlhAQABAPAA${
        triplet(0, r, g) + triplet(b, 255, 255)
    }/yH5BAAAAAAALAAAAAABAAEAAAICRAEAOw==`
