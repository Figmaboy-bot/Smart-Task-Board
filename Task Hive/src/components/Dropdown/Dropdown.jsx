import React, { useState, useRef, useEffect } from "react";
// Inline CSS for Dropdown component
const dropdownStyles = `
.custom-dropdown-wrapper {
  position: relative;
  display: inline-block;
  width: auto;
}
.custom-dropdown-trigger {
  width: auto;
  background: var(--color-background);
  color: var(--color-black);
  border: 1px solid var(--grey-20);
  border-radius: 8px;
  padding: 6px 12px;
  font-size: 14px;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  cursor: pointer;
  transition: border 0.2s;
}
.custom-dropdown-trigger.open {
  border-color: var(--primary-50);
}
.custom-dropdown-arrow {
  width: 14px;
  height: 14px;
  stroke-width: 1.5px;
  color: var(--grey-80);
}
.custom-dropdown-menu {
  position: absolute;
  left: 0;
  top: calc(100% + 4px);
  background: var(--color-background);
  border: 1px solid var(--grey-20);
  border-radius: 8px;
  z-index: 10;
  min-width: 100%;
  padding: 0;
  overflow: hidden;
}
.custom-dropdown-option {
  padding: 8px 12px;
  color: var(--color-black);
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  text-overflow: ellipsis;
  transition: background 0.15s;
}
.custom-dropdown-option:hover {
  background: var(--color-white);
}
.custom-dropdown-option.selected {
  background: var(--primary-50);
  color: var(--color-background);
}
placeholder {
    color: var(--grey-50);
}
`;
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import "./Dropdown.css";

export default function Dropdown({ options = [], value, onChange, placeholder = "Select", className = "", width = "auto", fontSize = "14px", padding }) {
  // Inject styles once per mount
  useEffect(() => {
    if (!document.getElementById('dropdown-inline-styles')) {
      const style = document.createElement('style');
      style.id = 'dropdown-inline-styles';
      style.innerHTML = dropdownStyles;
      document.head.appendChild(style);
    }
  }, []);
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const selected = options.find(opt => opt.value === value);
  const isSelected = selected && selected.value !== options[0]?.value;

  return (
    <div
      className={`custom-dropdown-wrapper ${className}`}
      ref={ref}
      style={{ width }}
    >
      <button
        className={`custom-dropdown-trigger${open ? " open" : ""}`}
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        style={{
          color: isSelected ? "var(--color-black)" : "var(--grey-60)",
          width: "100%",
          fontSize,
          padding: padding || "6px 12px"
        }}
      >
        <span>{selected ? selected.label : placeholder}</span>
        <ChevronDownIcon className="custom-dropdown-arrow" style={{ width: 20, height: 20, color: isSelected ? "var(--color-black)" : "var(--grey-50)" }} />
      </button>
      {open && (
        <ul className="custom-dropdown-menu" role="listbox">
          {options.map(opt => (
            <li
              key={opt.value}
              className={`custom-dropdown-option${value === opt.value ? " selected" : ""}`}
              onClick={() => { onChange(opt.value); setOpen(false); }}
              role="option"
              aria-selected={value === opt.value}
              style={{
                fontSize,
                padding: padding || "8px 12px"
              }}
            >
              {opt.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
