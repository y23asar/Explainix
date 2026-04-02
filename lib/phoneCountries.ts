export type PhoneCountry = {
  code: string;
  label: string;
  digits: number;
};

/** Local number length (excluding country code). */
export const PHONE_COUNTRIES: PhoneCountry[] = [
  { code: "+91", label: "India (+91)", digits: 10 },
  { code: "+974", label: "Qatar (+974)", digits: 8 },
  { code: "+1", label: "United States (+1)", digits: 10 },
  { code: "+44", label: "United Kingdom (+44)", digits: 10 },
  { code: "+971", label: "UAE (+971)", digits: 9 },
  { code: "+61", label: "Australia (+61)", digits: 9 },
  { code: "+65", label: "Singapore (+65)", digits: 8 },
  { code: "+966", label: "Saudi Arabia (+966)", digits: 9 },
  { code: "+20", label: "Egypt (+20)", digits: 10 },
  { code: "+880", label: "Bangladesh (+880)", digits: 10 },
];

export function getPhoneRule(code: string): PhoneCountry {
  return PHONE_COUNTRIES.find((c) => c.code === code) ?? { code, label: code, digits: 7 };
}
