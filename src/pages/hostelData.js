// Shared hostel catalog + demo student profile for the hostel-selection flow.
// In the real app, swap STUDENT for data from your auth/user context,
// and HOSTELS for whatever your backend returns.

export const STORAGE_KEY = "veritas_hostel_selection";

export const HOSTELS = [
  {
    id: "C",
    name: "HOSTEL C",
    type: "Male hostel",
    fee: 168000,
    capacity: 6,
    categories: [{ name: "HOSTEL C", spaces: 38 }],
  },
  {
    id: "D",
    name: "HOSTEL D",
    type: "Male hostel",
    fee: 168000,
    capacity: 6,
    categories: [{ name: "HOSTEL D", spaces: 48 }],
  },
  {
    id: "E",
    name: "HOSTEL E",
    type: "Male hostel",
    fee: 168000,
    capacity: 6,
    categories: [{ name: "HOSTEL E", spaces: 89 }],
  },
  {
    id: "F",
    name: "HOSTEL F",
    type: "Male hostel",
    fee: 168000,
    capacity: 6,
    categories: [{ name: "HOSTEL F", spaces: 26 }],
  },
  {
    id: "I",
    name: "HOSTEL I",
    type: "Male hostel",
    fee: 204000,
    capacity: 6,
    categories: [{ name: "HOSTEL I", spaces: 54 }],
  },
  {
    id: "J",
    name: "HOSTEL J",
    type: "Male hostel",
    fee: 204000,
    capacity: 6,
    categories: [{ name: "HOSTEL J", spaces: 61 }],
  },
  {
    id: "K",
    name: "HOSTEL K",
    type: "Male hostel",
    fee: 204000,
    capacity: 6,
    categories: [{ name: "HOSTEL K", spaces: 61 }],
  },
  {
    id: "L",
    name: "HOSTEL L",
    type: "Male hostel",
    fee: 228000,
    capacity: 6,
    categories: [{ name: "HOSTEL L", spaces: 61 }],
  },
  {
    id: "M",
    name: "HOSTEL M",
    type: "Male hostel",
    fee: 272000,
    capacity: 6,
    categories: [
      { name: "Ground Floor", spaces: 51 },
      { name: "First Floor", spaces: 76 },
    ],
  },
  {
    id: "N",
    name: "HOSTEL N",
    type: "Male hostel",
    fee: 272000,
    capacity: 6,
    categories: [
      { name: "Ground Floor", spaces: 51 },
      { name: "First Floor", spaces: 76 },
    ],
  },
  {
    id: "R",
    name: "HOSTEL R",
    type: "Male hostel",
    fee: 380000,
    capacity: 6,
    categories: [
      { name: "Ground Floor", spaces: 109 },
      { name: "First Floor", spaces: 95 },
      { name: "Second Floor", spaces: 135 },
    ],
  },
  {
    id: "S",
    name: "HOSTEL S",
    type: "Male hostel",
    fee: 380000,
    capacity: 6,
    categories: [
      { name: "Ground Floor", spaces: 182 },
      { name: "First Floor", spaces: 242 },
    ],
  },
];

export const STUDENT = {
  name: "Olusola Olusola Joshua",
  regNo: "VUG/CSC/23/9682",
  email: "vug/csc/23/9682@nas.veritas.edu.ng",
  phone: "09135279895",
  gender: "Male",
};

export function formatNaira(value) {
  return `₦${Number(value).toLocaleString("en-NG")}`;
}
