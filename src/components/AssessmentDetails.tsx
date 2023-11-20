import { ReportTableDatum } from "@/lib/observer/report"

interface Props {
  reportDatum: ReportTableDatum
}

export const AssessmentDetails = ({ reportDatum }: Props) => {
  const { gatewayHost, gatewayAssessment, statistics } = reportDatum;

  return (
    <div>
      {gatewayHost}
      {gatewayAssessment.ownershipAssessment.expectedWallet}
      {statistics.passFail.allNames.passRate}
    </div>
  )
}
