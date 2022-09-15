/* eslint-disable @next/next/no-img-element */
import clsx from "clsx"
import Image from "next/future/image"
import Link from "next/link"
import { FC } from "react"
import logoFacebook from "../../../public/logos/facebook.svg"
import logoMail from "../../../public/logos/mail.svg"
import logoPatreon from "../../../public/logos/patreon-white.svg"
import logoTwitter from "../../../public/logos/twitter.svg"
import styles from "./index.module.scss"
const YEAR = new Date().getFullYear()
const SiteFooter: FC = () => (
    <nav className={styles.main}>
        <ul>
            <li className={styles.item}>
                Version 2.0 <abbr title="beta version">βɛτα</abbr>
            </li>
            <li className={styles.item}>
                <abbr title="Copyright">©</abbr> {YEAR} <a href="http://tmkeesey.net">T. Michael Keesey</a>
            </li>
            <li className={clsx(styles.item, styles.logos)}>
                <Link href={`${process.env.NEXT_PUBLIC_WWW_URL}/mailinglist`}>
                    <a className={styles.textIcon} title="Subscribe to the PhyloPic mailing list.">
                        <Image src={logoMail} width={28} height={28} alt="Mailing List" />
                    </a>
                </Link>
                <a href="https://www.twitter.com/phylopic" title="Follow @phylopic on Twitter.">
                    <Image src={logoTwitter} width={28} height={28} alt="Twitter" />
                </a>
                <a href="https://www.facebook.com/phylopic" title="Follow @phylopic on Facebook.">
                    <Image src={logoFacebook} width={21} height={21} alt="Facebook" />
                </a>
                <a
                    href="https://www.patreon.com/tmkeesey?fan_landing=true"
                    title="Support the creator of PhyloPic on Patreon."
                >
                    <Image src={logoPatreon} width={80} height={11} alt="Patreon" />
                </a>
            </li>
        </ul>
    </nav>
)
export default SiteFooter
