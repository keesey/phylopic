import { Node, NodeLinks } from "@phylopic/api-models"
import { NumberView } from "@phylopic/ui"
import { FC } from "react"
import useNodeAge from "~/external/timetree.org/useNodeAge"
export interface Props {
    value?: Node
}
const AgeView: FC<Props> = ({ value }) => {
    const age = useNodeAge(value ?? null)
    if (age === null || !isFinite(age)) {
        return null
    }
    return (
        <>
            <br />
            <small>
                (
                <a href="https://timetree.org/" rel="noreferrer" target="_blank" title="Timetree of Life">
                    <YearsView value={age} />
                </a>
                )
            </small>
        </>
    )
}
const BILLION = 1000000000
const MILLION = 1000000
const THOUSAND = 1000000
const YearsView: FC<{ value: number }> = ({ value }) => {
    if (value > BILLION) {
        return (
            <>
                ~<NumberView value={parseFloat((value / BILLION).toPrecision(4))} />{" "}
                <abbr title="giga-years ago">Ga</abbr>
            </>
        )
    }
    if (value > MILLION) {
        return (
            <>
                ~<NumberView value={parseFloat((value / MILLION).toPrecision(4))} />{" "}
                <abbr title="mega-years ago">Ma</abbr>
            </>
        )
    }
    if (value > THOUSAND) {
        return (
            <>
                ~<NumberView value={parseFloat((value / THOUSAND).toPrecision(4))} />{" "}
                <abbr title="kilo-years ago">kya</abbr>
            </>
        )
    }
    return (
        <>
            <NumberView value={value} /> years ago
        </>
    )
}
export default AgeView
