import { zGatewayAddressRegistryItem } from "@/types"
import { z } from "zod"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { formatDuration } from "@/lib/utils"

type GridDatum = {
  label: string
  value: string | React.ReactNode
}

interface Props {
  data: z.infer<typeof zGatewayAddressRegistryItem>
}

const GatewayDetails = ({data}: Props) => {
  const displayData: Array<GridDatum> = [
    {
      label: 'Label',
      value: data.settings.label,
    },
    {
      label: "Address",
      value: <code className="break-all">{data.link}</code>,
    },
    {
      label: "Owner ID",
      value: <code className="break-all">{data.id}</code>,
    },
    {
      label: "Properties ID",
      value: <code className="break-all">{data.settings.properties}</code>,
    },
    {
      label: "Operator Stake",
      value: data.operatorStake
    },
    {
      label: "Status",
      value: data.status,
    },
    {
      label: 'Note',
      value: data.settings.note,
    },
    {
      label: "Ping",
      value: data.ping.status === "success" ? `${data.ping.value}ms` : data.ping.status,
    },
    {
      label: "Uptime",
      value: data.health.status === "success" ? `${formatDuration(data.health.uptime * 1000)}` : data.health.status,
    },
  ]
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl::md-cols-6 gap-4 max-h-[40vh] overflow-y-scroll">
      {displayData.map((datum) => (
        <Card>
          <CardHeader>
            <CardTitle>{datum.label}</CardTitle>
            {/* <CardDescription></CardDescription> */}
          </CardHeader>
          <CardContent>
            {
              typeof datum.value === 'string' ? (
                <p>{datum.value}</p>
              ) : (
                datum.value
              )
            }
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export default GatewayDetails