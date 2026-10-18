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
    officialEmail: "ewastechittagong4@gmail.com",
    phoneDisplay: "+880 1352-328093",
    phoneRaw: "+8801352328093",
    isPhoneVerified: true,
    streetAddress: "Mir Aulia Road, NR Steel City Gate, Akbarshah, Chittagong, Bangladesh",
    isAddressVerified: true,
    operatingHours: "Saturday – Thursday: 9:00 AM – 6:00 PM (GMT+6)",
    whatsappUrl: "https://wa.me/8801352328093",
  },
  logistics: {
    exportSeaport: "Port of Chittagong (Chattogram), Bangladesh",
    acceptedIncoterms: ["FOB Chittagong", "CIF Destination Port", "EXW Facility"],
    standardMoq: "1 Metric Ton (Trial Consignments Available)",
  },
  verificationChecklist: [
    {
      item: "Official Corporate Phone Number",
      status: "CONFIRMED",
      notes: "Confirmed client mobile and WhatsApp direct line: +880 1352-328093.",
    },
    {
      item: "Physical Workshop & Facility Street Address",
      status: "CONFIRMED",
      notes: "Confirmed physical address: Mir Aulia Road, NR Steel City Gate, Akbarshah, Chittagong.",
    },
    {
      item: "Official Business Email Address",
      status: "CONFIRMED",
      notes: "Confirmed primary correspondence email: ewastechittagong4@gmail.com.",
    },
    {
      item: "Commercial Trade License & Environmental Clearance (DoE)",
      status: "AWAITING_CLIENT_CONFIRMATION",
      notes: "No unverified government certificates or ISO numbers have been published.",
    },
    {
      item: "Authentic Facility & Warehouse Photography",
      status: "CONFIRMED",
      notes: "Ground operational photography and verified facility media active in media matrix.",
    },
    {
      item: "Export Banking & LC Beneficiary Details",
      status: "AWAITING_CLIENT_CONFIRMATION",
      notes: "Provided strictly offline upon verified RFQ quotation agreement.",
    },
  ],
};
