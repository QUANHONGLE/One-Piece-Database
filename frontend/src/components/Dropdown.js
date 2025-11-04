import { useState, useEffect, useRef } from "react";

function Dropdown({ label, value, onChange, options }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const dropdownRef = useRef(null);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsOpen(false);
      setIsClosing(false);
    }, 200); // Match animation duration
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        handleClose();
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      <button
        onClick={() => {
          if (isOpen) {
            handleClose();
          } else {
            setIsOpen(true);
          }
        }}
        className="min-w-[300px] px-4 py-2 bg-[#13a4db] text-white rounded-lg border-2 border-white/20 hover:bg-[#3fc3f7] transition-colors duration-200 flex items-center justify-between"
      >
        <span className="truncate">
          {value ? `${label}: ${value}` : `Select ${label}`}
        </span>
        <span className={`ml-2 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>{isOpen ? "▲" : "▼"}</span>
      </button>

      {(isOpen || isClosing) && (
        <div 
          className={`absolute z-50 mt-1 min-w-[300px] max-h-60 overflow-y-auto bg-white border-2 border-[#13a4db] rounded-lg shadow-lg scrollbar-dropdown origin-top ${
            isClosing ? 'animate-dropdown-close' : 'animate-dropdown-open'
          }`}
        >
          <div
            onClick={() => {
              onChange("");
              handleClose();
            }}
            className="px-4 py-2 hover:bg-[#13a4db] hover:text-white cursor-pointer transition-colors duration-150"
          >
            All {label}s
          </div>
          {options.map((option) => (
            <div
              key={option}
              onClick={() => {
                onChange(option);
                handleClose();
              }}
              className="px-4 py-2 hover:bg-[#13a4db] hover:text-white cursor-pointer transition-colors duration-150"
            >
              {option}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Dropdown;
