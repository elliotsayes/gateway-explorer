import Dexie, { Table } from "dexie";
import { GatewayAssessmentSummary } from "../observer/report";

export interface GatewayAssessmentPersistRow {
  type: string;
  timestamp: number;
  targetGatewayHost: string;
  gatewayAssessmentSummary: GatewayAssessmentSummary;
}

export class ObservationDatabase extends Dexie {
  public gatewayAssessments!: Table<GatewayAssessmentPersistRow, string>;

  public constructor() {
    super("ObservationDatabase");
    this.version(1).stores({
      gatewayAssessments: "type, timestamp, targetGatewayHost",
    });
  }
}

export const observationDb = new ObservationDatabase();
