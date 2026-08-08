import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import api from "@/api/axios";

function VerifyEmailPage() {
  const { token } = useParams();

  const [status, setStatus] = useState("verifying");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const verifyEmail = async () => {
      if (!token) {
        setStatus("error");
        setMessage(
          "Email verification token is missing."
        );
        return;
      }

      try {
        const response = await api.get(
          `/auth/verify-email/${token}`
        );

        setStatus("success");

        setMessage(
          response.data?.message ||
            "Your email has been verified successfully."
        );
      } catch (error) {
        console.error(
          "Email verification failed:",
          error
        );

        setStatus("error");

        setMessage(
          error.response?.data?.message ||
            "This verification link is invalid or expired."
        );
      }
    };

    verifyEmail();
  }, [token]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md rounded-2xl border bg-card p-8 text-center shadow-lg">
        {status === "verifying" && (
          <>
            <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary" />

            <h1 className="mt-6 text-2xl font-bold">
              Verifying your email...
            </h1>

            <p className="mt-2 text-sm text-muted-foreground">
              Please wait while we verify your
              email address.
            </p>
          </>
        )}

        {status === "success" && (
          <>
            <CheckCircle2 className="mx-auto h-14 w-14 text-green-500" />

            <h1 className="mt-6 text-2xl font-bold">
              Email Verified!
            </h1>

            <p className="mt-2 text-sm text-muted-foreground">
              {message}
            </p>

            <Button
              asChild
              className="mt-6 w-full"
            >
              <Link to="/login">
                Continue to Login
              </Link>
            </Button>
          </>
        )}

        {status === "error" && (
          <>
            <XCircle className="mx-auto h-14 w-14 text-red-500" />

            <h1 className="mt-6 text-2xl font-bold">
              Verification Failed
            </h1>

            <p className="mt-2 text-sm text-muted-foreground">
              {message}
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
          </>
        )}
      </div>
    </div>
  );
}

export default VerifyEmailPage;