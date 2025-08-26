// documentsApi.js
import api from "../../config/api";

const documentsApi = {
  getDocument: (project_id, document_name, config = {}) =>
    api.get(`/document/${project_id}/${document_name}`, {
      responseType: "blob", // <- força blob
      ...config,
    }),
};

export default documentsApi;
