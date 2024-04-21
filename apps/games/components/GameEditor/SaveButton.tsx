"use client"
import { ValidationFault } from "@phylopic/utils"
import { FC, useContext } from "react"
import { EditorContext, getMeta, select } from "~/lib/edit"
import { GameInstance } from "~/lib/s3/GameInstance"
import styles from "./SaveButton.module.scss"
export interface Props {
    code: string
    onSave: (instance: GameInstance<unknown>) => Promise<void>
}
export const SaveButton: FC<Props> = ({ code, onSave }) => {
    const [state, dispatch] = useContext(EditorContext) ?? []
    const active = Boolean(state && select.canSave(state))
    const handleClick =
        state && active
            ? () => {
                  ;(async () => {
                      try {
                          const validate = await import(`~/games/${code}/edit/validate`).then(
                              mod => mod.validate as (content: unknown) => Promise<readonly ValidationFault[]>,
                          )
                          const content = select.current(state)
                          const faults = await validate(content)
                          if (faults.length) {
                              alert(`Some issues were found:\n${faults.map(fault => `• ${fault.message}`).join("\n")}`)
                          } else {
                              const instance = {
                                  meta: getMeta(),
                                  content,
                              }
                              await onSave(instance)
                              dispatch?.({ type: "INITIALIZE", payload: content })
                              alert("Your changes have been saved.")
                          }
                      } catch (e) {
                          alert(String(e))
                      }
                  })()
              }
            : null
    return (
        <button className={styles.main} disabled={!active} onClick={() => handleClick?.()}>
            Save
        </button>
    )
}
