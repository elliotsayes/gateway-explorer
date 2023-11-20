
import { useQuery } from "@tanstack/react-query"
import { downloadCurrentReportInfoFromGateway } from "@/lib/observer/downloadObservation"
import { defaultGARCacheURL } from "@/lib/consts"
import { extractGarItems } from "@/lib/convert"
import { ReportSummaryTable } from "./ReportSummaryTable";

interface Props {
  host: string;
}

export const CurrentReport = ({ host }: Props) => {
  const {
    data: garData,
    isError: isGarError,
  } = useQuery(['gar'], async () => {
    const fetchResult = await fetch(defaultGARCacheURL);
    const fetchJson = await fetchResult.json();
    const garItems = extractGarItems(fetchJson);
    return garItems;
  });

  const observer = garData?.find((item) => item.settings.fqdn === host)
  const observerNotFound = (garData !== undefined) && (observer === undefined);

  const {
    data: reportData,
    isError: isReportError,
  } = useQuery(['observationReportCurrent', observer?.id], async () => {
    if (observer) {
      return await downloadCurrentReportInfoFromGateway(observer.linkFull)
    }
  }, {
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
      garData={garData}
      isGarError={isGarError}
      reportData={reportData}
      isReportError={isReportError}
    />
  )
}
