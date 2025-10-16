// function to format date as yyyy-MM-dd
export const formatDate = (date: Date | null): string => {
  if (!date) return "";
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-indexed
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

type BillLike = {
  user?: unknown;
  amount?: unknown;
  [k: string]: unknown;
};

type InputShape = {
  newBills?: unknown;
  dueBills?: unknown; // preferred spelling
  dewBills?: unknown; // common typo spelling (handled)
  [k: string]: unknown;
};

type Totals = {
  newBillsTotal: number;
  dueBillsTotal: number;
  grandTotal: number;
};

export function computeGrandTotalForEmployeeLedger(data: InputShape): Totals {
  const normalizeUser = (v: unknown): string => {
    if (typeof v !== "string") return "";
    // Trim, collapse inner whitespace, lowercase for case-insensitive match
    return v.trim().replace(/\s+/g, " ").toLowerCase();
  };

  const toNumber = (v: unknown): number => {
    // Accept numbers or numeric strings; otherwise return NaN
    if (typeof v === "number") return v;
    if (typeof v === "string" && v.trim() !== "") {
      const n = Number(v.trim());
      return Number.isFinite(n) ? n : NaN;
    }
    return NaN;
  };

  const isBillArray = (x: unknown): x is BillLike[] =>
    Array.isArray(x) && x.every((item) => item && typeof item === "object");

  // Accept both dueBills and dewBills; prefer dueBills if both exist
  const newBills = isBillArray(data.newBills) ? data.newBills : [];
  const dueBillsRaw = isBillArray((data as any).dueBills)
    ? (data as any).dueBills
    : isBillArray((data as any).dewBills)
    ? (data as any).dewBills
    : [];

  const sumTotalsFor = (bills: BillLike[]): number => {
    // Match any row whose normalized user equals "total"
    const matchKey = "total";
    let sum = 0;
    for (const row of bills) {
      if (!row || typeof row !== "object") continue;
      const user = normalizeUser(row.user);
      if (user === matchKey) {
        const amt = toNumber(row.amount);
        if (Number.isFinite(amt)) sum += amt;
      }
    }
    return sum;
  };

  const newBillsTotal = sumTotalsFor(newBills);
  const dueBillsTotal = sumTotalsFor(dueBillsRaw);
  const grandTotal = newBillsTotal + dueBillsTotal;

  return { newBillsTotal, dueBillsTotal, grandTotal };
}

/* ------------------- Example ------------------- */
// const input = { data: { ...your payload... } };
// const { newBillsTotal, dueBillsTotal, grandTotal } = computeGrandTotal(input.data);
// console.log({ newBillsTotal, dueBillsTotal, grandTotal });
