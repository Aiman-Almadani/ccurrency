import React from "react";
import { APP_NAME } from "../utils/constants";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full mt-12 py-6 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 transition-colors duration-200">
      <div className="max-w-md mx-auto px-4">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            © {currentYear} {APP_NAME} •{" "}
            <a
              href="https://github.com/Aiman-Almadani/ccurrency"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#a0e870] hover:text-[#7fcf4c] transition-colors duration-200"
            >
              GitHub
            </a>
          </div>
          <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              Live Data
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
