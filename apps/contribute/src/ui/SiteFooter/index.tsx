import clsx from "clsx"
import Image from "next/image"
import Link from "next/link"
import { FC } from "react"
import logoDiscord from "../../../public/logos/discord.svg"
import logoFacebook from "../../../public/logos/facebook.svg"
import logoMail from "../../../public/logos/mail.svg"
import logoMastodon from "../../../public/logos/mastodon.svg"
import logoPatreon from "../../../public/logos/patreon-white.svg"
import styles from "./index.module.scss"
const YEAR = new Date().getFullYear()
const SiteFooter: FC = () => (
    <nav className={styles.main}>
        <ul>
            <li className={styles.item}>Version 2.0</li>
            <li className={styles.item}>
                <abbr title="Copyright">©</abbr> {YEAR} <a href="http://tmkeesey.net">T. Michael Keesey</a>
            </li>
            <li className={clsx(styles.item, styles.logos)}>
                <Link
                    className={styles.textIcon}
                    href={`${process.env.NEXT_PUBLIC_WWW_URL}/mailinglist`}
                    title="Subscribe to the PhyloPic mailing list."
                >
                    <Image src={logoMail} width={28} height={28} alt="Mailing List" />
                </Link>
                <a href="https://sauropods.win/@phylopic" rel="me" title="Follow PhyloPic on Mastodon.">
                    <Image src={logoMastodon} width={25} height={25} alt="Mastodon" />
                </a>
                <a href="https://discord.gg/RtrWAzTEce" title="Join the discussion on Discord.">
                    <Image src={logoDiscord} width={27.7} height={21} alt="Discord" />
                </a>
                <a href="https://www.facebook.com/phylopic" rel="me" title="Follow PhyloPic on Facebook.">
                    <Image src={logoFacebook} width={21} height={21} alt="Facebook" />
                </a>
                <a
                    href="https://www.patreon.com/tmkeesey?fan_landing=true"
                    rel="author"
                    title="Support the creator of PhyloPic on Patreon."
                >
                    <Image src={logoPatreon} width={80} height={11} alt="Patreon" />
                </a>
                <a href="https://www.buymeacoffee.com/phylopic" className={styles.buyMeACoffee}>
                    <Image
                        alt="Buy me a coffee."
                        height={50}
                        src="https://img.buymeacoffee.com/button-api/?text=Buy me a coffee&emoji=&slug=phylopic&button_colour=f5bb00&font_colour=000000&font_family=Poppins&outline_colour=000000&coffee_colour=fade85"
                        unoptimized
                        width={235}
                    />
                </a>
            </li>
        </ul>
    </nav>
)
export default SiteFooter
