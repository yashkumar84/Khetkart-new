import Navbar from "@/components/Navbar";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

const schema = z.object({
  email: z.string().email(),
  token: z.string().min(10),
  newPassword: z.string().min(6),
});

export default function ResetPassword() {
  const { register, handleSubmit, formState, reset } = useForm<{
    email: string;
    token: string;
    newPassword: string;
  }>({ resolver: zodResolver(schema) });

  return (
    <div>
      <Navbar />
      <main className="container flex min-h-[70vh] items-center justify-center py-10">
        <Card className="w-full max-w-md">
          <CardHeader>
            <h1 className="text-2xl font-bold">Reset Password</h1>
          </CardHeader>
          <CardContent>
            <form
              className="space-y-3"
              onSubmit={handleSubmit(async (v) => {
                try {
                  const res = await fetch("/api/auth/reset", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(v),
                  });
                  if (!res.ok) throw new Error(await res.text());
                  toast.success("Password reset successful");
                  reset();
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
              <div className="space-y-1">
                <Label>Token</Label>
                <Input {...register("token")} />
                {formState.errors.token && (
                  <div className="text-xs text-destructive">{formState.errors.token.message as any}</div>
                )}
              </div>
              <div className="space-y-1">
                <Label>New Password</Label>
                <Input type="password" {...register("newPassword")} />
                {formState.errors.newPassword && (
                  <div className="text-xs text-destructive">{formState.errors.newPassword.message as any}</div>
                )}
              </div>
              <Button type="submit">Reset Password</Button>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
