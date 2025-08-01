'use client';

import { useState } from 'react';
import { useTheme } from 'next-themes';
import { motion, AnimatePresence } from 'framer-motion';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [isHovering, setIsHovering] = useState(false);

  return (
    <div className="flex items-center">
      <AnimatePresence>
        {isHovering && (
          <motion.span
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            className="text-[9px] text-gray-400 mr-2 hidden md:inline"
          >
            {theme}
          </motion.span>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        transition={{ type: 'spring', stiffness: 400, damping: 17 }}
        aria-label="Toggle theme"
        className="inline-flex rounded-sm p-2 
        text-color-primary
        bg-foreground
        theme-system:!bg-inherit"
        onClick={(ev) => {
          ev.preventDefault();

          if (theme === 'system') {
            setTheme('dark');
          }
          if (theme === 'light') {
            setTheme('system');
          }
          if (theme === 'dark') {
            setTheme('light');
          }
        }}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        <AnimatePresence mode="wait">
          {theme === 'dark' ? (
            <motion.span
              key="sun"
              initial={{ opacity: 0, rotate: -180, scale: 0.5 }}
              animate={{ opacity: 1, rotate: 0, scale: 1 }}
              exit={{ opacity: 0, rotate: 180, scale: 0.5 }}
              transition={{ duration: 0.2 }}
              className="sun-icon"
            >
              <SunIcon />
            </motion.span>
          ) : (
            <motion.span
              key="moon"
              initial={{ opacity: 0, rotate: 180, scale: 0.5 }}
              animate={{ opacity: 1, rotate: 0, scale: 1 }}
              exit={{ opacity: 0, rotate: -180, scale: 0.5 }}
              transition={{ duration: 0.2 }}
              className="moon-icon"
            >
              <MoonIcon />
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
}

function MoonIcon(props: any) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={16}
      height={16}
      strokeWidth={0}
      viewBox="0 0 56 56"
      {...props}
    >
      <path
        d="M41.2 36.1c-12.9 0-21-7.8-21-20.3 0-3.5.7-6.7 1.6-8.3.3-.7.4-1 .4-1.5 0-.8-.7-1.7-1.7-1.7-.2 0-.7 0-1.3.3A24.5 24.5 0 004.4 27.1 23.8 23.8 0 0029 51.7c10.2 0 18.4-5.3 22.3-14.1l.3-1.4c0-1-.9-1.6-1.6-1.6a3 3 0 00-1.2.2c-2 .8-4.8 1.3-7.6 1.3zM8.1 27c0-7.3 3.8-14.3 9.9-18-.8 2-1.2 4.5-1.2 7.2 0 14.6 9 23.3 23.9 23.3 2.4 0 4.5-.2 6.4-1a20.8 20.8 0 01-18 9.6C17 48 8.1 39 8.1 27z"
        stroke="none"
        fill="currentColor"
      />
    </svg>
  );
}

function SunIcon(props: any) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={16}
      height={16}
      strokeWidth={0}
      viewBox="0 0 56 56"
      {...props}
    >
      <path
        d="M30 4.6c0-1-.9-2-2-2a2 2 0 00-2 2v5c0 1 .9 2 2 2s2-1 2-2zm9.6 9a2 2 0 000 2.8c.8.8 2 .8 2.9 0L46 13a2 2 0 000-2.9 2 2 0 00-3 0zm-26 2.8c.7.8 2 .8 2.8 0 .8-.7.8-2 0-2.9L13 10c-.7-.7-2-.8-2.9 0-.7.8-.7 2.1 0 3zM28 16a12 12 0 00-12 12 12 12 0 0012 12 12 12 0 0012-12 12 12 0 00-12-12zm0 3.6c4.6 0 8.4 3.8 8.4 8.4 0 4.6-3.8 8.4-8.4 8.4a8.5 8.5 0 01-8.4-8.4c0-4.6 3.8-8.4 8.4-8.4zM51.3 30c1.1 0 2-.9 2-2s-.9-2-2-2h-4.9a2 2 0 00-2 2c0 1.1 1 2 2 2zM4.7 26a2 2 0 00-2 2c0 1.1.9 2 2 2h4.9c1 0 2-.9 2-2s-1-2-2-2zm37.8 13.6a2 2 0 00-3 0 2 2 0 000 2.9l3.6 3.5a2 2 0 002.9 0c.8-.8.8-2.1 0-3zM10 43.1a2 2 0 000 2.9c.8.7 2.1.8 3 0l3.4-3.5c.8-.8.8-2.1 0-2.9-.8-.8-2-.8-2.9 0zm20 3.4c0-1.1-.9-2-2-2a2 2 0 00-2 2v4.9c0 1 .9 2 2 2s2-1 2-2z"
        stroke="none"
        fill="currentColor"
      />
    </svg>
  );
}
