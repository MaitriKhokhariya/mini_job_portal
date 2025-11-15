import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

export default function ProfileForm({ user, onUpdate }) {
  const { api } = useAuth();
  const [skills, setSkills] = useState((user.skills || []).join(", "));
  const [resume, setResume] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("skills", skills.split(",").map((s) => s.trim()));
    if (resume) formData.append("resume", resume);

    try {
      await api.put("/user/profile", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Profile updated");
      onUpdate?.();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed");
    }
  };

  return (
    <div className="card bg-base-100 shadow-md p-5">
      <h3 className="font-bold text-lg mb-3">Your Profile</h3>
      <form onSubmit={handleSubmit} className="space-y-3">
        <textarea
          placeholder="Skills (comma separated)"
          className="textarea textarea-bordered w-full"
          rows={3}
          value={skills}
          onChange={(e) => setSkills(e.target.value)}
        />
        <input
          type="file"
          accept=".pdf,.doc,.docx"
          className="file-input file-input-bordered w-full"
          onChange={(e) => setResume(e.target.files[0])}
        />
        {user.resume && (
          <a
            href={`http://localhost:5000/uploads/${user.resume}`}
            target="_blank"
            rel="noreferrer"
            className="link text-sm"
          >
            Current resume
          </a>
        )}
        <button type="submit" className="btn btn-primary w-full">
          Save Profile
        </button>
      </form>
    </div>
  );
}