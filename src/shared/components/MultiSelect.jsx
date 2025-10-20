import React, { useEffect, useMemo, useRef, useState } from "react";

// A multiselect dropdown with searchable options and tag-style selected values.
// Props:
// - label?: string
// - placeholder?: string
// - options: Array<{ value: string | number, label: string }>
// - value: Array<string | number>
// - onChange: (nextValues: Array<string | number>) => void
// - disabled?: boolean
// - error?: string
// - className?: string
// - renderTag?: (option, remove) => ReactNode
// - noResultsText?: string
const MultiSelect = ({
  label,
  placeholder = "Select...",
  options = [],
  value = [],
  onChange,
  disabled = false,
  error,
  className = "",
  renderTag,
  noResultsText = "No results",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(-1);

  const containerRef = useRef(null);
  const inputRef = useRef(null);
  const listRef = useRef(null);

  const baseInputClasses =
    "w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500";
  const errorClasses = error
    ? "border-red-300 focus:ring-red-500 focus:border-red-500"
    : "border-gray-300";

  const selectedSet = useMemo(() => new Set(value), [value]);
  const valueToOption = useMemo(() => {
    const map = new Map();
    for (const opt of options) map.set(opt.value, opt);
    return map;
  }, [options]);

  const selectedOptions = useMemo(
    () => value.map((v) => valueToOption.get(v)).filter(Boolean),
    [value, valueToOption]
  );

  const filteredOptions = useMemo(() => {
    const q = query.trim().toLowerCase();
    const base = q
      ? options.filter((o) => o.label.toLowerCase().includes(q))
      : options;
    return base;
  }, [options, query]);

  const toggleValue = (val) => {
    if (disabled) return;
    const next = new Set(value);
    if (next.has(val)) next.delete(val);
    else next.add(val);
    onChange?.(Array.from(next));
  };

  const removeValue = (val) => {
    if (disabled) return;
    const next = value.filter((v) => v !== val);
    onChange?.(next);
  };

  const handleOpen = () => {
    if (disabled) return;
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
    setQuery("");
    setActiveIndex(-1);
  };

  // Close on outside click
  useEffect(() => {
    const onClick = (e) => {
      if (!containerRef.current) return;
      if (!containerRef.current.contains(e.target)) {
        setIsOpen(false);
        setQuery("");
        setActiveIndex(-1);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  // Keyboard navigation
  const onKeyDown = (e) => {
    if (!isOpen) {
      if (e.key === "ArrowDown" || e.key === "Enter") {
        e.preventDefault();
        handleOpen();
        setActiveIndex(0);
      }
      return;
    }

    if (e.key === "Escape") {
      e.preventDefault();
      handleClose();
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((idx) =>
        Math.min((idx < 0 ? -1 : idx) + 1, filteredOptions.length - 1)
      );
      return;
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((idx) => Math.max((idx < 0 ? 0 : idx) - 1, 0));
      return;
    }
    if (e.key === "Enter") {
      e.preventDefault();
      if (activeIndex >= 0 && activeIndex < filteredOptions.length) {
        toggleValue(filteredOptions[activeIndex].value);
      }
      return;
    }
    if (e.key === "Backspace" && query.length === 0 && value.length > 0) {
      // Remove last selected when input empty
      removeValue(value[value.length - 1]);
    }
  };

  useEffect(() => {
    if (!isOpen || activeIndex < 0) return;
    const list = listRef.current;
    const item = list?.querySelector(`[data-index="${activeIndex}"]`);
    if (item && list) {
      const itemTop = item.offsetTop;
      const itemBottom = itemTop + item.offsetHeight;
      const viewTop = list.scrollTop;
      const viewBottom = viewTop + list.clientHeight;
      if (itemTop < viewTop) list.scrollTop = itemTop;
      else if (itemBottom > viewBottom) list.scrollTop = itemBottom - list.clientHeight;
    }
  }, [activeIndex, isOpen]);

  return (
    <div className={`w-full ${className}`} ref={containerRef}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}

      <div
        className={`${baseInputClasses} ${errorClasses} relative min-h-[2.5rem] cursor-text ${
          disabled ? "opacity-50 cursor-not-allowed" : ""
        }`}
        onClick={() => {
          if (disabled) return;
          handleOpen();
          inputRef.current?.focus();
        }}
        role="combobox"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-controls="multiselect-listbox"
        onKeyDown={onKeyDown}
      >
        {/* Tags + Input */}
        <div className="flex flex-wrap gap-1 items-center">
          {selectedOptions.map((opt) => (
            <div
              key={opt.value}
              className="flex items-center gap-1 bg-indigo-50 text-indigo-700 border border-indigo-200 px-2 py-0.5 rounded-md text-xs"
            >
              {renderTag ? (
                renderTag(opt, () => removeValue(opt.value))
              ) : (
                <>
                  <span>{opt.label}</span>
                  <button
                    type="button"
                    className="text-indigo-500 hover:text-indigo-700"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeValue(opt.value);
                    }}
                    aria-label={`Remove ${opt.label}`}
                  >
                    ×
                  </button>
                </>
              )}
            </div>
          ))}

          <input
            ref={inputRef}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              if (!isOpen) setIsOpen(true);
            }}
            placeholder={selectedOptions.length === 0 ? placeholder : ""}
            disabled={disabled}
            className="flex-1 min-w-[6ch] border-0 focus:ring-0 outline-none text-sm py-1"
          />
        </div>

        {/* Chevron */}
        <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
          <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      </div>

      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}

      {/* Dropdown */}
      {isOpen && (
        <div
          className="relative z-20"
          role="presentation"
        >
          <div
            id="multiselect-listbox"
            ref={listRef}
            role="listbox"
            aria-multiselectable="true"
            className="absolute mt-1 w-full max-h-60 overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
          >
            {filteredOptions.length === 0 ? (
              <div className="px-3 py-2 text-sm text-gray-500">{noResultsText}</div>
            ) : (
              filteredOptions.map((opt, idx) => {
                const isSelected = selectedSet.has(opt.value);
                const isActive = idx === activeIndex;
                return (
                  <div
                    key={opt.value}
                    data-index={idx}
                    role="option"
                    aria-selected={isSelected}
                    onMouseEnter={() => setActiveIndex(idx)}
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleValue(opt.value);
                    }}
                    className={`relative cursor-pointer select-none py-2 pl-8 pr-3 text-sm ${
                      isActive ? "bg-indigo-50 text-indigo-900" : "text-gray-900"
                    }`}
                  >
                    {/* Checkmark */}
                    <span
                      className={`absolute inset-y-0 left-0 flex items-center pl-2 ${
                        isSelected ? "text-indigo-600" : "text-transparent"
                      }`}
                    >
                      <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path
                          fillRule="evenodd"
                          d="M16.704 5.29a1 1 0 010 1.415l-7.25 7.25a1 1 0 01-1.415 0l-3.25-3.25a1 1 0 111.415-1.415l2.543 2.543 6.543-6.543a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </span>
                    <span className="block truncate">{opt.label}</span>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MultiSelect;


