import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowDownAZ, ArrowUpZA } from "lucide-react";
import { CsvIcon } from "./CsvIcon";
import { ExcelIcon } from "./ExcelIcon";
import { useToast } from "@/hooks/use-toast";
import { BusinessLead } from "@/lib/types";
import { LoadingSpinner } from "./LoadingSpinner";
import { NoResults } from "./NoResults";

interface ResultsTableProps {
  results: BusinessLead[];
  isLoading: boolean;
  onDownloadCsv: () => void;
  onDownloadExcel: () => void;
}

type SortDirection = "asc" | "desc";
type SortField = "name" | "website" | "phone" | "region" | "type";

export function ResultsTable({
  results,
  isLoading,
  onDownloadCsv,
  onDownloadExcel,
}: ResultsTableProps) {
  const { toast } = useToast();
  const [sortField, setSortField] = useState<SortField>("name");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const sortedResults = [...results].sort((a, b) => {
    const aValue = a[sortField] || "";
    const bValue = b[sortField] || "";
    
    if (sortDirection === "asc") {
      return aValue.localeCompare(bValue);
    } else {
      return bValue.localeCompare(aValue);
    }
  });

  return (
    <Card className="bg-white mb-8">
      <CardContent className="pt-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-5">
          <h2 className="text-xl font-semibold">Search Results</h2>
          <div className="mt-3 md:mt-0">
            <span className="text-sm text-gray-600 mr-4">
              {results.length} result{results.length !== 1 ? "s" : ""} found
            </span>
            <div className="inline-flex rounded-md shadow-sm mt-2 md:mt-0">
              <Button
                variant="outline"
                className="rounded-r-none border-primary text-primary"
                onClick={onDownloadCsv}
                disabled={results.length === 0}
              >
                <CsvIcon className="mr-2 h-4 w-4" />
                <span>CSV</span>
              </Button>
              <Button
                variant="outline"
                className="rounded-l-none border-primary border-l-0 text-primary"
                onClick={onDownloadExcel}
                disabled={results.length === 0}
              >
                <ExcelIcon className="mr-2 h-4 w-4" />
                <span>Excel</span>
              </Button>
            </div>
          </div>
        </div>

        {isLoading ? (
          <LoadingSpinner />
        ) : results.length === 0 ? (
          <NoResults />
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead
                    className="cursor-pointer"
                    onClick={() => handleSort("name")}
                  >
                    <div className="flex items-center">
                      Business Name
                      {sortField === "name" && (
                        sortDirection === "asc" ? (
                          <ArrowDownAZ className="ml-1 h-4 w-4" />
                        ) : (
                          <ArrowUpZA className="ml-1 h-4 w-4" />
                        )
                      )}
                    </div>
                  </TableHead>
                  <TableHead>Website</TableHead>
                  <TableHead>Phone Number</TableHead>
                  <TableHead>Region</TableHead>
                  <TableHead>Business Type</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedResults.map((result, index) => (
                  <TableRow key={index} className="hover:bg-gray-50">
                    <TableCell className="font-medium">
                      {result.name}
                    </TableCell>
                    <TableCell>
                      {result.website ? (
                        <a
                          href={result.website.startsWith("http") ? result.website : `https://${result.website}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline"
                        >
                          {result.website}
                        </a>
                      ) : (
                        <span className="text-gray-400">Not available</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {result.phone || (
                        <span className="text-gray-400">Not available</span>
                      )}
                    </TableCell>
                    <TableCell>{result.region}</TableCell>
                    <TableCell>{result.type}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
