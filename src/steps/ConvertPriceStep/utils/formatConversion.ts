import { Data } from "../../../types"

/**
 * Convert a number from European format to English format
 * European: 1.234,56 or 1234,56
 * English: 1,234.56 or 1234.56
 * @param value - The numeric string value in European format
 */
export const convertEuropeanToEnglish = (value: string): string => {
  // Remove currency symbols and whitespace
  const cleaned = String(value).replace(/[$€¥£\s]/g, "")

  // European: 1.234,56 -> remove dots (thousands), convert comma to dot (decimal)
  const standardNumber = cleaned.replace(/\./g, "").replace(",", ".")

  // Validate it's a valid number
  const numValue = parseFloat(standardNumber)
  if (isNaN(numValue)) {
    return value // Return original if invalid
  }

  // Split into integer and decimal parts
  const parts = standardNumber.split(".")
  const integerPart = parts[0]
  const decimalPart = parts[1] || ""

  // English format: comma for thousands, dot for decimal
  const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  const result = decimalPart ? `${formattedInteger}.${decimalPart}` : formattedInteger

  return result
}

/**
 * Convert numeric columns from European to English format
 */
export const convertDataFormat = <T extends string>(
  data: Data<T>[],
  columnsToConvert: T[],
  _toFormat: "English",
): Data<T>[] => {
  return data.map((row) => {
    const newRow = { ...row }
    columnsToConvert.forEach((column) => {
      const value = newRow[column]
      if (value !== undefined && value !== "" && typeof value === "string") {
        try {
          newRow[column] = convertEuropeanToEnglish(value)
        } catch (e) {
          // Keep original value if conversion fails
          console.warn(`Failed to convert value "${value}" in column "${column}"`, e)
        }
      }
    })
    return newRow
  })
}
