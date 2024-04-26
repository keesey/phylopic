"use client"
import { Loader } from "@phylopic/client-components"
import { FC, useEffect, useState } from "react"
import Board from "../board/Board"
import { Game } from "../models"
import { BoardContainer, Submission } from "./BoardContainer"
import { InitializeAction } from "./actions"
import { adjudicate } from "./adjudicate"
import { createInitial } from "./createInitial"
export interface PlayerClientProps {
    game: Game
}
export const PlayerClient: FC<PlayerClientProps> = ({ game }) => {
    const [data, setData] = useState<InitializeAction["payload"] | null>(null)
    useEffect(() => {
        ;(async () => {
            setData(await createInitial(game))
        })()
    }, [game])
    const handleSubmit = async (submission: Submission) => {
        return await adjudicate(game, submission)
    }
    if (!data) {
        return <Loader />
    }
    return (
        <BoardContainer data={data} submit={handleSubmit}>
            <Board />
        </BoardContainer>
    )
}
