"use client";

import { useState } from "react";
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
} from "lucide-react";
import { getCustomerProfiles } from "@/lib/dummy-profiles";

interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  age: number;
  city: string;
  maritalStatus: string;
  status: "new" | "active" | "matched" | "paused";
  avatar?: string;
  joinDate: string;
  lastActivity: string;
}

const statusColors = {
  new: "bg-blue-100 text-blue-800 border-blue-200",
  active: "bg-green-100 text-green-800 border-green-200",
  matched: "bg-purple-100 text-purple-800 border-purple-200",
  paused: "bg-gray-100 text-gray-800 border-gray-200",
};

export function Dashboard() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(6);

  const allProfiles = getCustomerProfiles();
  const customers: Customer[] = allProfiles.map((profile) => ({
    id: profile.id,
    firstName: profile.firstName,
    lastName: profile.lastName,
    age: new Date().getFullYear() - new Date(profile.dateOfBirth).getFullYear(),
    city: profile.city,
    maritalStatus: profile.maritalStatus,
    status: profile.status,
    avatar: profile.avatar,
    joinDate: profile.joinDate,
    lastActivity: profile.lastActivity,
  }));

  const filteredCustomers = customers.filter((customer) => {
    const matchesSearch =
      `${customer.firstName} ${customer.lastName}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      customer.city.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || customer.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedCustomers = filteredCustomers.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  const handlePageChange = (page: number) => {
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

  return (
    <div className="bg-background min-h-screen">
      {/* Header */}
      <header className="border-border bg-card border-b">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <Heart className="text-primary h-6 w-6" />
              <Users className="text-secondary h-6 w-6" />
            </div>
            <div>
              <h1 className="gradient-text text-xl font-semibold">
                TDC Matchmaker
              </h1>
              <p className="text-muted-foreground text-sm">Dashboard</p>
            </div>
          </div>
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
                    {customers.length}
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
                  <p className="text-muted-foreground text-sm">Active</p>
                  <p className="text-2xl font-bold text-green-600">
                    {customers.filter((c) => c.status === "active").length}
                  </p>
                </div>
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100">
                  <div className="h-3 w-3 rounded-full bg-green-600"></div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">Matched</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {customers.filter((c) => c.status === "matched").length}
                  </p>
                </div>
                <Heart className="h-8 w-8 text-purple-600/60" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">New</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {customers.filter((c) => c.status === "new").length}
                  </p>
                </div>
                <Plus className="h-8 w-8 text-blue-600/60" />
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
              {filteredCustomers.length} of {customers.length} customers
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-6 flex items-center space-x-4">
              <div className="relative flex-1">
                <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform" />
                <Input
                  placeholder="Search customers by name or city..."
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
                  <SelectItem value="new">New</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="matched">Matched</SelectItem>
                  <SelectItem value="paused">Paused</SelectItem>
                </SelectContent>
              </Select>
              <Link href="/client/add-customer">
                <Button className="flex items-center space-x-2">
                  <Plus className="h-4 w-4" />
                  <span>Add Customer</span>
                </Button>
              </Link>
            </div>

            {/* Customer List */}
            <div className="mb-6 flex flex-col gap-2">
              {paginatedCustomers.map((customer) => (
                <Link
                  key={customer.id}
                  href={`/client/customer/${customer.id}`}
                >
                  <div className="border-border hover:bg-muted/50 card-hover flex cursor-pointer items-center justify-between rounded-lg border p-4 transition-colors">
                    <div className="flex items-center space-x-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage
                          src={customer.avatar ?? "/placeholder.svg"}
                        />
                        <AvatarFallback className="bg-primary/10 text-primary font-medium">
                          {customer.firstName[0]}
                          {customer.lastName[0]}
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
                          {new Date(customer.joinDate).toLocaleDateString()} •
                          Last active:{" "}
                          {new Date(customer.lastActivity).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Badge className={statusColors[customer.status]}>
                        {customer.status.charAt(0).toUpperCase() +
                          customer.status.slice(1)}
                      </Badge>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {totalPages >= 1 && (
              <div className="border-border border-t pt-4">
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <p className="text-muted-foreground text-sm">
                      Showing {startIndex + 1} to{" "}
                      {Math.min(
                        startIndex + itemsPerPage,
                        filteredCustomers.length,
                      )}{" "}
                      of {filteredCustomers.length} customers
                    </p>
                    <div className="flex items-center space-x-2">
                      <span className="text-muted-foreground text-sm">
                        Show:
                      </span>
                      <Select
                        value={itemsPerPage.toString()}
                        onValueChange={(value) => {
                          setItemsPerPage(Number(value));
                          setCurrentPage(1);
                        }}
                      >
                        <SelectTrigger className="h-8 w-20">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="6">6</SelectItem>
                          <SelectItem value="12">12</SelectItem>
                          <SelectItem value="24">24</SelectItem>
                          <SelectItem value="50">50</SelectItem>
                        </SelectContent>
                      </Select>
                      <span className="text-muted-foreground text-sm">
                        per page
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(1)}
                      disabled={currentPage === 1}
                      className="bg-transparent"
                    >
                      First
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="bg-transparent"
                    >
                      <ChevronLeft className="h-4 w-4" />
                      Previous
                    </Button>

                    <div className="flex items-center space-x-1">
                      {/* Show page numbers with ellipsis for large page counts */}
                      {(() => {
                        const pages = [];
                        const showPages = 5;
                        let startPage = Math.max(
                          1,
                          currentPage - Math.floor(showPages / 2),
                        );
                        const endPage = Math.min(
                          totalPages,
                          startPage + showPages - 1,
                        );

                        if (endPage - startPage < showPages - 1) {
                          startPage = Math.max(1, endPage - showPages + 1);
                        }

                        if (startPage > 1) {
                          pages.push(
                            <Button
                              key={1}
                              variant="outline"
                              size="sm"
                              onClick={() => handlePageChange(1)}
                              className="h-8 w-8 bg-transparent p-0"
                            >
                              1
                            </Button>,
                          );
                          if (startPage > 2) {
                            pages.push(
                              <span
                                key="ellipsis1"
                                className="text-muted-foreground"
                              >
                                ...
                              </span>,
                            );
                          }
                        }

                        for (let i = startPage; i <= endPage; i++) {
                          pages.push(
                            <Button
                              key={i}
                              variant={
                                currentPage === i ? "default" : "outline"
                              }
                              size="sm"
                              onClick={() => handlePageChange(i)}
                              className={`h-8 w-8 p-0 ${currentPage === i ? "" : "bg-transparent"}`}
                            >
                              {i}
                            </Button>,
                          );
                        }

                        if (endPage < totalPages) {
                          if (endPage < totalPages - 1) {
                            pages.push(
                              <span
                                key="ellipsis2"
                                className="text-muted-foreground"
                              >
                                ...
                              </span>,
                            );
                          }
                          pages.push(
                            <Button
                              key={totalPages}
                              variant="outline"
                              size="sm"
                              onClick={() => handlePageChange(totalPages)}
                              className="h-8 w-8 bg-transparent p-0"
                            >
                              {totalPages}
                            </Button>,
                          );
                        }

                        return pages;
                      })()}
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="bg-transparent"
                    >
                      Next
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(totalPages)}
                      disabled={currentPage === totalPages}
                      className="bg-transparent"
                    >
                      Last
                    </Button>
                  </div>
                </div>

                <div className="text-muted-foreground flex items-center justify-center space-x-2 text-sm">
                  <span>Go to page:</span>
                  <Input
                    type="number"
                    min={1}
                    max={totalPages}
                    value={currentPage}
                    onChange={(e) => {
                      const page = Number(e.target.value);
                      if (page >= 1 && page <= totalPages) {
                        handlePageChange(page);
                      }
                    }}
                    className="h-8 w-16 text-center"
                  />
                  <span>of {totalPages}</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
