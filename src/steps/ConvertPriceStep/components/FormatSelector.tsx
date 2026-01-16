import { FormControl, FormLabel, Radio, RadioGroup, Stack, Text } from "@chakra-ui/react"

interface FormatSelectorProps {
  format: "European" | "English"
  onChange: (format: "European" | "English") => void
}

export const FormatSelector = ({ format, onChange }: FormatSelectorProps) => {
  return (
    <FormControl>
      <FormLabel fontWeight="bold">Convert To</FormLabel>
      <RadioGroup onChange={(value) => onChange(value as "European" | "English")} value={format}>
        <Stack direction="column" spacing={3}>
          <Radio value="English" colorScheme="blue">
            <Stack spacing={0}>
              <Text fontWeight="medium">English Format</Text>
              <Text fontSize="sm" color="gray.600">
                Example: 1,234.56
              </Text>
            </Stack>
          </Radio>
          <Radio value="European" colorScheme="blue">
            <Stack spacing={0}>
              <Text fontWeight="medium">European Format</Text>
              <Text fontSize="sm" color="gray.600">
                Example: 1.234,56
              </Text>
            </Stack>
          </Radio>
        </Stack>
      </RadioGroup>
    </FormControl>
  )
}
