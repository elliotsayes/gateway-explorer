import { defaultGARCacheURL } from '@/lib/consts'
import { extractGarItems } from '@/lib/convert';
import { 
  useQuery,
} from '@tanstack/react-query'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { GarTable } from './GarTable';

const GarLoader = () => {
  const { data, isLoading, error, refetch, dataUpdatedAt } = useQuery(['gar'], async () => {
    const fetchResult = await fetch(defaultGARCacheURL);
    const fetchJson = await fetchResult.json();
    const garItems = extractGarItems(fetchJson);
    return garItems;
  });

  if (error) return <div>Error: {JSON.stringify(error)}</div>

  return (
    <div className=" h-screen px-2 md:px-8 py-4">
      <Card>
        <CardHeader>
          <CardTitle>ar.io Gateway Address Registry</CardTitle>
          <CardDescription>List of all Gateways</CardDescription>
        </CardHeader>
        <CardContent>
          <GarTable
            key={dataUpdatedAt}
            data={data ?? []}
            isRefreshing={isLoading}
            onRefresh={() => {refetch()}}
            onItemSelect={() => {}}
          />
        </CardContent>
      </Card>
    </div>
  )
}

export default GarLoader