export type ICompanyInfo = {
  _id?: string;
  name: string;
  phone: string;
  address: string;
  default: boolean;
  photoUrl?: string;
  publicId?: string;
};

export const DefaultCompanyData: ICompanyInfo = {
  name: "",
  phone: "",
  address: "",
  default: false,
};

export const dummyData = [
  {
    _id: "1a2b3c4d5e6f",
    name: "John Doe",
    phone: "123-456-7890",
    address: "123 Main St, Springfield, IL",
    isDefault: true,
    image: "https://example.com/images/john.jpg",
  },
  {
    _id: "7g8h9i0j1k2l",
    name: "Jane Smith",
    phone: "987-654-3210",
    address: "456 Oak St, Smalltown, TX",
    isDefault: false,
    image: "https://example.com/images/jane.jpg",
  },
  {
    _id: "3m4n5o6p7q8r",
    name: "Sam Wilson",
    phone: "555-123-4567",
    address: "789 Pine St, Capital City, CA",
    isDefault: false,
    image: "https://example.com/images/sam.jpg",
  },
  {
    _id: "9s0t1u2v3w4x",
    name: "Lisa Brown",
    phone: "333-222-1111",
    address: "101 Maple St, Greenville, NY",
    isDefault: true,
    image: "https://example.com/images/lisa.jpg",
  },
  {
    _id: "5y6z7a8b9c0d",
    name: "Mark Johnson",
    phone: "444-555-6666",
    address: "202 Birch St, Rivertown, FL",
    isDefault: false,
    image: "https://example.com/images/mark.jpg",
  },
];

export type IcloudinarySecret = {
  signature: string;
  timestamp: number;
  apiKey: string;
  cloudName: string;
};
