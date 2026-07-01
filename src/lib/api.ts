/**
 * Frontend API Helper for standard production communication with the full-stack server
 */

export const api = {
  getToken(): string | null {
    return localStorage.getItem("huios_token");
  },

  setToken(token: string) {
    localStorage.setItem("huios_token", token);
  },

  clearToken() {
    localStorage.removeItem("huios_token");
  },

  async request(endpoint: string, options: RequestInit = {}) {
    const token = this.getToken();
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...(options.headers as Record<string, string>),
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(endpoint, {
      ...options,
      headers,
    });

    if (!response.ok) {
      let errorMsg = "Ocorreu um erro no servidor";
      try {
        const errJson = await response.json();
        errorMsg = errJson.error || errorMsg;
      } catch (e) {
        // use default
      }

      // If token expired or unauthorized, automatically clear credentials
      if (response.status === 401 || response.status === 403) {
        this.clearToken();
        if (typeof window !== "undefined" && !window.location.pathname.includes("/login")) {
          // Can force soft reset in App.tsx
        }
      }

      throw new Error(errorMsg);
    }

    return response.json();
  },

  // --- Auth ---
  async login(email: string, password: string) {
    const data = await this.request("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    this.setToken(data.token);
    return data;
  },

  async me() {
    return this.request("/api/auth/me");
  },

  // --- Users CRUD ---
  async getUsers() {
    return this.request("/api/users");
  },

  async createUser(userData: any) {
    return this.request("/api/users", {
      method: "POST",
      body: JSON.stringify(userData),
    });
  },

  async updateUser(id: string, userData: any) {
    return this.request(`/api/users/${id}`, {
      method: "PUT",
      body: JSON.stringify(userData),
    });
  },

  async deleteUser(id: string) {
    return this.request(`/api/users/${id}`, {
      method: "DELETE",
    });
  },

  // --- Announcements ---
  async getAnnouncements() {
    return this.request("/api/announcements");
  },

  async createAnnouncement(annData: any) {
    return this.request("/api/announcements", {
      method: "POST",
      body: JSON.stringify(annData),
    });
  },

  async deleteAnnouncement(id: string) {
    return this.request(`/api/announcements/${id}`, {
      method: "DELETE",
    });
  },

  // --- News / Blog ---
  async getNews() {
    return this.request("/api/news");
  },

  async createNews(newsData: any) {
    return this.request("/api/news", {
      method: "POST",
      body: JSON.stringify(newsData),
    });
  },

  async likeNews(id: string) {
    return this.request(`/api/news/${id}/like`, {
      method: "POST",
    });
  },

  async commentNews(id: string, content: string) {
    return this.request(`/api/news/${id}/comment`, {
      method: "POST",
      body: JSON.stringify({ content }),
    });
  },

  async deleteNews(id: string) {
    return this.request(`/api/news/${id}`, {
      method: "DELETE",
    });
  },

  // --- Events ---
  async getEvents() {
    return this.request("/api/events");
  },

  async createEvent(eventData: any) {
    return this.request("/api/events", {
      method: "POST",
      body: JSON.stringify(eventData),
    });
  },

  async deleteEvent(id: string) {
    return this.request(`/api/events/${id}`, {
      method: "DELETE",
    });
  },

  // --- Prayer Requests ---
  async getPrayers() {
    return this.request("/api/prayer-requests");
  },

  async createPrayer(prayerData: any) {
    return this.request("/api/prayer-requests", {
      method: "POST",
      body: JSON.stringify(prayerData),
    });
  },

  async prayAlong(id: string) {
    return this.request(`/api/prayer-requests/${id}/pray`, {
      method: "POST",
    });
  },

  async respondPrayer(id: string, status: string, adminResponse: string) {
    return this.request(`/api/prayer-requests/${id}/response`, {
      method: "PUT",
      body: JSON.stringify({ status, adminResponse }),
    });
  },

  // --- Suggestions ---
  async getSuggestions() {
    return this.request("/api/suggestions");
  },

  async createSuggestion(sugData: any) {
    return this.request("/api/suggestions", {
      method: "POST",
      body: JSON.stringify(sugData),
    });
  },

  async respondSuggestion(id: string, status: string, adminResponse: string) {
    return this.request(`/api/suggestions/${id}/status`, {
      method: "PUT",
      body: JSON.stringify({ status, adminResponse }),
    });
  },

  // --- Challenges ---
  async getChallenges() {
    return this.request("/api/challenges");
  },

  async createChallenge(chalData: any) {
    return this.request("/api/challenges", {
      method: "POST",
      body: JSON.stringify(chalData),
    });
  },

  // --- Challenge Submissions ---
  async getSubmissions() {
    return this.request("/api/submissions");
  },

  async submitChallenge(subData: any) {
    return this.request("/api/submissions", {
      method: "POST",
      body: JSON.stringify(subData),
    });
  },

  async reviewSubmission(id: string, status: string, feedback: string) {
    return this.request(`/api/submissions/${id}/review`, {
      method: "PUT",
      body: JSON.stringify({ status, feedback }),
    });
  },

  // --- Notifications ---
  async getNotifications() {
    return this.request("/api/notifications");
  },

  async markNotificationRead(id: string) {
    return this.request(`/api/notifications/${id}/read`, {
      method: "PATCH",
    });
  },

  async deleteNotification(id: string) {
    return this.request(`/api/notifications/${id}`, {
      method: "DELETE",
    });
  },

  async deleteAllNotifications() {
    return this.request("/api/notifications", {
      method: "DELETE",
    });
  },

  async readAllNotifications() {
    return this.request("/api/notifications/read-all", {
      method: "POST",
    });
  },

  // --- Logs ---
  async getLogs() {
    return this.request("/api/logs");
  },
};
