'use client';

import { useState } from 'react';
import { Caption } from './caption';
import { HiOutlineClipboard, HiOutlineCheck } from 'react-icons/hi2';
import { motion, AnimatePresence } from 'framer-motion';

export const Snippet = ({ children, scroll = true, caption = null }: any) => {
  const [isHovering, setIsHovering] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const extractTextFromReactElement = (element: any): string => {
    if (!element) return '';

    if (typeof element === 'string') return element;

    if (element.props?.children) {
      return typeof element.props.children === 'string' ? element.props.children : '';
    }

    return '';
  };

  const handleCopy = async () => {
    try {
      const textToCopy = extractTextFromReactElement(children);
      await navigator.clipboard.writeText(textToCopy);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('Error al copiar el texto:', err);
    }
  };

  return (
    <div
      className="my-6 relative group"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <pre
        className={`
        p-4
        text-sm
        bg-foreground 
        rounded
        ${scroll ? 'overflow-auto' : 'whitespace-pre-wrap break-all overflow-hidden'}
      `}
      >
        <code>{children}</code>
      </pre>

      <AnimatePresence>
        {isHovering && (
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 400, damping: 17 }}
            aria-label="Copiar código"
            className={`
              absolute top-2 right-2 
              inline-flex rounded-sm p-2 
              text-color-primary
              bg-foreground
              hover:bg-gray-700
            `}
            onClick={handleCopy}
          >
            <AnimatePresence mode="wait">
              {isCopied ? (
                <motion.span
                  key="check"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <HiOutlineCheck size={16} />
                </motion.span>
              ) : (
                <motion.span
                  key="copy"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <HiOutlineClipboard size={16} />
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        )}
      </AnimatePresence>

      {caption != null ? <Caption>{caption}</Caption> : null}
    </div>
  );
};
