import api, { tokenStorage } from "./axios";

export const authApi = {
  async register({ username, email, password }) {
    const { data } = await api.post("/auth/register/", { username, email, password });
    return data;
  },

  async login({ username, password }) {
    const { data } = await api.post("/auth/login/", { username, password });
    tokenStorage.setTokens({ access: data.access, refresh: data.refresh });
    return data;
  },

  async logout() {
    const refresh = tokenStorage.getRefresh();
    try {
      if (refresh) {
        await api.post("/auth/logout/", { refresh });
      }
    } finally {
      tokenStorage.clear();
    }
  },

  async fetchCurrentUser() {
    const { data } = await api.get("/auth/me/");
    return data;
  },
};
