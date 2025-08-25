"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
  ChevronLeft,
  ChevronRight,
  Loader2,
  Eye,
} from "lucide-react";
import { api } from "@/trpc/react";

const statusColors = {
  matched: "bg-green-100 text-green-800 border-green-200",
  unmatched: "bg-purple-100 text-purple-800 border-purple-200",
  paused: "bg-gray-100 text-gray-800 border-gray-200",
};

export default function FindMatchesPage() {
  const { customerId } = useParams<{ customerId: string }>();
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;

  const {
    data: matchData,
    isLoading,
    error,
  } = api.match.findMatch.useQuery({
    customerId,
    currentPage,
    pageSize,
  });

  console.log(matchData);

  const calculateAge = (dateOfBirth: string) => {
    return new Date().getFullYear() - new Date(dateOfBirth).getFullYear();
  };

  const handleViewProfile = (partnerId: string) => {
    router.push(`/client/match/${customerId}?partnerId=${partnerId}`);
  };

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-amber-50 to-orange-50">
        <Card className="border-red-200 bg-white/80 backdrop-blur-sm">
          <CardContent className="p-6 text-center">
            <p className="text-red-600">
              Error loading matches: {error.message}
            </p>
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
              Find Matches
            </h1>
          </div>
          {matchData && (
            <Badge className="border-amber-200 bg-amber-100 text-amber-800">
              {matchData.partners.length} matches found
            </Badge>
          )}
        </div>
      </header>

      <div className="mx-auto max-w-7xl p-4 md:p-6">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-amber-600" />
            <span className="ml-2 text-amber-700">Finding matches...</span>
          </div>
        ) : matchData?.partners.length === 0 ? (
          <Card className="border-amber-200 bg-white/80 backdrop-blur-sm">
            <CardContent className="p-8 text-center">
              <Heart className="mx-auto mb-4 h-12 w-12 text-amber-400" />
              <h3 className="mb-2 text-lg font-semibold text-gray-900">
                No matches found
              </h3>
              <p className="text-gray-600">
                We couldn&apos;t find any matches based on the current criteria.
                Try adjusting the preferences.
              </p>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-4 md:gap-6 lg:grid-cols-2 xl:grid-cols-3">
              {matchData?.partners.map((partner) => (
                <Card
                  key={partner.id}
                  className="border-amber-200 bg-white/80 backdrop-blur-sm transition-shadow hover:shadow-lg"
                >
                  <CardContent className="p-4 md:p-6">
                    <div className="flex items-start space-x-4">
                      <Avatar className="h-16 w-16 md:h-20 md:w-20">
                        <AvatarImage src={partner.avatar ?? ""} />
                        <AvatarFallback className="bg-amber-100 font-medium text-amber-700">
                          {partner.firstName[0]}
                          {partner.lastName[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0 flex-1">
                        <div className="mb-2 flex items-center justify-between">
                          <h3 className="truncate font-semibold text-gray-900">
                            {partner.firstName} {partner.lastName}
                          </h3>
                          <Badge
                            className={
                              statusColors[partner.accountStatus ?? "unmatched"]
                            }
                          >
                            {partner.accountStatus}
                          </Badge>
                        </div>
                        <div className="space-y-1 text-sm text-gray-600">
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-3 w-3" />
                            <span>
                              {calculateAge(partner.dateOfBirth.toString())}{" "}
                              years
                            </span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <MapPin className="h-3 w-3" />
                            <span className="truncate">
                              {partner.city}, {partner.country}
                            </span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Briefcase className="h-3 w-3" />
                            <span className="truncate">
                              {partner.designation}
                            </span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <GraduationCap className="h-3 w-3" />
                            <span className="truncate">{partner.degree}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <Separator className="my-4 bg-amber-200" />

                    <div className="space-y-2">
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-600">Height:</span>
                        <span className="font-medium">{partner.height} cm</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-600">Religion:</span>
                        <span className="truncate font-medium">
                          {partner.religion}
                        </span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-600">Income:</span>
                        <span className="font-medium">₹{partner.income}</span>
                      </div>
                    </div>

                    <div className="mt-4">
                      <Button
                        size="sm"
                        onClick={() => handleViewProfile(partner.id)}
                        className="w-full bg-amber-600 text-white hover:bg-amber-700"
                      >
                        <Eye className="mr-2 h-3 w-3" />
                        View Profile
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Pagination */}
            {matchData && matchData.totalPages > 1 && (
              <div className="mt-8 flex items-center justify-center space-x-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(1, prev - 1))
                  }
                  disabled={!matchData.hasPreviousPage}
                  className="border-amber-300 text-amber-700 hover:bg-amber-50"
                >
                  <ChevronLeft className="mr-1 h-4 w-4" />
                  Previous
                </Button>

                <div className="flex items-center space-x-2">
                  {Array.from(
                    { length: Math.min(5, matchData.totalPages) },
                    (_, i) => {
                      const pageNum = i + 1;
                      return (
                        <Button
                          key={pageNum}
                          variant={
                            currentPage === pageNum ? "default" : "outline"
                          }
                          size="sm"
                          onClick={() => setCurrentPage(pageNum)}
                          className={
                            currentPage === pageNum
                              ? "bg-amber-600 hover:bg-amber-700"
                              : "border-amber-300 text-amber-700 hover:bg-amber-50"
                          }
                        >
                          {pageNum}
                        </Button>
                      );
                    },
                  )}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setCurrentPage((prev) =>
                      Math.min(matchData.totalPages, prev + 1),
                    )
                  }
                  disabled={!matchData.hasNextPage}
                  className="border-amber-300 text-amber-700 hover:bg-amber-50"
                >
                  Next
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
