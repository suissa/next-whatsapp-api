import React, { useState, useRef, useEffect } from 'react';

const MenuDropdown = ({ list }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const _list = list || ["Fila 1", "Fila 2", "Fila 3", "Fila 4"];

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="menu-dropdown-button px-4 py-2 text-purple bg-white rounded hover:bg-purple-200 focus:outline-none"
      >
        Filas
      </button>

      {isOpen && (
        <div className="absolute right-0 z-10 w-48 py-2 mt-2 bg-white rounded shadow-xl">
          {_list.map((item, index) => (
            <a
              key={index}
              href="#"
              className="menu-dropdown-item block px-4 py-2 text-purple hover:bg-gray-100"
            >
              {item}
            </a>
          ))}
        </div>
      )}
    </div>
  );
};

export default MenuDropdown;
