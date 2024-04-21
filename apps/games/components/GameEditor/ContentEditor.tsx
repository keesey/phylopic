import FourCladesEditor from "~/games/four-clades/edit"

export interface Props {
    code: string
}
export const ContentEditor = ({ code }: Props) => {
    switch (code) {
        case "four-clades": {
            return <FourCladesEditor />
        }
        default: {
            return <p>Cannot edit this game at the moment.</p>
        }
    }
}