import { parseNomen } from "parse-nomen"
import { FC, useMemo } from "react"
import NameView from "../NameView"
export type Props = {
    short?: boolean
    value: string
}
const NameRenderer: FC<Props> = ({ short, value }) => {
    const name = useMemo(() => parseNomen(value), [value])
    return <NameView name={name} short={short} />
}
export default NameRenderer
