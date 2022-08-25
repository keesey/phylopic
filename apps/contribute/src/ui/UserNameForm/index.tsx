import { FC, FormEvent, useCallback, useState } from "react"
import Speech from "../Speech"
import SpeechStack from "../SpeechStack"
import UserInput from "../UserInput"
import styles from "./index.module.scss"
type Props = {
    onSubmit: (name: string) => void
    value: string
}
const UserNameForm: FC<Props> = ({ onSubmit, value }) => {
    const [name, setName] = useState(value)
    const handleFormSubmit = useCallback(
        (event: FormEvent) => {
            event.preventDefault()
            const trimmed = name.trim().replaceAll(/\s+/g, " ")
            if (!trimmed) {
                alert("You have to give me something.")
            } else {
                onSubmit(trimmed)
            }
        },
        [name, onSubmit],
    )
    return (
        <form onSubmit={handleFormSubmit}>
            <Speech mode="user">
                <SpeechStack compact fullWidth>
                    <span className={styles.nameLabel}>My name is&nbsp;</span>
                    <UserInput
                        autoComplete="name"
                        id="name"
                        maxLength={128}
                        name="name"
                        onChange={setName}
                        placeholder="Full Name or Alias"
                        required
                        type="text"
                        value={name}
                    />
                    <span>.</span>
                </SpeechStack>
            </Speech>
        </form>
    )
}
export default UserNameForm
