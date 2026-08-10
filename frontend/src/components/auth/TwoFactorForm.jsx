import { useEffect, useRef, useState } from "react";
import { ArrowLeft, Loader2, ShieldCheck } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { useVerifyTwoFactor } from "@/hooks/useAuth";

function TwoFactorForm() {
  const navigate = useNavigate();
  const location = useLocation();

  const verifyTwoFactorMutation =
    useVerifyTwoFactor();

  const [code, setCode] = useState("");

  const inputRef = useRef(null);

  const challengeId =
    location.state?.challengeId;

  // ====================================
  // Redirect if challenge is missing
  // ====================================
  useEffect(() => {
    if (!challengeId) {
      toast.error(
        "Your verification session is invalid."
      );

      navigate("/login", {
        replace: true,
      });
    }
  }, [challengeId, navigate]);

  // ====================================
  // Handle OTP Input
  // ====================================
  const handleChange = (e) => {
    const value = e.target.value
      .replace(/\D/g, "")
      .slice(0, 6);

    setCode(value);
  };

  // ====================================
  // Verify Code
  // ====================================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (code.length !== 6) {
      toast.error(
        "Please enter the 6-digit verification code."
      );

      inputRef.current?.focus();

      return;
    }

    try {
      await verifyTwoFactorMutation.mutateAsync(
        {
          challengeId,
          code,
        }
      );

      toast.success(
        "Two-factor verification successful!"
      );

      navigate("/feed", {
        replace: true,
      });
    } catch (error) {
      console.error(
        "Two-factor verification failed:",
        error
      );

      toast.error(
        error?.response?.data?.message ||
          "Invalid or expired verification code."
      );

      setCode("");

      inputRef.current?.focus();
    }
  };

  // ====================================
  // Loading State
  // ====================================
  const isVerifying =
    verifyTwoFactorMutation.isPending;

  return (
    <div className="w-full max-w-md">
      {/* ================================= */}
      {/* Icon */}
      {/* ================================= */}

      <div className="mb-6 flex justify-center lg:justify-start">
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
          <ShieldCheck className="h-7 w-7" />
        </div>
      </div>

      {/* ================================= */}
      {/* Heading */}
      {/* ================================= */}

      <div className="text-center lg:text-left">
        <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
          Verify your login
        </h2>

        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          We've sent a 6-digit verification
          code to your email. Enter it below
          to continue.
        </p>
      </div>

      {/* ================================= */}
      {/* Form */}
      {/* ================================= */}

      <form
        onSubmit={handleSubmit}
        className="mt-8 space-y-6"
      >
        <div className="space-y-2">
          <label
            htmlFor="twoFactorCode"
            className="text-sm font-medium"
          >
            Verification Code
          </label>

          <Input
            ref={inputRef}
            id="twoFactorCode"
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={6}
            value={code}
            onChange={handleChange}
            placeholder="000000"
            disabled={isVerifying}
            autoFocus
            className="
              h-14
              text-center
              text-2xl
              font-semibold
              tracking-[0.5em]
            "
          />

          <p className="text-center text-xs text-muted-foreground">
            Enter the 6-digit code from your
            email.
          </p>
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
          {isVerifying ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Verifying...
            </>
          ) : (
            <>
              <ShieldCheck className="h-4 w-4" />
              Verify Code
            </>
          )}
        </Button>
      </form>

      {/* ================================= */}
      {/* Back to Login */}
      {/* ================================= */}

      <button
        type="button"
        onClick={() =>
          navigate("/login")
        }
        disabled={isVerifying}
        className="
          mt-6
          flex
          w-full
          items-center
          justify-center
          gap-2
          text-sm
          font-medium
          text-muted-foreground
          transition-colors
          hover:text-foreground
          disabled:pointer-events-none
          disabled:opacity-50
        "
      >
        <ArrowLeft className="h-4 w-4" />
        Back to login
      </button>
    </div>
  );
}

export default TwoFactorForm;