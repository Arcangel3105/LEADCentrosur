import { Search } from "lucide-react";

export function NoResults() {
  return (
    <div className="py-12 text-center">
      <div className="mx-auto w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-4">
        <Search className="h-6 w-6 text-gray-400" />
      </div>
      <p className="text-gray-600">No results found for your search criteria.</p>
      <p className="text-sm text-gray-500 mt-1">
        Try adjusting your filters or selecting different regions.
      </p>
    </div>
  );
}
