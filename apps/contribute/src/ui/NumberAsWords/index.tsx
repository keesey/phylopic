import { FC, useMemo } from "react"
import { toWords } from "number-to-words"
export type Props = {
    caps?: boolean
    max?: number
    value: number
}
const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)
const NumberAsWords: FC<Props> = ({ caps, max, value }) => {
    const words = useMemo(
        () => (max && value > max ? value.toLocaleString("en-us") : caps ? capitalize(toWords(value)) : toWords(value)),
        [caps, max, value],
    )
    const title = useMemo(() => value.toLocaleString("en-us"), [value])
    return <span title={title}>{words}</span>
}
export default NumberAsWords
