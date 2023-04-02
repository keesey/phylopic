import { FC, useMemo } from "react"
import { QuickLinkNode } from "../QuickLinkNode"
import styles from "./index.module.scss"
import getNodeSlug from "~/routes/getNodeSlug"
import Link from "next/link"
export interface Props {
    node: QuickLinkNode
}
const QuickLinkNodeView: FC<Props> = ({ node }) => {
    const href = `/nodes/${encodeURIComponent(node.uuid)}/${encodeURIComponent(getNodeSlug(node.slug))}`
    const title = deslugify(node.slug)
    const children = useMemo(() => {
        if (node.children) {
            return [...node.children].sort(compareChildren)
        }
        return []
    }, [node.children])
    return (
        <>
            {children.length > 0 && (
                <>
                    <Link className={styles.operator} href={href} title={title}>
                        {"("}
                    </Link>
                    {children.map((child, index) => (
                        <>
                            {index > 0 && (
                                <Link className={styles.operator} href={href} title={title}>
                                    {","}
                                </Link>
                            )}
                            <QuickLinkNodeView node={child} />
                        </>
                    ))}
                    <Link className={styles.operator} href={href} title={title}>
                        {")"}
                    </Link>
                </>
            )}
            {node.label && (
                <Link className={styles.name} href={href} title={title}>
                    {node.label}
                </Link>
            )}
        </>
    )
}
export default QuickLinkNodeView
const compareChildren = (a: QuickLinkNode, b: QuickLinkNode) => getLabelCount(a) - getLabelCount(b)
const deslugify = (s: string) => capitalize(s.replaceAll("-", " "))
const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)
const getLabelCount = (node: QuickLinkNode): number => {
    const self = node.label ? 1 : 0
    const children = node.children?.reduce<number>((prev, child) => prev + getLabelCount(child), 0) ?? 0
    return self + children
}
