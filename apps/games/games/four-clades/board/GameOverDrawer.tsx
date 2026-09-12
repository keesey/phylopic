"use client"
import { ImageThumbnailView, NumberView } from "@phylopic/ui"
import { FC, useContext, useEffect, useState } from "react"
import { Drawer } from "~/components/Drawer"
import { BoardContext, select } from "../play"
import styles from "./GameOverDrawer.module.scss"
import { ShareButton } from "~/components/ShareButton"
import { PracticeButton } from "~/components/PracticeButton"
import { NewGameButton } from "~/components/NewGameButton"
export interface GameOverDrawerProps {
    onNewGame?: () => void
}
export const GameOverDrawer: FC<GameOverDrawerProps> = ({ onNewGame }) => {
    const [closed, setClosed] = useState(false)
    const [state, _dispatch] = useContext(BoardContext) ?? []
    const [delayedWon, setDelayedWon] = useState(() => (state ? select.isWon(state) : false))
    const won = Boolean(state && select.isWon(state))
    const lost = Boolean(state && select.isLost(state))
    useEffect(() => {
        const handle = setTimeout(won ? () => setDelayedWon(true) : () => setDelayedWon(false), 700)
        return () => clearTimeout(handle)
    }, [won])
    return (
        <Drawer
            open={!closed && (delayedWon || lost)}
            onClose={() => {
                // :TODO:
                //dispatch?.({ type: "AUTO_WIN" }, nodes)
                setClosed(true)
            }}
        >
            <div className={styles.content}>
                {won && (
                    <>
                        <ImageThumbnailView
                            value={{
                                _links: {
                                    self: {
                                        href: "/images/7e27ce06-1f4f-45d8-a359-dcba8fc54b9b?build=346",
                                        title: "Tethyaster subinermis",
                                    },
                                    thumbnailFiles: [
                                        {
                                            href: "https://images.phylopic.org/images/7e27ce06-1f4f-45d8-a359-dcba8fc54b9b/thumbnail/192x192.png",
                                            sizes: "192x192",
                                            type: "image/png",
                                        },
                                        {
                                            href: "https://images.phylopic.org/images/7e27ce06-1f4f-45d8-a359-dcba8fc54b9b/thumbnail/128x128.png",
                                            sizes: "128x128",
                                            type: "image/png",
                                        },
                                        {
                                            href: "https://images.phylopic.org/images/7e27ce06-1f4f-45d8-a359-dcba8fc54b9b/thumbnail/64x64.png",
                                            sizes: "64x64",
                                            type: "image/png",
                                        },
                                    ],
                                },
                                modifiedFile: "2019-05-08T16:34:53.653Z",
                                uuid: "7e27ce06-1f4f-45d8-a359-dcba8fc54b9b",
                            }}
                        />
                        <h3>You Won!</h3>
                    </>
                )}
                {!won && lost && (
                    <>
                        <ImageThumbnailView
                            value={{
                                _links: {
                                    self: {
                                        href: "/images/42899e94-1ec9-43ce-aafc-236c3ef0f916?build=346",
                                        title: "Phaeodactylum tricornutum",
                                    },
                                    thumbnailFiles: [
                                        {
                                            href: "https://images.phylopic.org/images/42899e94-1ec9-43ce-aafc-236c3ef0f916/thumbnail/192x192.png",
                                            sizes: "192x192",
                                            type: "image/png",
                                        },
                                        {
                                            href: "https://images.phylopic.org/images/42899e94-1ec9-43ce-aafc-236c3ef0f916/thumbnail/128x128.png",
                                            sizes: "128x128",
                                            type: "image/png",
                                        },
                                        {
                                            href: "https://images.phylopic.org/images/42899e94-1ec9-43ce-aafc-236c3ef0f916/thumbnail/64x64.png",
                                            sizes: "64x64",
                                            type: "image/png",
                                        },
                                    ],
                                },
                                modifiedFile: "2023-12-02T03:09:00.098Z",
                                uuid: "42899e94-1ec9-43ce-aafc-236c3ef0f916",
                            }}
                        />
                        <h3>Sorry!</h3>
                        <p>
                            Better luck next time.
                            {state?.answers.length ? (
                                <>
                                    {" "}
                                    You still identified <NumberView value={state.answers.length} /> of the four clades!
                                </>
                            ) : null}
                        </p>
                    </>
                )}
                <p>Click on any of the clades to see more silhouettes and learn more.</p>
                {!onNewGame && <PracticeButton />}
                {onNewGame && <NewGameButton onClick={onNewGame} />}
                <ShareButton />
            </div>
        </Drawer>
    )
}
