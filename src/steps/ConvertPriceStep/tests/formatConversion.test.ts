import { convertEuropeanToEnglish, convertDataFormat } from "../utils/formatConversion"

describe("formatConversion", () => {
  describe("convertEuropeanToEnglish", () => {
    it("should convert from European to English format", () => {
      expect(convertEuropeanToEnglish("1.234,56")).toBe("1,234.56")
      expect(convertEuropeanToEnglish("1234,56")).toBe("1,234.56")
      expect(convertEuropeanToEnglish("15.000,00")).toBe("15,000.00")
      expect(convertEuropeanToEnglish("999,99")).toBe("999.99")
    })

    it("should handle currency symbols", () => {
      expect(convertEuropeanToEnglish("€1.234,56")).toBe("1,234.56")
      expect(convertEuropeanToEnglish("$1.234,56")).toBe("1,234.56")
    })

    it("should handle invalid values gracefully", () => {
      expect(convertEuropeanToEnglish("abc")).toBe("abc")
      expect(convertEuropeanToEnglish("")).toBe("")
    })
  })

  describe("convertDataFormat", () => {
    it("should convert specified columns in dataset", () => {
      const data: any[] = [
        { name: "Product A", price: "1.234,56", quantity: "100" },
        { name: "Product B", price: "2.345,67", quantity: "200" },
      ]

      const converted: any[] = convertDataFormat(data, ["price"], "English")

      expect(converted[0].price).toBe("1,234.56")
      expect(converted[0].name).toBe("Product A")
      expect(converted[0].quantity).toBe("100")
      expect(converted[1].price).toBe("2,345.67")
    })

    it("should not modify non-selected columns", () => {
      const data: any[] = [
        { name: "Product A", price: "1.234,56", discount: "12,5" },
        { name: "Product B", price: "2.345,67", discount: "15,0" },
      ]

      const converted: any[] = convertDataFormat(data, ["price"], "English")

      expect(converted[0].price).toBe("1,234.56")
    })

    it("should handle empty column list", () => {
      const data: any[] = [{ name: "Product A", price: "1.234,56" }]

      const converted: any[] = convertDataFormat(data, [], "English")

      expect(converted[0].price).toBe("1.234,56") // Should remain unchanged
    })
  })
})
