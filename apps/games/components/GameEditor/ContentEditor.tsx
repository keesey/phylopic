import FourCladesEditor from "~/games/four-clades/edit"
import { getBuild } from "~/lib/api"

export interface Props {
    code: string
    readOnly: boolean
}
export const ContentEditor = async ({ code, readOnly }: Props) => {
    const build = await getBuild()
    switch (code) {
        case "four-clades": {
            return <FourCladesEditor build={build} readOnly={readOnly} />
        }
        default: {
            return <p>Cannot edit this game at the moment.</p>
        }
    }
}
