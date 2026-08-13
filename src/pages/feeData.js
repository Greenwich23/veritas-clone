// Shared fee catalog + demo student profile.
// In the real app, swap STUDENT for data from your auth/user context,
// and FEE_CATALOG for whatever your backend returns.

export const STORAGE_KEY = "veritas_other_fees_selection";

export const FEE_CATALOG = {
  "Carryover Course": { amount: 20000, paymentType: "CISCO" },
  "Outstanding Tuition Fee": { amount: 150000, paymentType: "TUITION" },
  "Hostel Fee": { amount: 80000, paymentType: "HOSTEL" },
  "Late Registration": { amount: 15000, paymentType: "LATEREG" },
  "Miscellaneous Dues": { amount: 5000, paymentType: "MISC" },
};

export const STUDENT = {
  name: "Olusola Olusola Joshua",
  regNo: "VUG/CSC/23/9682",
  email: "vug/csc/23/9682@nas.veritas.edu.ng",
  phone: "09135279895",
};

export function formatNaira(value) {
  return `₦${Number(value).toLocaleString("en-NG", {
    minimumFractionDigits: 2,
  })}`;
}

export function todayISO() {
  return new Date().toISOString().split("T")[0];
}
