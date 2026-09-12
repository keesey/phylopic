import { CalendarDate, toPath } from "~/lib/datetime"
import styles from "./index.module.scss"
import { ButtonContainer } from "./ButtonContainer"
import { GameInstance } from "~/lib/s3/GameInstance"
import { putGameInstance } from "~/lib/s3/putGameInstance"
import { revalidatePath, revalidateTag } from "next/cache"
import { toDate } from "~/lib/datetime/toDate"
export interface Props<TContent = unknown> {
    code: string
    date: CalendarDate
}
export const GameGenerator = ({ code, date }: Props) => {
    const now = Date.now()
    const dateTime = toDate(date).getTime()
    const readOnly = now >= toDate(date).getTime()
    if (readOnly) {
        return null
    }
    const saveGame = async (instance: GameInstance<unknown>) => {
        "use server"
        const now = Date.now()
        if (dateTime <= now) {
            throw new Error("This game is in the past.")
        }
        await putGameInstance(code, date, instance)
        revalidatePath(`/edit/${encodeURIComponent(code)}${toPath(date)}`)
        revalidateTag
    }
    return (
        <div className={styles.main}>
            <ButtonContainer code={code} onGenerated={saveGame} />
        </div>
    )
}
