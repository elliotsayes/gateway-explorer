import Dexie, { Table } from "dexie";
import { Transaction } from "../observer/downloadObservation";
import { ObserverReport } from "../observer/types";

export class ObservationDatabase extends Dexie {
  public observationIndex!: Table<Transaction, string>;
  public observerReports!: Table<ObserverReport, string>;
  public gatewayAssessments!: Table<ObserverReport, string>;

  public constructor() {
    super("ObservationDatabase");
    this.version(1).stores({
      observationIndex: "id, owner.address",
      observerReports: "observerAddress, epochStartHeight, generatedAt",
    });
  }
}

export const observationDb = new ObservationDatabase();
