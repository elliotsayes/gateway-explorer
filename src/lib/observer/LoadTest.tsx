import { getObserverReportsTxIdsArweave } from "./load";

export function LoadTest() {
  const handleTestClick = async () => {
    const reports = await getObserverReportsTxIdsArweave({
      first: 10,
    }, false);
    console.log(reports);
  };

  return (
    <div>
      <button onClick={handleTestClick}>Test getAllObserverReportsArweave</button>
    </div>
  );
}
