import { AnchorLink, AnchorLinkProps } from "@phylopic/ui"
import clsx from "clsx"
import { FC, HTMLProps, useMemo } from "react"
import styles from "./index.module.scss"
export type Props = ({ type: "anchor" } & AnchorLinkProps) | ({ type: "button" } & HTMLProps<HTMLButtonElement>)
const HeaderNavButton: FC<Props> = props => {
    const combinedClassName = useMemo(() => clsx([props.className, styles.main]), [props.className])
    if (props.type === "button") {
        const { children, className: _className, type: _type, ...otherProps } = props
        return (
            <button className={combinedClassName} {...otherProps}>
                {children}
            </button>
        )
    } else {
        const { children, className: _className, type: _type, ...otherProps } = props
        return (
            <AnchorLink className={combinedClassName} {...otherProps}>
                {children}
            </AnchorLink>
        )
    }
}
export default HeaderNavButton
