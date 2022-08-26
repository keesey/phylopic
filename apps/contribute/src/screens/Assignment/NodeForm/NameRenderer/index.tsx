import { FC, useMemo } from "react"
import { parseNomen } from "parse-nomen"
import NameView from "~/ui/NameView"
import { INCOMPLETE_STRING } from "@phylopic/source-models"
export type Props = {
    value: string
}
const NameRenderer: FC<Props> = ({ value }) => {
    const name = useMemo(() => parseNomen(value), [value])
    return <NameView value={name} defaultText={INCOMPLETE_STRING} />
}
export default NameRenderer
