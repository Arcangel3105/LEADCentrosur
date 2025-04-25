import { useState } from "react";
import { MultiSelect } from "./MultiSelect";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Search } from "lucide-react";
import { REGIONS, BUSINESS_TYPES } from "@/lib/constants";

interface SearchFormProps {
  onSearch: (regions: string[], businessTypes: string[]) => void;
  isSearching: boolean;
}

export function SearchForm({ onSearch, isSearching }: SearchFormProps) {
  const [selectedRegions, setSelectedRegions] = useState<string[]>([]);
  const [selectedBusinessTypes, setSelectedBusinessTypes] = useState<string[]>([]);

  const handleSearch = () => {
    if (selectedRegions.length > 0 && selectedBusinessTypes.length > 0) {
      onSearch(selectedRegions, selectedBusinessTypes);
    }
  };

  const isFormValid = selectedRegions.length > 0 && selectedBusinessTypes.length > 0;

  // Build selection summary text
  const getSummaryText = () => {
    if (selectedRegions.length === 0 && selectedBusinessTypes.length === 0) {
      return "No selection made";
    }

    let summary = "";
    if (selectedRegions.length > 0) {
      summary += `${selectedRegions.length} region${selectedRegions.length > 1 ? "s" : ""}`;
    }

    if (selectedBusinessTypes.length > 0) {
      if (summary) summary += " and ";
      summary += `${selectedBusinessTypes.length} business type${
        selectedBusinessTypes.length > 1 ? "s" : ""
      }`;
    }

    return summary + " selected";
  };

  return (
    <Card className="bg-white mb-8">
      <CardContent className="pt-6">
        <h2 className="text-xl font-semibold mb-5">Search Criteria</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <MultiSelect
            options={REGIONS}
            label="Regions"
            placeholder="Select regions..."
            selectedValues={selectedRegions}
            onSelectionChange={setSelectedRegions}
          />

          <MultiSelect
            options={BUSINESS_TYPES}
            label="Business Types"
            placeholder="Select business types..."
            selectedValues={selectedBusinessTypes}
            onSelectionChange={setSelectedBusinessTypes}
          />
        </div>

        <div className="mt-8 flex flex-col sm:flex-row justify-between items-center">
          <div className="mb-4 sm:mb-0">
            <span className="text-sm text-gray-600">{getSummaryText()}</span>
          </div>
          <Button
            disabled={!isFormValid || isSearching}
            onClick={handleSearch}
            className="w-full sm:w-auto"
          >
            {isSearching ? (
              <>
                <span className="mr-2">Searching...</span>
                <span className="animate-spin">⟳</span>
              </>
            ) : (
              <>
                <span>Search for Leads</span>
                <Search className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
