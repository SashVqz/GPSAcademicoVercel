import React, { useState } from "react";
import { theme } from "@/constants/theme";
import { useSummary } from "./useSummary";
import { useNotifications } from "./useNotifications";
import { exportToPDF } from "./exportSummary";
import dynamic from "next/dynamic";
import { FaFileAlt, FaPaperPlane, FaTimes } from "react-icons/fa";

const LoadingModal = dynamic(() => import("@/components/LoadingModal"), {
  ssr: false,
});

const SendReportButton = ({ tutorId, tutorName, baseUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}` }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [showMsg, setShowMsg] = useState(null);
  const [isSending, setIsSending] = useState(false);
  
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : "";
  const userRole = typeof window !== "undefined" ? JSON.parse(localStorage.getItem("user"))?.role : "";
  
  const { 
    loading: summaryLoading,
    error: summaryError,
    generateSummary
  } = useSummary({ baseUrl, token, role: userRole });

  const {
    loading: notificationLoading,
    error: notificationError,
    sendNotificationToTeacher
  } = useNotifications({ baseUrl, token, role: userRole });

  const openModal = () => {
    setIsModalOpen(true);
    setShowMsg(null);
    setMessage("");
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setShowMsg(null);
    setMessage("");
  };

  const handleSendReport = async () => {
    setShowMsg(null);
    setIsSending(true);

    try {
      const newSummary = await generateSummary();
      if (!newSummary) throw new Error("No se pudo generar el informe académico");

      const pdfExporter = exportToPDF(newSummary);
      const pdfDocument = pdfExporter.download();
      if (!pdfDocument) throw new Error("No se pudo generar el documento PDF");

      const notificationMessage = message.trim() || "He compartido mi informe académico contigo.";
      const notificationResult = await sendNotificationToTeacher(
        tutorId,
        notificationMessage
      );

      if (notificationResult) {
        setShowMsg({
          type: "success",
          text: "Informe generado y enviado correctamente a tu tutor"
        });
        
        setTimeout(closeModal, 2000);
      } else {
        throw new Error("No se pudo enviar la notificación al tutor");
      }
    } catch (err) {
      console.error("Error al enviar el informe:", err);
      setShowMsg({
        type: "error",
        text: err.message || "Error al enviar el informe. Inténtalo de nuevo más tarde."
      });
    } finally {
      setIsSending(false);
    }
  };

  const loading = summaryLoading || notificationLoading || isSending;
  const error = summaryError || notificationError;

  if (loading && !isModalOpen) return <LoadingModal message="Cargando ..." />;

  return (
    <>
      <button
        className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 shadow-sm hover:shadow-md"
        onClick={openModal}
        title="Enviar informe"
        style={{ 
          backgroundColor: theme.palette.primary.hex,
          color: 'white' 
        }}
      >
        <FaFileAlt className="text-sm" />
        <span>Enviar informe</span>
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 transition-opacity duration-300">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full transform transition-all duration-300 scale-100">
            <div className="relative p-6">
              {/* Header */}
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold" style={{ color: theme.palette.primary.hex }}>
                  Enviar Informe a {tutorName}
                </h2>
                <button
                  onClick={closeModal}
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
                  aria-label="Cerrar"
                >
                  <FaTimes style={{ color: theme.palette.gray.hex }} />
                </button>
              </div>
              
              {/* Content */}
              {loading ? (
                <div className="py-10 flex flex-col items-center">
                  <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200 mb-4" 
                    style={{ borderTopColor: theme.palette.primary.hex }}></div>
                  <p className="text-gray-600 font-medium mt-4">
                    Generando y enviando informe...
                  </p>
                </div>
              ) : error ? (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-r-md">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 text-red-500 mr-3">
                      <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-red-800">
                        {error}
                      </p>
                    </div>
                  </div>
                </div>
              ) : showMsg ? (
                <div className={`${
                  showMsg.type === 'success' 
                    ? 'bg-green-50 border-green-500 text-green-800' 
                    : 'bg-red-50 border-red-500 text-red-800'
                } border-l-4 p-4 mb-6 rounded-r-md`}>
                  <div className="flex items-center">
                    <div className={`flex-shrink-0 ${
                      showMsg.type === 'success' ? 'text-green-500' : 'text-red-500'
                    } mr-3`}>
                      {showMsg.type === 'success' ? (
                        <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium">
                        {showMsg.text}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  <div className="mb-6">
                    <textarea
                      id="tutor-message"
                      rows="5"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder={`Escribe un mensaje para ${tutorName}...`}
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:outline-none transition-all duration-200 resize-none"
                      style={{ 
                        borderColor: theme.palette.lightGray.hex,
                        color: theme.palette.text.hex,
                        focusRing: theme.palette.primary.hex 
                      }}
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      Este mensaje será enviado junto con tu informe (es opcional)
                    </p>
                  </div>
                  
                  <div className="flex justify-end gap-3 mt-6">
                    <button
                      onClick={closeModal}
                      className="px-4 py-2 border rounded-md font-medium text-sm transition-colors duration-200 hover:bg-gray-50"
                      style={{ 
                        borderColor: theme.palette.lightGray.hex,
                        color: theme.palette.darkGray.hex
                      }}
                    >
                      Cancelar
                    </button>
                    
                    <button
                      onClick={handleSendReport}
                      className="px-6 py-2 text-white rounded-md font-medium text-sm shadow-sm hover:shadow-md transition-all duration-200 flex items-center gap-2"
                      style={{ backgroundColor: theme.palette.primary.hex }}
                    >
                      <FaPaperPlane size={14} />
                      <span>Enviar Informe</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SendReportButton;