"use client";

import {
  FaHome,
  FaUser,
  FaSignInAlt,
  FaUserPlus,
  FaSignOutAlt,
  FaUserCircle,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import { FaChevronDown, FaChevronUp } from "react-icons/fa6";
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import "@fontsource/montserrat";
import { theme } from "@/constants/theme";
import LogOut from "./LogOut";


export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [showNavbar, setShowNavbar] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const router = useRouter();
  const sidebarRef = useRef(null);
  const dropdownRef = useRef(null);
  const lastScrollY = useRef(0);

  const fetchUserData = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      setUserRole(data.user?.role);
      setIsLoggedIn(true);
    } catch (e) {
      console.error(e);
      setIsLoggedIn(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const token = localStorage.getItem("token");
      if (token && !isLoggedIn) fetchUserData();
    }, 1000);
    return () => clearInterval(interval);
  }, [isLoggedIn]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setShowDropdown(false);
      }
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target)
      ) {
        setIsSidebarOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const threshold = 10;
    const handleScroll = () => {
      const currentY = window.scrollY;
      const maxScroll = document.body.scrollHeight - window.innerHeight;
  
      if (maxScroll <= 0) {
        setShowNavbar(true);
        return;
      }
  
      if (Math.abs(currentY - lastScrollY.current) < threshold) return;
  
      setShowNavbar(currentY < lastScrollY.current || currentY <= 0);
      lastScrollY.current = currentY;
    };
  
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleTypeUserProfile = async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    const data = await res.json();
    setIsSidebarOpen(false);
    router.push(`/profile/${data.user.role.toLowerCase()}/${data.user.id}`);
  };

  const handleTypeUserHome = async () => {
    if (!localStorage.getItem("token")) return router.push("/");
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    const data = await res.json();
    router.push(`/home/${data.user.role.toLowerCase()}/${data.user.id}`);
  };

  const getRoleLabel = () => {
    if (!userRole) return "Cuenta";
    if (userRole === "STUDENT") return "Estudiante";
    if (userRole === "TEACHER") return "Profesor/a";
    return "Administrador";
  };

  const buttonBaseStyle = {
    color: theme.palette.background.hex,
    backgroundColor: "transparent",
    fontSize: theme.fontSizes.m,
    padding: "8px 12px",
    borderRadius: theme.buttonRadios.m,
    fontWeight: theme.fontWeight.regular,
    display: "flex",
    alignItems: "center",
    gap: "8px",
    cursor: "pointer",
    border: "none",
  };

  const hoverStyle = {
    backgroundColor: theme.palette.dark.hex,
  };

  return (
    <>
      <div style={{ height: "64px", width: "100%" }} />

      <nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 40,
          backgroundColor: theme.palette.primary.hex,
          padding: "12px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
          transform: showNavbar ? "translateY(0%)" : "translateY(-100%)",
          transition: "transform 0.3s",
        }}
      >
        <div
          style={{ display: "flex", alignItems: "center", cursor: "pointer" }}
          onClick={handleTypeUserHome}
        >
          <img src="/logo.png" title="Logo" style={{ height: "32px", width: "32px", borderRadius: "9999px" }} />
          <p
            style={{
              color: theme.palette.background.hex,
              marginLeft: "12px",
              fontSize: theme.fontSizes.m,
              fontWeight: theme.fontWeight.medium,
              fontFamily: "Montserrat, sans-serif",
            }}
          >
            Asistente de Carrera Profesional
          </p>
        </div>

        {!isMobile && (
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <button
              style={buttonBaseStyle}
              onMouseOver={(e) => Object.assign(e.currentTarget.style, hoverStyle)}
              onMouseOut={(e) => Object.assign(e.currentTarget.style, { backgroundColor: "transparent" })}
              onClick={handleTypeUserHome}
            >
              <FaHome /> Inicio
            </button>

            <div style={{ position: "relative" }} ref={dropdownRef}>
              <button
                style={buttonBaseStyle}
                onMouseOver={(e) => Object.assign(e.currentTarget.style, hoverStyle)}
                onMouseOut={(e) => Object.assign(e.currentTarget.style, { backgroundColor: "transparent" })}
                onClick={() => setShowDropdown((prev) => !prev)}
              >
                <FaUserCircle /> {getRoleLabel()} {showDropdown ? <FaChevronUp /> : <FaChevronDown />}
              </button>
              <div
                style={{
                  position: "absolute",
                  right: 0,
                  marginTop: "8px",
                  width: "192px",
                  backgroundColor: theme.palette.background.hex,
                  borderRadius: "8px",
                  boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                  transform: showDropdown ? "scale(1)" : "scale(0.95)",
                  opacity: showDropdown ? 1 : 0,
                  pointerEvents: showDropdown ? "auto" : "none",
                  transition: "all 0.3s ease-in-out",
                  overflow: "hidden",
                  zIndex: 50,
                }}
              >
                {(isLoggedIn ? [
                  { label: "Mi perfil", onClick: handleTypeUserProfile },
                  { label: "Cerrar sesión", onClick: () => { setShowDropdown(false); setShowLogoutModal(true); } },
                ] : [
                  { label: "Iniciar sesión", onClick: () => { router.push("/login"); setShowDropdown(false); } },
                  { label: "Registrarse", onClick: () => { router.push("/register"); setShowDropdown(false); } },
                ]).map((item, idx) => (
                  <button
                    key={idx}
                    onClick={item.onClick}
                    style={{
                      padding: "10px 16px",
                      background: "none",
                      border: "none",
                      textAlign: "left",
                      fontSize: theme.fontSizes.m,
                      color: theme.palette.text.hex,
                      width: "100%",
                      cursor: "pointer",
                    }}
                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = theme.palette.lightGray.hex}
                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = "transparent"}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {isMobile && (
          <button
            style={{ ...buttonBaseStyle, padding: "8px" }}
            onClick={() => setIsSidebarOpen(true)}
          >
            <FaBars style={{ fontSize: "20px" }} />
          </button>
        )}
      </nav>

      {/* Sidebar móvil funcional */}
      {isMobile && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 50,
            backgroundColor: isSidebarOpen ? "rgba(0, 0, 0, 0.6)" : "transparent",
            transition: "opacity 0.3s",
            pointerEvents: isSidebarOpen ? "auto" : "none",
          }}
        >
          <div
            ref={sidebarRef}
            style={{
              position: "fixed",
              top: 0,
              right: 0,
              width: "256px",
              height: "100%",
              backgroundColor: theme.palette.blueNavbar.hex,
              boxShadow: "-2px 0 8px rgba(0,0,0,0.2)",
              display: "flex",
              flexDirection: "column",
              padding: "24px",
              gap: "16px",
              borderTopLeftRadius: "16px",
              borderBottomLeftRadius: "16px",
              transform: isSidebarOpen ? "translateX(0%)" : "translateX(100%)",
              transition: "transform 0.5s ease-in-out",
              pointerEvents: "auto",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsSidebarOpen(false)}
              style={{
                alignSelf: "flex-end",
                color: theme.palette.background.hex,
                padding: "8px",
                borderRadius: "8px",
                backgroundColor: theme.palette.dark.hex,
                border: "none",
              }}
            >
              <FaTimes style={{ fontSize: "16px" }} />
            </button>

            <div style={{ display: "flex", flexDirection: "column", gap: "4px", borderBottom: `1px solid ${theme.palette.dark.hex}`, paddingBottom: "16px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <FaUserCircle style={{ fontSize: "28px", color: theme.palette.background.hex }} />
                <h3 style={{ color: theme.palette.background.hex, fontSize: theme.fontSizes.l, fontWeight: theme.fontWeight.bold }}>
                  {isLoggedIn ? getRoleLabel() : "Sesión no iniciada"}
                </h3>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <button
                style={buttonBaseStyle}
                onMouseOver={(e) => Object.assign(e.currentTarget.style, hoverStyle)}
                onMouseOut={(e) => Object.assign(e.currentTarget.style, { backgroundColor: "transparent" })}
                onClick={handleTypeUserHome}
              >
                <FaHome /> Inicio
              </button>
              {isLoggedIn ? (
                <>
                  <button
                    style={buttonBaseStyle}
                    onMouseOver={(e) => Object.assign(e.currentTarget.style, hoverStyle)}
                    onMouseOut={(e) => Object.assign(e.currentTarget.style, { backgroundColor: "transparent" })}
                    onClick={handleTypeUserProfile}
                  >
                    <FaUser /> Mi perfil
                  </button>

                  <button
                    style={buttonBaseStyle}
                    onMouseOver={(e) => Object.assign(e.currentTarget.style, hoverStyle)}
                    onMouseOut={(e) => Object.assign(e.currentTarget.style, { backgroundColor: "transparent" })}
                    onClick={() => {
                      setIsSidebarOpen(false);
                      setShowLogoutModal(true);
                    }}                    
                  >
                    <FaSignOutAlt /> Cerrar sesión
                  </button>
                </>
              ) : (
                <>
                  <button
                    style={buttonBaseStyle}
                    onMouseOver={(e) => Object.assign(e.currentTarget.style, hoverStyle)}
                    onMouseOut={(e) => Object.assign(e.currentTarget.style, { backgroundColor: "transparent" })}
                    onClick={() => {
                      router.push("/login");
                      setIsSidebarOpen(false);
                    }}
                  >
                    <FaSignInAlt /> Iniciar sesión
                  </button>

                  <button
                    style={buttonBaseStyle}
                    onMouseOver={(e) => Object.assign(e.currentTarget.style, hoverStyle)}
                    onMouseOut={(e) => Object.assign(e.currentTarget.style, { backgroundColor: "transparent" })}
                    onClick={() => {
                      router.push("/register");
                      setIsSidebarOpen(false);
                    }}
                  >
                    <FaUserPlus /> Registrarse
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
      {showLogoutModal && <LogOut onClose={() => setShowLogoutModal(false)} />}
    </>
  );
}