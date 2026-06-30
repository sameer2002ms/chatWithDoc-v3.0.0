import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { User, Lock } from "lucide-react";
import toast from "react-hot-toast";
import AuthCard from "../components/auth/AuthCard";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import { useAuth } from "../hooks/useAuth";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ username: "", password: "" });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const validate = () => {
    const next = {};
    if (!form.username.trim()) next.username = "Username is required";
    if (!form.password) next.password = "Password is required";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setIsLoading(true);
    try {
      await login(form);
      toast.success("Welcome back");
      const redirectTo = location.state?.from?.pathname || "/dashboard";
      navigate(redirectTo, { replace: true });
    } catch (err) {
      const message =
        err?.response?.data?.detail || "Invalid username or password. Please try again.";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthCard
      title="Welcome back"
      subtitle="Sign in to keep chatting with your documents"
      footer={
        <span>
          Don't have an account?{" "}
          <Link to="/register" className="font-medium text-[var(--color-accent-600)] hover:underline">
            Create one
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
          label="Password"
          name="password"
          type="password"
          icon={Lock}
          placeholder="••••••••"
          autoComplete="current-password"
          value={form.password}
          error={errors.password}
          onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
        />
        <Button type="submit" variant="accent" size="lg" isLoading={isLoading} className="mt-2 w-full">
          Sign in
        </Button>
      </form>
    </AuthCard>
  );
}
