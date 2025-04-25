export function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      <p className="mt-4 text-gray-600">Searching for business leads...</p>
      <p className="text-sm text-gray-500 mt-1">This may take a moment</p>
    </div>
  );
}
