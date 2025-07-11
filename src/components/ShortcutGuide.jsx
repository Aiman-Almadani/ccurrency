import React from "react";

const ShortcutGuide = () => {
  const shortcuts = [
    { key: "Ctrl+C", description: "Copy converted amount" },
    { key: "Space", description: "Swap currencies" },
    { key: "Enter", description: "Focus amount input" },
  ];

  return (
    <div className="w-full max-w-md">
      <div className="grid grid-cols-[auto_1fr] gap-x-2 gap-y-2 text-xs text-gray-500 dark:text-gray-400">
        {shortcuts.map((shortcut, index) => (
          <React.Fragment key={index}>
            <div className="flex items-center justify-end">
              <kbd className="px-1 flex w-full justify-center py-0.5 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded text-gray-600 dark:text-gray-300 font-mono min-w-[20px] text-center">
                {shortcut.key}
              </kbd>
            </div>
            <div className="flex items-center">
              {shortcut.description}
            </div>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default ShortcutGuide;
