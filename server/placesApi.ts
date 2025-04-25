import axios from "axios";
import { BUSINESS_TYPE_QUERIES, REGION_MAPPINGS } from "@/lib/constants";
import { InsertBusinessLead } from "@shared/schema";

const GOOGLE_PLACES_API_KEY = process.env.GOOGLE_PLACES_API_KEY || "";

interface PlaceDetails {
  name: string;
  website?: string;
  formatted_phone_number?: string;
  international_phone_number?: string;
}

export async function searchBusinesses(region: string, businessType: string): Promise<InsertBusinessLead[]> {
  const regionQuery = REGION_MAPPINGS[region] || region;
  const typeQuery = BUSINESS_TYPE_QUERIES[businessType] || businessType;
  
  try {
    // Step 1: First call - Text Search to find places
    const searchQuery = `${typeQuery} in ${regionQuery}`;
    const textSearchUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json`;
    const searchResponse = await axios.get(textSearchUrl, {
      params: {
        query: searchQuery,
        key: GOOGLE_PLACES_API_KEY,
      },
    });

    const places = searchResponse.data.results || [];
    const businessLeads: InsertBusinessLead[] = [];

    // Step 2: Get details for each place to get website and phone
    for (const place of places.slice(0, 10)) { // Limit to 10 places to avoid rate limiting
      try {
        const placeId = place.place_id;
        const detailsUrl = `https://maps.googleapis.com/maps/api/place/details/json`;
        const detailsResponse = await axios.get(detailsUrl, {
          params: {
            place_id: placeId,
            fields: "name,website,formatted_phone_number,international_phone_number",
            key: GOOGLE_PLACES_API_KEY,
          },
        });

        const details: PlaceDetails = detailsResponse.data.result || {};
        
        businessLeads.push({
          name: details.name || place.name,
          website: details.website || "",
          phone: details.formatted_phone_number || details.international_phone_number || "",
          region,
          type: businessType,
        });
      } catch (detailsError) {
        console.error(`Error fetching details for place ${place.name}:`, detailsError);
        // Still add the place with limited info
        businessLeads.push({
          name: place.name,
          website: "",
          phone: "",
          region,
          type: businessType,
        });
      }
      
      // Add a small delay to avoid hitting rate limits
      await new Promise((resolve) => setTimeout(resolve, 200));
    }

    return businessLeads;
  } catch (error) {
    console.error("Error searching businesses:", error);
    throw new Error("Failed to search for businesses");
  }
}
