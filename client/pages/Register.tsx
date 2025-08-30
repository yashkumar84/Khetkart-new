import { useState } from "react";
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

export default function Register() {
  const { register } = useAuth();
  const t = useT();
  const nav = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  return (
    <div>
      <Navbar />
      <main className="container flex min-h-[70vh] items-center justify-center py-10">
        <Card className="w-full max-w-md">
          <CardHeader>
            <h1 className="text-2xl font-bold">{t("register")}</h1>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && (
              <div className="rounded bg-destructive/10 p-2 text-sm text-destructive">
                {error}
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="name">{t("name")}</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">{t("email")}</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">{t("password")}</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col items-stretch gap-3">
            <Button
              onClick={async () => {
                setError(null);
                try {
                  await register(name, email, password);
                  nav("/");
                } catch (e: any) {
                  setError(e.message);
                }
              }}
            >
              {t("create_account")}
            </Button>
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
