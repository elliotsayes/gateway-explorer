import { generateGatewayAssessmentForHost } from "@/lib/observer/runObservation";
import { Button } from "./ui/button";
import { useMutation, useQuery } from "@tanstack/react-query";
import { garQuery } from "@/lib/query";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { useState } from "react";
import { GatewayAssessmentSummary, generateGatewayAssessmentSummary } from "@/lib/observer/report";
import { AssessmentDetails } from "./AssessmentDetails";
import { GatewayAssessmentPersistRow, observationDb } from "@/lib/idb/observation";

interface Props {
  host: string;
}

export const ObservationListSingleGateway = ({ host }: Props) => {
  const [isAssessmentSheetOpen, setIsDetailsSheetOpen] = useState(false);
  const [selectedAssessment, setSelectedAssessment] = useState<GatewayAssessmentSummary | undefined>(undefined);

  const {
    data,
    isError,
  } = useQuery(garQuery);

  const target = data?.find((item) => item.settings.fqdn === host)
  const targetNotFound = (data !== undefined) && (target === undefined);

  const {
    mutate,
    isPending,
  } = useMutation({
    mutationKey: ['observationReportCurrent', target?.id],
    mutationFn: async () => {
      if (target === undefined) throw Error('Target is undefined');
      const res = await generateGatewayAssessmentForHost(
        target,
        [],
        ['ardrive-dapp'],
      );
      return res;
    },
    onSuccess: async (data) => {
      console.log(`Generated Assessment for ${host}`, data)
      
      // Show Summary
      const gatewayAssessmentSummary = generateGatewayAssessmentSummary(host, data);
      console.log(`Showing summary`, gatewayAssessmentSummary)
      setSelectedAssessment(gatewayAssessmentSummary)
      setIsDetailsSheetOpen(true)
      
      // Persist
      const persistRow: GatewayAssessmentPersistRow = {
        type: "browser",
        timestamp: Date.now(),
        targetGatewayHost: host,
        gatewayAssessmentSummary,
      }

      const result = await observationDb.gatewayAssessments.add(persistRow);
      console.log(`Saving assessment result`, result)
    }
  })

  if (isError) {
    return (
      <div>
        Failed to load Gateway Info
      </div>
    )
  }

  if (targetNotFound) {
    return (
      <div>
        Gateway not found
      </div>
    )
  }

  const canRunAssessment = target !== undefined && !isPending;

  return (
    <div>
      <Button
        onClick={canRunAssessment ? () => mutate() : undefined}
        className={`${!canRunAssessment ? 'cursor-wait' : ''} ${isPending ? 'animate-pulse' : ''}`}
      >
        Run Observation
      </Button>
      <p>ObservationListSingleGateway: {host}</p>
      <Sheet
        open={isAssessmentSheetOpen}
        // onOpenChange={(isOpen) => {
        //   setIsSheetOpen(isOpen)
        // }}
        modal={false}
      >
        <SheetContent
          side="bottom"
          onCloseButtonClick={() => {
            setIsDetailsSheetOpen(false)
            // setSelectedItemId(undefined)
          }}
        >
          <SheetHeader>
            <SheetTitle className='pb-4'>
              Assessment Details
              {/* {selectedItem?.settings.label && <> - <code>{selectedItem?.settings.label}</code></>} */}
            </SheetTitle>
          </SheetHeader>
          {
            selectedAssessment &&
              <AssessmentDetails
                reportDatum={selectedAssessment}
              />
          }
        </SheetContent>
      </Sheet>
    </div>
  )
}
