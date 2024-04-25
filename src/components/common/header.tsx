import React from 'react'
import { ThemeToggle } from '../theme/theme-toggle'
import { Logo } from './logo'
import Links from './links'

const Header = () => {
    return (
        <header className='flex mb-8 md:mb-16 items-center'>
            <Logo />

            <nav className="font-mono text-sm grow justify-end items-center flex gap-3 md:gap-5">
                <ThemeToggle />
                <Links />
            </nav>
        </header>
    )
}

export default Header
