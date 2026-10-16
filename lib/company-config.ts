/**
 * Centralized Company Configuration & Operational Verification Registry
 * All unconfirmed parameters are explicitly tracked here for client signoff.
 */

export interface CompanyConfig {
  brand: {
    name: string;
    tagline: string;
    establishedCity: string;
    portProximity: string;
  };
  contact: {
    officialEmail: string;
    phoneDisplay: string;
    phoneRaw: string;
    isPhoneVerified: boolean;
    streetAddress: string;
    isAddressVerified: boolean;
    operatingHours: string;
    whatsappUrl: string;
  };
  logistics: {
    exportSeaport: string;
    acceptedIncoterms: string[];
    standardMoq: string;
  };
  verificationChecklist: Array<{
    item: string;
    status: "CONFIRMED" | "AWAITING_CLIENT_CONFIRMATION";
    notes: string;
  }>;
}

export const companyConfig: CompanyConfig = {
  brand: {
    name: "E-Waste Chittagong",
    tagline: "Sustainable Electronics Recycling & Material Recovery",
    establishedCity: "Chittagong",
    portProximity: "Chittagong Maritime Sea Port, Bangladesh",
  },
  contact: {
    officialEmail: "info@ewastechittagong.com",
    phoneDisplay: "+880 1800-000000 (Awaiting Client Confirmation)",
    phoneRaw: "+8801800000000",
    isPhoneVerified: false,
    streetAddress: "Chittagong, Bangladesh (Exact facility address awaiting client confirmation)",
    isAddressVerified: false,
    operatingHours: "Saturday – Thursday: 9:00 AM – 6:00 PM (GMT+6)",
    whatsappUrl: "https://wa.me/8801800000000",
  },
  logistics: {
    exportSeaport: "Port of Chittagong (Chattogram), Bangladesh",
    acceptedIncoterms: ["FOB Chittagong", "CIF Destination Port", "EXW Facility"],
    standardMoq: "1 Metric Ton (Trial Consignments Available)",
  },
  verificationChecklist: [
    {
      item: "Official Corporate Phone Number",
      status: "AWAITING_CLIENT_CONFIRMATION",
      notes: "Currently using placeholder +880 1800-000000 with explicit confirmation notice.",
    },
    {
      item: "Physical Workshop & Facility Street Address",
      status: "AWAITING_CLIENT_CONFIRMATION",
      notes: "Identified regionally as Chittagong Port area. Specific street/plot number awaiting client provision.",
    },
    {
      item: "Commercial Trade License & Environmental Clearance (DoE)",
      status: "AWAITING_CLIENT_CONFIRMATION",
      notes: "No unverified government certificates or ISO numbers have been published.",
    },
    {
      item: "Authentic Facility & Warehouse Photography",
      status: "AWAITING_CLIENT_CONFIRMATION",
      notes: "All current assets are explicitly tagged as 'Illustrative Concept' with zero simulated claims.",
    },
    {
      item: "Export Banking & LC Beneficiary Details",
      status: "AWAITING_CLIENT_CONFIRMATION",
      notes: "Provided strictly offline upon verified RFQ quotation agreement.",
    },
  ],
};
