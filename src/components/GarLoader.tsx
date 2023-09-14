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
import { useState } from 'react';
import { pingUpdater } from '@/lib/pinger';

const GarLoader = () => {
  const [isPinging, setIsPinging] = useState(false)

  const { data, isLoading, isFetching, error, refetch } = useQuery(['gar'], async () => {
    const fetchResult = await fetch(defaultGARCacheURL);
    const fetchJson = await fetchResult.json();
    const garItems = extractGarItems(fetchJson);
    return garItems;
  }, {
    onSuccess: async (data) => {
      setIsPinging(true)
      setProcData(data)
      await pingUpdater(data, (newData) => {
        setProcData([...newData])
      })
      setIsPinging(false)
    },
    refetchInterval: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchIntervalInBackground: false,
    refetchOnWindowFocus: false,
  });

  const [procData, setProcData] = useState(data ?? [])
  const [selectedItemId, setSelectedItemId] = useState<string | undefined>(undefined)

  if (error) return <div>Error: {JSON.stringify(error)}</div>

  return (
    <div className="max-h-screen overscroll-contain px-2 sm:px-8 py-4">
      <Card>
        <CardHeader>
          <CardTitle>ar.io Gateway Address Registry</CardTitle>
          <CardDescription>List of all Gateways</CardDescription>
        </CardHeader>
        <CardContent>
          <GarTable
            data={procData}
            isRefreshing={isLoading || isFetching || isPinging}
            onRefresh={() => {refetch()}}
            onItemSelect={(item) => {setSelectedItemId(item.id)}}
            selectedItemId={selectedItemId}
          />
        </CardContent>
      </Card>
    </div>
  )
}

export default GarLoader