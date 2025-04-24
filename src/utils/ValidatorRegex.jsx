export const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.{8,})/;

export const nameRegex = (name) => {
  const namePattern = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
  return namePattern.test(name.trim());
};

export const certificationRegex = (certification) => {
  const certificationPattern = /^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s]+$/;
  return certificationPattern.test(certification.trim());
};


export const dateRegex = (dateString) => {
  const datePattern = /^\d{4}-\d{2}-\d{2}$/;
  return datePattern.test(dateString) && !isNaN(new Date(dateString).getTime());
};

export const gradeRegex = (grade) => {
  if (typeof grade !== "string") return false;
  const gradePattern = /^\d{1,2}(\.\d{1,2})?$/; // Permite 0-10 con hasta 2 decimales
  if (!gradePattern.test(grade)) return false; 

  const numericGrade = parseFloat(grade);
  return numericGrade >= 0 && numericGrade <= 10;
};


