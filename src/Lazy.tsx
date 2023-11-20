import { useParams } from "@tanstack/react-router"
import { observerCurrentRoute, observerHistoryRoute, observerTxRoute } from "./routes"
import { CurrentReport } from "./components/CurrentReport"
import { ReportListSingleGateway } from "./components/ReportListSingleGateway"
import { HistoricReport } from "./components/HistoricReport"

export const ObserverCurrent = () => {
  const params = useParams({ from: observerCurrentRoute.id })
  return <CurrentReport host={params.host} />
}

export const ObserverHistory = () => {
  const params = useParams({ from: observerHistoryRoute.id })
  return <ReportListSingleGateway host={params.host} />
}

export const ObserverTx = () => {
  const params = useParams({ from: observerTxRoute.id })
  return <HistoricReport host={params.host} txId={params.txId} />
}
