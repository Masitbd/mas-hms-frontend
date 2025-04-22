export function convertNumberToWords(amount: any): string {
  const a = [
    "",
    "One",
    "Two",
    "Three",
    "Four",
    "Five",
    "Six",
    "Seven",
    "Eight",
    "Nine",
    "Ten",
    "Eleven",
    "Twelve",
    "Thirteen",
    "Fourteen",
    "Fifteen",
    "Sixteen",
    "Seventeen",
    "Eighteen",
    "Nineteen",
  ];
  const b = [
    "",
    "",
    "Twenty",
    "Thirty",
    "Forty",
    "Fifty",
    "Sixty",
    "Seventy",
    "Eighty",
    "Ninety",
  ];

  const number = parseInt(amount);
  if (number === 0) return "Zero";

  if (number < 20) return a[number];
  if (number < 100)
    return (
      b[Math.floor(number / 10)] + (number % 10 ? " " + a[number % 10] : "")
    );
  if (number < 1000)
    return (
      a[Math.floor(number / 100)] +
      " Hundred " +
      convertNumberToWords(number % 100)
    );
  if (number < 100000)
    return (
      convertNumberToWords(Math.floor(number / 1000)) +
      " Thousand " +
      convertNumberToWords(number % 1000)
    );
  if (number < 10000000)
    return (
      convertNumberToWords(Math.floor(number / 100000)) +
      " Lakh " +
      convertNumberToWords(number % 100000)
    );

  return number.toString(); // fallback
}
