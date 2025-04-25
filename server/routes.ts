import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { searchBusinesses } from "./serpApi";
import { searchParamsSchema } from "@shared/schema";
import { z } from "zod";
import * as csv from "csv-stringify/sync";
import * as xlsx from "xlsx";

export async function registerRoutes(app: Express): Promise<Server> {
  // Search for business leads
  app.post("/api/search", async (req: Request, res: Response) => {
    try {
      const validation = searchParamsSchema.safeParse(req.body);
      
      if (!validation.success) {
        return res.status(400).json({ 
          message: "Invalid search parameters", 
          errors: validation.error.errors 
        });
      }
      
      const { regions, businessTypes } = validation.data;
      
      // Collect all leads from various combinations
      const allLeads = [];
      
      for (const region of regions) {
        for (const businessType of businessTypes) {
          try {
            const leads = await searchBusinesses(region, businessType);
            allLeads.push(...leads);
          } catch (error) {
            console.error(`Error searching for ${businessType} in ${region}:`, error);
          }
        }
      }
      
      // Save leads to storage (optional)
      await storage.saveBusinessLeads(allLeads);
      
      return res.json(allLeads);
    } catch (error) {
      console.error("Error in search endpoint:", error);
      return res.status(500).json({ message: "Failed to search for leads" });
    }
  });
  
  // Download as CSV
  app.post("/api/download/csv", (req: Request, res: Response) => {
    try {
      const schema = z.object({
        results: z.array(z.object({
          name: z.string(),
          website: z.string().optional(),
          phone: z.string().optional(),
          region: z.string(),
          type: z.string()
        }))
      });
      
      const validation = schema.safeParse(req.body);
      
      if (!validation.success) {
        return res.status(400).json({ 
          message: "Invalid request body", 
          errors: validation.error.errors 
        });
      }
      
      const { results } = validation.data;
      
      // Generate CSV with just website URLs
      const csvData = results.map(item => ({
        "Website URL": item.website || "Not available"
      }));
      
      const csvString = csv.stringify(csvData, {
        header: true,
        columns: ["Website URL"]
      });
      
      res.setHeader("Content-Type", "text/csv");
      res.setHeader("Content-Disposition", "attachment; filename=business_leads.csv");
      res.send(csvString);
    } catch (error) {
      console.error("Error generating CSV:", error);
      res.status(500).json({ message: "Failed to generate CSV file" });
    }
  });
  
  // Download as Excel
  app.post("/api/download/excel", (req: Request, res: Response) => {
    try {
      const schema = z.object({
        results: z.array(z.object({
          name: z.string(),
          website: z.string().optional(),
          phone: z.string().optional(),
          region: z.string(),
          type: z.string()
        }))
      });
      
      const validation = schema.safeParse(req.body);
      
      if (!validation.success) {
        return res.status(400).json({ 
          message: "Invalid request body", 
          errors: validation.error.errors 
        });
      }
      
      const { results } = validation.data;
      
      // Generate Excel with business names and phone numbers
      const excelData = results.map(item => ({
        "Business Name": item.name,
        "Phone Number": item.phone || "Not available"
      }));
      
      // Create Excel workbook and worksheet
      const workbook = xlsx.utils.book_new();
      const worksheet = xlsx.utils.json_to_sheet(excelData);
      
      // Add worksheet to workbook
      xlsx.utils.book_append_sheet(workbook, worksheet, "Business Leads");
      
      // Write to buffer
      const excelBuffer = xlsx.write(workbook, { type: "buffer", bookType: "xlsx" });
      
      res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
      res.setHeader("Content-Disposition", "attachment; filename=business_leads.xlsx");
      res.send(excelBuffer);
    } catch (error) {
      console.error("Error generating Excel:", error);
      res.status(500).json({ message: "Failed to generate Excel file" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
