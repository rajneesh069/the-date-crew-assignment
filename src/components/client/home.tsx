"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  Filter,
  Plus,
  Heart,
  Users,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Trash2,
  Edit3,
  User,
} from "lucide-react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { api } from "@/trpc/react";
import { toast } from "sonner";

const statusColors: Record<string, string> = {
  unmatched: "bg-purple-100 text-purple-800 border-purple-200",
  matched: "bg-green-100 text-green-800 border-green-200",
  paused: "bg-gray-100 text-gray-800 border-gray-200",
};

export function Dashboard({ role }: { role: "ADMIN" | "MATCHMAKER" }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);

  const utils = api.useUtils();

  const {
    data: customersData,
    isLoading,
    error,
  } = api.customer.getAllCustomers.useQuery({ page: currentPage });

  const { data: searchCustomersData } = api.customer.search.useQuery(
    { search: debouncedSearchTerm, currentPage },
    { enabled: !!debouncedSearchTerm },
  );

  const customers = searchTerm
    ? searchCustomersData?.result
    : customersData?.customers;

  const processedCustomers =
    (customers ?? []).map((customer) => ({
      id: customer.id,
      firstName: customer.firstName,
      lastName: customer.lastName,
      age:
        new Date().getFullYear() - new Date(customer.dateOfBirth).getFullYear(),
      city: customer.city,
      maritalStatus:
        customer.maritalStatus === "NeverMarried"
          ? "Never Married"
          : "Divorced",
      status: customer.accountStatus,
      avatar: customer.avatar,
      joinDate: customer.joinDate,
      raw: customer,
    })) ?? [];

  const filteredCustomers =
    statusFilter === "all"
      ? processedCustomers
      : processedCustomers.filter(
          (customer) => customer.status === statusFilter,
        );

  const totalPages = searchTerm
    ? (searchCustomersData?.totalPages ?? 1)
    : (customersData?.totalPages ?? 1);
  const totalCount = searchTerm
    ? (searchCustomersData?.totalCount ?? 0)
    : (customersData?.totalCount ?? 0);
  const pageSize = searchTerm
    ? (searchCustomersData?.pageSize ?? 10)
    : (customersData?.pageSize ?? 10);

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value);
    setCurrentPage(1);
  };

  // delete mutation
  const deleteMutation = api.customer.deleteCustomer.useMutation({
    onSuccess: async () => {
      await utils.customer.getAllCustomers.invalidate();
      await utils.customer.search.invalidate();
      toast.success("Deleted the user successfully");
    },
    onError: () => {
      toast.error("Failed to delete user");
    },
  });

  const confirmDelete = async (customerId: string) => {
    await deleteMutation.mutateAsync({ customerId });
  };

  if (isLoading) {
    return (
      <div className="bg-background flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="border-primary mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-b-2"></div>
          <p className="text-muted-foreground">Loading customers...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-background flex min-h-screen items-center justify-center">
        <div className="text-center">
          <p className="mb-4 text-red-600">
            Error loading customers: {error.message}
          </p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen">
      {/* Header */}
      <header className="border-border bg-card border-b">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <Heart className="text-primary h-6 w-6" />
              <Users className="text-secondary hidden h-6 w-6 md:block" />
            </div>
            <div>
              <h1 className="gradient-text text-xl font-semibold">
                TDC Matchmaker
              </h1>
              <p className="text-muted-foreground text-sm">Dashboard</p>
            </div>
          </div>
          <div className="flex flex-col items-center gap-2 md:flex-row">
            {role === "ADMIN" && (
              <Link href={"/admin"}>
                <Button
                  variant="outline"
                  className="flex items-center space-x-2 bg-transparent"
                >
                  <User className="h-4 w-4" />
                  <span>Admin</span>
                </Button>
              </Link>
            )}
            <Link href={"/api/auth/signout"}>
              <Button
                variant="outline"
                className="flex items-center space-x-2 bg-transparent"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="p-6">
        {/* Stats Cards */}
        <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">Total Clients</p>
                  <p className="text-primary text-2xl font-bold">
                    {totalCount}
                  </p>
                </div>
                <Users className="text-primary/60 h-8 w-8" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">Matched</p>
                  <p className="text-2xl font-bold text-green-600">
                    {
                      filteredCustomers.filter((c) => c.status === "matched")
                        .length
                    }
                  </p>
                </div>
                <Heart className="h-8 w-8 text-green-600/60" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">Unmatched</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {
                      filteredCustomers.filter((c) => c.status === "unmatched")
                        .length
                    }
                  </p>
                </div>
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-100">
                  <div className="h-3 w-3 rounded-full bg-purple-600"></div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">Paused</p>
                  <p className="text-2xl font-bold text-gray-600">
                    {
                      filteredCustomers.filter((c) => c.status === "paused")
                        .length
                    }
                  </p>
                </div>
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100">
                  <div className="h-3 w-3 rounded-full bg-gray-600"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Customer Management</CardTitle>
            <CardDescription>
              Manage and view all your assigned customers • Showing{" "}
              {filteredCustomers.length} of {totalCount} customers
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-6 flex flex-col items-center gap-3 space-x-4 md:flex-row md:gap-0">
              <div className="relative flex-1">
                <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform" />
                <Input
                  placeholder="Search customers by name, email, phone, or city..."
                  value={searchTerm}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Select
                value={statusFilter}
                onValueChange={handleStatusFilterChange}
              >
                <SelectTrigger className="w-40">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="unmatched">Unmatched</SelectItem>
                  <SelectItem value="matched">Matched</SelectItem>
                  <SelectItem value="paused">Paused</SelectItem>
                </SelectContent>
              </Select>

              <Link href="/client/add-customer">
                <Button className="flex items-center">
                  <Plus className="h-4 w-4" />
                  <span>Add Customer</span>
                </Button>
              </Link>
            </div>

            {/* Customer List */}
            <div className="mb-6 space-y-2">
              {filteredCustomers.map((customer) => (
                <div
                  className="border-border hover:bg-muted/50 card-hover flex flex-col items-center justify-between gap-3 rounded-lg border p-4 transition-colors md:flex-row"
                  key={customer.id}
                >
                  <Link
                    href={`/client/customer/${encodeURIComponent(customer.id)}`}
                    className="flex-1"
                  >
                    <div className="flex items-center space-x-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage
                          src={customer.avatar ?? "/placeholder.svg"}
                        />
                        <AvatarFallback className="bg-primary/10 text-primary font-medium">
                          {customer.firstName?.[0]}
                          {customer.lastName?.[0]}
                        </AvatarFallback>
                      </Avatar>

                      <div>
                        <h3 className="text-foreground font-medium">
                          {customer.firstName} {customer.lastName}
                        </h3>
                        <p className="text-muted-foreground text-sm">
                          {customer.age} years • {customer.city} •{" "}
                          {customer.maritalStatus}
                        </p>
                        <p className="text-muted-foreground mt-1 text-xs">
                          Joined:{" "}
                          {new Date(customer.joinDate).toLocaleDateString(
                            "en-IN",
                            { timeZone: "Asia/Kolkata" },
                          )}
                        </p>
                      </div>
                    </div>
                  </Link>
                  <div className="flex items-center gap-1">
                    <Badge className={statusColors[customer.status]}>
                      {customer.status.charAt(0).toUpperCase() +
                        customer.status.slice(1)}
                    </Badge>
                    <Link
                      href={`/client/edit-customer/${encodeURIComponent(customer.id)}`}
                    >
                      <Button
                        variant="outline"
                        size="sm"
                        className="bg-transparent"
                      >
                        <Edit3 className="mr-2 h-4 w-4" />
                        Edit
                      </Button>
                    </Link>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="bg-transparent"
                        >
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Delete customer?</DialogTitle>
                        </DialogHeader>
                        <p className="mb-4">
                          This action is permanent. Are you sure you want to
                          delete {customer.firstName} {customer.lastName}?
                        </p>
                        <DialogFooter>
                          <DialogClose asChild>
                            <Button variant="outline" size="sm">
                              Cancel
                            </Button>
                          </DialogClose>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={async () => {
                              await confirmDelete(customer.id);
                            }}
                          >
                            Delete
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {(customersData?.totalPages ??
              searchCustomersData?.totalPages ??
              1) >= 1 && (
              <div className="border-border border-t pt-4">
                <div className="mb-4 flex flex-col items-center justify-between gap-3 md:flex-row">
                  <div className="flex items-center space-x-4">
                    <p className="text-muted-foreground text-sm">
                      Showing {(currentPage - 1) * (pageSize ?? 10) + 1} to{" "}
                      {Math.min(currentPage * (pageSize ?? 10), totalCount)} of{" "}
                      {totalCount} customers
                    </p>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(1)}
                      disabled={!customersData?.hasPreviousPage}
                      className="hidden bg-transparent md:block"
                    >
                      First
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={!customersData?.hasPreviousPage}
                      className="bg-transparent"
                    >
                      <ChevronLeft className="h-4 w-4" />
                      Previous
                    </Button>

                    <div className="flex items-center space-x-1">
                      <span className="text-muted-foreground text-sm">
                        Page {currentPage} of {totalPages}
                      </span>
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={!customersData?.hasNextPage}
                      className="bg-transparent"
                    >
                      Next
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(totalPages)}
                      disabled={!customersData?.hasNextPage}
                      className="hidden bg-transparent md:block"
                    >
                      Last
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
