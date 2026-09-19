"use client"
import { Loader } from "@phylopic/client-components"
import { FC, useEffect, useState } from "react"
import Board from "../board/Board"
import { Game } from "../models"
import { BoardContainer } from "./BoardContainer"
import { InitializeAction } from "./actions"
import { createInitial } from "./createInitial"
export interface PlayerClientProps {
    game: Game | null
    onNewGame?: () => void
}
export const PlayerClient: FC<PlayerClientProps> = ({ game, onNewGame }) => {
    const [data, setData] = useState<InitializeAction["payload"] | null>(null)
    useEffect(() => {
        if (game) {
            ;(async () => {
                setData(await createInitial(game))
            })()
        } else {
            setData(null)
        }
    }, [game])
    if (game && !data) {
        return <Loader />
    }
    return (
        <BoardContainer data={data} game={game ?? undefined} onNewGame={onNewGame}>
            <Board onNewGame={onNewGame} />
        </BoardContainer>
    )
}
