import { isErrors } from "@phylopic/api-models"
import { isAxiosError } from "axios"
import { FC, useMemo } from "react"
import Dialogue from "~/ui/Dialogue"
import { ICON_ARROW_LEFT } from "~/ui/ICON_SYMBOLS"
import Speech from "~/ui/Speech"
import UserButton from "~/ui/UserButton"
import UserOptions from "~/ui/UserOptions"
export type Props = {
    error: Error
    onCancel: () => void
}
const UploadError: FC<Props> = ({ error, onCancel }) => {
    const [message, detail] = useMemo<[string, string | null]>(() => {
        if (isAxiosError(error)) {
            const { data } = error.response ?? {}
            if (isErrors(data) && data.errors.length > 0) {
                return data.errors.length == 1
                    ? [data.errors[0].userMessage, null]
                    : [
                          "There were some errors uploading that:",
                          data.errors.map((error, index) => `${index + 1}) ${error.userMessage}`).join("; "),
                      ]
            }
        }
        return ["There was some kind of error:", `“${String(error)}”`]
    }, [error])
    return (
        <Dialogue>
            <Speech mode="system">
                <p>
                    <strong>Ack!</strong> {message}
                </p>
                {detail && <p>{detail}</p>}
            </Speech>
            <UserOptions>
                <UserButton icon={ICON_ARROW_LEFT} onClick={onCancel}>
                    Start over.
                </UserButton>
            </UserOptions>
        </Dialogue>
    )
}
export default UploadError
