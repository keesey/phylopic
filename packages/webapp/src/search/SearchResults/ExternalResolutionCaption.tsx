import { parseNomen } from "parse-nomen"
import { useMemo, FC } from "react"
import getShortName from "~/models/getShortName"
import NameView from "~/views/NameView"
import { ExternalResolution } from "../models/ExternalResolution"
export interface Props {
    value: ExternalResolution
}
const ExternalResolutionCaption: FC<Props> = ({ value }) => {
    const titleName = useMemo(() => parseNomen(value.title), [value.title])
    const shortTitleName = useMemo(() => getShortName(titleName), [titleName])
    const shortNodeName = useMemo(() => getShortName(value.node.names[0]), [value.node])
    if (shortTitleName === shortNodeName) {
        return <NameView value={value.node.names[0]} short />
    }
    return (
        <>
            <NameView value={value.node.names[0]} short />
            {" / "}
            <NameView value={titleName} />
        </>
    )
}
export default ExternalResolutionCaption
