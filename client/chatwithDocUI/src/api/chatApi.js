import api from "./axios";

export const chatApi = {
  async ask(question) {
    const { data } = await api.post("/ask/", { question });
    return data;
  },

  async listHistory() {
    const { data } = await api.get("/chat/history/");
    return data;
  },
};
