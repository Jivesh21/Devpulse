import AuthLayout from "@/layouts/AuthLayout";
import TwoFactorForm from "@/components/auth/TwoFactorForm";

function VerifyTwoFactorPage() {
  return (
    <AuthLayout>
      <TwoFactorForm />
    </AuthLayout>
  );
}

export default VerifyTwoFactorPage;