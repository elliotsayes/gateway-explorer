
import { useQuery } from "@tanstack/react-query"
import { defaultGARCacheURL } from "@/lib/consts"
import { extractGarItems } from "@/lib/convert"
import { ReportListTable } from "./ReportListTable";

interface Props {
  host: string;
}

export const ReportListSingleGateway = ({ host }: Props) => {
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

  if (observerNotFound) {
    return (
      <div>
        Observer not found
      </div>
    )
  }

  return (
    <ReportListTable
      host={host}
      garData={garData}
      isGarError={isGarError}
      observer={observer}
    />
  )
}
