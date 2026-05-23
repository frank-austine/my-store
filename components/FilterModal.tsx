'use client';

import { useState } from 'react';

const CATEGORIES = [
  'Exotic',
  'Indoor',
  'Indoor Smalls',
  'Indoor Mediums',
  'Licensed Exotic',
  'Licensed Indoor',
  'Concentrates',

];

type Props = {
  isOpen: boolean;
  onClose: () => void;
  selected: string[];
  onApply: (selected: string[]) => void;
};

export default function FilterModal({ isOpen, onClose, selected, onApply }: Props) {
  const [localSelected, setLocalSelected] = useState<string[]>(selected);
  const [categoryOpen, setCategoryOpen] = useState(true);

  if (!isOpen) return null;

  function toggle(cat: string) {
    setLocalSelected((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  }

  function handleDone() {
    onApply(localSelected);
    onClose();
  }

  function handleClear() {
    setLocalSelected([]);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-[#1a1a1a] rounded-2xl w-full max-w-sm flex flex-col overflow-hidden shadow-2xl">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#2a2a2a]">
          <h2 className="text-white font-bold text-base">Filter</h2>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-[#2a2a2a] flex items-center justify-center text-gray-400 hover:text-white transition text-sm"
          >
            ✕
          </button>
        </div>

        {/* Category section */}
        <div className="flex-1 overflow-y-auto px-5 py-4" style={{ maxHeight: '60vh' }}>
          {/* Category toggle */}
          <button
            onClick={() => setCategoryOpen(!categoryOpen)}
            className="flex items-center justify-between w-full mb-4"
          >
            <span className="text-white font-bold text-sm">Category</span>
            <svg
              width="16" height="16" viewBox="0 0 24 24"
              fill="none" stroke="#8B7B2A" strokeWidth="2"
              className={`transition-transform duration-200 ${categoryOpen ? 'rotate-180' : ''}`}
            >
              <polyline points="6 9 12 15 18 9"/>
            </svg>
          </button>

          {categoryOpen && (
            <div className="space-y-0.5">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => toggle(cat)}
                  className="flex items-center justify-between w-full px-2 py-3 rounded-xl hover:bg-[#222] transition"
                >
                  <span className="text-gray-300 text-sm font-medium">{cat}</span>
                  {/* Checkbox */}
                  <div className={`w-5 h-5 rounded border flex items-center justify-center transition ${
                    localSelected.includes(cat)
                      ? 'bg-[#8B7B2A] border-[#8B7B2A]'
                      : 'border-gray-600 bg-transparent'
                  }`}>
                    {localSelected.includes(cat) && (
                      <svg width="10" height="10" viewBox="0 0 12 12" fill="none" stroke="white" strokeWidth="2">
                        <polyline points="2 6 5 9 10 3"/>
                      </svg>
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Footer buttons */}
        <div className="flex gap-3 px-5 py-4 border-t border-[#2a2a2a]">
          <button
            onClick={handleClear}
            className="flex-1 py-4 rounded-2xl bg-[#2a2a2a] hover:bg-[#333] text-white font-bold text-sm transition"
          >
            Clear all
          </button>
          <button
            onClick={handleDone}
            className="flex-1 py-4 rounded-2xl bg-[#8B7B2A] hover:bg-[#a08f30] text-white font-bold text-sm transition"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}