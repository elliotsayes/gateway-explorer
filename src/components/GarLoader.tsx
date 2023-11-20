import { defaultGARCacheURL } from '@/lib/consts'
import { extractGarItems } from '@/lib/convert';
import { 
  useQuery,
} from '@tanstack/react-query'
import { GarTable } from './GarTable';
import { useEffect, useState } from 'react';
import { pingUpdater } from '@/lib/pinger';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from './ui/sheet';
import GatewayDetails from './GatewayDetails';

const GarLoader = () => {
  const [isPinging, setIsPinging] = useState(false)

  const { data, isLoading, isFetching, error, refetch, isRefetching } = useQuery({
    queryKey: ['gar'], 
    queryFn: async () => {
      const fetchResult = await fetch(defaultGARCacheURL);
      const fetchJson = await fetchResult.json();
      const garItems = extractGarItems(fetchJson);
      return garItems;
    }, 
    refetchInterval: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchIntervalInBackground: false,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (data && !isRefetching) {
      (async () => {
        setIsPinging(true)
        setProcData(data)
        await pingUpdater(data, (newData) => {
          setProcData([...newData])
        })
        setIsPinging(false)
      })()
    }
  }, [data, isRefetching])


  const [procData, setProcData] = useState(data ?? [])
  const [selectedDetailsItemId, setSelectedDetailsItemId] = useState<string | undefined>(undefined)
  const selectedDetailsItem = procData.find((item) => item.id === selectedDetailsItemId)
  
  const [isDetailsSheetOpen, setIsDetailsSheetOpen] = useState(false)
  
  if (error) return <div>Error: {JSON.stringify(error)}</div>

  return (
    <>
      <GarTable
        data={procData}
        isRefreshing={isLoading || isFetching || isPinging}
        onRefresh={() => {refetch()}}
        onItemUpdate={(updatedItem) => {
          setProcData((prevData) => {
            const prevItemIndex = prevData.findIndex((item) => item.id === updatedItem.id)
            if (prevItemIndex === -1) return prevData;
            const newData = [...prevData]
            newData[prevItemIndex] = updatedItem
            return newData
          })
        }}
        onItemSelect={(item) => {
          setSelectedDetailsItemId(item.id)
          if (!isDetailsSheetOpen) {
            setIsDetailsSheetOpen(true)
          }
        }}
        selectedItemId={selectedDetailsItemId}
      />
      <Sheet
        open={isDetailsSheetOpen}
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
              Gateway Details
              {/* {selectedItem?.settings.label && <> - <code>{selectedItem?.settings.label}</code></>} */}
            </SheetTitle>
            <GatewayDetails
              data={selectedDetailsItem!}
            />
          </SheetHeader>
        </SheetContent>
      </Sheet>
    </>
  )
}

export default GarLoader