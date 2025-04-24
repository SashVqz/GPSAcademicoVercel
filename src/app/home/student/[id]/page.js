"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import "@fontsource/montserrat";
import dynamic from "next/dynamic";
const LoadingModal = dynamic(() => import("@/components/LoadingModal"), {
  ssr: false,
});
import Roadmap from "@/components/Roadmap/Roadmap";
import CareerOpportunityComponent from "@/components/Roadmap/CareerOpportunityComponent";
import { AlertSystemRoadmap } from "@/components/Roadmap/AlertSystemRoadmap";
import { subjectsByYear } from "@/constants/subjectsByYear";
import StudentHeaderCard from "@/components/Roadmap/StudentHeaderCard";
import ExploreMoreRoadmapsCard from "@/components/Roadmap/ExploreMoreRoadmapsCard";

const Home = () => {
  const params = useParams();
  const router = useRouter();
  const [roadmap, setRoadmap] = useState(null);
  const [metadata, setMetadata] = useState(null);
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [alerts, setAlerts] = useState([]);

  const fetchMetadataAndRoadmap = async () => {
    try {
      const metadataRes = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/metadata`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const metadataData = await metadataRes.json();
      localStorage.setItem("metadata", JSON.stringify(metadataData.metadata));
      setMetadata(metadataData.metadata);
      
      const academicAlerts = generateAlerts(metadataData.metadata);
      setAlerts(academicAlerts);
      
      const hasEmptyAlert = academicAlerts.some(alert => alert.keyword === "empty");
      
      if (!hasEmptyAlert) {
        try {
          const roadmapRes = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/userRoadmap`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          });
    
          if (roadmapRes.ok) {
            const roadmapData = await roadmapRes.json();
            setRoadmap(roadmapData.roadmap);
            setProgress(calculateProgress(roadmapData.roadmap));
          } else {
            await generateRoadmap();
          }
        } catch (error) {
          console.error("Error fetching roadmap:", error);
        }
      }
      
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching metadata:", error);
      setIsLoading(false);
    }
  };

  const generateRoadmap = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/userRoadmap`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      
      if (response.ok) {
        const roadmapRes = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/userRoadmap`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        
        if (roadmapRes.ok) {
          const freshRoadmapData = await roadmapRes.json();
          setRoadmap(freshRoadmapData.roadmap);
          setProgress(calculateProgress(freshRoadmapData.roadmap));
        }
      }
    } catch (error) {
      console.error("Error generating roadmap:", error);
    }
  };

  const calculateProgress = (_roadmap) => {
    if (!_roadmap || !_roadmap.body) return 0;
    let totalTasks = 0;
    let completedTasks = 0;
    Object.entries(_roadmap.body).forEach(([_, sectionData]) => {
      const tasks = Object.entries(sectionData).slice(1);
      tasks.forEach(([_, taskData]) => {
        if (taskData && typeof taskData === "object" && "status" in taskData) {
          totalTasks++;
          if (taskData.status === "done") completedTasks++;
        }
      });
    });
    return totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
  };

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("token");
    if (!user || !token) return router.replace(`/login`);
    if (user.role !== "STUDENT" || user.id !== params.id) return router.replace(`/unauthorized`);
    fetchMetadataAndRoadmap();
  }, []);

  const generateAlerts = (metadata) => {
    if (!metadata) return [];

    const alerts = [];
    const academicRecord = metadata?.AH?.subjects;

    if (!metadata?.AH || !Array.isArray(academicRecord) || academicRecord.length === 0) {
      alerts.push({
        id: "academic-empty",
        type: "warning",
        keyword: "empty",
        action: {
          label: "Ir al perfil",
          path: `/profile/student/${params.id}`,
        },
      });
      return alerts;
    }

    const requiredSubjects = [...subjectsByYear[1], ...subjectsByYear[2]];

    const missingSubjects = requiredSubjects.filter((req) => {
      const subject = academicRecord.find((s) => s.name === req);
      return !subject || typeof subject.grade !== "number" || subject.grade < 0;
    });

    const hasPassedYear = (year) => {
      const yearSubjects = academicRecord.filter(
        (s) => Number(s.year) === year && typeof s.grade === "number"
      );
      const total = yearSubjects.length;
      const failed = yearSubjects.filter((s) => s.grade < 5).length;
      return total > 0 && failed <= 2;
    };

    const passedFirst = hasPassedYear(1);
    const passedSecond = hasPassedYear(2);

    if (!passedFirst || !passedSecond || missingSubjects.length > 0) {
      alerts.push({
        id: "academic-incomplete",
        type: "warning",
        keyword: "incomplete",
        action: {
          label: "Revisar expediente",
          path: `/profile/student/${params.id}`,
        },
      });
    }

    return alerts;
  };

  if (isLoading) return <LoadingModal />;

  const hasEmptyAlert = alerts.some(alert => alert.keyword === "empty");

  if (hasEmptyAlert) {
    return (
      <div className="p-10 space-y-6">
        <AlertSystemRoadmap alerts={alerts} />
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-center w-full px-6 py-10 ">
        <div className="w-full max-w-6xl space-y-8">
          {/* Cabecera del estudiante */}
          <StudentHeaderCard
            metadata={metadata}
          />

          {/* Mensaje recordatorio de actualizar perfil */}
          {alerts.length > 0 && (
            <AlertSystemRoadmap alerts={alerts} />
          )}

          {/* Roadmap */}
          {roadmap && (
            <div className="bg-white rounded-2xl shadow-md p-10">
              <Roadmap
                roadmap={roadmap}
                metadata={metadata}
                progress={progress}
                setProgress={setProgress}
              />
            </div>
          )}

          <div className="bg-white rounded-2xl shadow-md p-10">
            <ExploreMoreRoadmapsCard />
          </div>

          {/* Oportunidades */}
          <div className="bg-white rounded-2xl shadow-md p-10">
            <CareerOpportunityComponent />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;