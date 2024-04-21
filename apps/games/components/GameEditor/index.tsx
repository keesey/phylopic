import { CalendarDate } from "~/lib/datetime"
import { GameInstance } from "~/lib/s3/GameInstance"
export interface Props<TContent = unknown> {
    code: string
    date: CalendarDate
    initialGameInstance: GameInstance<TContent>
}
export const GameEditor = ({ code, date, initialGameInstance }: Props) => {}
