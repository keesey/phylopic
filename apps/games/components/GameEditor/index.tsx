import { CalendarDate, formatDate } from "~/lib/datetime"
import { EditorContainer } from "~/lib/edit"
import { GameInstance } from "~/lib/s3/GameInstance"
import { ContentEditor } from "./ContentEditor"
import { Controls } from "./Controls"
import { putGameInstance } from "~/lib/s3/putGameInstance"
import { Suspense } from "react"
import { Loader } from "@phylopic/client-components"
import styles from "./index.module.scss"
export interface Props<TContent = unknown> {
    code: string
    date: CalendarDate
    initialGameInstance: GameInstance<TContent>
    readOnly: boolean
}
export const GameEditor = ({ code, date, initialGameInstance, readOnly }: Props) => {
    const handleSave = async (instance: GameInstance<unknown>) => {
        "use server"
        if (!readOnly) {
            await putGameInstance(code, date, instance)
        }
    }
    return (
        <EditorContainer data={initialGameInstance.content}>
            <header className={styles.heading}>
                <h3 className={styles.date}>{formatDate(date, "long")}</h3>
                <Controls code={code} onSave={handleSave} readOnly={readOnly} />
            </header>
            <Suspense fallback={<Loader />}>
                <ContentEditor code={code} readOnly={readOnly} />
            </Suspense>
        </EditorContainer>
    )
}
