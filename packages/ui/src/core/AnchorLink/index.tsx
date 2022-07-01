/* eslint-disable jsx-a11y/anchor-is-valid */
import Link, { LinkProps } from "next/link"
import { AnchorHTMLAttributes, DetailedHTMLProps, FC } from "react"
export type AnchorLinkProps = LinkProps & DetailedHTMLProps<AnchorHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement>
export const AnchorLink: FC<AnchorLinkProps> = ({
    as,
    children,
    href,
    locale,
    passHref,
    prefetch,
    replace,
    scroll,
    shallow,
    ...anchorProps
}) => (
    <Link
        as={as}
        href={href}
        locale={locale}
        passHref={passHref}
        prefetch={prefetch}
        replace={replace}
        scroll={scroll}
        shallow={shallow}
    >
        <a {...anchorProps}>{children}</a>
    </Link>
)
export default AnchorLink
