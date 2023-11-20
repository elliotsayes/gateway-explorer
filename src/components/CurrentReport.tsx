
import { useQuery } from "@tanstack/react-query"
import { downloadCurrentReportInfoFromGateway } from "@/lib/observer/downloadObservation"
import { defaultGARCacheURL } from "@/lib/consts"
import { extractGarItems } from "@/lib/convert"
import { ReportTable } from "./ReportTable";

interface Props {
  id: string;
}

export const CurrentReport = ({ id }: Props) => {
  const {
    data: garData,
    isError: isGarError,
  } = useQuery(['gar'], async () => {
    const fetchResult = await fetch(defaultGARCacheURL);
    const fetchJson = await fetchResult.json();
    const garItems = extractGarItems(fetchJson);
    return garItems;
  });

  const observer = garData?.find((item) => item.id === id)

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

  return (
    <ReportTable
      id={id}
      garData={garData}
      isGarError={isGarError}
      reportData={reportData}
      isReportError={isReportError}
    />
  )
}
