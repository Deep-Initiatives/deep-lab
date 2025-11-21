import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";

type AdminUser = { id: string; username: string; role: "admin" | "blog-admin" };

export default function AdminUsersPage() {
  const { token } = useAuth();
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState<Record<string, Partial<AdminUser> & { password?: string }>>({});
  const [createOpen, setCreateOpen] = useState(false);
  const [newUser, setNewUser] = useState<{ username: string; password: string; confirm: string; role: "admin" | "blog-admin" }>({ username: "", password: "", confirm: "", role: "blog-admin" });

  const { data: users = [], isLoading } = useQuery<AdminUser[]>({
    queryKey: ["/api/admin/users"],
    queryFn: async () => {
      const res = await fetch("/api/admin/users", { headers: { Authorization: `Bearer ${token}` } });
      if (!res.ok) throw new Error("Failed to fetch users");
      return res.json();
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: any }) => {
      const res = await fetch(`/api/admin/users/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error((await res.json()).error || "Failed to update user");
      return res.json();
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] }),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/admin/users/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error((await res.json()).error || "Failed to delete user");
      return res.json();
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] }),
  });

  const createMutation = useMutation({
    mutationFn: async (payload: { username: string; password: string; role: "admin" | "blog-admin" }) => {
      const res = await fetch(`/api/admin/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error((await res.json()).error || "Failed to create user");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
      setCreateOpen(false);
      setNewUser({ username: "", password: "", confirm: "", role: "blog-admin" });
    },
  });

  const startEdit = (user: AdminUser) => {
    setEditing((prev) => ({ ...prev, [user.id]: { username: user.username, role: user.role } }));
  };

  const cancelEdit = (id: string) => {
    setEditing((prev) => {
      const copy = { ...prev };
      delete copy[id];
      return copy;
    });
  };

  const saveEdit = async (id: string) => {
    const payload = editing[id];
    await updateMutation.mutateAsync({ id, payload });
    cancelEdit(id);
  };

  if (isLoading) {
    return <div className="py-8 text-center">Loading users...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Manage Users</h1>
            <p className="text-muted-foreground">Admins can add, edit, change roles, or delete users.</p>
          </div>
          <Button onClick={() => setCreateOpen((v) => !v)}>{createOpen ? "Close" : "Add User"}</Button>
        </div>
      </div>

      {createOpen && (
        <Card>
          <CardHeader>
            <CardTitle>Add User</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
              <div className="md:col-span-4">
                <Label>Username</Label>
                <Input value={newUser.username} onChange={(e) => setNewUser((p) => ({ ...p, username: e.target.value }))} />
              </div>
              <div className="md:col-span-3">
                <Label>Password</Label>
                <Input type="password" value={newUser.password} onChange={(e) => setNewUser((p) => ({ ...p, password: e.target.value }))} />
              </div>
              <div className="md:col-span-3">
                <Label>Confirm Password</Label>
                <Input type="password" value={newUser.confirm} onChange={(e) => setNewUser((p) => ({ ...p, confirm: e.target.value }))} />
              </div>
              <div className="md:col-span-2">
                <Label>Role</Label>
                <select
                  value={newUser.role}
                  onChange={(e) => setNewUser((p) => ({ ...p, role: e.target.value as any }))}
                  className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm focus:outline-none"
                >
                  <option value="blog-admin">blog-admin</option>
                  <option value="admin">admin</option>
                </select>
              </div>
              <div className="md:col-span-12 flex justify-end">
                <Button
                  onClick={() => {
                    if (!newUser.username || !newUser.password) return;
                    if (newUser.password !== newUser.confirm) return;
                    createMutation.mutate({ username: newUser.username.trim(), password: newUser.password, role: newUser.role });
                  }}
                  disabled={createMutation.isPending}
                >
                  {createMutation.isPending ? "Creating..." : "Create"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Users</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {users.map((u) => {
            const isEditing = !!editing[u.id];
            const edit = editing[u.id] || {};
            return (
              <div key={u.id} className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end border-b pb-4">
                <div className="md:col-span-3">
                  <Label>Username</Label>
                  {isEditing ? (
                    <Input
                      value={edit.username ?? ""}
                      onChange={(e) => setEditing((p) => ({ ...p, [u.id]: { ...p[u.id], username: e.target.value } }))}
                    />
                  ) : (
                    <div className="text-foreground">{u.username}</div>
                  )}
                </div>
                <div className="md:col-span-2">
                  <Label>Role</Label>
                  {isEditing ? (
                    <select
                      value={edit.role as any}
                      onChange={(e) => setEditing((p) => ({ ...p, [u.id]: { ...p[u.id], role: e.target.value as any } }))}
                      className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm focus:outline-none"
                    >
                      <option value="admin">admin</option>
                      <option value="blog-admin">blog-admin</option>
                    </select>
                  ) : (
                    <div className="text-foreground capitalize">{u.role}</div>
                  )}
                </div>
                <div className="md:col-span-3">
                  <Label>New Password (optional)</Label>
                  {isEditing ? (
                    <Input
                      type="password"
                      value={(edit as any).password ?? ""}
                      onChange={(e) => setEditing((p) => ({ ...p, [u.id]: { ...p[u.id], password: e.target.value } }))}
                      placeholder="Set new password"
                    />
                  ) : (
                    <div className="text-muted-foreground">••••••</div>
                  )}
                </div>
                <div className="md:col-span-4 flex gap-2 justify-end">
                  {isEditing ? (
                    <>
                      <Button variant="outline" onClick={() => cancelEdit(u.id)}>Cancel</Button>
                      <Button onClick={() => saveEdit(u.id)} disabled={updateMutation.isPending}>Save</Button>
                    </>
                  ) : (
                    <>
                      <Button variant="outline" onClick={() => startEdit(u)}>Edit</Button>
                      <Button
                        variant="destructive"
                        onClick={() => deleteMutation.mutate(u.id)}
                        disabled={deleteMutation.isPending}
                      >
                        Delete
                      </Button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}


