"use client"
import { Loader } from "@phylopic/client-components"
import { FC, useEffect, useState } from "react"
import Board from "../board/Board"
import { Game } from "../models"
import { BoardContainer, Submission } from "./BoardContainer"
import { Action, InitializeAction } from "./actions"
import { adjudicate } from "./adjudicate"
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
    const handleSubmit = async (submission: Submission): Promise<Action> => {
        console.debug({ game, submission })
        if (game) {
            return await adjudicate(game, submission)
        }
        return { type: "SUBMIT_CANCEL" }
    }
    if (game && !data) {
        return <Loader />
    }
    return (
        <BoardContainer data={data} onSubmit={handleSubmit} onNewGame={onNewGame}>
            <Board onNewGame={onNewGame} />
        </BoardContainer>
    )
}
