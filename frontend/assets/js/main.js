const portfolioApp = {
  state: {
    profile: null,
    projects: [],
    experience: [],
    contact: null
  },

  async init() {
    this.setupObserver();
    await this.loadContent();
    this.bindUi();
  },

  setupObserver() {
    const revealElements = document.querySelectorAll(".reveal");
    if (!window.IntersectionObserver || revealElements.length === 0) return;

    window.portfolioObserver = new window.IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
        }
      });
    }, {
      threshold: 0.18
    });

    revealElements.forEach((element) => {
      window.portfolioObserver.observe(element);
    });
  },

  async loadContent() {
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

      this.renderProfile();
      this.renderProjects();
      this.renderExperience();
      this.renderContact();
      this.renderFooter();
    } catch (error) {
      this.showErrorState(error.message);
    }
  },

  renderProfile() {
    const profile = this.state.profile;
    if (!profile) return;

    document.querySelector(".brand-name").textContent = profile.name.split(" ")[0];
    document.querySelector(".hero-copy h1").innerHTML = `${profile.name.split(" ")[0]} <span>${profile.name.split(" ").slice(1).join(" ") || "Portfolio"}</span>`;
    document.querySelector(".hero-title .typing-text").textContent = profile.professionalTitle;
    document.querySelector(".hero-description").textContent = profile.intro;
    document.querySelector(".hero-image").src = profile.profileImage;

    const aboutCopy = document.querySelector(".about-copy");
    if (aboutCopy) {
      aboutCopy.innerHTML = `<p>${profile.biography}</p>
        <ul class="about-list">${profile.achievements.map((item) => `<li>${item}</li>`).join("")}</ul>`;
    }

    const statsGrid = document.querySelector(".stats-grid");
    if (statsGrid) {
      statsGrid.innerHTML = profile.stats.map((item) => `
        <div class="stat-card">
          <strong class="stat-value" data-target="${item.value}">0</strong>
          <span>${item.label}</span>
        </div>
      `).join("");
    }
  },

  renderProjects() {
    const container = document.getElementById("projectsContainer");
    if (!container) return;

    container.innerHTML = "";

    this.state.projects.forEach((project) => {
      const card = document.createElement("article");
      card.className = "project-card reveal reveal-up";
      card.dataset.category = project.category;
      card.innerHTML = `
        <div class="project-top">
          <span class="project-tag">${project.category}</span>
          <div class="project-actions">
            ${project.demo ? `<a href="${project.demo}" class="text-link" target="_blank" rel="noreferrer">Live Demo</a>` : ""}
            ${project.github ? `<a href="${project.github}" class="text-link" target="_blank" rel="noreferrer">GitHub</a>` : ""}
          </div>
        </div>
        <div class="project-banner ${project.banner || ""}"></div>
        <h3>${project.title}</h3>
        <p>${project.description}</p>
        <div class="project-badges">${(project.technologies || []).map((tech) => `<span>${tech}</span>`).join("")}</div>
      `;
      container.appendChild(card);
      if (window.IntersectionObserver) {
        window.portfolioObserver?.observe(card);
      }
    });
  },

  renderExperience() {
    const timeline = document.querySelector(".timeline-list");
    if (!timeline) return;

    timeline.innerHTML = this.state.experience.map((entry) => `
      <article class="timeline-item reveal reveal-left">
        <span class="timeline-year">${entry.period}</span>
        <h3>${entry.title}</h3>
        <p>${entry.description}</p>
      </article>
    `).join("");

    if (window.portfolioObserver) {
      timeline.querySelectorAll(".timeline-item").forEach((item) => {
        window.portfolioObserver.observe(item);
      });
    }
  },

  renderContact() {
    const contact = this.state.contact;
    if (!contact) return;

    const contactPanel = document.querySelector(".contact-panel");
    if (!contactPanel) return;

    contactPanel.innerHTML = `
      <div class="contact-details">
        <p class="contact-copy">Email</p>
        <a href="mailto:${contact.email}" class="contact-link">${contact.email}</a>
        <p class="contact-copy">Phone</p>
        <a href="tel:${contact.phone}" class="contact-link">${contact.phone}</a>
        <p class="contact-copy">Location</p>
        <p class="contact-text">${contact.location}</p>
        <p class="contact-copy">Social</p>
        <div class="contact-social-grid">${(contact.socialLinks || []).map((social) => `
          <a href="${social.url}" class="contact-social-link" target="_blank" rel="noreferrer">
            <span>${social.label}</span>
          </a>
        `).join("")}</div>
        <div class="contact-buttons">
          <a href="mailto:${contact.email}" class="button button-primary">Send Email</a>
          ${(contact.socialLinks || []).slice(0, 2).map((social) => `<a href="${social.url}" class="button button-secondary" target="_blank" rel="noreferrer">${social.label}</a>`).join("")}
        </div>
      </div>
    `;
  },

  renderFooter() {
    const footer = document.querySelector(".footer-note");
    if (!footer) return;

    footer.textContent = this.state.contact?.footerCopyright || footer.textContent;
  },

  showErrorState(message) {
    const container = document.getElementById("projectsContainer");
    if (!container) return;

    container.innerHTML = `<div class="empty-state">${message}</div>`;
  },

  bindUi() {
    const filterButtons = document.querySelectorAll(".filter-btn");
    filterButtons.forEach((button) => {
      button.addEventListener("click", () => {
        filterButtons.forEach((btn) => btn.classList.remove("active"));
        button.classList.add("active");

        const filter = button.dataset.filter;
        const cards = document.querySelectorAll(".project-card");
        cards.forEach((card) => {
          const matches = filter === "all" || card.dataset.category === filter;
          card.style.display = matches ? "grid" : "none";
        });
      });
    });
  }
};

window.addEventListener("DOMContentLoaded", () => {
  portfolioApp.init();
});
