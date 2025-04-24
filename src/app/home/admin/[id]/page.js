"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { theme } from "@/constants/theme";
import "@fontsource/montserrat";
import ErrorPopUp from "@/components/ErrorPopUp";
import dynamic from "next/dynamic";
const LoadingModal = dynamic(() => import("@/components/LoadingModal"), {
  ssr: false,
});
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { FaUsers, FaGraduationCap, FaChalkboardTeacher, FaHeartbeat, FaMap } from 'react-icons/fa';

const AdminDashboard = () => {
  const router = useRouter();
  const params = useParams();
  const id = params.id;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [user, setUser] = useState({});
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalStudents: 0,
    totalTeachers: 0,
    totalRoadmaps: 0,
    totalDegrees: 0,
    activeUsers: 0,
    usersByMonth: [],
    userDistribution: [],
    studentsByDegree: [],
    specializations: []
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (localStorage.getItem("user") && localStorage.getItem("token")) {
          const userData = JSON.parse(localStorage.getItem("user"));
          setUser(userData);

          if (userData.role !== "ADMIN") {
            return (
              <ErrorPopUp
                message={"No tienes acceso a esta página."}
                path={`/home/${userData.role.toLowerCase()}/${id}`}
              />
            );
          }

          // Fetch user data from backend
          const userResponse = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          });

          if (!userResponse.ok) {
            throw new Error("Error al obtener datos del usuario");
          }

          const userData2 = await userResponse.json();
          setUser(userData2.user);

          // Fetch all stats data
          await fetchAllStats();
        } else {
          return (
            <ErrorPopUp
              message={"Debes iniciar sesión para ver esta página."}
              path={`/login`}
            />
          );
        }
      } catch (error) {
        console.error("Error:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const fetchAllStats = async () => {
    try {
      const usersResponse = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/admin`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!usersResponse.ok) throw new Error("Error al obtener datos de usuarios");
      const usersData = await usersResponse.json();
      const students = usersData.filter(user => user.role === "STUDENT");
      const teachers = usersData.filter(user => user.role === "TEACHER");

      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      const activeUsers = usersData.filter(user => {
        const updatedAt = new Date(user.updatedAt);
        return updatedAt > oneWeekAgo;
      });

      const usersByMonth = processUsersByMonth(usersData);
      const studentsByDegree = processStudentsByDegree(students);
      const specializations = processSpecializations(teachers);

      const roadmapsResponse = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/roadmaps`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!roadmapsResponse.ok) {
        throw new Error("Error al obtener datos de roadmaps");
      }

      const roadmapsData = await roadmapsResponse.json();

      const degreesResponse = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/degrees`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!degreesResponse.ok) {
        throw new Error("Error al obtener datos de titulaciones");
      }

      const degreesData = await degreesResponse.json();

      setStats({
        totalUsers: usersData.length,
        totalStudents: students.length,
        totalTeachers: teachers.length,
        totalRoadmaps: roadmapsData.length,
        totalDegrees: degreesData.length,
        activeUsers: activeUsers.length,
        usersByMonth: usersByMonth,
        userDistribution: [
          { name: "Estudiantes", value: students.length, color: theme.palette.accent.hex },
          { name: "Profesores", value: teachers.length, color: theme.palette.primary.hex }
        ],
        studentsByDegree: studentsByDegree,
        specializations: specializations
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
      setError("Error al cargar las estadísticas");
    }
  };

  const processUsersByMonth = (usersData) => {
    const monthNames = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
    const usersByMonthMap = new Map();

    const today = new Date();
    for (let i = 5; i >= 0; i--) {
      const month = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const monthKey = `${month.getFullYear()}-${month.getMonth()}`;
      usersByMonthMap.set(monthKey, {
        name: monthNames[month.getMonth()],
        students: 0,
        teachers: 0,
        total: 0,
        date: new Date(month)
      });
    }

    usersData.forEach(user => {
      if (user.createdAt) {
        const createdAt = new Date(user.createdAt);
        const monthKey = `${createdAt.getFullYear()}-${createdAt.getMonth()}`;

        if (usersByMonthMap.has(monthKey)) {
          const monthData = usersByMonthMap.get(monthKey);
          if (user.role === "STUDENT") {
            monthData.students++;
          } else if (user.role === "TEACHER") {
            monthData.teachers++;
          }
          monthData.total++;
          usersByMonthMap.set(monthKey, monthData);
        }
      }
    });

    return Array.from(usersByMonthMap.values())
      .sort((a, b) => a.date - b.date);
  };

  const processStudentsByDegree = (students) => {
    const degreeMap = new Map();

    students.forEach(student => {
      if (student.metadata && student.metadata.degree) {
        const degree = student.metadata.degree;
        const degreeCount = degreeMap.get(degree) || 0;
        degreeMap.set(degree, degreeCount + 1);
      } else {
        const degreeCount = degreeMap.get("Sin asignar") || 0;
        degreeMap.set("Sin asignar", degreeCount + 1);
      }
    });

    return Array.from(degreeMap.entries())
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  };

  const processSpecializations = (teachers) => {
    const specializationMap = new Map();

    teachers.forEach(teacher => {
      if (teacher.metadata && teacher.metadata.specialization) {
        const specialization = teacher.metadata.specialization;
        const specCount = specializationMap.get(specialization) || 0;
        specializationMap.set(specialization, specCount + 1);
      } else {
        const specCount = specializationMap.get("Sin especialización") || 0;
        specializationMap.set("Sin especialización", specCount + 1);
      }
    });

    return Array.from(specializationMap.entries())
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  };

  const COLORS = [
    theme.palette.primary.hex,
    theme.palette.accent.hex,
    theme.palette.purple.hex,
    theme.palette.teal.hex,
    theme.palette.warning.hex,
    theme.palette.deepOrange.hex
  ];

  if (loading) return <LoadingModal />;

  return (
    <div
      style={{
        backgroundImage: "url('/assets/fondo.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed"
      }}
    >
      <div className="flex items-center justify-center p-5">
        <h1 className="text-4xl font-bold text-blue-800 mt-5">
          Panel de Administración
        </h1>
      </div>

      <div className="container p-4 mx-auto">
        <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-4">
          <div className="p-6 bg-white border rounded-lg shadow-sm" style={{ borderLeft: `4px solid ${theme.palette.primary.hex}` }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">USUARIOS TOTALES</p>
                <p className="mt-1 text-3xl font-bold" style={{ color: theme.palette.primary.hex }}>{stats.totalUsers}</p>
              </div>
              <div className="p-3 rounded-full" style={{ backgroundColor: `${theme.palette.primary.hex}15` }}>
                <FaUsers className="text-xl" style={{ color: theme.palette.primary.hex }} />
              </div>
            </div>
          </div>

          <div className="p-6 bg-white border rounded-lg shadow-sm" style={{ borderLeft: `4px solid ${theme.palette.accent.hex}` }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">ESTUDIANTES</p>
                <p className="mt-1 text-3xl font-bold" style={{ color: theme.palette.accent.hex }}>{stats.totalStudents}</p>
              </div>
              <div className="p-3 rounded-full" style={{ backgroundColor: `${theme.palette.accent.hex}15` }}>
                <FaGraduationCap className="text-xl" style={{ color: theme.palette.accent.hex }} />
              </div>
            </div>
          </div>

          <div className="p-6 bg-white border rounded-lg shadow-sm" style={{ borderLeft: `4px solid ${theme.palette.primary.hex}` }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">PROFESORES</p>
                <p className="mt-1 text-3xl font-bold" style={{ color: theme.palette.primary.hex }}>{stats.totalTeachers}</p>
              </div>
              <div className="p-3 rounded-full" style={{ backgroundColor: `${theme.palette.primary.hex}15` }}>
                <FaChalkboardTeacher className="text-xl" style={{ color: theme.palette.primary.hex }} />
              </div>
            </div>
          </div>

          <div className="p-6 bg-white border rounded-lg shadow-sm" style={{ borderLeft: `4px solid ${theme.palette.success.hex}` }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">USUARIOS ACTIVOS</p>
                <p className="mt-1 text-3xl font-bold" style={{ color: theme.palette.success.hex }}>{stats.activeUsers}</p>
                <p className="text-xs text-gray-500">Últimos 7 días</p>
              </div>
              <div className="p-3 rounded-full" style={{ backgroundColor: `${theme.palette.success.hex}15` }}>
                <FaHeartbeat className="text-xl" style={{ color: theme.palette.success.hex }} />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 mb-6 md:grid-cols-2">
          <div className="p-6 bg-white border rounded-lg shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-semibold" style={{ color: theme.palette.text.hex }}>
                Nuevos registros por mes
              </h3>
              <div className="flex space-x-2">
                <div className="px-2 py-1 text-xs bg-gray-100 rounded">Últimos 6 meses</div>
              </div>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.usersByMonth} margin={{ top: 10, right: 30, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value, name) => [value, name === "students" ? "Estudiantes" : name === "teachers" ? "Profesores" : "Total"]} />
                  <Legend
                    payload={[
                      { value: 'Estudiantes', type: 'square', color: theme.palette.accent.hex },
                      { value: 'Profesores', type: 'square', color: theme.palette.primary.hex },
                      { value: 'Total', type: 'square', color: theme.palette.purple.hex }
                    ]}
                  />
                  <Bar dataKey="students" name="Estudiantes" stackId="a" fill={theme.palette.accent.hex} radius={[4, 4, 0, 0]} />
                  <Bar dataKey="teachers" name="Profesores" stackId="a" fill={theme.palette.primary.hex} radius={[4, 4, 0, 0]} />
                  <Bar dataKey="total" name="Total" fill={theme.palette.purple.hex} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="p-6 bg-white border rounded-lg shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-semibold" style={{ color: theme.palette.text.hex }}>
                Estudiantes por titulación
              </h3>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stats.studentsByDegree}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {stats.studentsByDegree.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value, name, props) => [`${value} estudiantes`, props.payload.name]} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-2">
          <div className="p-6 bg-white border rounded-lg shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-semibold" style={{ color: theme.palette.text.hex }}>
                Distribución de usuarios
              </h3>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stats.userDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {stats.userDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value, name, props) => [`${value} usuarios`, props.payload.name]} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="p-6 bg-white border rounded-lg shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-semibold" style={{ color: theme.palette.text.hex }}>
                Especialización de profesores
              </h3>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  layout="vertical"
                  data={stats.specializations.slice(0, 5)} // Limit to top 5 for readability
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                  <XAxis type="number" />
                  <YAxis type="category" dataKey="name" width={150} />
                  <Tooltip formatter={(value) => [`${value} profesores`, 'Cantidad']} />
                  <Bar dataKey="value" fill={theme.palette.primary.hex} radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <h3 className="mb-4 text-base font-medium">Acciones Rápidas</h3>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <button
            onClick={() => router.push(`/home/admin/${id}/users`)}
            className="flex items-center p-4 bg-white border rounded-lg transition-shadow hover:shadow-md"
          >
            <div
              className="flex items-center justify-center w-9 h-9 mr-4 rounded"
              style={{ backgroundColor: `${theme.palette.primary.hex}15` }}
            >
              <FaUsers className="text-lg" style={{ color: theme.palette.primary.hex }} />
            </div>
            <div className="text-left">
              <h3 className="text-sm font-medium" style={{ color: theme.palette.text.hex }}>
                Gestionar Usuarios
              </h3>
              <p className="text-xs text-gray-500">{stats.totalUsers} usuarios en total</p>
            </div>
          </button>

          <button
            onClick={() => router.push(`/home/admin/${id}/roadmaps`)}
            className="flex items-center p-4 bg-white border rounded-lg transition-shadow hover:shadow-md"
          >
            <div
              className="flex items-center justify-center w-9 h-9 mr-4 rounded"
              style={{ backgroundColor: `${theme.palette.primary.hex}15` }}
            >
              <FaMap className="text-lg" style={{ color: theme.palette.primary.hex }} />
            </div>
            <div className="text-left">
              <h3 className="text-sm font-medium" style={{ color: theme.palette.text.hex }}>
                Gestionar Roadmaps
              </h3>
              <p className="text-xs text-gray-500">{stats.totalRoadmaps} roadmaps creados</p>
            </div>
          </button>

          <button
            onClick={() => router.push(`/home/admin/${id}/degrees`)}
            className="flex items-center p-4 bg-white border rounded-lg transition-shadow hover:shadow-md"
          >
            <div
              className="flex items-center justify-center w-9 h-9 mr-4 rounded"
              style={{ backgroundColor: `${theme.palette.primary.hex}15` }}
            >
              <FaGraduationCap className="text-lg" style={{ color: theme.palette.primary.hex }} />
            </div>
            <div className="text-left">
              <h3 className="text-sm font-medium" style={{ color: theme.palette.text.hex }}>
                Gestionar Titulaciones
              </h3>
              <p className="text-xs text-gray-500">{stats.totalDegrees} titulaciones configuradas</p>
            </div>
          </button>
        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;