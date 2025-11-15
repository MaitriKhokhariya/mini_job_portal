import { useEffect, useState } from "react";
import { useJobs } from "../api/jobs";
import toast from "react-hot-toast";

export default function EmployerDashboard() {
  const { create, myJobs, applicants } = useJobs();
  const [jobs, setJobs] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", description: "", location: "", skills: "" });
  const [selectedJob, setSelectedJob] = useState(null);
  const [appList, setAppList] = useState([]);

  const loadMyJobs = async () => {
    const { data } = await myJobs();
    setJobs(data);
  };

  useEffect(() => {
    loadMyJobs();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await create({
        ...form,
        skills: form.skills.split(",").map((s) => s.trim()),
      });
      toast.success("Job posted");
      setForm({ title: "", description: "", location: "", skills: "" });
      setShowForm(false);
      loadMyJobs();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed");
    }
  };

  const viewApplicants = async (jobId) => {
    const { data } = await applicants(jobId);
    setAppList(data);
    setSelectedJob(jobId);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Employer Dashboard</h2>
        <button onClick={() => setShowForm((v) => !v)} className="btn btn-primary">
          {showForm ? "Cancel" : "Post New Job"}
        </button>
      </div>

      {/* Create Form */}
      {showForm && (
        <div className="card bg-base-100 shadow-md p-5">
          <form onSubmit={handleCreate} className="space-y-3">
            <input
              placeholder="Job Title"
              required
              className="input input-bordered w-full"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
            <textarea
              placeholder="Description"
              required
              rows={4}
              className="textarea textarea-bordered w-full"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
            <input
              placeholder="Location"
              required
              className="input input-bordered w-full"
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
            />
            <input
              placeholder="Skills (comma separated)"
              required
              className="input input-bordered w-full"
              value={form.skills}
              onChange={(e) => setForm({ ...form, skills: e.target.value })}
            />
            <button type="submit" className="btn btn-success w-full">
              Post Job
            </button>
          </form>
        </div>
      )}

      {/* My Jobs */}
      <h3 className="text-xl font-semibold">My Posted Jobs</h3>
      <div className="grid gap-4 md:grid-cols-2">
        {jobs.map((job) => (
          <div key={job._id} className="card bg-base-100 shadow p-4">
            <h4 className="font-medium">{job.title}</h4>
            <p className="text-sm text-gray-600">{job.location}</p>
            <button
              onClick={() => viewApplicants(job._id)}
              className="mt-2 btn btn-sm btn-outline"
            >
              View Applicants
            </button>
          </div>
        ))}
      </div>

      {/* Applicants Modal */}
      {selectedJob && (
        <div className="fixed inset-0 bg-black/60 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-screen overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">Applicants</h3>
              <button onClick={() => setSelectedJob(null)} className="btn btn-sm btn-circle">
                ✕
              </button>
            </div>
            {appList.length === 0 ? (
              <p>No applicants yet.</p>
            ) : (
              <div className="space-y-3">
                {appList.map((app) => (
                  <div key={app._id} className="border rounded p-3 flex justify-between items-center">
                    <div>
                      <p className="font-medium">{app.seeker.name}</p>
                      <p className="text-sm">{app.seeker.email}</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {app.seeker.skills?.map((s) => (
                          <span key={s} className="badge badge-sm badge-outline">
                            {s}
                          </span>
                        ))}
                      </div>
                      {app.seeker.resume && (
                        <a
                          href={`http://localhost:5000/uploads/${app.seeker.resume}`}
                          target="_blank"
                          rel="noreferrer"
                          className="link text-xs"
                        >
                          Resume
                        </a>
                      )}
                    </div>
                    <span className={`badge ${app.status === "pending" ? "badge-warning" : app.status === "accepted" ? "badge-success" : "badge-error"}`}>
                      {app.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}