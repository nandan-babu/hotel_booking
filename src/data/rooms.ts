export interface Room {
  code: string;
  type: string;
  price: number;
  maxGuests: number;
  amenities: string[];
  imageUrl: string;
}

export interface Booking {
  roomCode: string;
  checkIn: string;
  checkOut: string;
}

export const ROOMS: Room[] = [
  {
    code: "R101",
    type: "Deluxe Room",
    price: 3500,
    maxGuests: 2,
    amenities: ["Free Wi-Fi", "Air conditioning", "Breakfast"],
    imageUrl: "/deluxe.jpg"
  },
  {
    code: "R102",
    type: "Deluxe Room",
    price: 3500,
    maxGuests: 2,
    amenities: ["Free Wi-Fi", "Air conditioning", "City view"],
    imageUrl: "/deluxe.jpg"
  },
  {
    code: "R201",
    type: "Executive Suite",
    price: 5800,
    maxGuests: 3,
    amenities: ["Free Wi-Fi", "Air conditioning", "Lounge access"],
    imageUrl: "/executive.jpg"
  },
  {
    code: "R202",
    type: "Executive Suite",
    price: 5800,
    maxGuests: 3,
    amenities: ["Free Wi-Fi", "Air conditioning", "Balcony"],
    imageUrl: "/executive.jpg"
  },
  {
    code: "R301",
    type: "Family Room",
    price: 4200,
    maxGuests: 4,
    amenities: ["Free Wi-Fi", "Air conditioning", "Connecting door"],
    imageUrl: "/family.jpg"
  }
];

export const EXISTING_BOOKINGS: Booking[] = [
  {
    roomCode: "R101",
    checkIn: "2026-09-20",
    checkOut: "2026-09-23"
  },
  {
    roomCode: "R201",
    checkIn: "2026-09-18",
    checkOut: "2026-09-21"
  }
];
