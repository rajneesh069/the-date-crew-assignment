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
          <div className="flex items-center justify-between px-4 py-3 sm:px-6 sm:py-4">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="flex items-center space-x-1 sm:space-x-2">
                <Heart className="h-5 w-5 text-amber-600 sm:h-6 sm:w-6" />
                <Users className="h-5 w-5 text-amber-500 sm:h-6 sm:w-6" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-gray-900 sm:text-xl">
                  Profile
                </h1>
              </div>
            </div>
            <Link href={"https://thedatecrew.com"}>
              <Button className="flex items-center space-x-1 bg-amber-600 px-3 py-2 text-white hover:bg-amber-700 sm:px-4">
                <Heart className="h-4 w-4" />
                <span className="xs:inline hidden sm:inline">Match</span>
              </Button>
            </Link>
          </div>
        </header>

        <div className="mx-auto max-w-6xl p-4 sm:p-6">
          <Card className="mb-4 border-amber-200 bg-white/80 backdrop-blur-sm sm:mb-6">
            <CardContent className="p-4 sm:p-6">
              <div className="flex flex-col items-start space-y-4 sm:flex-row sm:space-y-0 sm:space-x-6">
                <div className="flex w-full flex-col items-center space-y-4 sm:w-auto sm:flex-row sm:items-start sm:space-y-0 sm:space-x-4">
                  <Avatar className="h-20 w-20 sm:h-24 sm:w-24">
                    <AvatarImage src={customer?.avatar ?? ""} />
                    <AvatarFallback className="bg-amber-100 text-lg font-medium text-amber-700 sm:text-xl">
                      {customer?.firstName[0]}
                      {customer?.lastName[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 text-center sm:text-left">
                    <div className="mb-2 flex flex-col space-y-2 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
                      <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">
                        {customer?.firstName} {customer?.lastName}
                      </h2>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center justify-center space-x-2 sm:justify-start">
                        <Calendar className="h-4 w-4" />
                        <span className="text-sm sm:text-base">
                          {age} years old
                        </span>
                      </div>
                      <div className="flex items-center justify-center space-x-2 sm:justify-start">
                        <MapPin className="h-4 w-4" />
                        <span className="text-sm sm:text-base">
                          {customer?.city}, {customer?.country}
                        </span>
                      </div>
                    </div>
                    {customer?.bio && (
                      <p className="mt-3 text-center text-sm text-gray-600 sm:mt-4 sm:text-left">
                        {customer?.bio}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-2">
            <Card className="border-amber-200 bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-3 sm:pb-6">
                <CardTitle className="flex items-center space-x-2 text-base sm:text-lg">
                  <Users className="h-4 w-4 text-amber-600 sm:h-5 sm:w-5" />
                  <span>Personal Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pt-0">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
                  <div>
                    <label className="text-xs font-medium text-gray-600 sm:text-sm">
                      Gender
                    </label>
                    <p className="text-sm font-medium">{customer?.gender}</p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-600 sm:text-sm">
                      Height
                    </label>
                    <p className="text-sm font-medium">{customer?.height} cm</p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-600 sm:text-sm">
                      Date of Birth
                    </label>
                    <p className="text-sm font-medium">
                      {new Date(
                        customer?.dateOfBirth ?? "",
                      ).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-600 sm:text-sm">
                      Marital Status
                    </label>
                    <p className="text-sm font-medium">
                      {customer?.maritalStatus === "NeverMarried"
                        ? "Never Married"
                        : "Divorced"}
                    </p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-600 sm:text-sm">
                      Siblings
                    </label>
                    <p className="text-sm font-medium">{customer?.siblings}</p>
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-xs font-medium text-gray-600 sm:text-sm">
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
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
                  <div>
                    <label className="text-xs font-medium text-gray-600 sm:text-sm">
                      Religion
                    </label>
                    <p className="text-sm font-medium">{customer?.religion}</p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-600 sm:text-sm">
                      Caste
                    </label>
                    <p className="text-sm font-medium">{customer?.caste}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-amber-200 bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-3 sm:pb-6">
                <CardTitle className="flex items-center space-x-2 text-base sm:text-lg">
                  <Briefcase className="h-4 w-4 text-amber-600 sm:h-5 sm:w-5" />
                  <span>Professional Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pt-0">
                <div className="grid grid-cols-1 gap-3 sm:gap-4">
                  <div>
                    <label className="text-xs font-medium text-gray-600 sm:text-sm">
                      Current Company
                    </label>
                    <p className="text-sm font-medium break-words">
                      {customer?.company}
                    </p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-600 sm:text-sm">
                      Designation
                    </label>
                    <p className="text-sm font-medium break-words">
                      {customer?.designation}
                    </p>
                  </div>
                </div>
                <Separator className="bg-amber-200" />
                <div className="grid grid-cols-1 gap-3 sm:gap-4">
                  <div>
                    <label className="flex items-center space-x-1 text-xs font-medium text-gray-600 sm:text-sm">
                      <GraduationCap className="h-3 w-3 sm:h-4 sm:w-4" />
                      <span>Education</span>
                    </label>
                    <p className="text-sm font-medium break-words">
                      {customer?.degree}
                    </p>
                    <p className="text-xs break-words text-gray-600">
                      {customer?.college}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-amber-200 bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-3 sm:pb-6">
                <CardTitle className="flex items-center space-x-2 text-base sm:text-lg">
                  <Heart className="h-4 w-4 text-amber-600 sm:h-5 sm:w-5" />
                  <span>Preferences</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 pt-0 sm:space-y-4">
                <div className="grid grid-cols-1 gap-3 sm:gap-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Baby className="h-3 w-3 text-gray-600 sm:h-4 sm:w-4" />
                      <label className="text-xs font-medium text-gray-600 sm:text-sm">
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
                      <Globe className="h-3 w-3 text-gray-600 sm:h-4 sm:w-4" />
                      <label className="text-xs font-medium text-gray-600 sm:text-sm">
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
                      <PawPrint className="h-3 w-3 text-gray-600 sm:h-4 sm:w-4" />
                      <label className="text-xs font-medium text-gray-600 sm:text-sm">
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
              <CardHeader className="pb-3 sm:pb-6">
                <CardTitle className="flex items-center space-x-2 text-base sm:text-lg">
                  <Calendar className="h-4 w-4 text-amber-600 sm:h-5 sm:w-5" />
                  <span>Activity Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 pt-0 sm:space-y-4">
                <div className="grid grid-cols-1 gap-3 sm:gap-4">
                  <div>
                    <label className="text-xs font-medium text-gray-600 sm:text-sm">
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
