import { parseNomen } from "parse-nomen"
import { TitledLink } from "@phylopic/api-models"
import { useMemo, FC } from "react"
import NomenView from "../NomenView"
import useHRef from "./useHRef"
export interface Props {
    value: TitledLink
    title: string
}
const ExternalTitledLinkView: FC<Props> = ({ value, title }) => {
    const href = useHRef(value.href)
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
