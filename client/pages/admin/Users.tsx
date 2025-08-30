import Navbar from "@/components/Navbar";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface AdminUser {
  _id: string;
  name: string;
  email: string;
  role: string;
}

export default function AdminUsers() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("user123");
  const [role, setRole] = useState("user");

  async function load() {
    const res = await api<{ users: AdminUser[] }>("/users", { auth: true });
    setUsers(res.users);
  }
  useEffect(() => {
    load();
  }, []);

  return (
    <ProtectedRoute role="admin">
      <div>
        <Navbar />
        <main className="container py-8">
          <h1 className="mb-4 text-2xl font-bold">Users</h1>

          <div className="mb-6 grid gap-3 md:grid-cols-4">
            <Input
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <Input
              placeholder="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              placeholder="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Select value={role} onValueChange={(v) => setRole(v)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="user">User</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="farmer">Farmer</SelectItem>
                <SelectItem value="delivery">Delivery</SelectItem>
              </SelectContent>
            </Select>
            <div className="md:col-span-4">
              <Button
                onClick={async () => {
                  await api("/users", {
                    method: "POST",
                    auth: true,
                    body: JSON.stringify({ name, email, password, role }),
                  });
                  setName("");
                  setEmail("");
                  setPassword("user123");
                  setRole("user");
                  load();
                }}
              >
                Create User
              </Button>
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((u) => (
                <TableRow key={u._id}>
                  <TableCell>{u.name}</TableCell>
                  <TableCell>{u.email}</TableCell>
                  <TableCell>{u.role}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </main>
      </div>
    </ProtectedRoute>
  );
}
