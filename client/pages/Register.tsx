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
  name: z.string().min(2, "Name too short"),
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Min 6 chars"),
});

type FormData = z.infer<typeof schema>;

export default function Register() {
  const { register: signup } = useAuth();
  const t = useT();
  const nav = useNavigate();
  const { register, handleSubmit, formState } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  async function onSubmit(values: FormData) {
    try {
      await signup(values.name, values.email, values.password);
      toast.success("Account created");
      nav("/");
    } catch (e: any) {
      toast.error(e?.message || "Registration failed");
    }
  }

  return (
    <div>
      <Navbar />
      <main className="container flex min-h-[70vh] items-center justify-center py-10">
        <Card className="w-full max-w-md">
          <CardHeader>
            <h1 className="text-2xl font-bold">{t("register")}</h1>
          </CardHeader>
          <CardContent className="space-y-4">
            <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
              <div className="space-y-2">
                <Label htmlFor="name">{t("name")}</Label>
                <Input id="name" {...register("name")} />
                {formState.errors.name && (
                  <div className="text-xs text-destructive">
                    {formState.errors.name.message}
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">{t("email")}</Label>
                <Input id="email" type="email" {...register("email")} />
                {formState.errors.email && (
                  <div className="text-xs text-destructive">
                    {formState.errors.email.message}
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">{t("password")}</Label>
                <Input
                  id="password"
                  type="password"
                  {...register("password")}
                />
                {formState.errors.password && (
                  <div className="text-xs text-destructive">
                    {formState.errors.password.message}
                  </div>
                )}
              </div>
              <Button type="submit" disabled={formState.isSubmitting}>
                {formState.isSubmitting
                  ? "Please wait..."
                  : t("create_account")}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col items-stretch gap-3">
            <div className="text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link to="/login" className="underline">
                {t("login")}
              </Link>
            </div>
          </CardFooter>
        </Card>
      </main>
    </div>
  );
}
