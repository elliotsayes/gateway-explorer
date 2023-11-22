import { useParams } from "@tanstack/react-router"
import { observeIndexRoute } from "./routes"
import { ObservationListSingleGateway } from "./components/ObservationListSingleGateway"

export const ObserveIndex = () => {
  console.log("Rendering ObserveIndex")
  const params = useParams({ from: observeIndexRoute.id })
  return <ObservationListSingleGateway host={params.host} />
}
