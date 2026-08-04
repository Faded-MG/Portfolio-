const API_BASE = "http://localhost:3000/api";

const api = {
  async request(endpoint, options = {}) {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {})
      },
      credentials: "include",
      ...options
    });

    const contentType = response.headers.get("content-type") || "";
    const payload = contentType.includes("application/json")
      ? await response.json()
      : null;

    if (!response.ok) {
      throw new Error(payload?.message || "Request failed");
    }

    return payload;
  },

  get(endpoint) {
    return this.request(endpoint, { method: "GET" });
  },

  post(endpoint, body) {
    return this.request(endpoint, {
      method: "POST",
      body: JSON.stringify(body || {})
    });
  },

  put(endpoint, body) {
    return this.request(endpoint, {
      method: "PUT",
      body: JSON.stringify(body || {})
    });
  },

  delete(endpoint) {
    return this.request(endpoint, { method: "DELETE" });
  }
};
