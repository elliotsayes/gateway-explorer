import { defaultGARCacheURL } from '@/lib/consts'
import { extractGarItems } from '@/lib/convert';
import { 
  useQuery,
} from '@tanstack/react-query'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { GarTable } from './GarTable';
import { useState } from 'react';
import { pingUpdater } from '@/lib/pinger';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from './ui/sheet';
import GatewayDetails from './GatewayDetails';
import arioLogo from '../assets/ar.io-white.png'

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
  const selectedItem = procData.find((item) => item.id === selectedItemId)

  const [isSheetOpen, setIsSheetOpen] = useState(false)
  
  if (error) return <div>Error: {JSON.stringify(error)}</div>

  return (
    <div className="max-h-[100vh] px-2 sm:px-8 py-4">
      <Card>
        <CardHeader>
          <CardTitle className='flex flex-row gap-2 px-2 items-baseline'>
            <a
              href='https://ar.io/'
              className='px-1'
              target='_blank'
            >
              <img src={arioLogo} className='flex' width='100rem' />
            </a>
            <span className='font-ario text-3xl'>
              Gateway Explorer
            </span>
          </CardTitle>
          {/* <CardDescription>List of all Gateways</CardDescription> */}
        </CardHeader>
        <CardContent>
          <GarTable
            data={procData}
            isRefreshing={isLoading || isFetching || isPinging}
            onRefresh={() => {refetch()}}
            onItemSelect={(item) => {
              setSelectedItemId(item.id)
              if (!isSheetOpen) {
                setIsSheetOpen(true)
              }
            }}
            selectedItemId={selectedItemId}
          />
        </CardContent>
      </Card>
      <Sheet
        open={isSheetOpen}
        // onOpenChange={(isOpen) => {
        //   setIsSheetOpen(isOpen)
        // }}
        modal={false}
      >
        <SheetContent
          side="bottom"
          onCloseButtonClick={() => {
            setIsSheetOpen(false)
            // setSelectedItemId(undefined)
          }}
        >
          <SheetHeader>
            <SheetTitle className='pb-4'>
              Gateway Details{selectedItem?.settings.label && <> - <code>{selectedItem?.settings.label}</code></>}
            </SheetTitle>
            <GatewayDetails
              data={selectedItem!}
            />
          </SheetHeader>
        </SheetContent>
      </Sheet>
      <div className='flex flex-row flex-grow justify-center py-2 gap-4'>
        <div className='flex'>
          s
        </div>
      </div>
    </div>
  )
}

export default GarLoader