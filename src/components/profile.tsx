"use client";

import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  Heart,
  Users,
  MapPin,
  Briefcase,
  GraduationCap,
  Calendar,
  Globe,
  Baby,
  PawPrint,
} from "lucide-react";
import { api } from "@/trpc/react";
import { LoaderOverlay } from "./ui/loader";
import { Button } from "./ui/button";
import Link from "next/link";

const statusColors = {
  matched: "bg-green-100 text-green-800 border-green-200",
  unmatched: "bg-purple-100 text-purple-800 border-purple-200",
  paused: "bg-gray-100 text-gray-800 border-gray-200",
};

const preferenceColors = {
  Yes: "bg-green-100 text-green-800 border-green-200",
  No: "bg-red-100 text-red-800 border-red-200",
  Maybe: "bg-yellow-100 text-yellow-800 border-yellow-200",
};

export function CustomerPublicProfile() {
  const { id } = useParams<{ id: string }>();
  const { data: customer, isLoading } = api.customer.getPublicProfile.useQuery({
    customerId: id,
  });

  const age =
    new Date().getFullYear() -
    new Date(customer?.dateOfBirth ?? "").getFullYear();

  return (
    <LoaderOverlay isLoading={isLoading}>
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50">
        <header className="border-b border-amber-200 bg-white/80 backdrop-blur-sm">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <Heart className="h-6 w-6 text-amber-600" />
                <Users className="h-6 w-6 text-amber-500" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Profile</h1>
              </div>
            </div>
            <Link href={"https://thedatecrew.com"}>
              <Button className="flex items-center space-x-0 bg-amber-600 text-white hover:bg-amber-700">
                <Heart className="h-4 w-4" />
                <span>Match</span>
              </Button>
            </Link>
          </div>
        </header>

        <div className="mx-auto max-w-6xl p-6">
          <Card className="mb-6 border-amber-200 bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-start space-x-6">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={customer?.avatar ?? ""} />
                  <AvatarFallback className="bg-amber-100 text-xl font-medium text-amber-700">
                    {customer?.firstName[0]}
                    {customer?.lastName[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="mb-2 flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-gray-900">
                      {customer?.firstName} {customer?.lastName}
                    </h2>
                    <Badge
                      className={
                        statusColors[customer?.accountStatus ?? "unmatched"]
                      }
                    >
                      {customer?.accountStatus.charAt(0).toUpperCase() ??
                        "" + customer?.accountStatus.slice(1)}
                    </Badge>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4" />
                      <span>{age} years old</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4" />
                      <span>
                        {customer?.city}, {customer?.country}
                      </span>
                    </div>
                  </div>
                  {customer?.bio && (
                    <p className="mt-4 text-sm text-gray-600">
                      {customer?.bio}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <Card className="border-amber-200 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="h-5 w-5 text-amber-600" />
                  <span>Personal Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Gender
                    </label>
                    <p className="text-sm font-medium">{customer?.gender}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Height
                    </label>
                    <p className="text-sm font-medium">{customer?.height} cm</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Date of Birth
                    </label>
                    <p className="text-sm font-medium">
                      {new Date(
                        customer?.dateOfBirth ?? "",
                      ).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Marital Status
                    </label>
                    <p className="text-sm font-medium">
                      {customer?.maritalStatus === "NeverMarried"
                        ? "Never Married"
                        : "Divorced"}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Siblings
                    </label>
                    <p className="text-sm font-medium">{customer?.siblings}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Languages
                    </label>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {customer?.languages.map((lang) => (
                        <Badge
                          key={lang}
                          variant="secondary"
                          className="bg-amber-100 text-xs text-amber-800"
                        >
                          {lang}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
                <Separator className="bg-amber-200" />
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Religion
                    </label>
                    <p className="text-sm font-medium">{customer?.religion}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Caste
                    </label>
                    <p className="text-sm font-medium">{customer?.caste}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-amber-200 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Briefcase className="h-5 w-5 text-amber-600" />
                  <span>Professional Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Current Company
                    </label>
                    <p className="text-sm font-medium">{customer?.company}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Designation
                    </label>
                    <p className="text-sm font-medium">
                      {customer?.designation}
                    </p>
                  </div>
                </div>
                <Separator className="bg-amber-200" />
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="flex items-center space-x-1 text-sm font-medium text-gray-600">
                      <GraduationCap className="h-4 w-4" />
                      <span>Education</span>
                    </label>
                    <p className="text-sm font-medium">{customer?.degree}</p>
                    <p className="text-xs text-gray-600">{customer?.college}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-amber-200 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Heart className="h-5 w-5 text-amber-600" />
                  <span>Preferences</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Baby className="h-4 w-4 text-gray-600" />
                      <label className="text-sm font-medium text-gray-600">
                        Want Kids
                      </label>
                    </div>
                    <Badge
                      className={preferenceColors[customer?.wantKids ?? "Yes"]}
                    >
                      {customer?.wantKids}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Globe className="h-4 w-4 text-gray-600" />
                      <label className="text-sm font-medium text-gray-600">
                        Open to Relocate
                      </label>
                    </div>
                    <Badge
                      className={
                        preferenceColors[customer?.openToRelocate ?? "Yes"]
                      }
                    >
                      {customer?.openToRelocate}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <PawPrint className="h-4 w-4 text-gray-600" />
                      <label className="text-sm font-medium text-gray-600">
                        Open to Pets
                      </label>
                    </div>
                    <Badge
                      className={
                        preferenceColors[customer?.openToPets ?? "Yes"]
                      }
                    >
                      {customer?.openToPets}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-amber-200 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5 text-amber-600" />
                  <span>Activity Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Join Date
                    </label>
                    <p className="text-sm font-medium">
                      {new Date(customer?.joinDate ?? "").toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </LoaderOverlay>
  );
}
