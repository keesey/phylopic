import { TitledLink } from "@phylopic/api-models"
import { parseNomen } from "parse-nomen"
import { FC, useMemo } from "react"
import resolveExternalHRef from "~/models/resolveExternalHRef"
import NomenView from "../NomenView"
export interface Props {
    value: TitledLink
    title: string
}
const ExternalTitledLinkView: FC<Props> = ({ value, title }) => {
    const href = useMemo(() => resolveExternalHRef(value.href), [value.href])
    const name = useMemo(() => parseNomen(value.title), [value.title])
    if (!href) {
        return <NomenView value={name} />
    }
    return (
        <a href={href} title={title}>
            <NomenView value={name} />
        </a>
    )
}
export default ExternalTitledLinkView
