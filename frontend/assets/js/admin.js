
const adminApp = {
  state: {
    profile: null,
    projects: [],
    experience: [],
    contact: null,
    editingProjectId: null,
    editingExperienceId: null
  },

  toastEl: null,

  init() {
    if (!auth.ensureAdminAccess()) return;

    this.toastEl = document.getElementById("toast");
    this.bindNavigation();
    this.bindProfileForm();
    this.bindProjectForm();
    this.bindExperienceForm();
    this.bindContactForm();
    this.bindLogout();
    this.loadDashboard();
  },

  async loadDashboard() {
    try {
      const [profileResponse, projectsResponse, experienceResponse, contactResponse] = await Promise.all([
        api.get("/profile"),
        api.get("/projects"),
        api.get("/experience"),
        api.get("/contact")
      ]);

      this.state.profile = profileResponse.data;
      this.state.projects = projectsResponse.data;
      this.state.experience = experienceResponse.data;
      this.state.contact = contactResponse.data;

      this.renderOverview();
      this.renderProfileForm();
      this.renderProjects();
      this.renderExperience();
      this.renderContactForm();
    } catch (error) {
      this.showToast(error.message, true);
    }
  },

  bindNavigation() {
    document.querySelectorAll(".admin-nav-btn").forEach((button) => {
      button.addEventListener("click", () => {
        document.querySelectorAll(".admin-nav-btn").forEach((btn) => btn.classList.remove("active"));
        document.querySelectorAll(".admin-panel").forEach((panel) => panel.classList.remove("active"));
        button.classList.add("active");
        document.getElementById(`panel-${button.dataset.panel}`).classList.add("active");
      });
    });
  },

  bindProfileForm() {
    document.getElementById("profileForm").addEventListener("submit", async (event) => {
      event.preventDefault();
      const payload = this.collectFormData("profileForm");

      try {
        const result = await api.put("/profile", payload);
        this.state.profile = result.data;
        this.showToast(result.message);
      } catch (error) {
        this.showToast(error.message, true);
      }
    });
  },

  bindProjectForm() {
    document.getElementById("projectForm").addEventListener("submit", async (event) => {
      event.preventDefault();
      const payload = {
        title: document.getElementById("projectTitle").value.trim(),
        description: document.getElementById("projectDescription").value.trim(),
        category: document.getElementById("projectCategory").value,
        technologies: document.getElementById("projectTechnologies").value.split(",").map((item) => item.trim()).filter(Boolean),
        github: document.getElementById("projectGithub").value.trim(),
        demo: document.getElementById("projectDemo").value.trim(),
        banner: document.getElementById("projectBanner").value,
        featured: document.getElementById("projectFeatured").checked
      };

      try {
        const response = this.state.editingProjectId
          ? await api.put(`/projects/${this.state.editingProjectId}`, payload)
          : await api.post("/projects", payload);

        this.state.editingProjectId = null;
        document.getElementById("saveProjectBtn").textContent = "Add Project";
        this.projectFormReset();
        await this.loadDashboard();
        this.showToast(response.message);
      } catch (error) {
        this.showToast(error.message, true);
      }
    });
  },

  bindExperienceForm() {
    document.getElementById("experienceForm").addEventListener("submit", async (event) => {
      event.preventDefault();
      const payload = {
        title: document.getElementById("experienceTitle").value.trim(),
        organization: document.getElementById("experienceOrganization").value.trim(),
        period: document.getElementById("experiencePeriod").value.trim(),
        description: document.getElementById("experienceDescription").value.trim(),
        type: document.getElementById("experienceType").value
      };

      try {
        const response = this.state.editingExperienceId
          ? await api.put(`/experience/${this.state.editingExperienceId}`, payload)
          : await api.post("/experience", payload);

        this.state.editingExperienceId = null;
        this.experienceFormReset();
        await this.loadDashboard();
        this.showToast(response.message);
      } catch (error) {
        this.showToast(error.message, true);
      }
    });
  },

  bindContactForm() {
    document.getElementById("contactForm").addEventListener("submit", async (event) => {
      event.preventDefault();
      const payload = {
        email: document.getElementById("contactEmail").value.trim(),
        phone: document.getElementById("contactPhone").value.trim(),
        location: document.getElementById("contactLocation").value.trim(),
        message: document.getElementById("contactMessage").value.trim(),
        footerCopyright: document.getElementById("footerCopyright").value.trim(),
        socialLinks: this.parseJsonField("contactSocialLinks")
      };

      try {
        const result = await api.put("/contact", payload);
        this.state.contact = result.data;
        this.showToast(result.message);
      } catch (error) {
        this.showToast(error.message, true);
      }
    });
  },

  bindLogout() {
    document.getElementById("logoutBtn").addEventListener("click", async () => {
      try {
        await api.post("/logout", {});
        auth.clear();
        window.location.href = "/frontend/login.html";
      } catch (error) {
        this.showToast(error.message, true);
      }
    });
  },

  renderOverview() {
    const overview = document.getElementById("summaryGrid");
    const totalProjects = this.state.projects.length;
    const totalSkills = this.state.profile?.skills?.length || 0;
    const profileCompletion = Math.min(100, Math.round(((this.state.profile?.name ? 20 : 0) + (this.state.profile?.professionalTitle ? 20 : 0) + (this.state.profile?.intro ? 20 : 0) + (this.state.profile?.email ? 20 : 0) + (this.state.profile?.profileImage ? 20 : 0))));

    overview.innerHTML = `
      <article class="summary-card"><strong>${totalProjects}</strong><p>Total Projects</p></article>
      <article class="summary-card"><strong>${totalSkills}</strong><p>Total Skills</p></article>
      <article class="summary-card"><strong>${profileCompletion}%</strong><p>Profile Completion</p></article>
      <article class="summary-card"><strong>${this.state.experience.length}</strong><p>Recent Changes</p></article>
    `;
  },

  renderProfileForm() {
    if (!this.state.profile) return;
    document.getElementById("profileName").value = this.state.profile.name || "";
    document.getElementById("profileTitle").value = this.state.profile.professionalTitle || "";
    document.getElementById("profileIntro").value = this.state.profile.intro || "";
    document.getElementById("profileImage").value = this.state.profile.profileImage || "";
    document.getElementById("profileLocation").value = this.state.profile.location || "";
    document.getElementById("profileEmail").value = this.state.profile.email || "";
    document.getElementById("profileResume").value = this.state.profile.resumeLink || "";
    document.getElementById("profileBiography").value = this.state.profile.biography || "";
    document.getElementById("profileSkills").value = (this.state.profile.skills || []).map((item) => item.name).join(", ");
    document.getElementById("profileAchievements").value = (this.state.profile.achievements || []).join("\n");
  },

  renderProjects() {
    const list = document.getElementById("projectList");
    list.innerHTML = this.state.projects.map((project) => `
      <article class="list-item">
        <h3>${project.title}</h3>
        <p>${project.description}</p>
        <div class="actions-row">
          <button class="button button-secondary" data-action="edit-project" data-id="${project.id}">Edit</button>
          <button class="button button-danger" data-action="delete-project" data-id="${project.id}">Delete</button>
        </div>
      </article>
    `).join("");

    list.querySelectorAll("[data-action='edit-project']").forEach((button) => {
      button.addEventListener("click", () => this.populateProjectForm(Number(button.dataset.id)));
    });

    list.querySelectorAll("[data-action='delete-project']").forEach((button) => {
      button.addEventListener("click", async () => {
        try {
          const response = await api.delete(`/projects/${button.dataset.id}`);
          await this.loadDashboard();
          this.showToast(response.message);
        } catch (error) {
          this.showToast(error.message, true);
        }
      });
    });
  },

  renderExperience() {
    const list = document.getElementById("experienceList");
    list.innerHTML = this.state.experience.map((entry) => `
      <article class="list-item">
        <h3>${entry.title}</h3>
        <p>${entry.organization} • ${entry.period}</p>
        <div class="actions-row">
          <button class="button button-secondary" data-action="edit-experience" data-id="${entry.id}">Edit</button>
          <button class="button button-danger" data-action="delete-experience" data-id="${entry.id}">Delete</button>
        </div>
      </article>
    `).join("");

    list.querySelectorAll("[data-action='edit-experience']").forEach((button) => {
      button.addEventListener("click", () => this.populateExperienceForm(Number(button.dataset.id)));
    });

    list.querySelectorAll("[data-action='delete-experience']").forEach((button) => {
      button.addEventListener("click", async () => {
        try {
          const response = await api.delete(`/experience/${button.dataset.id}`);
          await this.loadDashboard();
          this.showToast(response.message);
        } catch (error) {
          this.showToast(error.message, true);
        }
      });
    });
  },

  renderContactForm() {
    if (!this.state.contact) return;
    document.getElementById("contactEmail").value = this.state.contact.email || "";
    document.getElementById("contactPhone").value = this.state.contact.phone || "";
    document.getElementById("contactLocation").value = this.state.contact.location || "";
    document.getElementById("contactMessage").value = this.state.contact.message || "";
    document.getElementById("footerCopyright").value = this.state.contact.footerCopyright || "";
    document.getElementById("contactSocialLinks").value = JSON.stringify(this.state.contact.socialLinks || [], null, 2);
  },

  populateProjectForm(id) {
    const project = this.state.projects.find((item) => item.id === id);
    if (!project) return;

    this.state.editingProjectId = id;
    document.getElementById("projectTitle").value = project.title;
    document.getElementById("projectDescription").value = project.description;
    document.getElementById("projectCategory").value = project.category;
    document.getElementById("projectTechnologies").value = (project.technologies || []).join(", ");
    document.getElementById("projectGithub").value = project.github || "";
    document.getElementById("projectDemo").value = project.demo || "";
    document.getElementById("projectBanner").value = project.banner || "project-banner-1";
    document.getElementById("projectFeatured").checked = Boolean(project.featured);
    document.getElementById("saveProjectBtn").textContent = "Update Project";
  },

  projectFormReset() {
    document.getElementById("projectForm").reset();
    document.getElementById("projectCategory").value = "web";
    document.getElementById("projectBanner").value = "project-banner-1";
  },

  populateExperienceForm(id) {
    const entry = this.state.experience.find((item) => item.id === id);
    if (!entry) return;

    this.state.editingExperienceId = id;
    document.getElementById("experienceTitle").value = entry.title;
    document.getElementById("experienceOrganization").value = entry.organization;
    document.getElementById("experiencePeriod").value = entry.period;
    document.getElementById("experienceDescription").value = entry.description;
    document.getElementById("experienceType").value = entry.type;
  },

  experienceFormReset() {
    document.getElementById("experienceForm").reset();
    document.getElementById("experienceType").value = "education";
  },

  collectFormData(formId) {
    const form = document.getElementById(formId);
    const payload = {};

    form.querySelectorAll("input, textarea, select").forEach((field) => {
      const key = field.name || field.id;
      const value = field.type === "checkbox" ? field.checked : field.value;
      payload[key] = value;
    });

    payload.skills = payload.skills
      .split(",")
      .map((item) => ({ name: item.trim(), level: 80 }))
      .filter((item) => item.name);

    payload.achievements = payload.achievements
      .split("\n")
      .map((item) => item.trim())
      .filter(Boolean);

    return payload;
  },

  parseJsonField(id) {
    const raw = document.getElementById(id).value.trim();
    try {
      return raw ? JSON.parse(raw) : [];
    } catch {
      throw new Error("Social links must be valid JSON.");
    }
  },

  showToast(message, isError = false) {
    if (!this.toastEl) return;
    this.toastEl.textContent = message;
    this.toastEl.classList.toggle("show", true);
    this.toastEl.style.borderColor = isError ? "rgba(255, 107, 125, 0.55)" : "rgba(124, 156, 255, 0.55)";
    clearTimeout(this.toastEl.timeoutId);
    this.toastEl.timeoutId = setTimeout(() => this.toastEl.classList.remove("show"), 2600);
  }
};

window.addEventListener("DOMContentLoaded", () => adminApp.init());