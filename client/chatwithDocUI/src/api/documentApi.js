import api from "./axios";

const EXTENSION_TO_SOURCE_TYPE = {
  pdf: "pdf",
  doc: "word",
  docx: "word",
  html: "html",
  htm: "html",
};

function resolveSourceType(filename) {
  const ext = filename.split(".").pop()?.toLowerCase();
  return EXTENSION_TO_SOURCE_TYPE[ext] || "pdf";
}

export const documentApi = {
  async uploadFile(file, onUploadProgress) {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("source_type", resolveSourceType(file.name));
    const { data } = await api.post("/upload/", formData, {
      onUploadProgress,
    });
    return data;
  },

  async uploadUrl(url) {
    const { data } = await api.post("/upload/", {
      source_type: "url",
      source_value: url,
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