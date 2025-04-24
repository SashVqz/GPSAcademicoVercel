import React, { useState, useEffect } from "react";
import { FaFilePdf, FaSpinner } from "react-icons/fa";
import { exportToPDF } from '@/components/notifications/exportSummary'; 

const Pupils = ({ students, setStudents, token, setToken }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [studentSummaries, setStudentSummaries] = useState({});
  const [downloadingStudent, setDownloadingStudent] = useState(null);

  useEffect(() => {
    if (students && students.length > 0) {
      const filtered = students.filter(student => {
        const fullName = `${student.firstName || ""} ${student.lastName || ""}`.toLowerCase();
        return fullName.includes(searchTerm.toLowerCase());
      });
      setFilteredStudents(filtered);
      
      // Fetch summaries for each student
      filtered.forEach(student => {
        fetchStudentSummaries(student.id);
      });
    } else {
      setFilteredStudents([]);
    }
  }, [searchTerm, students]);

  const fetchStudentSummaries = async (studentId) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/summary/${studentId}/all`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        console.log(`No summaries found for student ${studentId}`);
        return;
      }

      const data = await response.json();
      
      // Update state with summaries for this student
      setStudentSummaries(prev => ({
        ...prev,
        [studentId]: data.summaries || []
      }));
    } catch (error) {
      console.error(`Error fetching summaries for student ${studentId}:`, error);
    }
  };

  const hasSummaries = (student) => {
    return studentSummaries[student.id] && studentSummaries[student.id].length > 0;
  };

  const handleDownloadSummary = async (studentId) => {
    try {
      // Set downloading state
      setDownloadingStudent(studentId);

      // Fetch latest summary
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/summary/${studentId}/latest`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error fetching summary:", errorText);
        return;
      }
  
      const data = await response.json();
      
      if (!data || !data.summary) {
        console.error("No summary found for the student");
        return;
      }
  
      // Use the exportToPDF function to download the summary
      const pdfExport = exportToPDF(data.summary);
      pdfExport.download();
      
    } catch (error) {
      console.error("Detailed error al descargar el informe:", error);
    } finally {
      // Reset downloading state
      setDownloadingStudent(null);
    }
  };

  return (
    <div className="p-4 bg-white rounded-lg">
      <h2 className="text-lg font-semibold">
        Alumnos tutelados
      </h2>

      <div className="mt-4 w-full flex items-center">
        <input
          type="text"
          placeholder="Buscar alumno por nombre o apellido..."
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="w-full bg-white rounded-lg shadow-md border border-gray-200 mt-6 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Nombre
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Apellidos
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Curso
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Grado
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Informe
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredStudents.map((student, index) => (
              <tr
                key={student.id || index}
                className="hover:bg-gray-50 transition"
              >
                <td className="px-6 py-4 text-sm text-gray-900">
                  {student.firstName}
                </td>

                <td className="px-6 py-4 text-sm text-gray-900">
                  {student.lastName}
                </td>

                <td className="px-6 py-4 text-sm text-gray-900">
                  {Array.isArray(student.yearsCompleted) && student.yearsCompleted.length > 0
                    ? `${Math.max(...student.yearsCompleted)}º`
                    : "No disponible"}
                </td>

                <td className="px-6 py-4 text-sm">
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                    {student.degree || "No disponible"}
                  </span>
                </td>

                <td className="px-6 py-4 text-sm text-gray-900 flex items-center justify-center">
                  {hasSummaries(student) ? (
                    downloadingStudent === student.id ? (
                      <FaSpinner className="text-blue-500 animate-spin" />
                    ) : (
                      <button 
                        onClick={() => handleDownloadSummary(student.id)}
                        className="text-blue-500 hover:text-blue-700 transition-colors"
                        title="Descargar último informe"
                      >
                        <FaFilePdf size={20} />
                      </button>
                    )
                  ) : (
                    <span
                      className="text-gray-400 text-xs"
                      title="Sin informes disponibles"
                    >
                      N/A
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Pupils;