"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, Mail, Calendar } from "lucide-react";
import type { Account, Session } from "@prisma/client";
import Image from "next/image";

type UserWithRelations = {
  id: string;
  name: string | null;
  email: string | null;
  role: string;
  image: string | null;
  createdAt: Date;
  adminActivated: boolean;
  accounts: Account[];
  sessions: Session[];
};

interface UserManagementProps {
  users: UserWithRelations[];
}

export function UserManagement({ users: initialUsers }: UserManagementProps) {
  const [users, setUsers] = useState(initialUsers);
  const [loading, setLoading] = useState<string | null>(null);

  const toggleUserActivation = async (
    userId: string,
    currentStatus: boolean,
  ) => {
    setLoading(userId);
    try {
      const response = await fetch("/api/admin/toggle-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          adminActivated: !currentStatus,
        }),
      });

      if (response.ok) {
        setUsers(
          users.map((user) =>
            user.id === userId
              ? { ...user, adminActivated: !currentStatus }
              : user,
          ),
        );
      }
    } catch (error) {
      console.error("Error toggling user activation:", error);
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Calendar className="h-8 w-8 text-[#D4AF37]" />
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {users.length}
                </p>
                <p className="text-gray-600">Total Users</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-8 w-8 text-green-500" />
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {users.filter((user) => user.adminActivated).length}
                </p>
                <p className="text-gray-600">Activated Users</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <XCircle className="h-8 w-8 text-red-500" />
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {users.filter((user) => !user.adminActivated).length}
                </p>
                <p className="text-gray-600">Pending Activation</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6">
        {users.map((user) => (
          <Card key={user.id} className="card-elegant">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center space-x-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#D4AF37]">
                    {user.image ? (
                      <Image
                        src={user.image ?? "/placeholder.svg"}
                        alt={user.name ?? "User"}
                        className="h-12 w-12 rounded-full object-cover"
                      />
                    ) : (
                      <Calendar className="h-6 w-6 text-white" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {user.name ?? "Unknown User"}
                    </h3>
                    <p className="text-sm font-normal text-gray-500">
                      {user.role}
                    </p>
                  </div>
                </CardTitle>
                <Badge
                  variant={user.adminActivated ? "default" : "secondary"}
                  className={
                    user.adminActivated
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }
                >
                  {user.adminActivated ? "Activated" : "Pending"}
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-600">
                    {user.email ?? "No email"}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-600">
                    Joined {new Date(user.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between border-t pt-4">
                <div className="text-sm text-gray-500">
                  <p>Accounts: {user.accounts.length}</p>
                  <p>Active Sessions: {user.sessions.length}</p>
                </div>

                <Button
                  onClick={() =>
                    toggleUserActivation(user.id, user.adminActivated)
                  }
                  disabled={loading === user.id}
                  className={
                    user.adminActivated
                      ? "bg-red-500 text-white hover:bg-red-600"
                      : "btn-primary"
                  }
                >
                  {loading === user.id
                    ? "Processing..."
                    : user.adminActivated
                      ? "Deactivate"
                      : "Activate User"}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
