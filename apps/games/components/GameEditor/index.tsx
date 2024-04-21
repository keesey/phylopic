import { CalendarDate } from "~/lib/datetime"
import { EditorContainer } from "~/lib/edit"
import { GameInstance } from "~/lib/s3/GameInstance"
import { ContentEditor } from "./ContentEditor"
import { Controls } from "./Controls"
export interface Props<TContent = unknown> {
    code: string
    date: CalendarDate
    initialGameInstance: GameInstance<TContent>
}
export const GameEditor = ({ code, date, initialGameInstance }: Props) => {
    return (
        <EditorContainer data={initialGameInstance.content}>
            <Controls code={code} />
            <ContentEditor code={code} />
        </EditorContainer>
    )
}
