import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/store/auth";
import Navbar from "@/components/Navbar";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useT } from "@/i18n";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

const schema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Min 6 chars"),
});

type FormData = z.infer<typeof schema>;

export default function Login() {
  const { login } = useAuth();
  const nav = useNavigate();
  const t = useT();
  const { register: rhf, handleSubmit, formState } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: "onSubmit",
  });

  async function onSubmit(values: FormData) {
    try {
      await login(values.email, values.password);
      toast.success("Logged in");
      nav("/");
    } catch (e: any) {
      toast.error(e?.message || "Login failed");
    }
  }

  return (
    <div>
      <Navbar />
      <main className="container flex min-h-[70vh] items-center justify-center py-10">
        <Card className="w-full max-w-md">
          <CardHeader>
            <h1 className="text-2xl font-bold">{t("login")}</h1>
          </CardHeader>
          <CardContent className="space-y-4">
            <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
              <div className="space-y-2">
                <Label htmlFor="email">{t("email")}</Label>
                <Input id="email" type="email" {...rhf("email")} />
                {formState.errors.email && (
                  <div className="text-xs text-destructive">
                    {formState.errors.email.message}
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">{t("password")}</Label>
                <Input id="password" type="password" {...rhf("password")} />
                {formState.errors.password && (
                  <div className="text-xs text-destructive">
                    {formState.errors.password.message}
                  </div>
                )}
              </div>
              <Button type="submit" disabled={formState.isSubmitting}>
                {formState.isSubmitting ? "Please wait..." : t("continue")}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col items-stretch gap-3">
            <div className="text-center text-sm text-muted-foreground">
              No account?{" "}
              <Link to="/register" className="underline">
                {t("register")}
              </Link>
            </div>
            <div className="text-center text-xs text-muted-foreground">
              Demo: admin@khetkart.com / admin123 • user@khetkart.com / user123
            </div>
            <Button
              variant="outline"
              onClick={async () => {
                await fetch("/api/auth/seed-demo", { method: "POST" });
                toast.success("Seeded demo users (if they didn't exist)");
              }}
            >
              Seed demo users
            </Button>
          </CardFooter>
        </Card>
      </main>
    </div>
  );
}
