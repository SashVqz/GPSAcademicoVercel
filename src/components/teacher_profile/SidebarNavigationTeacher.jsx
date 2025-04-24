"use client";

import { useState } from "react";
import { theme } from "@/constants/theme";
import { FaBars, FaTimes } from "react-icons/fa";

const SidebarNavigation = ({ activeSection, setActiveSection }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const groupedSections = [
    {
      title: "Perfil personal",
      items: [{ id: "personal", label: "Información principal" }],
    },
    {
      title: "Tutoría",
      items: [{ id: "pupils", label: "Alumnos tutelados" }],
    },
  ];

  return (
    <aside className="flex flex-col md:w-64 w-full rounded-sm p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-4 md:mb-2">
        <h2
          className="text-lg font-bold"
          style={{ color: theme.palette.text.hex }}
        >
          Panel de perfil
        </h2>

        {/* Botón hamburguesa en móvil */}
        <div className="md:hidden">
          <button onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? (
              <FaTimes size={24} style={{ color: theme.palette.text.hex }} />
            ) : (
              <FaBars size={24} style={{ color: theme.palette.text.hex }} />
            )}
          </button>
        </div>
      </div>

      {/* Menú animado */}
      <div
        className={`flex flex-col gap-6 w-full overflow-hidden transition-all duration-300 ease-in-out ${
          menuOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
        } md:max-h-none md:opacity-100 md:flex`}
      >
        {groupedSections.map(({ title, items }) => (
          <div key={title} className="flex flex-col gap-3 min-w-max">
            <div className="flex flex-col gap-1">
              <p
                className="text-xs uppercase font-semibold tracking-wide"
                style={{ color: theme.palette.gray.hex }}
              >
                {title}
              </p>
              <hr
                className="mb-2"
                style={{ borderColor: theme.palette.lightGray.hex }}
              />
            </div>

            {items.map(({ id, label }) => (
              <button
                key={id}
                className="px-4 py-2 rounded text-sm transition-all duration-200 text-left"
                style={{
                  backgroundColor:
                    activeSection === id
                      ? theme.palette.light.hex
                      : "transparent",
                  color:
                    activeSection === id
                      ? theme.palette.background.hex
                      : theme.palette.text.hex,
                  fontWeight:
                    activeSection === id
                      ? theme.fontWeight.semibold
                      : theme.fontWeight.regular,
                  boxShadow:
                    activeSection === id ? "0 1px 2px rgba(0,0,0,0.05)" : "none",
                }}
                onClick={() => {
                  setActiveSection(id);
                  setMenuOpen(false); // cerrar menú tras click en móvil
                }}
              >
                {label}
              </button>
            ))}
          </div>
        ))}
      </div>
    </aside>
  );
};

export default SidebarNavigation;
