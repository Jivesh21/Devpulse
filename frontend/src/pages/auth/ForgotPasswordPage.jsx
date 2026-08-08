import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, ArrowLeft, Send } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import api from "@/api/axios";

function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] =
    useState(false);
  const [submitted, setSubmitted] =
    useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      toast.error("Please enter your email");
      return;
    }

    try {
      setIsSubmitting(true);

      const response = await api.post(
        "/auth/forgot-password",
        {
          email: email.trim(),
        }
      );

      toast.success(
        response.data?.message ||
          "If an account exists with this email, a password reset link has been sent."
      );

      setSubmitted(true);
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Unable to process your request"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md rounded-2xl border bg-card p-8 shadow-lg">
        {!submitted ? (
          <>
            <div className="mb-8 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Mail className="h-6 w-6 text-primary" />
              </div>

              <h1 className="mt-5 text-2xl font-bold">
                Forgot Password?
              </h1>

              <p className="mt-2 text-sm text-muted-foreground">
                Enter your email and we'll send you
                a link to reset your password.
              </p>
            </div>

            <form
              onSubmit={handleSubmit}
              className="space-y-5"
            >
              <div className="space-y-2">
                <Label htmlFor="email">
                  Email
                </Label>

                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    autoComplete="email"
                    value={email}
                    onChange={(e) =>
                      setEmail(e.target.value)
                    }
                    className="h-11 pl-10"
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="h-11 w-full gap-2"
              >
                {isSubmitting ? (
                  "Sending..."
                ) : (
                  <>
                    Send Reset Link
                    <Send className="h-4 w-4" />
                  </>
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <Link
                to="/login"
                className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Login
              </Link>
            </div>
          </>
        ) : (
          <div className="text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <Mail className="h-6 w-6 text-primary" />
            </div>

            <h1 className="mt-5 text-2xl font-bold">
              Check Your Email
            </h1>

            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              If an account exists with{" "}
              <span className="font-medium text-foreground">
                {email}
              </span>
              , we've sent a password reset link.
            </p>

            <p className="mt-4 text-xs text-muted-foreground">
              The reset link expires in 15 minutes.
            </p>

            <Button
              asChild
              variant="outline"
              className="mt-6 w-full"
            >
              <Link to="/login">
                Back to Login
              </Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ForgotPasswordPage;