import clsx from "clsx"
import { FC, Key, ReactNode } from "react"
import Header, { HeaderLevel } from "../Header"
import HeaderNavButton, { Props as HeaderNavButtonProps } from "./HeaderNavButton"
import styles from "./index.module.scss"
export interface Props {
    buttons: ReadonlyArray<HeaderNavButtonProps & { key: Key }>
    header: ReactNode
    headerLevel: HeaderLevel
}
const HeaderNav: FC<Props> = ({ buttons, header, headerLevel }) => {
    return (
        <div className={clsx(styles.main, styles[`main-level-${headerLevel}`])}>
            <Header level={headerLevel}>{header}</Header>
            <div className={styles.buttons}>
                {buttons.map(({ key, ...buttonProps }) => (
                    <HeaderNavButton key={key} {...buttonProps} />
                ))}
            </div>
        </div>
    )
}
export default HeaderNav
