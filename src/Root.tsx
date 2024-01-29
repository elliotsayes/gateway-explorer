import { Outlet } from "@tanstack/react-router"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import arioLogo from './assets/ar.io-white.png'
import { Toaster } from "./components/ui/toaster"
import { useNetwork } from "./hooks/useNetwork"
import { ExternalLinkIcon, InfoIcon } from "lucide-react"
import { Tooltip } from "./components/ui/tooltip"
import { TooltipContent, TooltipProvider, TooltipTrigger } from "@radix-ui/react-tooltip"

export const Root = () => {
  const network = useNetwork();

  return (
    <>
      <div className="max-h-[100vh] px-2 md:px-8 lg:px-16 py-4">
        <Card>
          <CardHeader>
            <CardTitle className='flex flex-col md:flex-row px-2 items-center md:items-baseline'>
              <a
                href='/'
                className='flex items-center px-1 flex-col md:flex-row gap-2 md:gap-4'
              >
                <img src={arioLogo} width='100rem' />
                <span className='font-ario text-3xl'>
                  Gateway Explorer
                </span>
              </a>
              {
                network == "devnet" && 
                  <sup className='text-lg text-muted-foreground'>
                    &nbsp;dev
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <InfoIcon size={12} className="ml-0.5" />
                        </TooltipTrigger>
                        <TooltipContent align="start" className="z-50">
                          <Card className="font-normal text-sm px-2 py-1">
                            <a href='https://gateways.permagate.io/' target='_blank' className="underline flex flex-row items-baseline">
                              <span className="">Go to mainnet</span><ExternalLinkIcon size={12} className='flex ml-0.5' />
                            </a>
                          </Card>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </sup>
              }
              {
                network == "mainnet" && 
                  <sup className='text-lg text-muted-foreground'>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <InfoIcon size={12} />
                        </TooltipTrigger>
                        <TooltipContent align="start" className="z-50">
                          <Card className="font-normal text-sm px-2 py-1">
                            <span>On mainnet</span>
                            <a href='https://gateways.ar-io.dev/' target='_blank' className="underline flex flex-row items-baseline">
                              <span className="">Go to devnet</span><ExternalLinkIcon size={12} className='flex ml-0.5' />
                            </a>
                          </Card>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </sup>
              }
            </CardTitle>
            {/* <CardDescription>List of all Gateways</CardDescription> */}
          </CardHeader>
          <CardContent>
            <Outlet />
          </CardContent>
        </Card>
        <div className='flex flex-col text-center text-muted-foreground gap-1 pt-2'>
          <div className='flex flex-row flex-grow justify-center gap-2'>
            <div className='flex'>
              <a href='https://ar.io/' target='_blank' className="underline">
                Home
              </a>
            </div>
            <span className='font-bold'>•</span>
            <div className='flex'>
              <a href='https://ar.io/docs/' target='_blank' className="underline">
                Docs
              </a>
            </div>
            <span className='font-bold'>•</span>
            <div className='flex'>
              <a href='https://github.com/ar-io' target='_blank' className="underline">
                Github
              </a>
            </div>
            <span className='font-bold'>•</span>
            <div className='flex'>
              <a href='https://discord.gg/7zUPfN4D6g' target='_blank' className="underline">
                Discord
              </a>
            </div>
          </div>
          <div>
            ©2023 ar.io
          </div>
          {/* <div className={`${isDetailsSheetOpen ? 'h-[calc(50vh+3em)]' : 'h-[2em]'} transition-all duration-200`} /> */}
          <div className={`h-[2em] transition-all duration-200`} />
        </div>
      </div>
      <Toaster />
    </>
  )
}
