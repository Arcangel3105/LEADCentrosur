export const REGIONS = [
  "Andalusia",
  "Murcia",
  "Madrid",
  "Extremadura",
  "Valencia",
];

export const BUSINESS_TYPES = [
  "Hospitality equipment distributors",
  "Hospitality equipment installers",
  "Hospitality equipment technicians",
  "Large food service organizations",
  "Catering companies",
  "Franchises",
  "Kitchen or hospitality project planners",
];

// Map business types to search queries for the Google Places API
export const BUSINESS_TYPE_QUERIES: Record<string, string> = {
  "Hospitality equipment distributors": "hospitality equipment distributor store warehouse",
  "Hospitality equipment installers": "hospitality equipment installer",
  "Hospitality equipment technicians": "hospitality equipment technician",
  "Large food service organizations": "large food service organization",
  "Catering companies": "catering company",
  "Franchises": "hospitality franchise",
  "Kitchen or hospitality project planners": "kitchen hospitality project planner",
};

// Map regions to country subdivisions for the Google Places API
export const REGION_MAPPINGS: Record<string, string> = {
  "Andalusia": "andalusia spain",
  "Murcia": "murcia spain",
  "Madrid": "madrid spain",
  "Extremadura": "extremadura spain",
  "Valencia": "valencia spain",
};
