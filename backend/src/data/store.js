const fs = require("fs");
const path = require("path");

const dataDir = path.join(__dirname, "..", "..", "data");

function ensureDataDirectory() {
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
}

function readJson(fileName, fallback) {
  ensureDataDirectory();

  const filePath = path.join(dataDir, fileName);

  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify(fallback, null, 2));
    return structuredClone(fallback);
  }

  const raw = fs.readFileSync(filePath, "utf8");

  try {
    return JSON.parse(raw);
  } catch (error) {
    fs.writeFileSync(filePath, JSON.stringify(fallback, null, 2));
    return structuredClone(fallback);
  }
}

function writeJson(fileName, payload) {
  ensureDataDirectory();
  const filePath = path.join(dataDir, fileName);
  fs.writeFileSync(filePath, JSON.stringify(payload, null, 2));
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

const defaultProfile = {
  name: "Mahlet Getinet",
  professionalTitle: "Computer Science Student & Aspiring iOS Developer",
  intro: "I build thoughtful digital experiences through clean code, elegant interfaces, and a passion for solving real-world problems.",
  profileImage: "/frontend/assets/images/me.jpg",
  location: "Addis Ababa, Ethiopia",
  email: "mahletgetinet17@gmail.com",
  resumeLink: "/frontend/assets/images/Mahlet_Getinet_Resume.png",
  socialLinks: [
    { label: "GitHub", url: "https://github.com/mahletgetinet17" },
    { label: "LinkedIn", url: "https://www.linkedin.com/in/mahlet-getinet-4b7975347h" },
    { label: "X", url: "https://x.com/duskwood_MG" }
  ],
  biography: "Combining rigorous engineering habits with clean visual systems helps me craft interfaces that feel intuitive, confident, and memorable.",
  skills: [
    { name: "HTML", level: 92 },
    { name: "CSS", level: 88 },
    { name: "JavaScript", level: 86 },
    { name: "Swift", level: 84 },
    { name: "Java", level: 72 }
  ],
  achievements: [
    "Computer Science Student",
    "Portfolio Projects",
    "Continuous Learner",
    "Future iOS Developer"
  ],
  stats: [
    { label: "Projects Completed", value: 5 },
    { label: "Technologies Explored", value: 14 },
    { label: "Hours Coding", value: 350 }
  ]
};

const defaultProjects = [
  {
    id: 1,
    title: "Smart Route",
    description: "A route recommendation experience that blends traffic insights and user preferences into smarter travel decisions.",
    category: "web",
    technologies: ["HTML", "CSS", "JavaScript"],
    github: "https://github.com/mahletgetinet17/smart-route",
    demo: "https://mahletgetinet17.github.io/smart-route",
    banner: "project-banner-1",
    featured: true
  },
  {
    id: 2,
    title: "Personal Portfolio",
    description: "A polished portfolio built for recruiters and interviewers with a premium experience.",
    category: "web",
    technologies: ["HTML", "CSS", "JavaScript"],
    github: "https://github.com/mahletgetinet17/portfolio",
    demo: "https://mahletgetinet17.github.io/portfolio",
    banner: "project-banner-2",
    featured: true
  },
  {
    id: 3,
    title: "AI Homework Helper",
    description: "An educational assistant that helps students understand concepts through intelligent explanations.",
    category: "ai",
    technologies: ["JavaScript", "AI", "UX"],
    github: "https://github.com/mahletgetinet17/ai-homework-helper",
    demo: "https://mahletgetinet17.github.io/ai-homework-helper",
    banner: "project-banner-3",
    featured: false
  }
];

const defaultExperience = [
  {
    id: 1,
    type: "education",
    title: "Computer Science Student",
    organization: "Academic Program",
    period: "2024 - Present",
    description: "Building foundations in software engineering, data structures, and systems thinking."
  },
  {
    id: 2,
    type: "certification",
    title: "Interactive Web Development",
    organization: "Self-directed Learning",
    period: "2025",
    description: "Improved UI implementation, responsive layouts, and polished frontend interactions."
  }
];

const defaultContact = {
  email: "mahletgetinet17@gmail.com",
  phone: "+251 90 437 8430",
  location: "Addis Ababa, Ethiopia",
  message: "I’m available for internships, collaboration, and project conversations.",
  socialLinks: [
    { label: "GitHub", url: "https://github.com/mahletgetinet17" },
    { label: "LinkedIn", url: "https://www.linkedin.com/in/mahlet-getinet-4b7975347h" },
    { label: "X", url: "https://x.com/duskwood_MG" }
  ],
  footerCopyright: "© 2026 Mahlet Getinet — Built with HTML, CSS, and Vanilla JavaScript."
};

module.exports = {
  readJson,
  writeJson,
  clone,
  defaultProfile,
  defaultProjects,
  defaultExperience,
  defaultContact,
  dataDir
};
