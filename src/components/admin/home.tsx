"use client";

import { Shield, Users, UserCheck, UserX, Activity } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Badge } from "../ui/badge";
import Image from "next/image";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { api } from "@/trpc/react";

export function Home() {
  const { data, isLoading, isPending } = api.user.getAllUsers.useQuery();
  const users = data?.users;

  const utils = api.useUtils();

  const toggleMutation = api.user.toggleUserActivation.useMutation({
    onSuccess: async () => {
      toast("User Activation toggled", {
        className: "text-white bg-green-500",
      });
      await utils.user.getAllUsers.invalidate();
    },
    onError: () => {
      toast("Failed to toggle user activation", {
        className: "bg-red-500 text-white",
      });
    },
  });

  async function toggleUserActivation(userId: string, current: boolean) {
    try {
      await toggleMutation.mutateAsync({ userId, adminActivated: !current });
    } catch (e) {
      console.error(e);
    }
  }

  // if (isLoading || isPending) {
  //   return <PageLoader message="Loading admin dashboard..." />
  // }

  const activeUsers = users?.filter((user) => user.adminActivated).length ?? 0;
  const pendingUsers =
    users?.filter((user) => !user.adminActivated && user.role !== "ADMIN")
      .length ?? 0;
  const adminUsers = users?.filter((user) => user.role === "ADMIN").length ?? 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
      <div className="mx-auto max-w-7xl space-y-8 p-6">
        <div className="space-y-6 text-center">
          <div className="flex justify-center">
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
              <p className="mt-1 text-xs text-amber-600">Registered members</p>
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
              <p className="mt-1 text-xs text-green-600">Activated accounts</p>
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

        <Card className="border-amber-200 bg-white/90 p-0 shadow-xl backdrop-blur-sm">
          <CardHeader className="border-b border-amber-100 bg-gradient-to-r from-amber-50 to-orange-50 p-3">
            <CardTitle className="p-3 text-xl text-amber-900">
              <Users className="h-5 w-5" />
              User Management
            </CardTitle>
            <CardDescription className="text-amber-700">
              Activate or deactivate user accounts to control platform access
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            {data?.totalCount === 0 ? (
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
              <div className="space-y-4">
                {users?.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between rounded-xl border border-amber-100 bg-gradient-to-r from-white to-amber-50/30 p-5 shadow-sm transition-all duration-200 hover:shadow-md"
                  >
                    <div className="flex items-center space-x-4">
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
                      <div className="space-y-1">
                        <p className="font-semibold text-amber-900">
                          {user.name ?? "No name"}
                        </p>
                        <p className="text-sm text-amber-600">{user.email}</p>
                        <div className="flex items-center space-x-2">
                          <Badge
                            variant={
                              user.role === "ADMIN" ? "default" : "secondary"
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
                              user.adminActivated ? "default" : "destructive"
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

                    {user.role !== "ADMIN" && (
                      <Button
                        onClick={() =>
                          toggleUserActivation(user.id, user.adminActivated)
                        }
                        variant={
                          user.adminActivated ? "destructive" : "default"
                        }
                        size="sm"
                        className={
                          user.adminActivated
                            ? "bg-red-500 hover:bg-red-600"
                            : "bg-green-500 text-white hover:bg-green-600"
                        }
                        disabled={toggleMutation.isPending}
                      >
                        {toggleMutation.isPending
                          ? "..."
                          : user.adminActivated
                            ? "Deactivate"
                            : "Activate"}
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
