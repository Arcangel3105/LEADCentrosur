import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { SearchForm } from "@/components/SearchForm";
import { ResultsTable } from "@/components/ResultsTable";
import { useToast } from "@/hooks/use-toast";
import { BusinessLead } from "@/lib/types";

export default function Home() {
  const { toast } = useToast();
  const [results, setResults] = useState<BusinessLead[]>([]);
  const [showResults, setShowResults] = useState(false);

  const searchMutation = useMutation({
    mutationFn: async ({
      regions,
      businessTypes,
    }: {
      regions: string[];
      businessTypes: string[];
    }) => {
      const response = await apiRequest("POST", "/api/search", {
        regions,
        businessTypes,
      });
      return response.json();
    },
    onSuccess: (data) => {
      setResults(data);
      setShowResults(true);
      if (data.length === 0) {
        toast({
          title: "No results found",
          description: "Try adjusting your search criteria.",
          variant: "default",
        });
      } else {
        toast({
          title: "Search completed",
          description: `Found ${data.length} business leads.`,
          variant: "default",
        });
      }
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to search for leads: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  const handleSearch = (regions: string[], businessTypes: string[]) => {
    searchMutation.mutate({ regions, businessTypes });
    if (!showResults) {
      setShowResults(true);
    }
  };

  const handleDownloadCsv = async () => {
    try {
      const response = await fetch("/api/download/csv", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ results }),
      });
      
      if (!response.ok) throw new Error("Failed to download CSV");
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "business_leads.csv";
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast({
        title: "Download successful",
        description: "CSV file has been downloaded.",
      });
    } catch (error) {
      toast({
        title: "Download failed",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive",
      });
    }
  };

  const handleDownloadExcel = async () => {
    try {
      const response = await fetch("/api/download/excel", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ results }),
      });
      
      if (!response.ok) throw new Error("Failed to download Excel file");
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "business_leads.xlsx";
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast({
        title: "Download successful",
        description: "Excel file has been downloaded.",
      });
    } catch (error) {
      toast({
        title: "Download failed",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-6">
      <header className="mb-8">
        <h1 className="text-2xl md:text-3xl font-semibold text-primary">
          Business Lead Generator
        </h1>
        <p className="text-neutral-800 mt-2">
          Find business leads across regions and sectors
        </p>
      </header>

      <main>
        <div className="bg-amber-50 border border-amber-200 rounded-md p-4 mb-6 shadow-sm">
          <h2 className="font-semibold text-amber-800 mb-1">API Status Notice</h2>
          <p className="text-sm text-amber-700">
            The SERPapi account has reached its search limit. The application is currently showing generated example data
            for demonstration purposes.
          </p>
        </div>
      
        <SearchForm
          onSearch={handleSearch}
          isSearching={searchMutation.isPending}
        />

        {showResults && (
          <ResultsTable
            results={results}
            isLoading={searchMutation.isPending}
            onDownloadCsv={handleDownloadCsv}
            onDownloadExcel={handleDownloadExcel}
          />
        )}
      </main>

      <footer className="text-center text-gray-500 text-sm mt-8">
        <p>© {new Date().getFullYear()} Business Lead Generator | Data provided by SERPapi</p>
      </footer>
    </div>
  );
}
