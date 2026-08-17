import { useCallback, useState } from "react"
import { Box, Checkbox, Heading, ModalBody, useStyleConfig } from "@chakra-ui/react"
import { SelectHeaderTable } from "./components/SelectHeaderTable"
import { ContinueButton } from "../../components/ContinueButton"
import { useRsi } from "../../hooks/useRsi"
import type { themeOverrides } from "../../theme"
import type { RawData } from "../../types"

type SelectHeaderProps = {
  data: RawData[]
  onContinue: (headerValues: RawData, data: RawData[]) => Promise<void>
  onBack?: () => void
}

export const SelectHeaderStep = ({ data, onContinue, onBack }: SelectHeaderProps) => {
  const styles = useStyleConfig(
    "SelectHeaderStep",
  ) as (typeof themeOverrides)["components"]["SelectHeaderStep"]["baseStyle"]
  const { translations } = useRsi()
  const [selectedRows, setSelectedRows] = useState<ReadonlySet<number>>(new Set([0]))
  const [removeHeaderRow, setRemoveHeaderRow] = useState(true)
  const [isLoading, setIsLoading] = useState(false)

  const handleContinue = useCallback(async () => {
    const [selectedRowIndex] = selectedRows
    // We consider data above header to be redundant
    const trimmedData = data.slice(removeHeaderRow ? selectedRowIndex + 1 : selectedRowIndex)
    setIsLoading(true)
    await onContinue(data[selectedRowIndex], trimmedData)
    setIsLoading(false)
  }, [onContinue, data, removeHeaderRow, selectedRows])

  return (
    <>
      <ModalBody pb={0}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={8} flexWrap="wrap" gap="8px"> 
          <Heading sx={styles.heading}>{translations.selectHeaderStep.title}</Heading>
          <Checkbox
            isChecked={removeHeaderRow}
            onChange={(e) => setRemoveHeaderRow(e.target.checked)}
            colorScheme="rsi"
            flexShrink={0}
            size="lg"
            color="red.500"
            fontWeight="semibold"
          >
            {translations.selectHeaderStep.removeHeaderRowLabel}
          </Checkbox>
        </Box>
        <SelectHeaderTable data={data} selectedRows={selectedRows} setSelectedRows={setSelectedRows} />
      </ModalBody>
      <ContinueButton
        onContinue={handleContinue}
        onBack={onBack}
        title={translations.selectHeaderStep.nextButtonTitle}
        backTitle={translations.selectHeaderStep.backButtonTitle}
        isLoading={isLoading}
      />
    </>
  )
}
