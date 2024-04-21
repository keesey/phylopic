import { CalendarDate } from "~/lib/datetime"
import { EditorContainer } from "~/lib/edit"
import { GameInstance } from "~/lib/s3/GameInstance"
import { ContentEditor } from "./ContentEditor"
import { Controls } from "./Controls"
import { putGameInstance } from "~/lib/s3/putGameInstance"
export interface Props<TContent = unknown> {
    code: string
    date: CalendarDate
    initialGameInstance: GameInstance<TContent>
}
export const GameEditor = ({ code, date, initialGameInstance }: Props) => {
    const handleSave = async (instance: GameInstance<unknown>) => {
        "use server"
        await putGameInstance(code, date, instance)
    }
    return (
        <EditorContainer data={initialGameInstance.content}>
            <Controls code={code} onSave={handleSave} />
            <ContentEditor code={code} />
        </EditorContainer>
    )
}
