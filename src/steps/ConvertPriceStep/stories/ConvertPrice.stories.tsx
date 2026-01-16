import type { Meta } from "@storybook/react"
import { ConvertPriceStep } from "../ConvertPriceStep"
import { mockRsiValues } from "../../../stories/mockRsiValues"
import { Providers } from "../../../components/Providers"
import { ModalWrapper } from "../../../components/ModalWrapper"

export default {
  title: "Convert Price Step",
  component: ConvertPriceStep,
} as Meta

const mockData = [
  {
    name: "Product A",
    price: "1.234,56",
    quantity: "100",
    discount: "12,5",
  },
  {
    name: "Product B",
    price: "2.500,00",
    quantity: "50",
    discount: "5,0",
  },
  {
    name: "Product C",
    price: "999,99",
    quantity: "200",
    discount: "10,0",
  },
  {
    name: "Product D",
    price: "15.000,00",
    quantity: "25",
    discount: "20,5",
  },
  {
    name: "Product E",
    price: "500,50",
    quantity: "150",
    discount: "7,5",
  },
]

export const EuropeanFormat = () => {
  return (
    <Providers theme={mockRsiValues.customTheme || {}} rsiValues={mockRsiValues}>
      <ModalWrapper isOpen={true} onClose={() => {}}>
        <ConvertPriceStep
          data={mockData}
          onContinue={(data) => {
            console.log("Converted data:", data)
          }}
        />
      </ModalWrapper>
    </Providers>
  )
}

export const WithBackButton = () => {
  return (
    <Providers theme={mockRsiValues.customTheme || {}} rsiValues={mockRsiValues}>
      <ModalWrapper isOpen={true} onClose={() => {}}>
        <ConvertPriceStep
          data={mockData}
          onContinue={(data) => {
            console.log("Converted data:", data)
          }}
          onBack={() => {
            console.log("Back clicked")
          }}
        />
      </ModalWrapper>
    </Providers>
  )
}
