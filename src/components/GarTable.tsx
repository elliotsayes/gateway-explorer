import { zGatewayAddressRegistryItem } from "@/types"
import { z } from "zod"

interface Props {
  items: Array<z.infer<typeof zGatewayAddressRegistryItem>>
}

const GarTable = ({items}: Props) => {
  return (
    <div className="flex flex-col">
      {items.map((item, index) => (
        <div key={index} className="flex flex-row">
          <span>
            {item.settings.fqdn}
          </span>
        </div> 
      ))}
    </div>
  );
}

export { GarTable }