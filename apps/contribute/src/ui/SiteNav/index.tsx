import { INCOMPLETE_STRING } from "@phylopic/source-models"
import { UUID } from "@phylopic/utils"
import { useRouter } from "next/router"
import { FC, useState } from "react"
import useAuthorized from "~/auth/hooks/useAuthorized"
import useSubmission from "~/editing/useSubmission"
import useContributor from "~/profile/useContributor"
import SiteTitle from "../SiteTitle"
import DropDownMenu from "./DropDownMenu"
import styles from "./index.module.scss"
import NavItem from "./NavItem"
export type Props = {
    submissionUUID?: UUID
}
const SiteNav: FC<Props> = ({ submissionUUID }) => {
    const authorized = useAuthorized()
    const contributor = useContributor()
    const enabled = authorized && Boolean(contributor?.name && contributor.name !== INCOMPLETE_STRING)
    const [selected, setSelected] = useState<"account" | "file" | "edit" | "site" | "view" | undefined>()
    const submission = useSubmission(submissionUUID)
    const router = useRouter()
    return (
        <>
            <nav className={styles.main}>
                <NavItem
                    label={<SiteTitle />}
                    onToggle={() => setSelected(selected === "site" ? undefined : "site")}
                    selected={selected === "site"}
                />
                <NavItem
                    label="File"
                    disabled={!enabled}
                    onToggle={() => setSelected(selected === "file" ? undefined : "file")}
                    selected={selected === "file"}
                />
                <NavItem
                    label="Edit"
                    disabled={!enabled || !submission}
                    onToggle={() => setSelected(selected === "edit" ? undefined : "edit")}
                    selected={selected === "edit"}
                />
                <NavItem
                    label="View"
                    disabled={!enabled}
                    onToggle={() => setSelected(selected === "view" ? undefined : "view")}
                    selected={selected === "view"}
                />
                <div className={styles.spacer} role="separator" />
                {enabled && (
                        <NavItem
                            label={contributor!.name}
                            onToggle={() => setSelected(selected === "account" ? undefined : "account")}
                            selected={selected === "account"}
                        />
                )}
                {!enabled && (
                        <NavItem
                            label="Sign In"
                            onToggle={() => router.push("/")}
                            selected={false}
                        />
                )}
            </nav>
            <DropDownMenu submission={submission} selected={selected} />
        </>
    )
}
export default SiteNav
