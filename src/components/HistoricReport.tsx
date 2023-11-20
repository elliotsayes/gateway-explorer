
import { useQuery } from "@tanstack/react-query"
import { downloadReportInfoForTransaction, querySingleTransaction } from "@/lib/observer/downloadObservation"
import { defaultGARCacheURL } from "@/lib/consts"
import { extractGarItems } from "@/lib/convert"
import { ReportSummaryTable } from "./ReportSummaryTable";

interface Props {
  host: string
  txId: string;
}

export const HistoricReport = ({ host, txId }: Props) => {
  const {
    data: garData,
    isError: isGarError,
  } = useQuery({
    queryKey: ['gar'],
    queryFn: async () => {
      const fetchResult = await fetch(defaultGARCacheURL);
      const fetchJson = await fetchResult.json();
      const garItems = extractGarItems(fetchJson);
      return garItems;
    },
  });

  const observer = garData?.find((item) => item.settings.fqdn === host)
  const observerNotFound = (garData !== undefined) && (observer === undefined);

  const {
    data: reportTxData,
    isError: isReportTxError,
  } = useQuery({
    queryKey: ['observationReportTx', txId],
    queryFn: async () => {
      const tx = await querySingleTransaction(txId);
      const reportData = await downloadReportInfoForTransaction(tx)
      return {
        tx,
        reportData,
      }
    },
    enabled: observer !== undefined,
  });

  if (observerNotFound) {
    return (
      <div>
        Observer not found
      </div>
    )
  }

  return (
    <ReportSummaryTable
      host={host}
      label={`txId: ${txId.slice(0, 8)}...`}
      garData={garData}
      isGarError={isGarError}
      reportData={reportTxData?.reportData}
      isReportError={isReportTxError}
    />
  )
}
