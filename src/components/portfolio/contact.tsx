import Link from "next/link";
import React from "react";

const Contact = () => {
  return (
    <div className="w-full flex items-center justify-center my-14">
      <Link
        className="text-sm text-gray-600 dark:text-gray-300 w-1/2 sm:w-1/3 text-center font-bold rounded-full py-2 px-4 border-2 border-foreground transition-colors hover:bg-foreground hover:text-primary"
        href="https://www.linkedin.com/in/marcospenelascamara"
        target="_blank"
      >
        Contact Me
      </Link>
    </div>
  );
};

export default Contact;
