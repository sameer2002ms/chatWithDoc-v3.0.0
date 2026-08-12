import api from "./axios";

export const documentApi = {
  async uploadFile(file, onUploadProgress) {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("source_type", "pdf");
    const { data } = await api.post("/upload/", formData, {
      onUploadProgress,
    });
    return data;
  },

  async listDocuments() {
    const { data } = await api.get("/documents/");
    return data;
  },

  async getCurrentDocument() {
    const { data } = await api.get("/documents/current/");
    return data;
  },
};