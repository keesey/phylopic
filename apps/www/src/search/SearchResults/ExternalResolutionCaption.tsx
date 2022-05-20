import { parseNomen } from "parse-nomen"
import { useMemo, FC } from "react"
import getShortNomen from "~/models/getShortNomen"
import NomenView from "~/views/NomenView"
import { ExternalResolution } from "../models/ExternalResolution"
export interface Props {
    value: ExternalResolution
}
const ExternalResolutionCaption: FC<Props> = ({ value }) => {
    const titleName = useMemo(() => parseNomen(value.title), [value.title])
    const shortTitleName = useMemo(() => getShortNomen(titleName), [titleName])
    const shortNodeName = useMemo(() => getShortNomen(value.node.names[0]), [value.node])
    if (shortTitleName === shortNodeName) {
        return <NomenView value={value.node.names[0]} short />
    }
    return (
        <>
            <NomenView value={value.node.names[0]} short />
            {" / "}
            <NomenView value={titleName} />
        </>
    )
}
export default ExternalResolutionCaption
