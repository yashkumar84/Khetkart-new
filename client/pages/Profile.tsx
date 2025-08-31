import Navbar from "@/components/Navbar";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/store/auth";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { useState } from "react";

const profileSchema = z.object({
  name: z.string().min(2, "Too short"),
  phone: z.string().optional(),
  address: z.string().optional(),
  avatarUrl: z.string().url().optional().or(z.literal("")),
});

type ProfileForm = z.infer<typeof profileSchema>;

const passwordSchema = z.object({
  oldPassword: z.string().min(6),
  newPassword: z.string().min(6),
});

type PasswordForm = z.infer<typeof passwordSchema>;

export default function Profile() {
  const { user, setUser } = useAuth();
  const [file, setFile] = useState<File | null>(null);
  const { register, handleSubmit, formState, reset } = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || "",
      phone: undefined,
      address: undefined,
      avatarUrl: "",
    },
  });
  const pwd = useForm<PasswordForm>({ resolver: zodResolver(passwordSchema) });

  async function onSave(values: ProfileForm) {
    try {
      let avatar = values.avatarUrl || undefined;
      if (file) {
        const fd = new FormData();
        fd.append("file", file);
        const res = await fetch("/api/upload/image", { method: "POST", body: fd, headers: { Authorization: `Bearer ${localStorage.getItem("kk_token")}` || "" } });
        if (!res.ok) throw new Error("Upload failed");
        const data = await res.json();
        avatar = data.url;
      }
      const updated = await api<{ user: any }>("/auth/me", {
        method: "PUT",
        auth: true,
        body: JSON.stringify({ name: values.name, phone: values.phone, address: values.address, avatar }),
      });
      setUser(updated.user, localStorage.getItem("kk_token"));
      toast.success("Profile updated");
      reset({ ...values, avatarUrl: "" });
      setFile(null);
    } catch (e: any) {
      toast.error(e?.message || "Update failed");
    }
  }

  async function onChangePassword(values: PasswordForm) {
    try {
      await api("/auth/change-password", {
        method: "POST",
        auth: true,
        body: JSON.stringify(values),
      });
      toast.success("Password changed");
      pwd.reset();
    } catch (e: any) {
      toast.error(e?.message || "Failed to change password");
    }
  }

  return (
    <ProtectedRoute>
      <div>
        <Navbar />
        <main className="container grid gap-8 py-8 md:grid-cols-2">
          <section className="rounded border p-4 space-y-4">
            <h1 className="text-xl font-bold">Edit Profile</h1>
            <form className="space-y-3" onSubmit={handleSubmit(onSave)}>
              <div className="space-y-1">
                <Label htmlFor="name">Name</Label>
                <Input id="name" {...register("name")} />
                {formState.errors.name && (
                  <div className="text-xs text-destructive">{formState.errors.name.message}</div>
                )}
              </div>
              <div className="space-y-1">
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" {...register("phone")} />
              </div>
              <div className="space-y-1">
                <Label htmlFor="address">Address</Label>
                <Input id="address" {...register("address")} />
              </div>
              <div className="space-y-1">
                <Label>Avatar</Label>
                <Input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} />
                <div className="text-center text-xs text-muted-foreground">or</div>
                <Input placeholder="Image URL" {...register("avatarUrl")} />
              </div>
              <Button type="submit" disabled={formState.isSubmitting}>Save</Button>
            </form>
          </section>
          <section className="rounded border p-4 space-y-4">
            <h2 className="text-xl font-bold">Change Password</h2>
            <form className="space-y-3" onSubmit={pwd.handleSubmit(onChangePassword)}>
              <div className="space-y-1">
                <Label htmlFor="oldPassword">Current Password</Label>
                <Input id="oldPassword" type="password" {...pwd.register("oldPassword")} />
              </div>
              <div className="space-y-1">
                <Label htmlFor="newPassword">New Password</Label>
                <Input id="newPassword" type="password" {...pwd.register("newPassword")} />
              </div>
              <Button type="submit" disabled={pwd.formState.isSubmitting}>Update Password</Button>
            </form>
          </section>
        </main>
      </div>
    </ProtectedRoute>
  );
}
