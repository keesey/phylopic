import { ReactNode, FC } from "react"
import AnchorLink from "../AnchorLink"
import styles from "./index.module.scss"
export type BreadcrumbItem = Readonly<{
    children: ReactNode
    href?: string
}>
export interface Props {
    items: readonly BreadcrumbItem[]
}
const Breadcrumbs: FC<Props> = ({ items }) => (
    <nav className={styles.main}>
        <ul>
            {items.map(({ children, href }, index) => (
                <li key={href ?? index}>{href ? <AnchorLink href={href}>{children}</AnchorLink> : children}</li>
            ))}
        </ul>
    </nav>
)
export default Breadcrumbs
