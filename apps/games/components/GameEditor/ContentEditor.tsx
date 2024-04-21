import FourCladesEditor from "~/games/four-clades/edit"

export interface Props {
    code: string
    readOnly: boolean
}
export const ContentEditor = ({ code, readOnly }: Props) => {
    switch (code) {
        case "four-clades": {
            return <FourCladesEditor readOnly={readOnly} />
        }
        default: {
            return <p>Cannot edit this game at the moment.</p>
        }
    }
}
