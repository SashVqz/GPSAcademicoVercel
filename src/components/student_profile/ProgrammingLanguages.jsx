import React, { useState, useEffect } from "react";
import { theme } from "@/constants/theme";
import { op_skill } from "@/constants/op_skill";
import { op_level_skill } from "@/constants/level_skill";
import { FaTrash } from "react-icons/fa";

const ProgrammingLanguages = ({ skills, setSkills, onSave, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [e, setE] = useState({});
  const [tempSkills, setTempSkills] = useState([]);
  const [deletedSkills, setDeletedSkills] = useState([]);
  const [skillSearch, setSkillSearch] = useState({});
  const [dropdownOpen, setDropdownOpen] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [isSaving, setIsSaving] = useState(false);
  const itemsPerPage = 4;

  console.log("Component rendered, isEditing:", isEditing);

  useEffect(() => {
    console.log("Props received:", { skillsLength: skills?.length, onSaveExists: !!onSave, onDeleteExists: !!onDelete });
  }, [skills, onSave, onDelete]);

  const levelMap = {
    low: op_level_skill[0],
    medium: op_level_skill[1],
    high: op_level_skill[2],
  };

  const reverseLevelMap = Object.fromEntries(
    Object.entries(levelMap).map(([key, value]) => [value, key])
  );

  const convertLanguage = (level) => levelMap[level] || op_level_skill[0];

  useEffect(() => {
    const initializedSkills = Array.isArray(skills) ? skills.map((skill) => ({
      _id: skill._id || null,
      name: skill.name || "",
      level: convertLanguage(skill.level),
    })) : [];

    console.log("Initialized skills:", initializedSkills);
    setTempSkills(initializedSkills);

    const initializedSearch = initializedSkills.reduce((acc, skill, index) => {
      acc[index] = skill.name;
      return acc;
    }, {});
    setSkillSearch(initializedSearch);
  }, [skills]);

  const totalPages = Math.ceil(tempSkills.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = tempSkills.slice(startIndex, startIndex + itemsPerPage);

  const handleLevelChange = (index, event) => {
    console.log("Level change:", index, event.target.value);
    const updatedSkills = [...tempSkills];
    updatedSkills[index].level = event.target.value;
    setTempSkills(updatedSkills);
  }

  const handleSkillChange = (index, value) => {
    console.log("Skill change:", index, value);
    const updatedSkills = [...tempSkills];
    updatedSkills[index].name = value;
    setTempSkills(updatedSkills);
  }

  const addSkill = () => {
    console.log("Adding new skill");
    setTempSkills([...tempSkills, { _id: null, name: "", level: op_level_skill[0] }]);
  }

  const handleDeleteSkill = (index) => {
    const updatedSkills = tempSkills.filter((_, i) => i !== index);
    const skillToDelete = tempSkills[index];
  
    if (
      skillToDelete?._id &&
      Array.isArray(skills) &&
      skills.some((sk) => sk._id === skillToDelete._id)
    ) {
      setDeletedSkills((prev) => [...prev, skillToDelete]);
    }
  
    // Actualiza los estados derivados
    setTempSkills(updatedSkills);
  
    // Reindexar `skillSearch`
    const updatedSearch = updatedSkills.reduce((acc, sk, i) => {
      acc[i] = sk.name;
      return acc;
    }, {});
    setSkillSearch(updatedSearch);
  
    // Reindexar `dropdownOpen`
    const updatedDropdown = updatedSkills.reduce((acc, _, i) => {
      acc[i] = false;
      acc[`level-${i}`] = false;
      return acc;
    }, {});
    setDropdownOpen(updatedDropdown);
  
    // Reindexar errores
    const updatedErrors = {};
    Object.entries(e).forEach(([key, msg]) => {
      const match = key.match(/^skill-(\d+)$/);
      if (match) {
        const oldIndex = parseInt(match[1]);
        if (oldIndex < index) {
          updatedErrors[`skill-${oldIndex}`] = msg;
        } else if (oldIndex > index) {
          updatedErrors[`skill-${oldIndex - 1}`] = msg;
        }
        // Si es igual a `index`, se omite (el skill fue borrado)
      }
    });
    setE(updatedErrors);
  };
  

  const validateForm = () => {
    console.log("Validating form");
    const newErrors = {};
    tempSkills.forEach((sk, index) => {
      if (!sk.name.trim()) {
        newErrors[`skill-${index}`] = "El campo no puede estar vacío.";
      } else if (!op_skill.includes(sk.name)) {
        newErrors[`skill-${index}`] = "Selecciona un idioma válido de la lista.";
      } else if (tempSkills.filter((s) => s.name === sk.name).length > 1) {
        newErrors[`skill-${index}`] = "El lenguaje ya ha sido añadido.";
      }
    });
    setE(newErrors);
    const isValid = Object.keys(newErrors).length === 0;
    console.log("Form validation result:", isValid, newErrors);
    return isValid;
  }

  const saveChanges = async () => {
    console.log("Save button clicked");

    if (!validateForm()) {
      console.log("Validation failed, aborting save");
      return;
    }

    console.log("Validation successful, proceeding with save");
    setIsSaving(true);

    try {
      const formattedSkills = tempSkills.map((skill) => ({
        _id: skill._id,
        name: skill.name,
        level: reverseLevelMap[skill.level] || 'low',
      }));

      console.log("Formatted skills for saving:", formattedSkills);

      if (deletedSkills.length > 0) {
        console.log("Processing deleted skills:", deletedSkills);
        const formattedDeletedSkills = deletedSkills.map(skill => ({
          _id: skill._id,
          name: skill.name,
          level: reverseLevelMap[skill.level] || 'low'
        }));

        if (typeof onDelete === 'function') {
          console.log("Calling onDelete with:", formattedDeletedSkills);
          await onDelete({ skills: formattedDeletedSkills });
          console.log("onDelete completed successfully");
          setDeletedSkills([]);
        } else {
          console.error("onDelete is not a function:", onDelete);
        }
      }

      if (formattedSkills.length > 0) {
        if (typeof onSave === 'function') {
          console.log("Calling onSave with:", { programming_languages: formattedSkills });
          const result = await onSave({ programming_languages: formattedSkills });
          console.log("onSave result:", result);
        } else {
          console.error("onSave is not a function:", onSave);
        }
      }

      setIsEditing(false);
    } catch (error) {
      console.error("Error during save:", error);
      alert("Error al guardar: " + (error.message || "Error desconocido"));
    } finally {
      setIsSaving(false);
    }
  };

  const filterOptions = (input) => {
    return op_skill.filter((lang) =>
      lang.toLowerCase().includes((input || "").toLowerCase())
    );
  };

  const handleCancel = () => {
    console.log("Cancel button clicked");
    const resetSkills = Array.isArray(skills) ? skills.map((skill) => ({
      _id: skill._id || null,
      name: skill.name || "",
      level: convertLanguage(skill.level),
    })) : [];

    setTempSkills(resetSkills);

    const resetSearch = resetSkills.reduce((acc, skill, index) => {
      acc[index] = skill.name || "";
      return acc;
    }, {});
    setSkillSearch(resetSearch);

    setDeletedSkills([]);
    setE({});
    setIsEditing(false);
  }

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <>
      <div className="space-y-4 p-4 bg-white rounded-lg">
        <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center">

          <h2 className="text-lg font-semibold" style={{ color: theme.palette.text.hex }}>
            Lenguajes de Programación
          </h2>

          <div
            className="flex gap-2"
            style={{
              justifyContent: "flex-start",
              flexWrap: "wrap",
            }}
          >
            {isEditing && (
              <button
                type="button"
                onClick={saveChanges}
                disabled={isSaving}
                className="px-4 py-2 text-white rounded-md transition duration-200"
                style={{
                  backgroundColor: isSaving ? '#cccccc' : theme.palette.primary.hex,
                  fontWeight: "bold",
                  cursor: isSaving ? 'not-allowed' : 'pointer'
                }}
              >
                {isSaving ? 'Guardando...' : 'Guardar cambios'}
              </button>
            )}

            <button
              type="button"
              onClick={() => (isEditing ? handleCancel() : setIsEditing(true))}
              disabled={isSaving}
              className="px-4 py-2 text-white rounded-md transition duration-200"
              style={{
                backgroundColor: isEditing ? theme.palette.error.hex : theme.palette.primary.hex,
                fontWeight: "bold",
                cursor: isSaving ? 'not-allowed' : 'pointer'
              }}
            >
              {isEditing ? "Cancelar" : "Editar"}
            </button>
          </div>
        </div>

        {tempSkills.length === 0 && deletedSkills.length === 0 && (
          <p className="text-gray-500 text-sm text-center">No hay Lenguajes de programación guardadas.</p>
        )}

        {currentItems.map((sk, index) => {
          const globalIndex = startIndex + index;
          const filter_skill = filterOptions(skillSearch[globalIndex] || "");
          const hasError = e[`skill-${globalIndex}`];

          return (
            <div
              key={globalIndex}
              className="rounded-md p-4 border space-y-3"
              style={{ borderColor: theme.palette.lightGray.hex }}
            >

              <div className="flex flex-col md:flex-row items-start gap-3 w-full">
                <div className="w-full md:w-3/4 relative space-y-1">
                  <label className="text-sm font-medium" style={{ color: theme.palette.text.hex }}>
                    Lenguaje de programación
                  </label>

                  {isEditing ? (
                    <div>
                      <input
                        type="text"
                        placeholder="Buscar lenguaje de programación..."
                        value={skillSearch[globalIndex] || ""}
                        onChange={(e) => {
                          const value = e.target.value;
                          setSkillSearch({ ...skillSearch, [globalIndex]: value });
                          handleSkillChange(globalIndex, "");
                          setDropdownOpen({ ...dropdownOpen, [globalIndex]: true });
                        }}
                        onFocus={() => setDropdownOpen({ ...dropdownOpen, [globalIndex]: true })}
                        onBlur={() => setTimeout(() => setDropdownOpen((prev) => ({ ...prev, [globalIndex]: false })), 150)}
                        className="block w-full p-2 border rounded-md"
                        style={{
                          borderColor: hasError ? theme.palette.error.hex : theme.palette.primary.hex,
                          color: theme.palette.text.hex,
                        }}
                      />
                      {dropdownOpen[globalIndex] && filter_skill.length > 0 && (
                        <ul className="absolute z-10 w-full border rounded-md mt-1 max-h-32 overflow-auto bg-white shadow">
                          {filter_skill.map((op, opIndex) => (
                            <li
                              key={`${op}-${opIndex}-${globalIndex}`}
                              className="px-2 py-1 hover:bg-gray-100 cursor-pointer text-sm"
                              onMouseDown={() => {
                                handleSkillChange(globalIndex, op);
                                setSkillSearch({ ...skillSearch, [globalIndex]: op });
                                setDropdownOpen({ ...dropdownOpen, [globalIndex]: false });
                              }}
                            >
                              {op}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ) : (
                    <input
                      type="text"
                      value={sk.name}
                      disabled
                      className="block w-full p-2 rounded-md"
                      style={{ color: theme.palette.text.hex }}
                    />
                  )}
                  {hasError && (
                    <p className="text-xs" style={{ color: theme.palette.error.hex }}>
                      {e[`skill-${globalIndex}`]}
                    </p>
                  )}
                </div>

                <div className="w-full md:w-1/4 relative space-y-1">
                  <label className="text-sm font-medium" style={{ color: theme.palette.text.hex }}>
                    Nivel
                  </label>

                  {isEditing ? (
                    <div>
                      <input
                        type="text"
                        value={sk.level}
                        readOnly
                        onClick={() => setDropdownOpen({ ...dropdownOpen, [`level-${globalIndex}`]: true })}
                        onBlur={() =>
                          setTimeout(() => setDropdownOpen((prev) => ({ ...prev, [`level-${globalIndex}`]: false })), 150)
                        }
                        className="w-full p-2 border rounded-md cursor-pointer"
                        style={{
                          borderColor: theme.palette.primary.hex,
                          color: theme.palette.text.hex,
                        }}
                      />
                      {dropdownOpen[`level-${globalIndex}`] && (
                        <ul className="absolute z-10 w-full border rounded-md mt-1 max-h-32 overflow-auto bg-white shadow">
                          {op_level_skill.map((level) => (
                            <li
                              key={level}
                              onMouseDown={() => {
                                handleLevelChange(globalIndex, { target: { value: level } });
                                setDropdownOpen({ ...dropdownOpen, [`level-${globalIndex}`]: false });
                              }}
                              className="px-2 py-1 hover:bg-gray-100 cursor-pointer text-sm"
                            >
                              {level}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ) : (
                    <input
                      type="text"
                      value={sk.level}
                      disabled
                      className="block w-full p-2 rounded-md"
                      style={{ color: theme.palette.text.hex }}
                    />
                  )}
                </div>

                {isEditing && (
                  <div className="pt-2 md:pt-6 mt-2 self-start">
                    <button
                      type="button"
                      onClick={() => handleDeleteSkill(globalIndex)}
                      className="text-white p-2 rounded-md transition duration-200"
                      style={{ backgroundColor: theme.palette.error.hex }}
                      aria-label="Eliminar lenguaje de programación"
                    >
                      <FaTrash className="text-sm" />
                    </button>
                  </div>
                )}
              </div>

            </div>
          )
        })}

        {/* Paginación */}
        {tempSkills.length > itemsPerPage && (
          <div className="flex justify-between items-center mt-4">
            <button
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded ${currentPage === 1 ? "bg-gray-300" : "bg-blue-500 text-white"}`}
            >
              Anterior
            </button>
            <span className="text-sm">
              Página {currentPage} de {totalPages}
            </span>
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className={`px-4 py-2 rounded ${currentPage === totalPages ? "bg-gray-300" : "bg-blue-500 text-white"}`}
            >
              Siguiente
            </button>
          </div>
        )}

        {isEditing && (
          <button
            type="button"
            onClick={addSkill}
            className="w-full px-4 py-2 text-white rounded-md transition duration-200"
            style={{ backgroundColor: theme.palette.primary.hex, fontWeight: "bold" }}
          >
            Añadir lenguaje de programación
          </button>
        )}
      </div>
    </>
  );
};

export default ProgrammingLanguages;