import Navbar from "@/components/Navbar";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

const schema = z.object({ email: z.string().email() });

export default function ForgotPassword() {
  const { register, handleSubmit, formState } = useForm<{ email: string }>({ resolver: zodResolver(schema) });
  return (
    <div>
      <Navbar />
      <main className="container flex min-h-[70vh] items-center justify-center py-10">
        <Card className="w-full max-w-md">
          <CardHeader>
            <h1 className="text-2xl font-bold">Forgot Password</h1>
          </CardHeader>
          <CardContent>
            <form
              className="space-y-3"
              onSubmit={handleSubmit(async (v) => {
                try {
                  const res = await fetch("/api/auth/forgot", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(v),
                  });
                  const data = await res.json();
                  toast.success("Reset link sent. Token: " + (data.token || "check server logs"));
                } catch (e: any) {
                  toast.error(e?.message || "Failed");
                }
              })}
            >
              <div className="space-y-1">
                <Label>Email</Label>
                <Input type="email" {...register("email")} />
                {formState.errors.email && (
                  <div className="text-xs text-destructive">{formState.errors.email.message as any}</div>
                )}
              </div>
              <Button type="submit">Send Reset Link</Button>
            </form>
          </CardContent>
          <CardFooter></CardFooter>
        </Card>
      </main>
    </div>
  );
}
