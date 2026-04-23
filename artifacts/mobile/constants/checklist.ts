import type { Feather } from "@expo/vector-icons";

export type ChecklistItem = {
  id: string;
  label: string;
  done: boolean;
};

export type ChecklistCategory = {
  id: string;
  name: string;
  icon: keyof typeof Feather.glyphMap;
  items: ChecklistItem[];
};

let counter = 0;
const id = (prefix: string) => `${prefix}-${++counter}`;

export function buildDefaultCategories(): ChecklistCategory[] {
  return [
    {
      id: id("cat"),
      name: "Essentials",
      icon: "star",
      items: [
        { id: id("it"), label: "Travel Pillow", done: false },
        { id: id("it"), label: "Travel Adapter", done: false },
        { id: id("it"), label: "Sunglasses", done: false },
        { id: id("it"), label: "Travel-Sized Laundry Detergent", done: false },
        { id: id("it"), label: "Multi-Tool or Swiss Army Knife", done: false },
      ],
    },
    {
      id: id("cat"),
      name: "Documents",
      icon: "file-text",
      items: [
        { id: id("it"), label: "Passport/ID", done: false },
        { id: id("it"), label: "Travel Itinerary", done: false },
        { id: id("it"), label: "Boarding Passes", done: false },
        { id: id("it"), label: "Hotel Reservations", done: false },
        { id: id("it"), label: "Insurance Documents", done: false },
      ],
    },
    {
      id: id("cat"),
      name: "Electronics",
      icon: "monitor",
      items: [
        { id: id("it"), label: "Smartphone and Charger", done: false },
        { id: id("it"), label: "Laptop/Tablet and Charger", done: false },
        { id: id("it"), label: "Camera and Accessories", done: false },
        { id: id("it"), label: "Power Bank", done: false },
        { id: id("it"), label: "Headphones", done: false },
      ],
    },
    {
      id: id("cat"),
      name: "Toiletries",
      icon: "droplet",
      items: [
        { id: id("it"), label: "Toothbrush", done: false },
        { id: id("it"), label: "Shampoo and Conditioner", done: false },
        { id: id("it"), label: "Soap/Body Wash", done: false },
        { id: id("it"), label: "Razor and Shaving Cream", done: false },
        { id: id("it"), label: "Deodorant", done: false },
      ],
    },
    {
      id: id("cat"),
      name: "Clothes",
      icon: "shopping-bag",
      items: [
        { id: id("it"), label: "T-Shirt", done: false },
        { id: id("it"), label: "Pants/Shorts", done: false },
        { id: id("it"), label: "Underwear", done: false },
        { id: id("it"), label: "Socks", done: false },
        { id: id("it"), label: "Jacket/Outerwear", done: false },
      ],
    },
  ];
}

export function newId(prefix = "id") {
  return `${prefix}-${++counter}-${Date.now()}`;
}
