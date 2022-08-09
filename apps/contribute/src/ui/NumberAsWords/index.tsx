import { FC, useMemo } from "react"
import { toWords } from "number-to-words"
export type Props = {
    value: number
}
const NumberAsWords: FC<Props> = ({ value }) => {
    const words = useMemo(() => toWords(value), [value])
    const title = useMemo(() => value.toLocaleString("en-us"), [value])
    return <span title={title}>{words}</span>
}
export default NumberAsWords
