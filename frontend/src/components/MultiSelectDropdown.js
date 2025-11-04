import { useState, useEffect, useRef } from "react";

function MultiSelectDropdown({
  label,
  name,
  openDropdown,
  setOpenDropdown,
  options,
  selected,
  setSelected,
  transformValue,
  sortFn,
}) {
  const dropdownRef = useRef(null);
  const [isClosing, setIsClosing] = useState(false);
  const isOpen = openDropdown === name;

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setOpenDropdown(null);
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

  function toggleOption(value) {
    if (selected.includes(value)) {
      setSelected(selected.filter((v) => v !== value));
    } else {
      setSelected([...selected, value]);
    }
  }

  return (
    <div
      className="w-[150px] flex flex-col items-stretch relative font-sans"
      ref={dropdownRef}
    >
      <button
        onClick={() => {
          if (isOpen) {
            handleClose();
          } else {
            setOpenDropdown(name);
          }
        }}
        className="bg-[#13a4db] text-white flex items-center justify-center p-[clamp(4px,1vw,10px)] px-[clamp(8px,2vw,20px)] w-full text-[clamp(0.8rem,1.2vw,1.2rem)] font-sans font-bold border-2 border-[#0dbbff] rounded-[30px] cursor-pointer transition-all duration-200 ease-in-out hover:bg-[#26769669] hover:scale-[1.03] focus:outline-none focus:shadow-[0px_0px_6px_rgba(0,0,0,0.6)] overflow-hidden"
      >
        <span className="truncate block w-full text-center">{label} {selected.length > 0 ? `(${selected.length})` : ""}</span>
      </button>

      {(isOpen || isClosing) && (
        <div 
          className={`absolute top-full left-0 bg-black/80 border border-transparent rounded-md shadow-[0px_4px_8px_rgba(0,0,0,0.3)] p-2 mt-1 flex flex-col gap-1.5 z-[1000] max-h-[200px] overflow-y-auto min-w-[150px] scrollbar-dropdown origin-top ${
            isClosing ? 'animate-dropdown-close' : 'animate-dropdown-open'
          }`}
        >
          {options
            .slice()
            .sort(sortFn ?? undefined)
            .map((opt) => {
              const value = transformValue ? transformValue(opt) : String(opt);
              const isSelected = selected.includes(value);
              return (
                <div
                  key={opt}
                  className={`w-full text-sm cursor-pointer text-white font-bold p-1.5 px-2.5 rounded transition-all duration-200 ease ${
                    isSelected
                      ? "bg-[#0dbbff] text-black"
                      : "hover:bg-white/20 hover:scale-[1.02]"
                  }`}
                  onClick={() => toggleOption(value)}
                >
                  {opt}
                </div>
              );
            })}
        </div>
      )}
    </div>
  );
}

export default MultiSelectDropdown;
