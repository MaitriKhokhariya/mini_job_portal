import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "seeker" });
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(form);
      navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.message || "Register failed");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-12 card shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-4">Register</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Full Name"
          required
          className="input input-bordered w-full"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <input
          type="email"
          placeholder="Email"
          required
          className="input input-bordered w-full"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <input
          type="password"
          placeholder="Password (min 6)"
          required
          className="input input-bordered w-full"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        <select
          className="select select-bordered w-full"
          value={form.role}
          onChange={(e) => setForm({ ...form, role: e.target.value })}
        >
          <option value="seeker">Job Seeker</option>
          <option value="employer">Employer</option>
        </select>
        <button type="submit" className="btn btn-primary w-full">
          Create Account
        </button>
      </form>
      <p className="mt-4 text-center">
        Already have an account? <Link to="/login" className="link">Login</Link>
      </p>
    </div>
  );
}