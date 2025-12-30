import api from "../../config/api";

const folderAPI = {
  getAllFolders: () => api.get("/folder/all"),
  getFoldersWithPagination: (pageSize, page) =>
    api.get(`/folder/pagination/${pageSize}/${page}`),
  getFoldersWithPaginationAndFilter: (pageSize, page, search) => {
    const params = new URLSearchParams();
    if (search) params.append("search", search);
    return api.get(
      `/folder/pagination-filter/${pageSize}/${page}?${params.toString()}`
    );
  },
  getFolderById: (folderId) => api.get(`/folder/${folderId}`),
  getFolderByName: (folderName) => api.get(`/folder/name/${folderName}`),
  deleteFolder: (data) => api.delete("/folder", { data }),
  postFolder: (data) => api.post("/folder", data),
  patchFolder: (data) => api.patch("/folder", data),
  getCountFolders: () => api.get("/folder/count/all"),
  getProjectsByFolder: (folderId) =>
    api.get(`/project_folder/folder/${folderId}`),
};

export default folderAPI;

