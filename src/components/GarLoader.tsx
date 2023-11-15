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
import { ReportTable } from './ReportTable';

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

  const [isDetailsSheetOpen, setIsDetailsSheetOpen] = useState(false)
  const [isReportSheetOpen, setIsReportSheetOpen] = useState(false)
  
  if (error) return <div>Error: {JSON.stringify(error)}</div>

  return (
    <div className="max-h-[100vh] px-2 md:px-8 lg:px-16 py-4">
      <Card>
        <CardHeader>
          <CardTitle className='flex flex-col md:flex-row gap-2 px-2 items-center md:items-baseline'>
            <a
              href='https://ar.io/'
              className='px-1'
              target='_blank'
            >
              <img src={arioLogo} className='flex' width='100rem' />
            </a>
            <div className='flex'>
              <span className='font-ario text-3xl'>
                Gateway Explorer
              </span>
            </div>
          </CardTitle>
          {/* <CardDescription>List of all Gateways</CardDescription> */}
        </CardHeader>
        <CardContent>
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
              setSelectedItemId(item.id)
              if (!isDetailsSheetOpen) {
                setIsDetailsSheetOpen(true)
              }
            }}
            onOpenReport={(item) => {
              setSelectedItemId(item.id)
              if (!isReportSheetOpen) {
                setIsReportSheetOpen(true)
              }
            }}
            selectedItemId={selectedItemId}
          />
        </CardContent>
      </Card>
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
              data={selectedItem!}
            />
          </SheetHeader>
        </SheetContent>
      </Sheet>
      <Sheet
        open={isReportSheetOpen}
        // onOpenChange={(isOpen) => {
        //   setIsSheetOpen(isOpen)
        // }}
        modal={false}
      >
        <SheetContent
          side="bottom"
          onCloseButtonClick={() => {
            setIsReportSheetOpen(false)
            // setSelectedItemId(undefined)
          }}
        >
          <SheetHeader>
            <SheetTitle className='pb-4'>
              Report Details
              {/* {selectedItem?.settings.label && <> - <code>{selectedItem?.settings.label}</code></>} */}
            </SheetTitle>
            <div className='min-h-[20vh] max-h-[80vh] overflow-y-scroll'>
              {
                selectedItem && (
                  <ReportTable observer={selectedItem} onUpdateObserver={function (): void {
                    throw new Error('Function not implemented.');
                  }} />
                )
              }
            </div>
          </SheetHeader>
        </SheetContent>
      </Sheet>
      <div className='flex flex-col text-center text-muted-foreground gap-1 pt-2'>
        <div className='flex flex-row flex-grow justify-center gap-2'>
          <div className='flex'>
            <a href='https://ar.io/' target='_blank'>
              Home
            </a>
          </div>
          <span className='font-bold'>•</span>
          <div className='flex'>
            <a href='https://ar.io/docs/' target='_blank'>
              Docs
            </a>
          </div>
          <span className='font-bold'>•</span>
          <div className='flex'>
            <a href='https://github.com/ar-io' target='_blank'>
              Github
            </a>
          </div>
          <span className='font-bold'>•</span>
          <div className='flex'>
            <a href='https://discord.gg/7zUPfN4D6g' target='_blank'>
              Discord
            </a>
          </div>
        </div>
        <div>
          ©2023 ar.io
        </div>
        <div className={`${isDetailsSheetOpen ? 'h-[calc(50vh+3em)]' : 'h-[2em]'} transition-all duration-200`} />
      </div>
    </div>
  )
}

export default GarLoader