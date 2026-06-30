import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, Mail, Lock } from "lucide-react";
import toast from "react-hot-toast";
import AuthCard from "../components/auth/AuthCard";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import { useAuth } from "../hooks/useAuth";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const validate = () => {
    const next = {};
    if (!form.username.trim()) next.username = "Username is required";
    if (!form.email.trim()) next.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) next.email = "Enter a valid email address";
    if (!form.password) next.password = "Password is required";
    else if (form.password.length < 8) next.password = "Use at least 8 characters";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setIsLoading(true);
    try {
      await register(form);
      toast.success("Account created. Please sign in.");
      navigate("/login", { replace: true });
    } catch (err) {
      const data = err?.response?.data;
      const message =
        (data && (data.username?.[0] || data.email?.[0] || data.password?.[0] || data.detail)) ||
        "Could not create your account. Please try again.";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthCard
      title="Create your account"
      subtitle="Start asking questions about your documents"
      footer={
        <span>
          Already have an account?{" "}
          <Link to="/login" className="font-medium text-[var(--color-accent-600)] hover:underline">
            Sign in
          </Link>
        </span>
      }
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
        <Input
          label="Username"
          name="username"
          icon={User}
          placeholder="jane.doe"
          autoComplete="username"
          value={form.username}
          error={errors.username}
          onChange={(e) => setForm((f) => ({ ...f, username: e.target.value }))}
        />
        <Input
          label="Email"
          name="email"
          type="email"
          icon={Mail}
          placeholder="jane@company.com"
          autoComplete="email"
          value={form.email}
          error={errors.email}
          onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
        />
        <Input
          label="Password"
          name="password"
          type="password"
          icon={Lock}
          placeholder="At least 8 characters"
          autoComplete="new-password"
          value={form.password}
          error={errors.password}
          onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
        />
        <Button type="submit" variant="accent" size="lg" isLoading={isLoading} className="mt-2 w-full">
          Create account
        </Button>
      </form>
    </AuthCard>
  );
}
