import { Data } from "../../../types"

/**
 * Check if a value is numeric (could be a price/number)
 */
export const isNumericValue = (value: any): boolean => {
  if (value === null || value === undefined || value === "") return false
  const stringValue = String(value)
  // Remove common currency symbols and whitespace
  const cleanedValue = stringValue.replace(/[$€¥£,.\s]/g, "")

  // Check if what remains is a number
  return !isNaN(parseFloat(cleanedValue)) && isFinite(Number(cleanedValue))
}

/**
 * Detect if a numeric value uses European format (comma as decimal separator)
 * European: 1.234,56 or 1234,56
 * English: 1,234.56 or 1234.56
 */
export const isEuropeanFormat = (value: string): boolean => {
  const stringValue = String(value).trim()

  // Remove currency symbols
  const cleaned = stringValue.replace(/[$€¥£\s]/g, "")

  // Check for European pattern: comma as last separator (decimal)
  const commaIndex = cleaned.lastIndexOf(",")
  const dotIndex = cleaned.lastIndexOf(".")

  // If comma comes after dot, it's European format
  if (commaIndex > dotIndex && commaIndex > 0) {
    // Verify there are 1-2 digits after the comma (decimal places)
    const afterComma = cleaned.substring(commaIndex + 1)
    return afterComma.length > 0 && afterComma.length <= 3 && /^\d+$/.test(afterComma)
  }

  // If only comma exists (no dot), and has 1-2 digits after it, likely European
  if (commaIndex > -1 && dotIndex === -1) {
    const afterComma = cleaned.substring(commaIndex + 1)
    return afterComma.length > 0 && afterComma.length <= 3 && /^\d+$/.test(afterComma)
  }

  return false
}

/**
 * Detect numeric columns that might contain prices or numbers
 * Returns array of column keys that are numeric
 */
export const detectNumericColumns = <T extends string>(data: Data<T>[], threshold = 0.4): T[] => {
  if (data.length === 0) return []

  const sampleSize = Math.min(100, data.length) // Check first 100 rows for performance
  const sampleData = data.slice(0, sampleSize)

  // Get all keys from the first row
  const keys = Object.keys(sampleData[0]) as T[]

  return keys.filter((key) => {
    const numericCount = sampleData.filter((row) => {
      const value = row[key]
      return value !== undefined && value !== "" && isNumericValue(value)
    }).length

    return numericCount / sampleSize >= threshold
  })
}

/**
 * Detect if numeric columns use European format
 * Returns map of column keys to whether they use European format
 * @Param threshhold - The amount of values that must be required for us to format 0.6 is 60%
 */
export const detectEuropeanFormat = <T extends string>(
  data: Data<T>[],
  numericColumns: T[],
  threshold = 0.4,
): Record<T, boolean> => {
  const result = {} as Record<T, boolean>

  if (data.length === 0) return result

  const sampleSize = Math.min(100, data.length)
  const sampleData = data.slice(0, sampleSize)

  numericColumns.forEach((key) => {
    const values = sampleData
      .map((row) => row[key])
      .filter((val) => val !== undefined && val !== "" && isNumericValue(val))

    if (values.length === 0) {
      result[key] = false
      return
    }

    const europeanCount = values.filter((val) => isEuropeanFormat(String(val))).length

    result[key] = europeanCount / values.length >= threshold
  })

  return result
}
