import Link from "next/link"
import { FC, ReactNode } from "react"
import customEvents from "~/analytics/customEvents"
import styles from "./index.module.scss"
export type BreadcrumbItem = Readonly<{
    children: ReactNode
    href?: string
    label?: string
    onClick?: () => void
}>
export interface Props {
    items: readonly BreadcrumbItem[]
}
const Breadcrumbs: FC<Props> = ({ items }) => (
    <nav className={styles.main}>
        <ul>
            {items.map((item, index) => (
                <li key={item.href ?? index}>
                    {item.href ? (
                        <Link
                            href={item.href}
                            onClick={() => {
                                customEvents.clickLink(
                                    "breadcrumb",
                                    item.href ?? "",
                                    item.label ?? String(item.children),
                                    "link",
                                )
                                customEvents.clickBreadcrumb(item.href, index)
                                item.onClick?.()
                            }}
                        >
                            {item.children}
                        </Link>
                    ) : (
                        item.children
                    )}
                </li>
            ))}
        </ul>
    </nav>
)
export default Breadcrumbs
