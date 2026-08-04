const auth = {
  isLoggedIn() {
    return sessionStorage.getItem("portfolio-admin") === "true";
  },

  setLoggedIn() {
    sessionStorage.setItem("portfolio-admin", "true");
  },

  clear() {
    sessionStorage.removeItem("portfolio-admin");
  },

  ensureAdminAccess() {
    if (!this.isLoggedIn()) {
      window.location.href = "/frontend/login.html";
      return false;
    }

    return true;
  }
};
