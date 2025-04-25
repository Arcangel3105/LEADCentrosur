import { pgTable, text, serial, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const businessLeads = pgTable("business_leads", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  website: text("website"),
  phone: text("phone"),
  region: text("region").notNull(),
  type: text("type").notNull(),
});

export const insertBusinessLeadSchema = createInsertSchema(businessLeads).omit({
  id: true,
});

export type InsertBusinessLead = z.infer<typeof insertBusinessLeadSchema>;
export type BusinessLead = typeof businessLeads.$inferSelect;

export const searchParamsSchema = z.object({
  regions: z.array(z.string()).min(1, "At least one region must be selected"),
  businessTypes: z.array(z.string()).min(1, "At least one business type must be selected"),
});

export type SearchParams = z.infer<typeof searchParamsSchema>;
