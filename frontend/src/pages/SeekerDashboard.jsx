// src/pages/SeekerDashboard.jsx
import { useEffect, useState } from "react";
import { useJobs } from "../api/jobs";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext.jsx";
import SeekerProfileForm from "../pages/SeekerProfileForm.jsx";
import { Search, MapPin, Tag, Calendar, CheckCircle, XCircle, Clock, Briefcase } from "lucide-react";

export default function SeekerDashboard() {
  const { user } = useAuth();
  const { getAll, apply, myApplications } = useJobs();

  const [jobs, setJobs] = useState([]);
  const [filters, setFilters] = useState({ search: "", location: "", skill: "" });
  const [appMap, setAppMap] = useState({});
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const [jobsRes, appsRes] = await Promise.all([
        getAll(filters),
        myApplications(),
      ]);

      setJobs(jobsRes.data);

      const map = {};
      appsRes.data.forEach((a) => {
        map[a.job._id] = { status: a.status, appliedAt: a.appliedAt };
      });
      setAppMap(map);
    } catch (e) {
      toast.error("Failed to load jobs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  const handleApply = async (jobId) => {
    try {
      await apply(jobId);
      setAppMap((prev) => ({
        ...prev,
        [jobId]: { status: "pending", appliedAt: new Date() },
      }));
      toast.success("Applied successfully!");
    } catch (e) {
      toast.error(e.response?.data?.message || "Failed to apply");
    }
  };

  const clearFilters = () => {
    setFilters({ search: "", location: "", skill: "" });
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return <Clock className="w-4 h-4" />;
      case "accepted":
        return <CheckCircle className="w-4 h-4" />;
      case "rejected":
        return <XCircle className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "accepted":
        return "bg-green-100 text-green-800 border-green-300";
      case "rejected":
        return "bg-red-100 text-red-800 border-red-300";
      default:
        return "";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Profile Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-6">
              <SeekerProfileForm user={user} onUpdate={loadData} />
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Header */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                    <Briefcase className="w-6 h-6 text-indigo-600" />
                    Job Listings
                  </h1>
                  <p className="text-sm text-gray-600 mt-1">
                    {jobs.length} job{jobs.length !== 1 ? "s" : ""} available
                  </p>
                </div>
              </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-200">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search jobs..."
                    className="input input-bordered w-full pl-10"
                    value={filters.search}
                    onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                  />
                </div>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Location"
                    className="input input-bordered w-full pl-10"
                    value={filters.location}
                    onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                  />
                </div>
                <div className="relative">
                  <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Skill"
                    className="input input-bordered w-full pl-10"
                    value={filters.skill}
                    onChange={(e) => setFilters({ ...filters, skill: e.target.value })}
                  />
                </div>
              </div>
              {(filters.search || filters.location || filters.skill) && (
                <div className="mt-3 flex justify-end">
                  <button
                    onClick={clearFilters}
                    className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
                  >
                    Clear filters
                  </button>
                </div>
              )}
            </div>

            {/* Job List */}
            <div className="space-y-4">
              {loading ? (
                // Skeleton Loader
                [...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 animate-pulse"
                  >
                    <div className="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                    <div className="h-16 bg-gray-100 rounded mb-4"></div>
                    <div className="flex justify-between">
                      <div className="h-4 bg-gray-200 rounded w-32"></div>
                      <div className="h-9 bg-gray-200 rounded w-20"></div>
                    </div>
                  </div>
                ))
              ) : jobs.length === 0 ? (
                // Empty State
                <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-200">
                  <div className="bg-gray-200 border-2 border-dashed rounded-xl w-32 h-32 mx-auto mb-6" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    No jobs found
                  </h3>
                  <p className="text-gray-600 max-w-md mx-auto">
                    Try adjusting your filters or check back later for new opportunities.
                  </p>
                </div>
              ) : (
                jobs.map((job) => {
                  const app = appMap[job._id];

                  return (
                    <div
                      key={job._id}
                      className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 p-6 border border-gray-200"
                    >
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                        <div className="flex-1">
                          <h3 className="text-xl font-semibold text-gray-900 mb-1">
                            {job.title}
                          </h3>
                          <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                            <span className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              {job.location}
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              Posted {new Date(job.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-gray-700 mb-4 line-clamp-2">
                            {job.description}
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {job.skills.map((skill) => (
                              <span
                                key={skill}
                                className="px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-medium rounded-full"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                          <div className="mt-4 flex items-center text-sm text-gray-500">
                            <span>Posted by </span>
                            <span className="font-medium ml-1">{job.employer.name}</span>
                          </div>
                        </div>

                        {/* Application Status */}
                        <div className="flex flex-col items-end gap-2">
                          {app ? (
                            <div
                              className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-sm font-medium ${getStatusColor(
                                app.status
                              )}`}
                            >
                              {getStatusIcon(app.status)}
                              <span>{app.status.toUpperCase()}</span>
                            </div>
                          ) : (
                            <button
                              onClick={() => handleApply(job._id)}
                              className="btn btn-primary btn-sm"
                            >
                              Apply Now
                            </button>
                          )}
                          {app && (
                            <span className="text-xs text-gray-500">
                              Applied on {new Date(app.appliedAt).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}