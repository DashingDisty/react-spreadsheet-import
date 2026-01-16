import { isNumericValue, isEuropeanFormat, detectNumericColumns, detectEuropeanFormat } from "../utils/formatDetection"

describe("formatDetection", () => {
  describe("isNumericValue", () => {
    it("should detect valid numeric values", () => {
      expect(isNumericValue("123")).toBe(true)
      expect(isNumericValue("123.45")).toBe(true)
      expect(isNumericValue("1,234.56")).toBe(true)
      expect(isNumericValue("$1,234.56")).toBe(true)
      expect(isNumericValue("€1.234,56")).toBe(true)
    })

    it("should reject non-numeric values", () => {
      expect(isNumericValue("abc")).toBe(false)
      expect(isNumericValue("")).toBe(false)
      expect(isNumericValue(null)).toBe(false)
      expect(isNumericValue(undefined)).toBe(false)
    })
  })

  describe("isEuropeanFormat", () => {
    it("should detect European format", () => {
      expect(isEuropeanFormat("1.234,56")).toBe(true)
      expect(isEuropeanFormat("1234,56")).toBe(true)
      expect(isEuropeanFormat("€1.234,56")).toBe(true)
      expect(isEuropeanFormat("15.000,00")).toBe(true)
    })

    it("should not detect English format as European", () => {
      expect(isEuropeanFormat("1,234.56")).toBe(false)
      expect(isEuropeanFormat("1234.56")).toBe(false)
      expect(isEuropeanFormat("$1,234.56")).toBe(false)
    })

    it("should handle edge cases", () => {
      expect(isEuropeanFormat("123")).toBe(false)
      expect(isEuropeanFormat("")).toBe(false)
      expect(isEuropeanFormat("abc")).toBe(false)
    })
  })

  describe("detectNumericColumns", () => {
    it("should detect numeric columns", () => {
      const data = [
        { name: "Product A", price: "123.45", quantity: "100", description: "Text" },
        { name: "Product B", price: "234.56", quantity: "200", description: "More text" },
        { name: "Product C", price: "345.67", quantity: "300", description: "Even more" },
      ]

      const numericColumns = detectNumericColumns(data)
      expect(numericColumns).toContain("price")
      expect(numericColumns).toContain("quantity")
      expect(numericColumns).not.toContain("name")
      expect(numericColumns).not.toContain("description")
    })

    it("should handle empty data", () => {
      const numericColumns = detectNumericColumns([])
      expect(numericColumns).toEqual([])
    })
  })

  describe("detectEuropeanFormat", () => {
    it("should detect columns with European format", () => {
      const data = [
        { price: "1.234,56", quantity: "100" },
        { price: "2.345,67", quantity: "200" },
        { price: "3.456,78", quantity: "300" },
      ]

      const formatMap = detectEuropeanFormat(data, ["price", "quantity"])
      expect(formatMap.price).toBe(true)
      expect(formatMap.quantity).toBe(false)
    })

    it("should handle mixed formats", () => {
      const data = [
        { price: "1.234,56", discount: "10.5" },
        { price: "2.345,67", discount: "20.5" },
        { price: "3.456,78", discount: "30.5" },
      ]

      const formatMap = detectEuropeanFormat(data, ["price", "discount"])
      expect(formatMap.price).toBe(true)
      expect(formatMap.discount).toBe(false)
    })
  })
})
