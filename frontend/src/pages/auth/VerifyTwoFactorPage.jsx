import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { useVerifyTwoFactor } from "@/hooks/useAuth";

function VerifyTwoFactorPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const challengeId =
    location.state?.challengeId;

  const [code, setCode] = useState("");

  const verifyMutation =
    useVerifyTwoFactor();

  // ====================================
  // Missing Challenge
  // ====================================

  if (!challengeId) {
    return (
      <main className="flex min-h-screen items-center justify-center px-4">
        <div className="w-full max-w-md text-center">
          <ShieldCheck className="mx-auto h-12 w-12 text-muted-foreground" />

          <h1 className="mt-4 text-2xl font-bold">
            Verification session expired
          </h1>

          <p className="mt-2 text-sm text-muted-foreground">
            Please return to the login page
            and try again.
          </p>

          <Button
            className="mt-6"
            onClick={() =>
              navigate("/login", {
                replace: true,
              })
            }
          >
            Back to Login
          </Button>
        </div>
      </main>
    );
  }

  // ====================================
  // Verify OTP
  // ====================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    const trimmedCode = code.trim();

    if (!/^\d{6}$/.test(trimmedCode)) {
      toast.error(
        "Enter the 6-digit verification code."
      );

      return;
    }

    try {
      const response =
        await verifyMutation.mutateAsync({
          challengeId,
          code: trimmedCode,
        });

      toast.success(
        response.message ||
          "Verification successful"
      );

      navigate("/feed", {
        replace: true,
      });
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "Invalid or expired verification code."
      );
    }
  };

  const isVerifying =
    verifyMutation.isPending;

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-8">
      <div
        className="
          w-full
          max-w-md
          rounded-2xl
          border
          border-border/60
          bg-card
          p-6
          shadow-xl
          sm:p-8
        "
      >
        {/* Icon */}

        <div className="flex justify-center">
          <div
            className="
              flex
              h-14
              w-14
              items-center
              justify-center
              rounded-2xl
              bg-primary/10
              text-primary
            "
          >
            <ShieldCheck
              className="h-7 w-7"
              strokeWidth={2}
            />
          </div>
        </div>

        {/* Heading */}

        <div className="mt-6 text-center">
          <h1 className="text-2xl font-bold tracking-tight">
            Verify your login
          </h1>

          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            We sent a 6-digit verification
            code to your email. Enter it below
            to continue.
          </p>
        </div>

        {/* Form */}

        <form
          onSubmit={handleSubmit}
          className="mt-8 space-y-5"
        >
          <div className="space-y-2">
            <label
              htmlFor="two-factor-code"
              className="text-sm font-medium"
            >
              Verification code
            </label>

            <Input
              id="two-factor-code"
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={6}
              placeholder="000000"
              value={code}
              onChange={(e) => {
                const value =
                  e.target.value
                    .replace(/\D/g, "")
                    .slice(0, 6);

                setCode(value);
              }}
              disabled={isVerifying}
              className="
                h-12
                text-center
                text-lg
                font-semibold
                tracking-[0.5em]
              "
            />
          </div>

          <Button
            type="submit"
            disabled={
              isVerifying ||
              code.length !== 6
            }
            className="
              h-11
              w-full
              gap-2
            "
          >
            {isVerifying
              ? "Verifying..."
              : "Verify & Continue"}

            {!isVerifying && (
              <ArrowRight className="h-4 w-4" />
            )}
          </Button>
        </form>

        {/* Back */}

        <button
          type="button"
          onClick={() =>
            navigate("/login", {
              replace: true,
            })
          }
          disabled={isVerifying}
          className="
            mt-6
            w-full
            text-center
            text-sm
            font-medium
            text-muted-foreground
            transition-colors
            hover:text-foreground
          "
        >
          Back to Login
        </button>
      </div>
    </main>
  );
}

export default VerifyTwoFactorPage;