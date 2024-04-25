import React from 'react'
import { ThemeToggle } from '../theme/theme-toggle'

const Header = () => {
    return (
        <header className='flex mb-8 md:mb-16 items-center'>
            Marcos Cámara
            
            <nav className="font-mono text-xs grow justify-end items-center flex gap-1 md:gap-3">
                <ThemeToggle />
            </nav>
        </header>
    )
}

export default Header
