import { useCallback, useEffect, useState, useMemo } from "react"
import {
  Box,
  Heading,
  Button,
  Alert,
  AlertIcon,
  AlertDescription,
  Text,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
} from "@chakra-ui/react"
import { ContinueButton } from "../../components/ContinueButton"
import { useRsi } from "../../hooks/useRsi"
import type { Data } from "../../types"
import { detectNumericColumns, detectEuropeanFormat } from "./utils/formatDetection"
import { convertDataFormat } from "./utils/formatConversion"
import { ColumnSelector } from "./components/ColumnSelector"

export type ConvertPriceStepProps<T extends string> = {
  data: Data<T>[]
  onContinue: (data: Data<T>[]) => void
  onBack?: () => void
}

export const ConvertPriceStep = <T extends string>({ data, onContinue, onBack }: ConvertPriceStepProps<T>) => {
  const { translations } = useRsi<T>()
  const [numericColumns, setNumericColumns] = useState<T[]>([])
  const [europeanFormatColumns, setEuropeanFormatColumns] = useState<Record<T, boolean>>({} as Record<T, boolean>)
  const [selectedColumns, setSelectedColumns] = useState<T[]>([])
  const [hasEuropeanData, setHasEuropeanData] = useState(false)
  const [shouldSkip, setShouldSkip] = useState(false)

  // Detect numeric columns and European format on mount
  useEffect(() => {
    const detected = detectNumericColumns(data)
    setNumericColumns(detected)

    if (detected.length > 0) {
      const formatMap = detectEuropeanFormat(data, detected)
      setEuropeanFormatColumns(formatMap)

      // Check if any columns use European format
      const hasEuropean = Object.values(formatMap).some((isEuropean) => isEuropean)
      setHasEuropeanData(hasEuropean)

      if (!hasEuropean) {
        // No European format detected, skip this step
        setShouldSkip(true)
      } else {
        // Auto-select columns with European format
        const europeanCols = detected.filter((col) => formatMap[col])
        setSelectedColumns(europeanCols)
      }
    } else {
      // No numeric columns, skip this step
      setShouldSkip(true)
    }
  }, [data])

  // Auto-skip if no European data detected
  useEffect(() => {
    if (shouldSkip) {
      onContinue(data)
    }
  }, [shouldSkip, data, onContinue])

  const handleColumnToggle = useCallback((column: T) => {
    setSelectedColumns((prev) => (prev.includes(column) ? prev.filter((c) => c !== column) : [...prev, column]))
  }, [])

  const handleConvert = useCallback(() => {
    const converted = convertDataFormat(data, selectedColumns, "English")
    onContinue(converted)
  }, [data, selectedColumns, onContinue])

  const handleSkip = useCallback(() => {
    onContinue(data)
  }, [data, onContinue])

  // Generate preview data showing before/after for selected columns
  const previewData = useMemo(() => {
    if (selectedColumns.length === 0) return []

    // Take first 5 rows for preview
    const previewRows = data.slice(0, 5)
    const convertedRows = convertDataFormat(previewRows, selectedColumns, "English")

    return previewRows.map((originalRow, index) => ({
      original: originalRow,
      converted: convertedRows[index],
    }))
  }, [data, selectedColumns])

  // If should skip, return null (useEffect will handle navigation)
  if (shouldSkip) {
    return null
  }

  return (
    <Box display="flex" flexDirection="column" h="100%" w="100%">
      <Box flex="1" overflowY="auto" pr={2}>
        <Heading size="md" mb={4}>
          {translations.convertPriceStep?.title || "Convert Number Format"}
        </Heading>

        <Alert status="info" mb={4} borderRadius="md">
          <AlertIcon />
          <AlertDescription>
            {translations.convertPriceStep?.europeanDetected ||
              "We detected numeric columns with a European format (comma as decimal separator). Select the columns you want to convert to English format (dot as decimal separator)."}
          </AlertDescription>
        </Alert>

        <Box mb={4}>
          <ColumnSelector
            columns={numericColumns as string[]}
            selectedColumns={selectedColumns as string[]}
            onToggle={handleColumnToggle as (column: string) => void}
            europeanFormatColumns={europeanFormatColumns as Record<string, boolean>}
          />
        </Box>

        {selectedColumns.length > 0 && previewData.length > 0 && (
          <Box mb={4} p={4} borderWidth="1px" borderRadius="md" bg="gray.50" maxH="400px" overflowY="auto">
            <Text fontWeight="bold" mb={3}>
              Preview (first {previewData.length} rows):
            </Text>
            <Box overflowX="auto">
              <Table size="sm" variant="simple">
                <Thead position="sticky" top={0} bg="gray.50" zIndex={1}>
                  <Tr>
                    <Th>Column</Th>
                    <Th>Before (European)</Th>
                    <Th>After (English)</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {selectedColumns.map((column) => (
                    <Tr key={column as string}>
                      <Td fontWeight="medium">{column as string}</Td>
                      <Td>
                        {previewData.map((row, idx) => (
                          <Box key={idx} py={1}>
                            {String(row.original[column] || "")}
                          </Box>
                        ))}
                      </Td>
                      <Td color="green.600" fontWeight="medium">
                        {previewData.map((row, idx) => (
                          <Box key={idx} py={1}>
                            {String(row.converted[column] || "")}
                          </Box>
                        ))}
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </Box>
          </Box>
        )}
      </Box>

      <Box flexShrink={0} mt={4}>
        <ContinueButton
          onContinue={handleConvert}
          onBack={onBack}
          title={translations.convertPriceStep?.continueButton || "Convert to English Format"}
          backTitle={translations.matchColumnsStep?.backButtonTitle || "Back"}
        />

        <Box mt={2} textAlign="center">
          <Button onClick={handleSkip} variant="link" size="sm" color="gray.600">
            {translations.convertPriceStep?.skipButton || "Skip this step"}
          </Button>
        </Box>
      </Box>
    </Box>
  )
}
