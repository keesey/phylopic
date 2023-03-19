import Link from "next/link"
import { ReactNode, FC } from "react"
import styles from "./Breadcrumbs.module.scss"

export type BreadcrumbItem = Readonly<{
    children: ReactNode
    href?: string
}>
export interface Props {
    items: readonly BreadcrumbItem[]
}
const isExternalLink = (s: string) => /^(https?:)?\/\//.test(s)
const Breadcrumbs: FC<Props> = ({ items }) => (
    <nav className={styles.main}>
        <ul>
            {items.map(({ children, href }, index) => (
                <li key={index}>
                    {href ? (
                        isExternalLink(href) ? (
                            <a href={href}>{children}</a>
                        ) : (
                            <Link href={href} legacyBehavior>
                                {children}
                            </Link>
                        )
                    ) : (
                        children
                    )}
                </li>
            ))}
        </ul>
    </nav>
)
export default Breadcrumbs
