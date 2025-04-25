import { businessLeads, type BusinessLead, type InsertBusinessLead } from "@shared/schema";
import { db } from "./db";
import { eq, and } from "drizzle-orm";

export interface IStorage {
  getBusinessLeads(region: string, type: string): Promise<BusinessLead[]>;
  saveBusinessLead(lead: InsertBusinessLead): Promise<BusinessLead>;
  saveBusinessLeads(leads: InsertBusinessLead[]): Promise<BusinessLead[]>;
}

export class DatabaseStorage implements IStorage {
  async getBusinessLeads(region: string, type: string): Promise<BusinessLead[]> {
    // Build filters conditionally
    const filters = [];
    
    if (region !== "") {
      filters.push(eq(businessLeads.region, region));
    }
    
    if (type !== "") {
      filters.push(eq(businessLeads.type, type));
    }
    
    // Apply filters if there are any
    if (filters.length > 0) {
      return db.select().from(businessLeads).where(filters.length > 1 ? and(...filters) : filters[0]);
    } else {
      // No filters, return all
      return db.select().from(businessLeads);
    }
  }

  async saveBusinessLead(lead: InsertBusinessLead): Promise<BusinessLead> {
    const [savedLead] = await db
      .insert(businessLeads)
      .values(lead)
      .returning();
    
    return savedLead;
  }

  async saveBusinessLeads(leads: InsertBusinessLead[]): Promise<BusinessLead[]> {
    if (leads.length === 0) {
      return [];
    }
    
    const savedLeads = await db
      .insert(businessLeads)
      .values(leads)
      .returning();
    
    return savedLeads;
  }
}

export const storage = new DatabaseStorage();
