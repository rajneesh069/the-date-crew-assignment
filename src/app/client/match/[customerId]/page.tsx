"use client";

import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  Heart,
  Users,
  MapPin,
  Briefcase,
  GraduationCap,
  Calendar,
  Globe,
  Baby,
  PawPrint,
  Lightbulb,
  Mail,
  Loader2,
  CheckCircle,
} from "lucide-react";
import { api } from "@/trpc/react";
import { toast } from "sonner";

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

export default function MatchPage() {
  const { customerId } = useParams<{ customerId: string }>();
  const searchParams = useSearchParams();
  const partnerId = searchParams.get("partnerId");
  const router = useRouter();
  const [showInsights, setShowInsights] = useState(false);

  // Get partner profile data
  const { data: partner, isLoading: partnerLoading } =
    api.customer.getPublicProfile.useQuery(
      {
        customerId: partnerId!,
      },
      {
        enabled: !!partnerId,
      },
    );

  // Generate insights mutation
  const generateInsights = api.match.generateCompatibilityInsights.useMutation({
    onSuccess: () => {
      setShowInsights(true);
      toast.success("Compatibility insights generated!");
    },
    onError: (error) => {
      toast.error(`Failed to generate insights: ${error.message}`);
    },
  });

  // Send match emails mutation
  const sendMatch = api.match.sendMatches.useMutation({
    onSuccess: () => {
      toast.success("Match emails sent successfully!");
    },
    onError: (error) => {
      toast.error(`Failed to send match emails: ${error.message}`);
    },
  });

  const calculateAge = (dateOfBirth: string) => {
    return new Date().getFullYear() - new Date(dateOfBirth).getFullYear();
  };

  const handleGenerateInsights = () => {
    if (!partnerId) return;
    generateInsights.mutate({
      customerId,
      partnerId,
    });
  };

  const handleSendMatch = () => {
    if (!partnerId) return;
    sendMatch.mutate({
      customerId,
      partnerId,
    });
  };

  if (!partnerId) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-amber-50 to-orange-50">
        <Card className="border-red-200 bg-white/80 backdrop-blur-sm">
          <CardContent className="p-6 text-center">
            <p className="text-red-600">Partner ID is required</p>
            <Button
              onClick={() => router.back()}
              className="mt-4 bg-amber-600 hover:bg-amber-700"
            >
              Go Back
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (partnerLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-amber-50 to-orange-50">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-8 w-8 animate-spin text-amber-600" />
          <span className="text-amber-700">Loading profile...</span>
        </div>
      </div>
    );
  }

  if (!partner) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-amber-50 to-orange-50">
        <Card className="border-red-200 bg-white/80 backdrop-blur-sm">
          <CardContent className="p-6 text-center">
            <p className="text-red-600">Partner profile not found</p>
            <Button
              onClick={() => router.back()}
              className="mt-4 bg-amber-600 hover:bg-amber-700"
            >
              Go Back
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const age = calculateAge(partner.dateOfBirth.toString());

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50">
      <header className="border-b border-amber-200 bg-white/80 backdrop-blur-sm">
        <div className="flex items-center justify-between px-4 py-4 md:px-6">
          <div className="flex items-center space-x-2 md:space-x-3">
            <Button
              onClick={() => router.back()}
              variant="ghost"
              className="text-amber-700 hover:bg-amber-100"
              size="sm"
            >
              <ArrowLeft className="h-4 w-4 md:mr-2" />
              <span className="hidden sm:block">Back</span>
            </Button>
            <div className="flex items-center space-x-1 md:space-x-2">
              <Heart className="h-5 w-5 text-amber-600 md:h-6 md:w-6" />
              <Users className="h-5 w-5 text-amber-500 md:h-6 md:w-6" />
            </div>
            <h1 className="text-lg font-semibold text-gray-900 md:text-xl">
              Match Profile
            </h1>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              onClick={handleGenerateInsights}
              disabled={generateInsights.isPending}
              variant="outline"
              className="border-amber-300 bg-transparent text-amber-700 hover:bg-amber-50"
              size="sm"
            >
              {generateInsights.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Lightbulb className="h-4 w-4" />
              )}
              <span className="hidden sm:ml-2 sm:block">Insights</span>
            </Button>
            <Button
              onClick={handleSendMatch}
              disabled={sendMatch.isPending}
              className="bg-amber-600 text-white hover:bg-amber-700"
              size="sm"
            >
              {sendMatch.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : sendMatch.isSuccess ? (
                <CheckCircle className="h-4 w-4" />
              ) : (
                <Mail className="h-4 w-4" />
              )}
              <span className="hidden sm:ml-2 sm:block">
                {sendMatch.isSuccess ? "Sent!" : "Match"}
              </span>
            </Button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl p-4 md:p-6">
        {/* Compatibility Insights Card */}
        {showInsights && generateInsights.data && (
          <Card className="mb-6 border-amber-200 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Lightbulb className="h-5 w-5 text-amber-600" />
                <span>Compatibility Insights</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-sm max-w-none">
                <p className="whitespace-pre-wrap text-gray-700">
                  {generateInsights.data.insights}
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Partner Profile Card */}
        <Card className="mb-6 border-amber-200 bg-white/80 backdrop-blur-sm">
          <CardContent className="p-4 md:p-6">
            <div className="flex flex-col space-y-4 sm:flex-row sm:items-start sm:space-y-0 sm:space-x-6">
              <div className="flex justify-center sm:justify-start">
                <Avatar className="h-20 w-20 md:h-24 md:w-24">
                  <AvatarImage src={partner.avatar ?? ""} />
                  <AvatarFallback className="bg-amber-100 text-lg font-medium text-amber-700 md:text-xl">
                    {partner.firstName[0]}
                    {partner.lastName[0]}
                  </AvatarFallback>
                </Avatar>
              </div>
              <div className="flex-1 text-center sm:text-left">
                <div className="mb-2 flex flex-col items-center space-y-2 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
                  <h2 className="text-xl font-bold text-gray-900 md:text-2xl">
                    {partner.firstName} {partner.lastName}
                  </h2>
                  <Badge
                    className={
                      statusColors[partner.accountStatus ?? "unmatched"]
                    }
                  >
                    {partner.accountStatus?.charAt(0).toUpperCase() +
                      partner.accountStatus?.slice(1)}
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
                      {partner.city}, {partner.country}
                    </span>
                  </div>
                </div>
                {partner.bio && (
                  <p className="mt-4 text-sm text-gray-600">{partner.bio}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Profile Details Grid */}
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
                  <p className="text-sm font-medium">{partner.gender}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Height
                  </label>
                  <p className="text-sm font-medium">{partner.height} cm</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Date of Birth
                  </label>
                  <p className="text-sm font-medium">
                    {new Date(partner.dateOfBirth).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Marital Status
                  </label>
                  <p className="text-sm font-medium">
                    {partner.maritalStatus === "NeverMarried"
                      ? "Never Married"
                      : "Divorced"}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Siblings
                  </label>
                  <p className="text-sm font-medium">{partner.siblings}</p>
                </div>
                <div className="sm:col-span-2">
                  <label className="text-sm font-medium text-gray-600">
                    Languages
                  </label>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {partner.languages.map((lang) => (
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
                  <p className="text-sm font-medium">{partner.religion}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Caste
                  </label>
                  <p className="text-sm font-medium">{partner.caste}</p>
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
                    {partner.company}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Designation
                  </label>
                  <p className="text-sm font-medium break-words">
                    {partner.designation}
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
                  <p className="text-sm font-medium break-words">
                    {partner.degree}
                  </p>
                  <p className="text-xs break-words text-gray-600">
                    {partner.college}
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
                    className={preferenceColors[partner.wantKids ?? "Yes"]}
                  >
                    {partner.wantKids}
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
                      preferenceColors[partner.openToRelocate ?? "Yes"]
                    }
                  >
                    {partner.openToRelocate}
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
                    className={preferenceColors[partner.openToPets ?? "Yes"]}
                  >
                    {partner.openToPets}
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
                    {new Date(partner.joinDate).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Days Since Join
                  </label>
                  <p className="text-sm font-medium">
                    {Math.floor(
                      (new Date().getTime() -
                        new Date(partner.joinDate).getTime()) /
                        (1000 * 60 * 60 * 24),
                    )}{" "}
                    days
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
