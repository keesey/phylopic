import { CalendarDate } from "~/lib/datetime"
import { EditorContainer } from "~/lib/edit"
import { GameInstance } from "~/lib/s3/GameInstance"
import { ContentEditor } from "./ContentEditor"
import { Controls } from "./Controls"
import { putGameInstance } from "~/lib/s3/putGameInstance"
import { Suspense } from "react"
import { Loader } from "@phylopic/client-components"
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
            <Controls code={code} onSave={handleSave} readOnly={readOnly} />
            <Suspense fallback={<Loader />}>
                <ContentEditor code={code} readOnly={readOnly} />
            </Suspense>
        </EditorContainer>
    )
}
