import React, { useState, useEffect } from "react";
import { theme } from "@/constants/theme";
import { subjectsByYear } from "@/constants/subjectsByYear";
import { gradeRegex } from "@/utils/ValidatorRegex";
import { FaCheckCircle, FaTimesCircle, FaGraduationCap, FaClipboard, FaStar } from "react-icons/fa";

const ExpedienteAcademico = ({
  academicRecord,
  onSave,
  yearsCompleted = [],
  degree
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [grades, setGrades] = useState({});
  const [tempGrades, setTempGrades] = useState({});
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const [activeYear, setActiveYear] = useState(1);
  const [average, setAverage] = useState(null);
  const [credits, setCredits] = useState(null);
  const [currentCourse, setCurrentCourse] = useState("SIN CALCULAR");

  useEffect(() => {
    if (academicRecord.length > 0) {
      const extractedGrades = {};
      let total = 0;
      let sum = 0;
      let totalCredits = 0;

      academicRecord.forEach((subject) => {
        const value = subject.grade !== null ? subject.grade : null;
        extractedGrades[subject.name] = value !== null ? value.toString() : "";
        if (value !== null && !isNaN(value)) {
          sum += parseFloat(value);
          total++;
        }
        if (subject.credits && value !== null && !isNaN(value)) {
          totalCredits += parseFloat(subject.credits);
        }
      });

      setGrades(extractedGrades);
      setTempGrades({ ...extractedGrades });
      setAverage(total > 0 ? (sum / total).toFixed(2) : null);
      setCredits(totalCredits > 0 ? totalCredits : null);
    }

    if (Array.isArray(yearsCompleted) && yearsCompleted.length > 0) {
      const last = Math.max(...yearsCompleted);
      const current = Math.min(last + 1, 4);
      setCurrentCourse(`${current}º`);
    } else {
      setCurrentCourse("1º");
    }
  }, [academicRecord, yearsCompleted]);

  const handleGradeChange = (subjectName, value) => {
    let normalizedValue = value.replace(",", ".");

    if (normalizedValue === "" || /^\d{1,2}(\.\d{0,2})?$/.test(normalizedValue)) {
      setGrades((prev) => ({
        ...prev,
        [subjectName]: normalizedValue.replace(/^0+(\d)/, "$1"),
      }));
    }
  };


  const isFormValid = () => {
    const newErrors = {};
    Object.entries(grades).forEach(([subject, grade]) => {
      if (grade !== "" && !gradeRegex(grade)) {
        newErrors[subject] = "Nota inválida (debe ser entre 0 y 10, con hasta 2 decimales)";
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!isFormValid()) return;
    const updatedGrades = Object.entries(grades)
      .filter(([subject, grade]) => grade !== tempGrades[subject])
      .map(([subject, grade]) => ({ name: subject, grade: grade === "" ? null : parseFloat(grade) }));
    if (updatedGrades.length === 0) {
      setIsEditing(false);
      return;
    }
    onSave(updatedGrades);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
    setErrors({});
    setTempGrades({ ...grades });
    setIsEditing(false);
  };

  const handleEdit = () => {
    setTempGrades({ ...grades });
    setIsEditing(true);
  };

  const handleCancel = () => {
    setGrades({ ...tempGrades });
    setErrors({});
    setIsEditing(false);
  };

  const totalSubjects = subjectsByYear[activeYear].length;
  const approved = subjectsByYear[activeYear].filter((subj) => {
    const grade = parseFloat(grades[subj]);
    return !isNaN(grade) && grade >= 5;
  }).length;

  const failed = subjectsByYear[activeYear].filter((subj) => parseFloat(grades[subj]) < 5).length;

  return (
    <div className="space-y-4 p-4 bg-white rounded-lg">

      <div className="">
        <h2 className="text-lg font-semibold mt-1 mb-4">
          Expediente académico
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Curso actual */}
          <div className="p-4 bg-white w-full border rounded-lg shadow-sm" style={{ borderLeft: `6px solid ${theme.palette.primary.hex}` }}>
            <p className="text-xs mb-2 flex items-center gap-2" style={{ color: theme.palette.darkGray.hex }}>
              <FaGraduationCap className="text-sm" />
              Curso actual
            </p>
            <div
              className="flex"
            >
              <p className="text-l font-bold" style={{ color: theme.palette.text.hex }}>{currentCourse}</p>
              <p
                className="text-l font-bold ml-2"
                style={{ color: theme.palette.text.hex }}>
                {degree}
              </p>
            </div>

          </div>

          {/* Nota media */}
          <div className="flex rounded-lg overflow-hidden border" style={{ borderColor: theme.palette.lightGray.hex }}>
            <div style={{ width: "6px", backgroundColor: theme.palette.primary.hex }} />
            <div className="p-4 bg-white w-full">
              <p className="text-xs mb-2 flex items-center gap-2" style={{ color: theme.palette.darkGray.hex }}>
                <FaStar className="text-sm" />
                Nota media
              </p>
              <p className="text-base font-semibold" style={{ color: theme.palette.text.hex }}>
                {average !== null ? average : "SIN CALCULAR"}
              </p>
            </div>
          </div>

          {/* Créditos acumulados */}
          <div className="flex rounded-lg overflow-hidden border" style={{ borderColor: theme.palette.lightGray.hex }}>
            <div style={{ width: "6px", backgroundColor: theme.palette.primary.hex }} />
            <div className="p-4 bg-white w-full">
              <p className="text-xs mb-2 flex items-center gap-2" style={{ color: theme.palette.darkGray.hex }}>
                <FaClipboard className="text-sm" />
                Créditos acumulados
              </p>
              <p className="text-base font-semibold" style={{ color: theme.palette.text.hex }}>
                {credits !== null ? credits : "SIN CALCULAR"}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center">
        <div className="flex gap-2">
          {Object.keys(subjectsByYear).map((year) => (
            <button
              key={year}
              className={`px-4 py-2 text-sm rounded-md ${activeYear === parseInt(year) ? "bg-blue-500 text-white" : "bg-gray-200 text-black"}`}
              onClick={() => setActiveYear(parseInt(year))}
            >
              Curso {year}
            </button>
          ))}
        </div>

        <div className="flex gap-2">
          {isEditing && (
            <button
              type="button"
              onClick={handleSave}
              className="px-4 py-2 text-white rounded-md transition duration-200"
              style={{ backgroundColor: theme.palette.primary.hex, fontWeight: "bold" }}
            >
              Guardar cambios
            </button>
          )}
          <button
            type="button"
            onClick={() => (isEditing ? handleCancel() : handleEdit())}
            className="px-4 py-2 text-white rounded-md transition duration-200"
            style={{ backgroundColor: isEditing ? theme.palette.error.hex : theme.palette.primary.hex, fontWeight: "bold" }}
          >
            {isEditing ? "Cancelar" : "Editar"}
          </button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3 text-sm mb-4">
        {/* Asignaturas completadas */}
        <div
          className="flex items-center gap-2 px-3 py-1 rounded-full font-medium"
          style={{
            backgroundColor: `${theme.palette.primary.hex}20`,
            color: theme.palette.primary.hex,
          }}
        >
          <FaCheckCircle size={14} />
          {approved}/{totalSubjects} aprobadas
        </div>

        {/* Asignaturas suspensas */}
        {failed > 0 && (
          <div
            className="flex items-center gap-2 px-3 py-1 rounded-full font-medium"
            style={{
              backgroundColor: theme.palette.error.hex + "20",
              color: theme.palette.error.hex,
            }}
          >
            <FaTimesCircle size={14} />
            {failed} suspensas
          </div>
        )}
      </div>


      <div className="flex flex-col gap-2">
        {subjectsByYear[activeYear].map((subjectName, index) => (
          <div
            key={subjectName}
            className="flex items-center gap-4 p-2 rounded-md"
            style={{ backgroundColor: index % 2 === 0 ? theme.palette.neutral.hex : "transparent" }}
          >
            <label className="text-sm font-medium w-3/5">{subjectName}</label>
            {isEditing ? (
              <input
                type="number"
                min="0"
                max="10"
                step="0.01"
                value={grades[subjectName] || ""}
                onChange={(e) => { handleGradeChange(subjectName, e.target.value) }}
                className="block w-1/5 p-2 border rounded-md transition-all"
                style={{ borderColor: isEditing ? theme.palette.primary.hex : theme.palette.lightGray.hex }}
              />
            ) : (
              <p
                className="w-1/5 p-2 bg-transparent border border-transparent"
                style={{ color: theme.palette.text.hex }}
              >
                {grades[subjectName] || "—"}
              </p>
            )}


            {isEditing && errors[subjectName] && <p className="text-red-500 text-xs">{errors[subjectName]}</p>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExpedienteAcademico;
