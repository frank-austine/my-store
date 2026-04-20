'use client';

import { useEffect } from 'react';

export default function AntiCopyWrapper({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Disable right click
    const handleContextMenu = (e: MouseEvent) => e.preventDefault();

    // Disable common copy/save shortcuts
    const handleKeyDown = (e: KeyboardEvent) => {
      const blocked = (
        // Ctrl+C, Ctrl+U, Ctrl+S, Ctrl+A, Ctrl+P
        (e.ctrlKey && ['c', 'u', 's', 'a', 'p'].includes(e.key.toLowerCase())) ||
        // F12 devtools
        e.key === 'F12' ||
        // Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+Shift+C
        (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(e.key.toLowerCase()))
      );
      if (blocked) e.preventDefault();
    };

    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <div className="select-none" style={{ WebkitUserSelect: 'none' }}>
      {children}
    </div>
  );
}