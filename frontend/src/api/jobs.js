import { useAuth } from "../context/AuthContext";

export const useJobs = () => {
    const { api } = useAuth();

    const getAll = (filters = {}) => api.get("/jobs", { params: filters });
    const create = (payload) => api.post("/jobs", payload);
    const myJobs = () => api.get("/jobs/my");
    const apply = (jobId) => api.post(`/jobs/${jobId}/apply`);
    const applicants = (jobId) => api.get(`/jobs/${jobId}/applicants`);
    const myApplications = () => api.get("/jobs/my-applications");   // NEW
    return { getAll, create, myJobs, apply, applicants, myApplications };
};