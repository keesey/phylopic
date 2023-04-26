import { FC, Fragment, useMemo } from "react"
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
                        <Fragment key={child.uuid}>
                            {index > 0 && (
                                <Link className={styles.operator} href={href} title={title}>
                                    {","}
                                </Link>
                            )}
                            <QuickLinkNodeView node={child} />
                        </Fragment>
                    ))}
                    <Link className={styles.operator} href={href} title={title}>
                        {")\u200B"}
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
const compareChildren = (a: QuickLinkNode, b: QuickLinkNode) => {
    return (
        getLabelCount(a) - getLabelCount(b) ||
        getDepth(a) - getDepth(b) ||
        (a.slug < b.slug ? -1 : a.slug > b.slug ? 1 : 0)
    )
}
const deslugify = (s: string) => capitalize(s.replaceAll("-", " "))
const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)
const getLabelCount = (node: QuickLinkNode): number => {
    const self = node.label ? 1 : 0
    const children = node.children?.reduce<number>((prev, child) => prev + getLabelCount(child), 0) ?? 0
    return self + children
}
const getDepth = (node: QuickLinkNode, parentDepth = 0): number => {
    if (!node.children?.length) {
        return parentDepth + 1
    }
    return node.children.reduce<number>((prev, child) => Math.max(prev, getDepth(child, parentDepth + 1)), 0)
}
