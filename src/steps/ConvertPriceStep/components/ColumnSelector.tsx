import { Box, Checkbox, FormControl, FormLabel, Text, VStack } from "@chakra-ui/react"

interface ColumnSelectorProps {
  columns: string[]
  selectedColumns: string[]
  onToggle: (column: string) => void
  europeanFormatColumns: Record<string, boolean>
}

export const ColumnSelector = ({ columns, selectedColumns, onToggle, europeanFormatColumns }: ColumnSelectorProps) => {
  if (columns.length === 0) {
    return null
  }

  return (
    <FormControl>
      <FormLabel fontWeight="bold">Select Columns to Convert</FormLabel>
      <VStack align="stretch" spacing={2} maxH="300px" overflowY="auto">
        {columns.map((column) => (
          <Box
            key={column}
            p={2}
            borderWidth="1px"
            borderRadius="md"
            bg={europeanFormatColumns[column] ? "blue.50" : "gray.50"}
          >
            <Checkbox isChecked={selectedColumns.includes(column)} onChange={() => onToggle(column)} colorScheme="blue">
              <Text fontWeight="medium">{column}</Text>
              {europeanFormatColumns[column] && (
                <Text fontSize="xs" color="blue.600">
                  European format detected
                </Text>
              )}
            </Checkbox>
          </Box>
        ))}
      </VStack>
    </FormControl>
  )
}
