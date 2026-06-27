import { signIn } from "@/lib/auth";
import { AuthError } from "next-auth";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label, Card } from "@/components/ui/Card";
import { redirect } from "next/navigation";

async function loginAction(formData: FormData) {
  "use server";

  try {
    await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirectTo: "/admin",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      redirect("/admin/login?error=CredentialsSignin");
    }
    throw error;
  }
}

type PageProps = {
  searchParams: Promise<{ error?: string }>;
};

export default async function AdminLoginPage({ searchParams }: PageProps) {
  const { error } = await searchParams;

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--color-bg)] p-4">
      <Card className="w-full max-w-md">
        <div className="mb-6 text-center">
          <span className="text-4xl" aria-hidden>
            🌿
          </span>
          <h1 className="font-display mt-2 text-2xl font-bold text-[var(--color-primary)]">
            Beheer login
          </h1>
          <p className="mt-1 text-sm text-[var(--color-secondary)]">Groene Kansen Kaart</p>
        </div>

        <form action={loginAction} className="space-y-4">
          <div>
            <Label htmlFor="email">Gebruikersnaam</Label>
            <Input id="email" name="email" type="text" required autoComplete="username" />
          </div>
          <div>
            <Label htmlFor="password">Wachtwoord</Label>
            <Input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
            />
          </div>

          {error && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
              Onjuiste inloggegevens. Probeer het opnieuw.
            </p>
          )}

          <Button type="submit" className="w-full">
            Inloggen
          </Button>
        </form>
      </Card>
    </div>
  );
}
