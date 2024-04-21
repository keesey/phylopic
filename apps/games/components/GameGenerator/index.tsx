import { CalendarDate, toPath } from "~/lib/datetime"
import styles from "./index.module.scss"
import { Button } from "./Button"
import { GameInstance } from "~/lib/s3/GameInstance"
import { putGameInstance } from "~/lib/s3/putGameInstance"
import { revalidatePath, revalidateTag } from "next/cache"
export interface Props<TContent = unknown> {
    code: string
    date: CalendarDate
}
export const GameGenerator = ({ code, date }: Props) => {
    const saveGame = async (instance: GameInstance<unknown>) => {
        "use server"
        await putGameInstance(code, date, instance)
        revalidatePath(`/edit/${encodeURIComponent(code)}${toPath(date)}`)
        revalidateTag
    }
    return (
        <div className={styles.main}>
            <Button code={code} onGenerated={saveGame} />
        </div>
    )
}
