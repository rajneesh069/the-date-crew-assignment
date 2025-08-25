"use client";

import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  Heart,
  Users,
  Phone,
  MapPin,
  Briefcase,
  GraduationCap,
  Calendar,
  Globe,
  Baby,
  PawPrint,
  IndianRupee,
  MailIcon,
} from "lucide-react";
import Link from "next/link";
import { api } from "@/trpc/react";
import { LoaderOverlay } from "../ui/loader";
import { useRouter } from "next/navigation";

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

export function CustomerProfile() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const { data: customer, isLoading } = api.customer.getCustomer.useQuery({
    customerId: id,
  });

  const age =
    new Date().getFullYear() -
    new Date(customer?.dateOfBirth ?? "").getFullYear();

  const handleFindMatches = () => {
    router.push(`/client/matches/${customer?.id}`);
  };

  return (
    <LoaderOverlay isLoading={isLoading}>
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50">
        <header className="border-b border-amber-200 bg-white/80 backdrop-blur-sm">
          <div className="flex items-center justify-between px-4 py-4 md:px-6">
            <div className="flex items-center space-x-2 md:space-x-3">
              <Link href={"/client"}>
                <Button
                  variant="ghost"
                  className="text-amber-700 hover:bg-amber-100"
                  size="sm"
                >
                  <ArrowLeft className="h-4 w-4 md:mr-2" />
                  <span className="hidden sm:block">Back to Dashboard</span>
                </Button>
              </Link>
              <div className="flex items-center space-x-1 md:space-x-2">
                <Heart className="hidden h-5 w-5 text-amber-600 md:h-6 md:w-6" />
                <Users className="hidden h-5 w-5 text-amber-500 sm:block md:h-6 md:w-6" />
              </div>
              <h1 className="text-lg font-semibold text-gray-900 md:text-xl">
                Customer Profile
              </h1>
              <p className="hidden text-xs text-gray-600 md:text-sm">
                Detailed view
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Link href={`/profile/${customer?.id}`}>
                <Button
                  variant="outline"
                  className="border-amber-300 bg-transparent text-amber-700 hover:bg-amber-50"
                  size="sm"
                >
                  <Globe className="h-4 w-4 md:mr-2" />
                  <span className="hidden sm:block">Public Profile</span>
                </Button>
              </Link>
              <Button
                onClick={handleFindMatches}
                className="flex items-center bg-amber-600 text-white hover:bg-amber-700 md:space-x-2"
                size="sm"
              >
                <Heart className="h-4 w-4" />
                <span className="hidden sm:block">Find Matches</span>
              </Button>
            </div>
          </div>
        </header>

        <div className="mx-auto max-w-6xl p-4 md:p-6">
          <Card className="mb-4 border-amber-200 bg-white/80 backdrop-blur-sm md:mb-6">
            <CardContent className="p-4 md:p-6">
              <div className="flex flex-col space-y-4 sm:flex-row sm:items-start sm:space-y-0 sm:space-x-6">
                <div className="flex justify-center sm:justify-start">
                  <Avatar className="h-20 w-20 md:h-24 md:w-24">
                    <AvatarImage src={customer?.avatar ?? ""} />
                    <AvatarFallback className="bg-amber-100 text-lg font-medium text-amber-700 md:text-xl">
                      {customer?.firstName[0]}
                      {customer?.lastName[0]}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <div className="flex-1 text-center sm:text-left">
                  <div className="mb-2 flex flex-col items-center space-y-2 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
                    <h2 className="text-xl font-bold text-gray-900 md:text-2xl">
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
                  <div className="space-y-1 text-sm md:text-base">
                    <div className="flex items-center justify-center space-x-2 sm:justify-start">
                      <Calendar className="h-4 w-4" />
                      <span>{age} years old</span>
                    </div>
                    <div className="flex items-center justify-center space-x-2 sm:justify-start">
                      <MapPin className="h-4 w-4" />
                      <span>
                        {customer?.city}, {customer?.country}
                      </span>
                    </div>
                    <div className="flex items-center justify-center space-x-2 sm:justify-start">
                      <MailIcon className="h-4 w-4" />
                      <span className="break-all">{customer?.email}</span>
                    </div>
                    <div className="flex items-center justify-center space-x-2 sm:justify-start">
                      <Phone className="h-4 w-4" />
                      <span>{customer?.phone}</span>
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

          <div className="grid grid-cols-1 gap-4 md:gap-6 xl:grid-cols-2">
            <Card className="border-amber-200 bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center space-x-2 text-base md:text-lg">
                  <Users className="h-4 w-4 text-amber-600 md:h-5 md:w-5" />
                  <span>Personal Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
                  <div className="sm:col-span-2">
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
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center space-x-2 text-base md:text-lg">
                  <Briefcase className="h-4 w-4 text-amber-600 md:h-5 md:w-5" />
                  <span>Professional Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Current Company
                    </label>
                    <p className="text-sm font-medium break-words">
                      {customer?.company}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Designation
                    </label>
                    <p className="text-sm font-medium break-words">
                      {customer?.designation}
                    </p>
                  </div>
                  <div>
                    <label className="flex items-center space-x-1 text-sm font-medium text-gray-600">
                      <IndianRupee className="h-4 w-4" />
                      <span>Annual Income</span>
                    </label>
                    <p className="text-sm font-medium">{customer?.income}</p>
                  </div>
                </div>
                <Separator className="bg-amber-200" />
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="flex items-center space-x-1 text-sm font-medium text-gray-600">
                      <GraduationCap className="h-4 w-4" />
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
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center space-x-2 text-base md:text-lg">
                  <Heart className="h-4 w-4 text-amber-600 md:h-5 md:w-5" />
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

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Users className="h-4 w-4 text-gray-600" />
                      <label className="text-sm font-medium text-gray-600">
                        Importance of Caste in Partner
                      </label>
                    </div>
                    <Badge className="border-amber-200 bg-amber-100 text-amber-800">
                      {customer?.importanceOfCasteOfThePartner}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Users className="h-4 w-4 text-gray-600" />
                      <label className="text-sm font-medium text-gray-600">
                        Importance of Religion in Partner
                      </label>
                    </div>
                    <Badge className="border-amber-200 bg-amber-100 text-amber-800">
                      {customer?.importanceOfReligionOfThePartner}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-amber-200 bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center space-x-2 text-base md:text-lg">
                  <Calendar className="h-4 w-4 text-amber-600 md:h-5 md:w-5" />
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

                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Days Since Join
                    </label>
                    <p className="text-sm font-medium">
                      {Math.floor(
                        (new Date().getTime() -
                          new Date(customer?.joinDate ?? "").getTime()) /
                          (1000 * 60 * 60 * 24),
                      )}{" "}
                      days
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* <div className="mt-4 flex flex-col space-y-3 sm:flex-row sm:justify-center sm:space-y-0 sm:space-x-4 md:mt-6">
            <Button
              variant="outline"
              className="w-full border-amber-300 bg-transparent text-amber-700 hover:bg-amber-50 sm:w-auto"
            >
              <Mail className="mr-2 h-4 w-4" />
              Send Message
            </Button>
            <Button
              variant="outline"
              className="w-full border-amber-300 bg-transparent text-amber-700 hover:bg-amber-50 sm:w-auto"
            >
              <Phone className="mr-2 h-4 w-4" />
              Schedule Call
            </Button>
            <Button
              onClick={handleFindMatches}
              className="w-full bg-amber-600 text-white hover:bg-amber-700 sm:w-auto"
            >
              <Heart className="mr-2 h-4 w-4" />
              Find Matches
            </Button>
          </div> */}
        </div>
      </div>
    </LoaderOverlay>
  );
}
