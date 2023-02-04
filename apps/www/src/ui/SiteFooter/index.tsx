import clsx from "clsx"
import Image from "next/image"
import Link from "next/link"
import { FC } from "react"
import logoDiscord from "../../../public/logos/discord.svg"
import logoFacebook from "../../../public/logos/facebook.svg"
import logoMail from "../../../public/logos/mail.svg"
import logoMastodon from "../../../public/logos/mastodon.svg"
import logoPatreon from "../../../public/logos/patreon-white.svg"
import CollectionsDrawer from "../CollectionsDrawer"
import styles from "./index.module.scss"
const YEAR = new Date().getFullYear()
const SiteFooter: FC = () => (
    <footer className={styles.main}>
        <CollectionsDrawer />
        <ul className={styles.content}>
            <li className={clsx(styles.item, styles.optional)}>
                Version 2.0 <abbr title="beta version">βɛτα</abbr>
            </li>
            <li className={styles.item}>
                <abbr title="Copyright">©</abbr> {YEAR}{" "}
                <a href="http://tmkeesey.net" rel="author">
                    T. Michael Keesey
                </a>
            </li>
            <li className={clsx(styles.item, styles.logos)}>
                <Link className={styles.textIcon} href="/mailinglist" title="Subscribe to the PhyloPic mailing list.">
                    <Image src={logoMail} width={28} height={28} alt="Mailing List" />
                </Link>
                <a href="https://sauropods.win/@phylopic" title="Follow PhyloPic on Mastodon." rel="me">
                    <Image src={logoMastodon} width={25} height={25} alt="Mastodon" />
                </a>
                <a href="https://discord.gg/RtrWAzTEce" title="Join the discussion on Discord.">
                    <Image src={logoDiscord} width={27.7} height={21} alt="Discord" />
                </a>
                <a href="https://www.facebook.com/phylopic" title="Follow PhyloPic on Facebook." rel="me">
                    <Image src={logoFacebook} width={21} height={21} alt="Facebook" />
                </a>
                <a
                    href="https://www.patreon.com/tmkeesey?fan_landing=true"
                    rel="author"
                    title="Support the creator of PhyloPic on Patreon."
                >
                    <Image src={logoPatreon} width={80} height={11} alt="Patreon" />
                </a>
            </li>
        </ul>
    </footer>
)
export default SiteFooter
