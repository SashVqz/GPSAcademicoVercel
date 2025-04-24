export const roadmapsData = {
    "artificial-intelligence": {
      id: "artificial-intelligence",
      name: "Inteligencia Artificial",
      shortDescription: "Diseña y desarrolla sistemas inteligentes con capacidad de aprendizaje y adaptación.",
      description: "La especialización en Inteligencia Artificial te prepara para diseñar y desarrollar sistemas que pueden aprender, adaptarse y tomar decisiones basadas en datos. Este campo combina matemáticas, estadística, ciencias de la computación y dominios específicos para crear soluciones que automatizan tareas complejas. Con el auge de tecnologías como ChatGPT y modelos generativos, la IA está transformando todos los sectores industriales, desde la atención médica hasta la manufactura, creando una demanda sin precedentes de especialistas capacitados.",
      languages: ["Python", "R", "Julia", "C++", "Rust", "JavaScript"],
      tools: [
        { name: "TensorFlow", icon: "tensorflow.svg", popularity: 78 },
        { name: "PyTorch", icon: "pytorch.svg", popularity: 92 },
        { name: "Scikit-learn", icon: "scikit.svg", popularity: 85 },
        { name: "Hugging Face", icon: "huggingface.svg", popularity: 89 },
        { name: "JAX", icon: "jax.svg", popularity: 62 },
        { name: "Pandas", icon: "pandas.svg", popularity: 90 },
        { name: "CUDA", icon: "cuda.svg", popularity: 65 },
        { name: "Ray", icon: "ray.svg", popularity: 58 },
        { name: "MLflow", icon: "mlflow.svg", popularity: 70 },
        { name: "Weights & Biases", icon: "wandb.svg", popularity: 75 },
        { name: "LangChain", icon: "langchain.svg", popularity: 85 },
        { name: "DVC", icon: "dvc.svg", popularity: 55 }
      ],
      jobProfiles: [
        { 
          name: "Machine Learning Engineer", 
          percentage: 28, 
          growth: "alto",
          description: "Desarrolla algoritmos y sistemas de aprendizaje automático, implementa modelos en producción y optimiza su rendimiento. Requiere un fuerte conocimiento en programación, matemáticas y estadísticas."
        },
        { 
          name: "AI Research Scientist", 
          percentage: 12, 
          growth: "moderado",
          description: "Investiga y desarrolla nuevos algoritmos, técnicas y enfoques en IA. Contribuye al avance del campo mediante publicaciones académicas y prototipos de tecnologías emergentes."
        },
        { 
          name: "MLOps Engineer", 
          percentage: 18, 
          growth: "muy alto",
          description: "Especialista en la gestión del ciclo de vida completo de los modelos de ML, desde el desarrollo hasta el despliegue y monitorización en producción, asegurando escalabilidad, rendimiento y fiabilidad."
        },
        { 
          name: "Prompt Engineer", 
          percentage: 10, 
          growth: "muy alto",
          description: "Diseña y optimiza prompts para modelos de lenguaje y sistemas generativos. Trabaja en la interfaz entre humanos e IA para mejorar la calidad, precisión y utilidad de las respuestas."
        },
        { 
          name: "Data Scientist", 
          percentage: 14, 
          growth: "moderado",
          description: "Analiza grandes conjuntos de datos para extraer insights y desarrollar modelos predictivos. Combina habilidades estadísticas, programación y conocimiento del negocio para resolver problemas complejos."
        },
        { 
          name: "Computer Vision Engineer", 
          percentage: 8, 
          growth: "moderado",
          description: "Especialista en sistemas que interpretan y procesan información visual. Desarrolla soluciones para reconocimiento de objetos, análisis de imágenes médicas, sistemas de vigilancia y más."
        },
        { 
          name: "NLP Specialist", 
          percentage: 10, 
          growth: "alto",
          description: "Experto en procesamiento del lenguaje natural, desarrolla sistemas capaces de entender, interpretar y generar lenguaje humano. Trabaja en chatbots, traducción automática y análisis de sentimiento."
        }
      ],
      salaryData: {
        spain: {
          junior: { min: 30000, max: 45000, median: 36000, currency: "EUR" },
          mid: { min: 45000, max: 65000, median: 52000, currency: "EUR" },
          senior: { min: 65000, max: 95000, median: 78000, currency: "EUR" },
          lead: { min: 85000, max: 120000, median: 95000, currency: "EUR" }
        },
        europe: {
          junior: { min: 42000, max: 60000, median: 50000, currency: "EUR" },
          mid: { min: 60000, max: 90000, median: 75000, currency: "EUR" },
          senior: { min: 90000, max: 140000, median: 110000, currency: "EUR" },
          lead: { min: 120000, max: 180000, median: 145000, currency: "EUR" }
        },
        usa: {
          junior: { min: 85000, max: 120000, median: 100000, currency: "USD" },
          mid: { min: 120000, max: 170000, median: 145000, currency: "USD" },
          senior: { min: 170000, max: 240000, median: 195000, currency: "USD" },
          lead: { min: 220000, max: 320000, median: 260000, currency: "USD" }
        }
      },
      marketAnalysis: {
        demandLevel: 5, // 1-5
        competitionLevel: 4, // 1-5
        barrierToEntry: "Alta (requiere conocimientos sólidos de matemáticas, estadística y programación)",
        jobGrowth2025: 28, // porcentaje estimado de crecimiento
        remoteWorkOpportunities: "Excelentes (80% de las posiciones permiten trabajo remoto)",
        industryConcentration: ["Tech", "Salud", "Finanzas", "Automoción", "Retail", "Educación"]
      },
      trendGraph: {
        years: [2019, 2020, 2021, 2022, 2023, 2024],
        spainDemand: [62, 85, 120, 160, 210, 245],
        europeDemand: [350, 470, 620, 780, 980, 1150],
        globalDemand: [1150, 1650, 2200, 2950, 3800, 4500]
      },
      keySubjects: [
        { name: "Matemáticas para Machine Learning", difficulty: 4 },
        { name: "Aprendizaje Supervisado y No Supervisado", difficulty: 3 },
        { name: "Deep Learning y Redes Neuronales", difficulty: 4 },
        { name: "Procesamiento de Lenguaje Natural", difficulty: 4 },
        { name: "Large Language Models", difficulty: 5 },
        { name: "Generative AI", difficulty: 4 },
        { name: "Visión por Computador", difficulty: 4 },
        { name: "Sistemas de Recomendación", difficulty: 3 },
        { name: "Ética en IA", difficulty: 2 },
        { name: "MLOps y Despliegue de Modelos", difficulty: 4 }
      ],
      industryPartners: [
        { name: "Google DeepMind", logo: "google-deepmind.svg" },
        { name: "OpenAI", logo: "openai.svg" },
        { name: "Microsoft Research", logo: "microsoft-research.svg" },
        { name: "BBVA AI Factory", logo: "bbva-ai.svg" },
        { name: "Anthropic", logo: "anthropic.svg" }
      ],
      difficultyLevel: 4.2,
      futureRelevance: 5,
      careerPathways: [
        { path: "Investigación en IA", description: "Desarrollo de nuevos algoritmos y técnicas" },
        { path: "IA Aplicada", description: "Implementación de soluciones de IA en sectores específicos" },
        { path: "MLOps", description: "Especialización en el ciclo de vida completo de modelos ML" },
        { path: "AI Ethics", description: "Enfoque en el desarrollo responsable de la IA" },
        { path: "AI Product Management", description: "Gestión de productos basados en IA" },
        { path: "GenAI Engineering", description: "Especialización en modelos generativos" }
      ]
    },
    
    "backend-development": {
      id: "backend-development",
      name: "Desarrollo Backend",
      shortDescription: "Construye la lógica del servidor, bases de datos y APIs que impulsan las aplicaciones.",
      description: "La especialización en Desarrollo Backend te capacita para construir y mantener la infraestructura digital que hace funcionar las aplicaciones modernas. Con el aumento exponencial del consumo digital, las empresas necesitan construir sistemas escalables, seguros y eficientes que puedan manejar millones de usuarios simultáneos. Los ingenieros backend diseñan APIs, optimizan bases de datos, implementan microservicios y arquitecturas serverless, y garantizan la seguridad y rendimiento de la aplicación. Con la creciente adopción de tecnologías cloud, este perfil es cada vez más estratégico para cualquier organización con presencia digital.",
      languages: ["JavaScript/TypeScript", "Python", "Go", "Java", "C#", "Rust", "PHP", "Kotlin"],
      tools: [
        { name: "Node.js", icon: "nodejs.svg", popularity: 88 },
        { name: "Express", icon: "express.svg", popularity: 82 },
        { name: "NestJS", icon: "nestjs.svg", popularity: 75 },
        { name: "Spring Boot", icon: "spring.svg", popularity: 80 },
        { name: "Django", icon: "django.svg", popularity: 72 },
        { name: "FastAPI", icon: "fastapi.svg", popularity: 78 },
        { name: "Docker", icon: "docker.svg", popularity: 92 },
        { name: "Kubernetes", icon: "kubernetes.svg", popularity: 85 },
        { name: "AWS Lambda", icon: "aws-lambda.svg", popularity: 80 },
        { name: "Terraform", icon: "terraform.svg", popularity: 82 },
        { name: "PostgreSQL", icon: "postgresql.svg", popularity: 90 },
        { name: "MongoDB", icon: "mongodb.svg", popularity: 78 },
        { name: "Redis", icon: "redis.svg", popularity: 75 },
        { name: "Kafka", icon: "kafka.svg", popularity: 72 },
        { name: "gRPC", icon: "grpc.svg", popularity: 68 },
        { name: "GraphQL", icon: "graphql.svg", popularity: 70 }
      ],
      jobProfiles: [
        { 
          name: "Backend Developer", 
          percentage: 38, 
          growth: "alto",
          description: "Especialista en el desarrollo de la lógica del servidor, APIs, bases de datos y servicios que potencian las aplicaciones. Construye componentes que procesan datos, implementan reglas de negocio y aseguran la escalabilidad."
        },
        { 
          name: "DevOps Engineer", 
          percentage: 20, 
          growth: "muy alto",
          description: "Responsable de automatizar y optimizar los procesos de desarrollo, despliegue y operaciones. Implementa CI/CD, gestiona infraestructura como código y asegura la fiabilidad de los sistemas."
        },
        { 
          name: "Full Stack Developer", 
          percentage: 18, 
          growth: "moderado",
          description: "Desarrollador versátil capaz de trabajar tanto en el backend como en el frontend. Construye aplicaciones completas, desde la interfaz de usuario hasta la lógica del servidor y la base de datos."
        },
        { 
          name: "Cloud Engineer", 
          percentage: 12, 
          growth: "alto",
          description: "Experto en el diseño, implementación y gestión de soluciones basadas en la nube. Trabaja con servicios AWS, Azure o GCP para crear arquitecturas escalables, seguras y eficientes."
        },
        { 
          name: "API Architect", 
          percentage: 5, 
          growth: "moderado",
          description: "Diseña y define interfaces de programación que permiten la comunicación entre diferentes sistemas. Se especializa en crear APIs intuitivas, eficientes y bien documentadas."
        },
        { 
          name: "SRE (Site Reliability Engineer)", 
          percentage: 7, 
          growth: "muy alto",
          description: "Combina ingeniería de software y operaciones para diseñar sistemas altamente disponibles y escalables. Se enfoca en la automatización, monitorización y respuesta a incidentes."
        }
      ],
      salaryData: {
        spain: {
          junior: { min: 25000, max: 38000, median: 30000, currency: "EUR" },
          mid: { min: 38000, max: 58000, median: 46000, currency: "EUR" },
          senior: { min: 58000, max: 85000, median: 70000, currency: "EUR" },
          lead: { min: 78000, max: 110000, median: 90000, currency: "EUR" }
        },
        europe: {
          junior: { min: 40000, max: 55000, median: 48000, currency: "EUR" },
          mid: { min: 55000, max: 80000, median: 68000, currency: "EUR" },
          senior: { min: 80000, max: 130000, median: 100000, currency: "EUR" },
          lead: { min: 110000, max: 160000, median: 130000, currency: "EUR" }
        },
        usa: {
          junior: { min: 80000, max: 110000, median: 95000, currency: "USD" },
          mid: { min: 110000, max: 150000, median: 130000, currency: "USD" },
          senior: { min: 150000, max: 220000, median: 180000, currency: "USD" },
          lead: { min: 200000, max: 300000, median: 240000, currency: "USD" }
        }
      },
      marketAnalysis: {
        demandLevel: 5,
        competitionLevel: 3,
        barrierToEntry: "Media (requiere conocimientos técnicos sólidos)",
        jobGrowth2025: 25,
        remoteWorkOpportunities: "Excelentes (85% de las posiciones permiten trabajo remoto)",
        industryConcentration: ["Tech", "Finanzas", "E-commerce", "Salud", "Educación", "Servicios"]
      },
      trendGraph: {
        years: [2019, 2020, 2021, 2022, 2023, 2024],
        spainDemand: [170, 210, 240, 270, 290, 310],
        europeDemand: [900, 1100, 1300, 1500, 1650, 1800],
        globalDemand: [3000, 3400, 3800, 4200, 4600, 5000]
      },
      keySubjects: [
        { name: "Arquitectura de Aplicaciones", difficulty: 4 },
        { name: "Bases de Datos Relacionales y NoSQL", difficulty: 3 },
        { name: "APIs RESTful y GraphQL", difficulty: 3 },
        { name: "Sistemas Distribuidos", difficulty: 4 },
        { name: "Cloud Computing y Serverless", difficulty: 4 },
        { name: "Microservicios", difficulty: 4 },
        { name: "DevOps y CI/CD", difficulty: 3 },
        { name: "Seguridad en Aplicaciones", difficulty: 4 },
        { name: "Testing y Calidad de Software", difficulty: 3 },
        { name: "Escalabilidad y Optimización", difficulty: 4 }
      ],
      industryPartners: [
        { name: "Amazon Web Services", logo: "aws.svg" },
        { name: "Microsoft Azure", logo: "azure.svg" },
        { name: "Google Cloud", logo: "gcp.svg" },
        { name: "Glovo", logo: "glovo.svg" },
        { name: "CaixaBank Tech", logo: "caixabank.svg" }
      ],
      difficultyLevel: 3.8,
      futureRelevance: 4.8,
      careerPathways: [
        { path: "Arquitectura de Software", description: "Diseño de sistemas complejos y escalables" },
        { path: "DevOps", description: "Automatización y optimización de procesos de desarrollo" },
        { path: "Cloud Architecture", description: "Especialización en infraestructuras cloud" },
        { path: "SRE", description: "Ingeniería de fiabilidad de sistemas" },
        { path: "Security Engineering", description: "Especialización en seguridad informática" },
        { path: "Platform Engineering", description: "Desarrollo de plataformas para equipos de desarrollo" }
      ]
    },
    
    "data-analyst": {
      id: "data-analyst",
      name: "Analista de Datos",
      shortDescription: "Extrae insights valiosos a partir de grandes conjuntos de datos para la toma de decisiones.",
      description: "La especialización en Análisis de Datos te convierte en el puente entre los datos y la toma de decisiones empresariales. En la economía digital actual, las organizaciones acumulan cantidades masivas de datos, pero necesitan profesionales que puedan transformarlos en conocimientos accionables. Como analista de datos, aprenderás a extraer, limpiar y visualizar datos complejos para descubrir patrones y tendencias que guíen estrategias de negocio. Este rol es transversal a todas las industrias, desde marketing hasta finanzas, salud o recursos humanos, permitiéndote desarrollar tu carrera en diversos sectores.",
      languages: ["SQL", "Python", "R", "DAX", "M (Power Query)"],
      tools: [
        { name: "Excel/Google Sheets", icon: "excel.svg", popularity: 95 },
        { name: "Tableau", icon: "tableau.svg", popularity: 88 },
        { name: "Power BI", icon: "powerbi.svg", popularity: 92 },
        { name: "Python pandas", icon: "pandas.svg", popularity: 85 },
        { name: "Looker", icon: "looker.svg", popularity: 70 },
        { name: "Google Data Studio", icon: "datastudio.svg", popularity: 75 },
        { name: "SQL Server", icon: "sqlserver.svg", popularity: 82 },
        { name: "PostgreSQL", icon: "postgresql.svg", popularity: 78 },
        { name: "BigQuery", icon: "bigquery.svg", popularity: 72 },
        { name: "Snowflake", icon: "snowflake.svg", popularity: 70 },
        { name: "dbt", icon: "dbt.svg", popularity: 65 },
        { name: "Jupyter", icon: "jupyter.svg", popularity: 80 },
        { name: "Matplotlib/Seaborn", icon: "matplotlib.svg", popularity: 75 }
      ],
      jobProfiles: [
        { 
          name: "Data Analyst", 
          percentage: 42, 
          growth: "alto",
          description: "Profesional especializado en la recopilación, procesamiento y análisis de datos para identificar tendencias, patrones y oportunidades de negocio. Transforma datos complejos en insights accionables mediante visualizaciones y reportes."
        },
        { 
          name: "Business Intelligence Analyst", 
          percentage: 22, 
          growth: "moderado",
          description: "Enfocado en desarrollar e implementar soluciones de BI que transforman datos en información estratégica. Diseña dashboards, reportes automatizados y sistemas de monitorización para la toma de decisiones."
        },
        { 
          name: "Data Visualization Specialist", 
          percentage: 10, 
          growth: "alto",
          description: "Experto en convertir datos complejos en representaciones visuales intuitivas y efectivas. Domina herramientas de visualización y principios de diseño para comunicar insights de forma clara y persuasiva."
        },
        { 
          name: "Marketing Analyst", 
          percentage: 12, 
          growth: "moderado",
          description: "Especialista en el análisis de datos de marketing y comportamiento del consumidor. Evalúa el rendimiento de campañas, identifica segmentos de clientes y optimiza estrategias de marketing basadas en datos."
        },
        { 
          name: "Financial Analyst", 
          percentage: 8, 
          growth: "estable",
          description: "Analiza datos financieros para evaluar rendimiento, identificar tendencias y realizar proyecciones. Apoya decisiones de inversión, presupuestos y planificación financiera mediante análisis cuantitativos."
        },
        { 
          name: "Healthcare Data Analyst", 
          percentage: 6, 
          growth: "alto",
          description: "Especializado en el análisis de datos del sector salud para mejorar la calidad de atención, optimizar procesos clínicos y reducir costos. Trabaja con datos de pacientes, ensayos clínicos y registros médicos."
        }
      ],
      salaryData: {
        spain: {
          junior: { min: 22000, max: 35000, median: 28000, currency: "EUR" },
          mid: { min: 35000, max: 50000, median: 42000, currency: "EUR" },
          senior: { min: 50000, max: 75000, median: 60000, currency: "EUR" },
          lead: { min: 65000, max: 95000, median: 78000, currency: "EUR" }
        },
        europe: {
          junior: { min: 35000, max: 50000, median: 42000, currency: "EUR" },
          mid: { min: 50000, max: 70000, median: 60000, currency: "EUR" },
          senior: { min: 70000, max: 100000, median: 85000, currency: "EUR" },
          lead: { min: 90000, max: 130000, median: 110000, currency: "EUR" }
        },
        usa: {
          junior: { min: 65000, max: 90000, median: 78000, currency: "USD" },
          mid: { min: 90000, max: 120000, median: 105000, currency: "USD" },
          senior: { min: 120000, max: 160000, median: 140000, currency: "USD" },
          lead: { min: 150000, max: 220000, median: 180000, currency: "USD" }
        }
      },
      marketAnalysis: {
        demandLevel: 4.5,
        competitionLevel: 3,
        barrierToEntry: "Media-Baja (requiere conocimientos de estadística y herramientas específicas)",
        jobGrowth2025: 22,
        remoteWorkOpportunities: "Muy buenas (75% de las posiciones permiten trabajo remoto)",
        industryConcentration: ["Finanzas", "Tech", "Marketing", "Retail", "Salud", "Consultoría"]
      },
      trendGraph: {
        years: [2019, 2020, 2021, 2022, 2023, 2024],
        spainDemand: [110, 145, 180, 210, 240, 265],
        europeDemand: [650, 800, 950, 1100, 1250, 1400],
        globalDemand: [2200, 2700, 3200, 3700, 4100, 4500]
      },
      keySubjects: [
        { name: "Estadística Aplicada", difficulty: 3 },
        { name: "SQL Avanzado", difficulty: 3 },
        { name: "Análisis Exploratorio de Datos", difficulty: 2 },
        { name: "Visualización de Datos", difficulty: 3 },
        { name: "Business Intelligence", difficulty: 3 },
        { name: "Data Wrangling", difficulty: 3 },
        { name: "Modelado Predictivo Básico", difficulty: 3 },
        { name: "Transformación y Limpieza de Datos", difficulty: 3 },
        { name: "Storytelling con Datos", difficulty: 2 },
        { name: "Automatización de Reportes", difficulty: 2 }
      ],
      industryPartners: [
        { name: "Accenture", logo: "accenture.svg" },
        { name: "Deloitte", logo: "deloitte.svg" },
        { name: "BBVA", logo: "bbva.svg" },
        { name: "Santander", logo: "santander.svg" },
        { name: "EY", logo: "ey.svg" }
      ],
      difficultyLevel: 3,
      futureRelevance: 4.5,
      careerPathways: [
        { path: "Business Intelligence", description: "Enfoque en herramientas y procesos de BI empresarial" },
        { path: "Data Science", description: "Evolución hacia modelos predictivos más complejos" },
        { path: "Marketing Analytics", description: "Especialización en análisis para marketing" },
        { path: "Financial Analytics", description: "Especialización en el sector financiero" },
        { path: "Healthcare Analytics", description: "Análisis de datos en el sector salud" },
        { path: "People Analytics", description: "Análisis de datos para recursos humanos" }
      ]
    },
    
    "frontend-developer": {
        id: "frontend-developer",
        name: "Desarrollo Frontend",
        shortDescription: "Crea interfaces de usuario interactivas, accesibles y eficientes para aplicaciones web y móviles.",
        description: "La especialización en Desarrollo Frontend combina programación, diseño y experiencia de usuario para crear interfaces digitales que cautiven a los usuarios. Con la creciente importancia de la experiencia digital, las empresas buscan desarrolladores que dominen las últimas tecnologías y frameworks para construir aplicaciones web modernas, responsivas y accesibles. El ecosistema frontend evoluciona rápidamente, con nuevas herramientas y enfoques emergiendo constantemente, lo que ofrece un entorno de aprendizaje continuo y oportunidades de crecimiento profesional en sectores como e-commerce, fintech, entretenimiento digital y startups tecnológicas.",
        languages: ["JavaScript", "TypeScript", "HTML", "CSS/SCSS/LESS", "WebAssembly"],
        tools: [
            { name: "React", icon: "react.svg", popularity: 92 },
            { name: "Next.js", icon: "nextjs.svg", popularity: 88 },
            { name: "Vue.js", icon: "vue.svg", popularity: 75 },
            { name: "Angular", icon: "angular.svg", popularity: 68 },
            { name: "Svelte", icon: "svelte.svg", popularity: 70 },
            { name: "Astro", icon: "astro.svg", popularity: 65 },
            { name: "Tailwind CSS", icon: "tailwind.svg", popularity: 90 },
            { name: "styled-components", icon: "styled-components.svg", popularity: 75 },
            { name: "Vite", icon: "vite.svg", popularity: 85 },
            { name: "Webpack", icon: "webpack.svg", popularity: 70 },
            { name: "Redux/Zustand", icon: "redux.svg", popularity: 75 },
            { name: "React Query", icon: "react-query.svg", popularity: 78 },
            { name: "Jest", icon: "jest.svg", popularity: 80 },
            { name: "Cypress", icon: "cypress.svg", popularity: 78 },
            { name: "Playwright", icon: "playwright.svg", popularity: 72 },
            { name: "Figma", icon: "figma.svg", popularity: 88 },
            { name: "Storybook", icon: "storybook.svg", popularity: 75 }
        ],
        jobProfiles: [
            { 
            name: "Frontend Developer", 
            percentage: 42, 
            growth: "alto",
            description: "Especialista en la creación de interfaces de usuario para aplicaciones web. Domina HTML, CSS, JavaScript y frameworks modernos para desarrollar experiencias interactivas, responsivas y atractivas para los usuarios."
            },
            { 
            name: "UI Developer", 
            percentage: 16, 
            growth: "moderado",
            description: "Centrado en la implementación técnica de interfaces de usuario, traduciendo diseños en código. Combina habilidades de programación con sensibilidad estética para crear interfaces pixel-perfect."
            },
            { 
            name: "Full Stack Developer (orientado a frontend)", 
            percentage: 20, 
            growth: "moderado",
            description: "Desarrollador con enfoque principal en frontend pero con capacidades para trabajar en toda la pila tecnológica. Construye tanto la interfaz de usuario como la lógica del servidor, con mayor especialización en la parte cliente."
            },
            { 
            name: "Web Accessibility Specialist", 
            percentage: 7, 
            growth: "alto",
            description: "Experto en crear interfaces inclusivas y accesibles para todos los usuarios, incluidas personas con discapacidades. Domina las pautas WCAG y técnicas para asegurar que las aplicaciones sean utilizables por todos."
            },
            { 
            name: "Frontend Architect", 
            percentage: 8, 
            growth: "moderado",
            description: "Define la estructura, patrones y mejores prácticas para aplicaciones frontend complejas. Diseña soluciones escalables y establece estándares técnicos para equipos de desarrollo."
            },
            { 
            name: "UX Engineer", 
            percentage: 7, 
            growth: "alto",
            description: "Posición híbrida entre diseño UX y desarrollo frontend. Crea prototipos interactivos, implementa componentes reutilizables y aporta perspectiva técnica a las decisiones de diseño de experiencia de usuario."
            }
        ],
        salaryData: {
            spain: {
            junior: { min: 23000, max: 35000, median: 28000, currency: "EUR" },
            mid: { min: 35000, max: 52000, median: 42000, currency: "EUR" },
            senior: { min: 52000, max: 80000, median: 65000, currency: "EUR" },
            lead: { min: 70000, max: 100000, median: 85000, currency: "EUR" }
            },
            europe: {
            junior: { min: 32000, max: 50000, median: 42000, currency: "EUR" },
            mid: { min: 50000, max: 75000, median: 62000, currency: "EUR" },
            senior: { min: 75000, max: 110000, median: 90000, currency: "EUR" },
            lead: { min: 100000, max: 150000, median: 120000, currency: "EUR" }
            },
            usa: {
            junior: { min: 70000, max: 100000, median: 85000, currency: "USD" },
            mid: { min: 100000, max: 140000, median: 120000, currency: "USD" },
            senior: { min: 140000, max: 200000, median: 165000, currency: "USD" },
            lead: { min: 180000, max: 260000, median: 210000, currency: "USD" }
            }
        },
        marketAnalysis: {
            demandLevel: 4.5, // 1-5
            competitionLevel: 3.5, // 1-5
            barrierToEntry: "Media (requiere conocimientos técnicos y sensibilidad para el diseño)",
            jobGrowth2025: 20, // porcentaje estimado de crecimiento
            remoteWorkOpportunities: "Excelentes (85% de las posiciones permiten trabajo remoto)",
            industryConcentration: ["Tech", "Agencias digitales", "E-commerce", "Medios", "Startups", "Fintech"]
        },
        trendGraph: {
            years: [2019, 2020, 2021, 2022, 2023, 2024],
            spainDemand: [150, 180, 210, 235, 255, 280],
            europeDemand: [800, 950, 1100, 1250, 1400, 1550],
            globalDemand: [2600, 3100, 3500, 3900, 4300, 4700]
        },
        keySubjects: [
            { name: "JavaScript Moderno", difficulty: 3 },
            { name: "TypeScript", difficulty: 3 },
            { name: "React y Ecosistema", difficulty: 4 },
            { name: "CSS Avanzado", difficulty: 3 },
            { name: "Arquitectura Frontend", difficulty: 4 },
            { name: "Rendimiento Web", difficulty: 4 },
            { name: "Accesibilidad Web", difficulty: 3 },
            { name: "Testing Frontend", difficulty: 3 },
            { name: "UX/UI Fundamentals", difficulty: 2 },
            { name: "SEO Técnico", difficulty: 2 }
        ],
        industryPartners: [
            { name: "Vercel", logo: "vercel.svg" },
            { name: "Cabify", logo: "cabify.svg" },
            { name: "Idealista", logo: "idealista.svg" },
            { name: "Typeform", logo: "typeform.svg" },
            { name: "Shopify", logo: "shopify.svg" }
        ],
        difficultyLevel: 3.5,
        futureRelevance: 4.5,
        careerPathways: [
            { path: "UI Engineering", description: "Especialización en interfaces complejas e interactivas" },
            { path: "Frontend Architecture", description: "Diseño de arquitecturas frontend escalables" },
            { path: "Design Systems", description: "Creación y mantenimiento de sistemas de diseño" },
            { path: "Accessibility Specialist", description: "Especialización en interfaces accesibles" },
            { path: "Performance Optimization", description: "Optimización avanzada de rendimiento web" },
            { path: "Web3 Frontend", description: "Interfaces para aplicaciones descentralizadas" }
        ]
    }
};
  
export const getAllRoadmaps = () => {
    return Object.values(roadmapsData);
};
  
export const getRoadmapById = (id) => {
    return roadmapsData[id];
};
  
export const roadmapMenuItems = Object.values(roadmapsData).map(roadmap => ({
    id: roadmap.id,
    name: roadmap.name
}));