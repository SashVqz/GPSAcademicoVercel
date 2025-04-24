import React from "react";
import { theme } from "@/constants/theme";

const SearchForm = ({
  searchParams,
  handleInputChange,
  generateLinkedInUrl,
  handleOfferClick,
  userEligibility,
}) => {
  return (
    <div
      className="mb-6 p-4 border rounded-lg shadow-sm"
      style={{ borderColor: theme.palette.lightGray.hex }}
    >
      {!userEligibility.isEligible ? (
        <div className="bg-amber-100 border-l-4 border-amber-500 text-amber-700 p-4 mb-4 flex items-start">
          <i className="bi bi-exclamation-triangle-fill mr-2 mt-0.5"></i>
          <div>
            <p className="font-medium">Información importante</p>
            <p>
              {userEligibility.message ||
                "Debes estar cursando al menos el tercer año para buscar prácticas."}
            </p>
          </div>
        </div>
      ) : !userEligibility.canSearchJobs &&
        userEligibility.canSearchInternships ? (
        <div className="bg-blue-50 border-l-4 border-blue-500 text-blue-700 p-4 mb-4 flex items-start">
          <i className="bi bi-mortarboard-fill mr-2 mt-0.5"></i>
          <div>
            <p>
              En tu año académico actual, solo puedes buscar prácticas
              relacionadas con tu especialización.
            </p>
          </div>
        </div>
      ) : userEligibility.canSearchJobs ? (
        <div className="bg-green-50 border-l-4 border-green-500 text-green-700 p-4 mb-4 flex items-start">
          <i className="bi bi-check-circle-fill mr-2 mt-0.5"></i>
          <div>
            <p>
              Debido a tu avance académico, puedes buscar tanto ofertas de
              trabajo como prácticas.
            </p>
          </div>
        </div>
      ) : null}

      <form className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label
              htmlFor="keywords"
              className="block text-sm font-medium mb-1 items-center"
              style={{ color: theme.palette.text.hex }}
            >
              <i className="bi bi-tags-fill mr-2"></i>
              Habilidades o puesto
            </label>
            <div className="relative">
              <input
                type="text"
                id="keywords"
                name="keywords"
                value={searchParams.keywords}
                onChange={handleInputChange}
                className="w-full pl-4 p-2 border rounded-md transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                style={{
                  borderColor: theme.palette.light.hex,
                  color: theme.palette.text.hex,
                }}
                placeholder="Ej: Desarrollador React, Data Analyst"
              />
            </div>
          </div>
          <div>
            <label
              htmlFor="location"
              className="block text-sm font-medium mb-1 items-center"
              style={{ color: theme.palette.text.hex }}
            >
              <i className="bi bi-geo-alt-fill mr-2"></i>
              Ubicación
            </label>
            <div className="relative">
              <input
                type="text"
                id="location"
                name="location"
                value={searchParams.location}
                onChange={handleInputChange}
                className="w-full pl-4 p-2 border rounded-md transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                style={{
                  borderColor: theme.palette.light.hex,
                  color: theme.palette.text.hex,
                }}
                placeholder="Ej: Madrid, Barcelona, Valencia"
              />
            </div>
          </div>

          <div className="relative">
            <label
              htmlFor="jobType"
              className="block text-sm font-medium mb-1 items-center"
              style={{ color: theme.palette.text.hex }}
            >
              <i className="bi bi-briefcase-fill mr-2"></i>
              Tipo de empleo
            </label>
            <div className="relative">
              <select
                id="jobType"
                name="jobType"
                value={searchParams.jobType}
                onChange={handleInputChange}
                className="appearance-none w-full p-2 pl-4 pr-8 border rounded-md transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer"
                style={{
                  borderColor: theme.palette.light.hex,
                  color: theme.palette.text.hex,
                  backgroundColor: "white",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                }}
                disabled={
                  !userEligibility.canSearchJobs &&
                  userEligibility.canSearchInternships
                }
                title={
                  !userEligibility.canSearchJobs
                    ? "Solo puedes buscar prácticas según tu año académico"
                    : ""
                }
              >
                <option value="I">Prácticas</option>
                {userEligibility.canSearchJobs && (
                  <>
                    <option value="F">Jornada completa</option>
                    <option value="P">Jornada parcial</option>
                    <option value="">Todos los tipos</option>
                  </>
                )}
              </select>

              <div
                className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2"
                style={{ color: theme.palette.primary.hex }}
              >
                <i className="bi bi-chevron-down"></i>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <label
              htmlFor="datePosted"
              className="block text-sm font-medium mb-1 items-center"
              style={{ color: theme.palette.text.hex }}
            >
              <i className="bi bi-calendar3 mr-2"></i>
              Fecha de publicación
            </label>
            <div className="relative">
              <select
                id="datePosted"
                name="datePosted"
                value={searchParams.datePosted}
                onChange={handleInputChange}
                className="appearance-none w-full p-2 pl-4 pr-8 border rounded-md transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer"
                style={{
                  borderColor: theme.palette.light.hex,
                  color: theme.palette.text.hex,
                  backgroundColor: "white",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                }}
              >
                <option value="r86400">Últimas 24 horas</option>
                <option value="r604800">Últimos 7 días</option>
                <option value="r2592000">Últimos 30 días</option>
                <option value="">Cualquier fecha</option>
              </select>
              <div
                className="pointer-events-none absolute inset-y-0 left-0 flex items-center px-2"
                style={{ color: theme.palette.gray.hex }}
              ></div>
              <div
                className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2"
                style={{ color: theme.palette.primary.hex }}
              >
                <i className="bi bi-chevron-down"></i>
              </div>
            </div>
          </div>

          <div className="relative">
            <label
              htmlFor="remote"
              className="block text-sm font-medium mb-1 items-center"
              style={{ color: theme.palette.text.hex }}
            >
              <i className="bi bi-laptop mr-2"></i>
              Modalidad
            </label>
            <div className="relative">
              <select
                id="remote"
                name="remote"
                value={searchParams.remote ? "2" : ""}
                onChange={(e) =>
                  handleInputChange({
                    target: {
                      name: "remote",
                      value: e.target.value === "2",
                      type: "checkbox",
                      checked: e.target.value === "2",
                    },
                  })
                }
                className="appearance-none w-full p-2 pl-4 pr-8 border rounded-md transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer"
                style={{
                  borderColor: theme.palette.light.hex,
                  color: theme.palette.text.hex,
                  backgroundColor: "white",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                }}
              >
                <option value="">Todas las modalidades</option>
                <option value="2">Solo remoto</option>
              </select>

              <div
                className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2"
                style={{ color: theme.palette.primary.hex }}
              >
                <i className="bi bi-chevron-down"></i>
              </div>
            </div>
          </div>
        </div>

        <div className="text-left">
          {userEligibility.isEligible ? (
            <a
              href={generateLinkedInUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-md transition-colors duration-300 hover:bg-opacity-90 shadow-md"
              style={{
                backgroundColor: theme.palette.primary.hex,
                color: theme.palette.background.hex,
                borderRadius: theme.buttonRadios.m,
                fontWeight: theme.fontWeight.bold,
              }}
              onClick={(e) =>
                handleOfferClick(
                  e,
                  `Búsqueda de ${
                    searchParams.jobType === "I" ? "prácticas" : "empleo"
                  } en ${searchParams.keywords || "tu especialización"}`
                )
              }
            >
              <i className="bi bi-linkedin"></i>
              Ver ofertas en LinkedIn
            </a>
          ) : (
            <button
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-md transition-colors opacity-50 cursor-not-allowed shadow"
              style={{
                backgroundColor: theme.palette.lightGray.hex,
                color: theme.palette.darkGray.hex,
                borderRadius: theme.buttonRadios.m,
                fontWeight: theme.fontWeight.bold,
              }}
              disabled
            >
              <i className="bi bi-lock-fill"></i>
              Ver ofertas en LinkedIn
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default SearchForm;
