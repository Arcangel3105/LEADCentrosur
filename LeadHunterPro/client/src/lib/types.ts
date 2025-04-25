export interface BusinessLead {
  name: string;
  website: string;
  phone: string;
  region: string;
  type: string;
}

export interface SearchParams {
  regions: string[];
  businessTypes: string[];
}

export interface PlaceResult {
  name: string;
  formatted_address?: string;
  website?: string;
  formatted_phone_number?: string;
  international_phone_number?: string;
}

export interface PlacesApiResponse {
  results: PlaceResult[];
  next_page_token?: string;
}
