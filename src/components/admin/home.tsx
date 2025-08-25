"use client";

import {
  Shield,
  Users,
  UserCheck,
  UserX,
  Activity,
  Plus,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  LogOut,
  User,
  MoreVertical,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "../ui/badge";
import Image from "next/image";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { api } from "@/trpc/react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Switch } from "../ui/switch";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import type { ServerUser } from "@/types/user";
import { Loader, LoaderOverlay } from "../ui/loader";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

const userFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  image: z
    .string()
    .url()
    .optional()
    .or(z.literal(""))
    .transform((val) => val ?? undefined),
  role: z.enum(["ADMIN", "MATCHMAKER"]),
  adminActivated: z.boolean(),
});

type UserFormData = z.infer<typeof userFormSchema>;

export function Home() {
  const [currentPage, setCurrentPage] = useState(1);
  const [editingUser, setEditingUser] = useState<ServerUser | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<ServerUser | null>(null);
  const [loadingUserId, setLoadingUserId] = useState<string | null>(null);

  const createForm = useForm<UserFormData>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      name: "",
      email: "",
      image: "",
      role: "MATCHMAKER",
      adminActivated: false,
    },
  });

  const editForm = useForm<UserFormData>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      name: "",
      email: "",
      image: "",
      role: "MATCHMAKER",
      adminActivated: false,
    },
  });

  const { data, isLoading } = api.admin.getAllUsers.useQuery({
    page: currentPage,
  });
  const utils = api.useUtils();

  const createMutation = api.admin.createUser.useMutation({
    onSuccess: async () => {
      toast("User created successfully", {
        className: "text-white bg-green-500",
      });
      await utils.admin.getAllUsers.invalidate();
      setIsCreateDialogOpen(false);
      createForm.reset();
    },
    onError: () => {
      toast("Failed to create user", { className: "bg-red-500 text-white" });
    },
  });

  const updateMutation = api.admin.updateUser.useMutation({
    onSuccess: async () => {
      toast("User updated successfully", {
        className: "text-white bg-green-500",
      });
      await utils.admin.getAllUsers.invalidate();
      setIsEditDialogOpen(false);
      setEditingUser(null);
      editForm.reset();
    },
    onError: () => {
      toast("Failed to update user", { className: "bg-red-500 text-white" });
    },
  });

  const deleteMutation = api.admin.deleteUser.useMutation({
    onSuccess: async () => {
      toast("User deleted successfully", {
        className: "text-white bg-green-500",
      });
      await utils.admin.getAllUsers.invalidate();
      setIsDeleteDialogOpen(false);
      setUserToDelete(null);
    },
    onError: () => {
      toast("Failed to delete user", { className: "bg-red-500 text-white" });
    },
  });

  const toggleMutation = api.admin.toggleUserActivation.useMutation({
    onSuccess: async () => {
      toast("User activation toggled", {
        className: "text-white bg-green-500",
      });
      await utils.admin.getAllUsers.invalidate();
    },
    onError: () => {
      toast("Failed to toggle user activation", {
        className: "bg-red-500 text-white",
      });
    },
  });

  const handleCreateUser = async (data: UserFormData) => {
    await createMutation.mutateAsync(data);
  };

  const handleUpdateUser = async (data: UserFormData) => {
    if (!editingUser) return;
    await updateMutation.mutateAsync({ ...data, id: editingUser.id });
  };

  const handleDeleteUser = async () => {
    if (!userToDelete) return;
    await deleteMutation.mutateAsync({ userId: userToDelete.id });
  };

  const openEditDialog = (user: ServerUser) => {
    setEditingUser(user);
    editForm.reset({
      name: user.name,
      email: user.email,
      image: user.image ?? "",
      role: user.role,
      adminActivated: user.adminActivated,
    });
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (user: ServerUser) => {
    setUserToDelete(user);
    setIsDeleteDialogOpen(true);
  };

  async function toggleUserActivation(userId: string, current: boolean) {
    try {
      setLoadingUserId(userId);
      await toggleMutation.mutateAsync({ userId, adminActivated: !current });
    } finally {
      setLoadingUserId(null);
    }
  }

  const users = data?.users ?? [];
  const activeUsers = users.filter((user) => user.adminActivated).length;
  const pendingUsers = users.filter(
    (user) => !user.adminActivated && user.role !== "ADMIN",
  ).length;
  const adminUsers = users.filter((user) => user.role === "ADMIN").length;

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
      <div className="mx-auto max-w-7xl space-y-8 p-6">
        <div className="space-y-6">
          <div className="flex items-start justify-between">
            <div className="flex-1 text-center">
              <div className="mb-6 flex justify-center">
                <div className="rounded-full bg-gradient-to-br from-amber-100 to-orange-100 p-6 shadow-xl ring-4 ring-amber-200/50">
                  <Shield className="h-10 w-10 text-amber-600" />
                </div>
              </div>
              <div className="space-y-3">
                <h1 className="bg-gradient-to-r from-amber-600 via-orange-600 to-yellow-600 bg-clip-text text-4xl font-bold text-transparent">
                  Admin Dashboard
                </h1>
                <p className="mx-auto max-w-2xl text-lg text-amber-700/80">
                  Manage user accounts, monitor activity, and control access
                  permissions for The Date Crew platform
                </p>
              </div>
            </div>
            <div className="absolute top-6 right-6">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-amber-200 bg-white/90 hover:bg-amber-50"
                  >
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem asChild>
                    <Link
                      href="/client"
                      className="flex cursor-pointer items-center"
                    >
                      <User className="mr-2 h-4 w-4" />
                      Client
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link
                      href="/api/auth/signout"
                      className="flex cursor-pointer items-center"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        <LoaderOverlay isLoading={isLoading}>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card className="border-amber-200 bg-white/90 shadow-lg backdrop-blur-sm transition-shadow hover:shadow-xl">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-amber-900">
                  Total Users
                </CardTitle>
                <Users className="h-5 w-5 text-amber-600" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-amber-900">
                  {data?.totalCount ?? 0}
                </div>
                <p className="mt-1 text-xs text-amber-600">
                  Registered members
                </p>
              </CardContent>
            </Card>

            <Card className="border-green-200 bg-white/90 shadow-lg backdrop-blur-sm transition-shadow hover:shadow-xl">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-green-900">
                  Active Users
                </CardTitle>
                <UserCheck className="h-5 w-5 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-900">
                  {activeUsers}
                </div>
                <p className="mt-1 text-xs text-green-600">
                  Activated accounts
                </p>
              </CardContent>
            </Card>

            <Card className="border-orange-200 bg-white/90 shadow-lg backdrop-blur-sm transition-shadow hover:shadow-xl">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-orange-900">
                  Pending Users
                </CardTitle>
                <UserX className="h-5 w-5 text-orange-600" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-orange-900">
                  {pendingUsers}
                </div>
                <p className="mt-1 text-xs text-orange-600">
                  Awaiting activation
                </p>
              </CardContent>
            </Card>

            <Card className="border-purple-200 bg-white/90 shadow-lg backdrop-blur-sm transition-shadow hover:shadow-xl">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-purple-900">
                  Administrators
                </CardTitle>
                <Activity className="h-5 w-5 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-purple-900">
                  {adminUsers}
                </div>
                <p className="mt-1 text-xs text-purple-600">Admin accounts</p>
              </CardContent>
            </Card>
          </div>
        </LoaderOverlay>

        <Card className="border-amber-200 bg-white/90 p-0 shadow-xl backdrop-blur-sm">
          <CardHeader className="border-b border-amber-100 bg-gradient-to-r from-amber-50 to-orange-50 p-6">
            <div className="flex flex-col items-center justify-between gap-2 md:flex-row">
              <div>
                <CardTitle className="flex items-center gap-2 text-xl text-amber-900">
                  <Users className="h-5 w-5" />
                  User Management
                </CardTitle>
                <CardDescription className="text-amber-700">
                  Create, edit, delete, and manage user accounts
                </CardDescription>
              </div>
              <Dialog
                open={isCreateDialogOpen}
                onOpenChange={setIsCreateDialogOpen}
              >
                <DialogTrigger asChild>
                  <Button className="bg-amber-600 hover:bg-amber-700">
                    <Plus className="mr-2 h-4 w-4" />
                    Add User
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create New User</DialogTitle>
                    <DialogDescription>
                      Add a new user to the platform
                    </DialogDescription>
                  </DialogHeader>
                  <Form {...createForm}>
                    <form
                      onSubmit={createForm.handleSubmit(handleCreateUser)}
                      className="space-y-4"
                    >
                      <FormField
                        control={createForm.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter user name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={createForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input
                                type="email"
                                placeholder="Enter email address"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={createForm.control}
                        name="image"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Image URL</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Enter image URL (optional)"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={createForm.control}
                        name="role"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Role</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select a role" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="MATCHMAKER">
                                  Matchmaker
                                </SelectItem>
                                <SelectItem value="ADMIN">Admin</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={createForm.control}
                        name="adminActivated"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                            <div className="space-y-0.5">
                              <FormLabel>Activated</FormLabel>
                              <FormDescription>
                                Enable user account immediately
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <DialogFooter>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setIsCreateDialogOpen(false)}
                        >
                          Cancel
                        </Button>
                        <Button
                          type="submit"
                          disabled={createMutation.isPending}
                          className="min-w-[120px]"
                        >
                          {createMutation.isPending ? (
                            <div className="flex items-center gap-2">
                              <Loader size="sm" />
                              Creating...
                            </div>
                          ) : (
                            "Create User"
                          )}
                        </Button>
                      </DialogFooter>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            {isLoading ? (
              <div className="py-12 text-center">
                <Loader size="lg" className="mb-4" />
                <h3 className="mb-2 text-lg font-medium text-amber-900">
                  Loading users...
                </h3>
                <p className="text-amber-600">
                  Please wait while we fetch the user data
                </p>
              </div>
            ) : data?.totalCount === 0 ? (
              <div className="py-12 text-center">
                <Users className="mx-auto mb-4 h-12 w-12 text-amber-300" />
                <h3 className="mb-2 text-lg font-medium text-amber-900">
                  No users found
                </h3>
                <p className="text-amber-600">
                  Users will appear here once they register
                </p>
              </div>
            ) : (
              <>
                <LoaderOverlay isLoading={isLoading}>
                  <div className="space-y-4">
                    {users.map((user) => (
                      <div
                        key={user.id}
                        className="flex flex-col items-center justify-between gap-2 rounded-xl border border-amber-100 bg-gradient-to-r from-white to-amber-50/30 p-5 shadow-sm transition-all duration-200 hover:shadow-md md:flex-row"
                      >
                        <div className="flex flex-col items-center space-x-4 md:flex-row">
                          <div className="relative">
                            {user.image ? (
                              <Image
                                src={user.image || "/placeholder.svg"}
                                alt={user.name ?? "User"}
                                className="h-12 w-12 rounded-full ring-2 ring-amber-200"
                                width={48}
                                height={48}
                              />
                            ) : (
                              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-amber-200 to-orange-200 ring-2 ring-amber-200">
                                <Users className="h-6 w-6 text-amber-700" />
                              </div>
                            )}
                            {user.adminActivated && (
                              <div className="absolute -right-1 -bottom-1 h-4 w-4 rounded-full border-2 border-white bg-green-500"></div>
                            )}
                          </div>
                          <div className="space-y-1 p-2 text-center md:text-start">
                            <p className="font-semibold text-amber-900">
                              {user.name ?? "No name"}
                            </p>
                            <p className="text-sm text-wrap text-amber-600">
                              {user.email}
                            </p>
                            <div className="flex items-center justify-center space-x-2 md:justify-start">
                              <Badge
                                variant={
                                  user.role === "ADMIN"
                                    ? "default"
                                    : "secondary"
                                }
                                className={
                                  user.role === "ADMIN"
                                    ? "border-purple-200 bg-purple-100 text-purple-800"
                                    : ""
                                }
                              >
                                {user.role}
                              </Badge>
                              <Badge
                                variant={
                                  user.adminActivated
                                    ? "default"
                                    : "destructive"
                                }
                                className={
                                  user.adminActivated
                                    ? "border-green-200 bg-green-100 text-green-800"
                                    : "border-orange-200 bg-orange-100 text-orange-800"
                                }
                              >
                                {user.adminActivated ? "Active" : "Pending"}
                              </Badge>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openEditDialog(user as ServerUser)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>

                          {user.role !== "ADMIN" && (
                            <>
                              <Button
                                onClick={() =>
                                  toggleUserActivation(
                                    user.id,
                                    user.adminActivated,
                                  )
                                }
                                variant={
                                  user.adminActivated
                                    ? "destructive"
                                    : "default"
                                }
                                size="sm"
                                className={
                                  user.adminActivated
                                    ? "min-w-[100px] bg-red-500 hover:bg-red-600"
                                    : "min-w-[100px] bg-green-500 text-white hover:bg-green-600"
                                }
                                disabled={toggleMutation.isPending}
                              >
                                {loadingUserId === user.id ? (
                                  <Loader size="sm" />
                                ) : user.adminActivated ? (
                                  "Deactivate"
                                ) : (
                                  "Activate"
                                )}
                              </Button>

                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() =>
                                  openDeleteDialog(user as ServerUser)
                                }
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </LoaderOverlay>

                {data && data.totalPages >= 1 && (
                  <div className="mt-6 flex items-center justify-between border-t border-amber-100 pt-6">
                    <div className="text-sm text-amber-600">
                      Page {data.page} of {data.totalPages} ({data.totalCount}{" "}
                      total users)
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(currentPage - 1)}
                        disabled={!data.hasPreviousPage || isLoading}
                        className="border-amber-200 hover:bg-amber-50"
                      >
                        {isLoading ? (
                          <Loader size="sm" className="mr-1" />
                        ) : (
                          <ChevronLeft className="mr-1 h-4 w-4" />
                        )}
                        Previous
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(currentPage + 1)}
                        disabled={!data.hasNextPage || isLoading}
                        className="border-amber-200 hover:bg-amber-50"
                      >
                        Next
                        {isLoading ? (
                          <Loader size="sm" className="ml-1" />
                        ) : (
                          <ChevronRight className="ml-1 h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>

        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit User</DialogTitle>
              <DialogDescription>Update user information</DialogDescription>
            </DialogHeader>
            <Form {...editForm}>
              <form
                onSubmit={editForm.handleSubmit(handleUpdateUser)}
                className="space-y-4"
              >
                <FormField
                  control={editForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter user name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={editForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="Enter email address"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={editForm.control}
                  name="image"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Image URL</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter image URL (optional)"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={editForm.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Role</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a role" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="MATCHMAKER">Matchmaker</SelectItem>
                          <SelectItem value="ADMIN">Admin</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={editForm.control}
                  name="adminActivated"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                      <div className="space-y-0.5">
                        <FormLabel>Activated</FormLabel>
                        <FormDescription>
                          Enable or disable user account
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsEditDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={updateMutation.isPending}
                    className="min-w-[120px]"
                  >
                    {updateMutation.isPending ? (
                      <div className="flex items-center gap-2">
                        <Loader size="sm" />
                        Updating...
                      </div>
                    ) : (
                      "Update User"
                    )}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete User</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete {userToDelete?.name}? This
                action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsDeleteDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleDeleteUser}
                disabled={deleteMutation.isPending}
                className="min-w-[120px]"
              >
                {deleteMutation.isPending ? (
                  <div className="flex items-center gap-2">
                    <Loader size="sm" />
                    Deleting...
                  </div>
                ) : (
                  "Delete User"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
