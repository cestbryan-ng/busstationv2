"use client"

import React, { JSX, useState } from "react"
import Link from "next/link"
import { MapPin, Mail, Phone, Globe, ChevronDown, Clock } from "lucide-react"
import { FiFacebook, FiInstagram, FiLinkedin, FiTwitter } from "react-icons/fi"
import { useTranslation } from "react-i18next"
import { changeLanguage } from "@/lib/services/i18n-services/languageService"
import { LinkListProps, SocialLinkProps } from "@/lib/types/ui"
import { SupportedLanguage } from "@/lib/types/common"

const FooterLink = ({ link, name }: LinkListProps) => (
    <li>
        <Link
            href={link}
            className="group flex items-center gap-2 text-xs font-normal text-slate-400 hover:text-white transition-colors duration-200"
        >
            <span className="w-1 h-1 rounded-full bg-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
            {name}
        </Link>
    </li>
)

const SocialLink = ({ href, icon: Icon, label }: SocialLinkProps & { label: string }) => (
    <Link
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={label}
        className="w-8 h-8 rounded-lg border border-slate-700 flex items-center justify-center text-slate-400 hover:text-white hover:border-blue-500 hover:bg-blue-500/10 transition-all duration-200"
    >
        <Icon size={14} />
    </Link>
)

export default function Footer(): JSX.Element {
    const { t, i18n } = useTranslation()
    const [isLanguageMenuOpen, setIsLanguageMenuOpen] = useState<boolean>(false)
    const languages: SupportedLanguage[] = ["fr", "en"]

    function updateLanguage(lang: SupportedLanguage): void {
        changeLanguage(lang)
        setIsLanguageMenuOpen(false)
    }

    function translate(key: string): string {
        return t("footer." + key)
    }

    const quickLinks = [
        { name: translate("trip"), link: "/market-place" },
        { name: translate("agency"), link: "/agency" },
        { name: translate("about-us"), link: "/about" },
        { name: translate("contact-us"), link: "/contact-us" },
    ]

    const legalLinks = [
        { name: translate("terms-and-condition"), link: "/term-and-conditions" },
        { name: translate("privacy-policy"), link: "/privacy-policy" },
        { name: translate("cookies"), link: "/cookies" },
        { name: translate("faq"), link: "/faq" },
    ]

    const socialMedia = [
        { href: "https://facebook.com", icon: FiFacebook, label: "Facebook", color: "" },
        { href: "https://twitter.com", icon: FiTwitter, label: "Twitter", color: "" },
        { href: "https://instagram.com", icon: FiInstagram, label: "Instagram", color: "" },
        { href: "https://linkedin.com", icon: FiLinkedin, label: "LinkedIn", color: "" },
    ]

    const contactInfo = [
        { icon: MapPin, text: "BP 9878, 75001 Yaounde, Cameroon", link: undefined },
        { icon: Mail, text: "contact@busstation.com", link: "mailto:contact@busstation.com" },
        { icon: Phone, text: "+237 6 98 45 67 89", link: undefined },
        { icon: Clock, text: translate("schedule"), link: undefined },
    ]

    return (
        <footer className="bg-[#0f1117] border-t border-slate-800/60 text-white">
            <div className="container mx-auto px-6 py-10">

                {/* Séparateur haut discret */}
                <div className="flex flex-col md:flex-row justify-between gap-10 mb-8">

                    {/* Brand block */}
                    <div className="shrink-0 md:max-w-55">
                        {/* Logo */}
                        <div className="flex items-center gap-2.5 mb-3">
                            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-600/20">
                                <span className="font-bold text-sm text-white">B</span>
                            </div>
                            <span className="text-sm font-semibold text-slate-800 dark:text-white tracking-tight">
                                Bus Station
                            </span>
                        </div>

                        {/* Slogan */}
                        <p className="text-xs font-normal text-slate-400 leading-relaxed mb-5">
                            {translate("slogan")}
                        </p>

                        {/* Social */}
                        <p className="text-xs font-medium uppercase tracking-wider text-slate-500 mb-2.5">
                            {translate("followUs")}
                        </p>
                        <div className="flex items-center gap-2">
                            {socialMedia.map((s, i) => (
                                <SocialLink key={i} {...s} />
                            ))}
                        </div>
                    </div>

                    {/* Links grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 flex-1 md:justify-end">

                        {/* Quick Links */}
                        <div>
                            <h3 className="text-xs font-medium uppercase tracking-wider text-slate-500 mb-3 pb-2 border-b border-slate-800">
                                {translate("quickLink")}
                            </h3>
                            <ul className="space-y-2">
                                {quickLinks.map((item, i) => (
                                    <FooterLink key={i} link={item.link} name={item.name} />
                                ))}
                            </ul>
                        </div>

                        {/* Legal */}
                        <div>
                            <h3 className="text-xs font-medium uppercase tracking-wider text-slate-500 mb-3 pb-2 border-b border-slate-800">
                                {translate("legal")}
                            </h3>
                            <ul className="space-y-2">
                                {legalLinks.map((item, i) => (
                                    <FooterLink key={i} link={item.link} name={item.name} />
                                ))}
                            </ul>
                        </div>

                        {/* Contact */}
                        <div>
                            <h3 className="text-xs font-medium uppercase tracking-wider text-slate-500 mb-3 pb-2 border-b border-slate-800">
                                {translate("contact")}
                            </h3>
                            <ul className="space-y-2.5">
                                {contactInfo.map(({ icon: Icon, text, link }, i) => (
                                    <li key={i} className="flex items-start gap-2">
                                        <Icon className="h-3.5 w-3.5 text-blue-500 shrink-0 mt-0.5" />
                                        {link ? (
                                            <a
                                                href={link}
                                                className="text-xs font-normal text-slate-400 hover:text-white transition-colors duration-200 leading-snug"
                                            >
                                                {text}
                                            </a>
                                        ) : (
                                            <span className="text-xs font-normal text-slate-400 leading-snug">
                                                {text}
                                            </span>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        </div>

                    </div>
                </div>

                {/* Bottom bar */}
                <div className="pt-5 border-t border-slate-800/60 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <p className="text-xs font-normal text-slate-500">
                        &copy; {new Date().getFullYear()} {translate("allRight")}
                    </p>

                    {/* Language switcher */}
                    <div className="relative">
                        <button
                            onClick={() => setIsLanguageMenuOpen(!isLanguageMenuOpen)}
                            className="flex items-center gap-1.5 text-xs font-normal text-slate-400 hover:text-white px-2.5 py-1.5 rounded-md border border-slate-700 hover:border-slate-500 transition-all duration-200"
                        >
                            <Globe className="h-3 w-3" />
                            <span>{(i18n.language || "fr").toUpperCase()}</span>
                            <ChevronDown
                                className={`h-2.5 w-2.5 transition-transform duration-200 ${isLanguageMenuOpen ? "rotate-180" : ""}`}
                            />
                        </button>

                        {isLanguageMenuOpen && (
                            <div className="absolute right-0 bottom-full mb-2 w-28 bg-[#1a1d27] border border-slate-700 rounded-md shadow-xl z-50 overflow-hidden">
                                {languages.map((lang, i) => (
                                    <button
                                        key={i}
                                        onClick={() => updateLanguage(lang)}
                                        className="block w-full text-left px-3 py-2 text-xs font-normal text-slate-300 hover:bg-slate-800 hover:text-white transition-colors duration-150"
                                    >
                                        {lang.toUpperCase()}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </footer>
    )
}