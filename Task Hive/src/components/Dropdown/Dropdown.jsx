import React, { useState, useRef, useEffect } from "react";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import "./Dropdown.css";

export default function Dropdown({ options = [], value, onChange, placeholder = "Select", className = "", width = "auto", fontSize = "14px", padding, disabled = false }) {
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
        type="button"
        className={`custom-dropdown-trigger${open ? " open" : ""}`}
        onClick={() => !disabled && setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        disabled={disabled}
        style={{
          color: isSelected ? "var(--color-black)" : "var(--grey-60)",
          width: "100%",
          fontSize,
          padding: padding || "6px 12px",
          opacity: disabled ? 0.6 : 1,
          cursor: disabled ? "not-allowed" : "pointer",
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
