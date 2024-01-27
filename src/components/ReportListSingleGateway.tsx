
import { useQuery } from "@tanstack/react-query"
import { ReportListTable } from "./ReportListTable";
import { garQueryBuilder } from "@/lib/query";
import { defaultNetwork } from "@/lib/networks";

interface Props {
  host: string;
}

export const ReportListSingleGateway = ({ host }: Props) => {
  const {
    data: garData,
    isError: isGarError,
  } = useQuery(garQueryBuilder(defaultNetwork));

  const observer = garData?.find((item) => item.fqdnKey === host)
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
