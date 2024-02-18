const BILLION = 1000000000
const MILLION = 1000000
const THOUSAND = 1000
const getAgePresentation = (age: number) => {
    if (age >= BILLION) {
        return {
            text: "Gya",
            title: `giga-year${age === BILLION ? "" : "s"} ago`,
            value: parseFloat((age / BILLION).toPrecision(3)),
            years: BILLION,
        }
    }
    if (age >= MILLION) {
        return {
            text: "Mya",
            full: `mega-year${age === MILLION ? "" : "s"} ago`,
            value: parseFloat((age / MILLION).toPrecision(3)),
            years: MILLION,
        }
    }
    if (age >= THOUSAND) {
        return {
            text: "kya",
            title: `kilo-year${age === MILLION ? "" : "s"} (millenni${age === MILLION ? "um" : "a"}) ago`,
            value: parseFloat((age / THOUSAND).toPrecision(3)),
            years: THOUSAND,
        }
    }
    return {
        text: "ya",
        title: `year${age === 1 ? "" : "s"} ago`,
        value: Math.round(age),
        years: 1,
    }
}
export default getAgePresentation
