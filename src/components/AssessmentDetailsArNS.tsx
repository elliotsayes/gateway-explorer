import { ArnsNameAssessment } from "@/lib/observer/types"
import { StringComparitor } from "./StringComparitor";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { PassFailDetails } from "./PassFailDetails";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { AssessmentTimings } from "./AssessmentTimings";

interface Props {
  arnsName: string;
  arnsAssessment: ArnsNameAssessment;
  assessmentType: "Prescribed Name" | "Chosen Name";
}

export const AssessmentDetailsArNS = ({ arnsName, arnsAssessment, assessmentType }: Props) => {
  const {
    // assessedAt,
    pass,
    failureReason,
    expectedStatusCode,
    resolvedStatusCode,
    expectedId,
    resolvedId,
    expectedDataHash,
    resolvedDataHash,
    timings,
  } = arnsAssessment;

  const totalMs = timings?.total?.toString()

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <div className="flex flex-row gap-2 items-center">
            <span className="text-xl">{arnsName}</span>
            <PassFailDetails
              pass={pass}
              passText={`Passed${ totalMs && ` in ${totalMs}ms`}`}
              failureText="Failed"
              failureDetails={failureReason}
            />
          </div>
        </CardTitle>
        <CardDescription className="text-left">
          {assessmentType}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <StringComparitor
          label="Status Code"
          expected={expectedStatusCode?.toString()}
          actual={resolvedStatusCode?.toString()}
        />
        <StringComparitor
          label="ID"
          expected={expectedId}
          actual={resolvedId}
        />
        <StringComparitor
          label="Data Hash"
          expected={expectedDataHash}
          actual={resolvedDataHash}
        />
        {
          timings && (
            <Accordion type="single" collapsible>
              <AccordionItem value="timings" className=" max-w-screen-sm">
                <AccordionTrigger>Timings</AccordionTrigger>
                <AccordionContent>
                  <AssessmentTimings
                    timings={timings}
                  />
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          )
        }
      </CardContent>
    </Card>
  )
}
