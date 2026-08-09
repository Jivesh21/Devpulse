// LoginForm.jsx

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { GoogleLogin } from "@react-oauth/google";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  ArrowRight,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { loginSchema } from "@/validators/auth.validator";
import {
  useLogin,
  useGoogleLogin,
} from "@/hooks/useAuth";

function LoginForm() {
  const [showPassword, setShowPassword] =
    useState(false);

  const navigate = useNavigate();

  const loginMutation = useLogin();
  const googleLoginMutation =
    useGoogleLogin();

  const {
    register,
    handleSubmit,
    formState: {
      errors,
      isSubmitting,
    },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // ====================================
  // Email / Password Login
  // ====================================

  const onSubmit = async (data) => {
    try {
      const response =
        await loginMutation.mutateAsync(data);

      toast.success(response.message);

      navigate("/feed");
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Login failed"
      );
    }
  };

  // ====================================
  // Google Login
  // ====================================

  const handleGoogleSuccess = async (
    credentialResponse
  ) => {
    try {
      if (!credentialResponse?.credential) {
        toast.error(
          "Google credential was not received"
        );
        return;
      }

      const response =
        await googleLoginMutation.mutateAsync(
          credentialResponse.credential
        );

      toast.success(
        response.message ||
          "Google login successful"
      );

      navigate("/feed");
    } catch (error) {
      console.error(
        "Google login failed:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          "Google login failed"
      );
    }
  };

  const handleGoogleError = () => {
    toast.error(
      "Google login was cancelled or failed"
    );
  };

  const isLoggingIn =
    loginMutation.isPending ||
    googleLoginMutation.isPending;

  return (
    <div className="w-full">
      {/* ================================= */}
      {/* Heading */}
      {/* ================================= */}

      <div className="text-center lg:text-left">
        <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
          Welcome Back
        </h2>

        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Sign in to continue building with your
          developer community.
        </p>
      </div>

      {/* ================================= */}
      {/* Google Login */}
      {/* ================================= */}

      <div className="mt-6 space-y-4 sm:mt-8">
        <div className="relative flex items-center">
          <div className="flex-1 border-t border-border" />

          <span className="px-3 text-xs text-muted-foreground">
            CONTINUE WITH
          </span>

          <div className="flex-1 border-t border-border" />
        </div>

        <div className="flex justify-center">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleError}
            useOneTap={false}
            theme="outline"
            size="large"
            text="continue_with"
            shape="rectangular"
            width="100%"
          />
        </div>
      </div>

      {/* ================================= */}
      {/* Divider */}
      {/* ================================= */}

      <div className="my-5 flex items-center gap-3 sm:my-6">
        <div className="h-px flex-1 bg-border" />

        <span className="text-xs text-muted-foreground">
          OR
        </span>

        <div className="h-px flex-1 bg-border" />
      </div>

      {/* ================================= */}
      {/* Email / Password Form */}
      {/* ================================= */}

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-5"
      >
        {/* Email */}

        <div className="space-y-2">
          <Label htmlFor="email">
            Email
          </Label>

          <div className="relative">
            <Mail
              className="
                absolute
                left-3
                top-1/2
                h-4
                w-4
                -translate-y-1/2
                text-muted-foreground
              "
            />

            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              className="h-11 pl-10"
              {...register("email")}
            />
          </div>

          {errors.email && (
            <p className="text-sm text-red-500">
              {errors.email.message}
            </p>
          )}
        </div>

        {/* Password */}

        <div className="space-y-2">
          <div className="flex items-center justify-between gap-2">
            <Label htmlFor="password">
              Password
            </Label>

            <Link
              to="/forgot-password"
              className="
                text-sm
                font-medium
                text-primary
                transition-colors
                hover:text-primary/80
              "
            >
              Forgot Password?
            </Link>
          </div>

          <div className="relative">
            <Lock
              className="
                absolute
                left-3
                top-1/2
                h-4
                w-4
                -translate-y-1/2
                text-muted-foreground
              "
            />

            <Input
              id="password"
              type={
                showPassword
                  ? "text"
                  : "password"
              }
              placeholder="Enter your password"
              autoComplete="current-password"
              className="h-11 pl-10 pr-10"
              {...register("password")}
            />

            <button
              type="button"
              onClick={() =>
                setShowPassword(
                  (prev) => !prev
                )
              }
              className="
                absolute
                right-3
                top-1/2
                -translate-y-1/2
                text-muted-foreground
                transition-colors
                hover:text-foreground
              "
              aria-label={
                showPassword
                  ? "Hide password"
                  : "Show password"
              }
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>

          {errors.password && (
            <p className="text-sm text-red-500">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Submit */}

        <Button
          type="submit"
          disabled={
            isSubmitting || isLoggingIn
          }
          className="
            h-11
            w-full
            gap-2
            bg-primary
            text-primary-foreground
            hover:bg-primary/90
          "
        >
          {loginMutation.isPending
            ? "Signing In..."
            : "Sign In"}

          {!loginMutation.isPending && (
            <ArrowRight className="h-4 w-4" />
          )}
        </Button>
      </form>

      {/* ================================= */}
      {/* Register */}
      {/* ================================= */}

      <p className="mt-6 text-center text-sm text-muted-foreground sm:mt-8">
        Don't have an account?{" "}
        <Link
          to="/register"
          className="
            font-medium
            text-primary
            transition-colors
            hover:text-primary/80
          "
        >
          Sign Up
        </Link>
      </p>
    </div>
  );
}

export default LoginForm;