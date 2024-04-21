import { CalendarDate } from "~/lib/datetime"
import { EditorContainer, select } from "~/lib/edit"
import { GameInstance } from "~/lib/s3/GameInstance"
import { Controls } from "./Controls"
import { ControlButton } from "./ControlButton"
export interface Props<TContent = unknown> {
    code: string
    date: CalendarDate
    initialGameInstance: GameInstance<TContent>
}
export const GameEditor = ({ code, date, initialGameInstance }: Props) => {
    return (
        <EditorContainer data={initialGameInstance}>
            <Controls code={code} />
        </EditorContainer>
    )
}
