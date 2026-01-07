import React, { useState, useRef, useEffect } from "react";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import "./Dropdown.css";

export default function Dropdown({ options = [], value, onChange, placeholder = "Select", className = "" }) {
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

  return (
    <div className={`custom-dropdown-wrapper ${className}`} ref={ref}>
      <button
        className={`custom-dropdown-trigger${open ? " open" : ""}`}
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span>{selected ? selected.label : placeholder}</span>
        <ChevronDownIcon className="custom-dropdown-arrow" style={{ width: 20, height: 20, color: "#fff" }} />
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
            >
              {opt.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
