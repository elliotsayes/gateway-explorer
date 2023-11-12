import { getObserverReportsArweave } from "./load";

export function LoadTest() {
  const handleTestClick = async () => {
    const reports = await getObserverReportsArweave({
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
