import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { authService } from "../services/api";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import CustomInput from "@/components/CustomInput";
import { Loader, AlertCircleIcon } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // console.log("Logging in with:", formData); // ✅ Debug line
      await authService.login(formData);
      toast.success("Login successful!");
      navigate("/dashboard");
      window.location.reload();
    } catch (error) {
      console.error("Login error:", error);
      setError(error.response?.data?.message || "Invalid credentials");
      toast.error("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-gray-100 mb-4">
          Welcome Back
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <CustomInput
            label="Email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            autoComplete="email"
            required
          />

          <CustomInput
            label="Password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter your password"
            autoComplete="current-password"
            required
          />

          <Button type="submit" className="mt-6 w-full" disabled={loading}>
            {loading ? (
              <>
                <Loader className="animate-spin mr-2 size-4" />
                Signing in...
              </>
            ) : (
              "Login"
            )}
          </Button>
        </form>

        {error && (
          <Alert variant="destructive" className="mt-4">
            <AlertCircleIcon className="h-4 w-4" />
            <AlertTitle>Login Failed</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <p className="mt-4 text-center text-gray-600 dark:text-gray-400">
          Don’t have an account?{" "}
          <Link
            className="text-violet-400 underline underline-offset-4"
            to="/register"
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
