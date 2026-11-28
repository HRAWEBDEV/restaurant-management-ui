const PERSIAN_ARABIC_DIGITS = '۰۱۲۳۴۵۶۷۸۹٠١٢٣٤٥٦٧٨٩' as const

const DIGIT_MAP: Record<string, string> = Object.fromEntries(
  Array.from(PERSIAN_ARABIC_DIGITS, (digit, index) => [digit, String(index % 10)]),
)

const NON_ENGLISH_DIGIT_PATTERN = /[۰-۹٠-٩]/g

function toEnglishNumbers(value: string): string {
  return value.replace(NON_ENGLISH_DIGIT_PATTERN, (digit) => DIGIT_MAP[digit])
}

export { toEnglishNumbers }
