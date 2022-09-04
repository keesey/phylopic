import { INCOMPLETE_STRING } from "@phylopic/source-models"
import { parseNomen } from "parse-nomen"
import { FC, useMemo } from "react"
import NameView from "~/ui/NameView"
export type Props = {
    short?: boolean
    value: string
}
const NameRenderer: FC<Props> = ({ short, value }) => {
    const name = useMemo(() => parseNomen(value), [value])
    return <NameView value={name} defaultText={INCOMPLETE_STRING} short={short} />
}
export default NameRenderer
