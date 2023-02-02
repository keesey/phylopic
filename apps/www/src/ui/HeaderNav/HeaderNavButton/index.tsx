import clsx from "clsx"
import Link, { LinkProps } from "next/link"
import { FC, HTMLProps, PropsWithChildren, useMemo } from "react"
import styles from "./index.module.scss"
export type Props =
    | PropsWithChildren<{ className?: string; type: "anchor" } & LinkProps>
    | ({ type: "button" } & HTMLProps<HTMLButtonElement>)
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
            <Link className={combinedClassName} {...otherProps}>
                {children}
            </Link>
        )
    }
}
export default HeaderNavButton
