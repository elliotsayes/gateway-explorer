import { zArweaveTxId, zGatewayAddressRegistryItem } from '@/types'
import { z } from 'zod'
import { Input } from './ui/input';
import { useEffect, useRef, useState } from 'react';
import { queryClient, reportTxQueryBuilder } from '@/lib/query';
import { useNavigate } from '@tanstack/react-router';
import { Loader } from 'lucide-react';

interface ReportPasteAndGoProps {
  garData?: Array<z.infer<typeof zGatewayAddressRegistryItem>>
  initialTxId?: string
  fallbackFqdnKey: string
}

const ReportPasteAndGo = (props: ReportPasteAndGoProps) => {
  const { garData, initialTxId, fallbackFqdnKey } = props;

  const [txId, setTxId] = useState<string>(initialTxId ?? "");
  const [firing, setFiring] = useState<boolean>(false);
  const failedTxId = useRef<string | undefined>(undefined);

  const navigate = useNavigate();

  useEffect(() => {
    if (!garData || firing || txId === initialTxId || txId === failedTxId.current) {
      return;
    }

    const txParse = zArweaveTxId.safeParse(txId);
    if (!txParse.success) {
      return;
    }

    async function fetchReport() {
      setFiring(true);
      try {
        const res = await queryClient.ensureQueryData(
          reportTxQueryBuilder(txId),
        );
        const garItem = garData?.find((item) => item.observerWallet === res.reportData.observerAddress)
        navigate({
          to: "/gateway/$host/reports/tx/$txId",
          params: { host: garItem?.fqdnKey ?? fallbackFqdnKey, txId: txId },
        })
      } catch (e) {
        console.error(e);
        failedTxId.current = txId;
        setFiring(false);
      }
    }
    fetchReport();
  }, [navigate, garData, initialTxId, txId, fallbackFqdnKey, firing]);

  return (
    <div className='flex flex-row items-center'>
      <Input
        type='text'
        className='pr-8'
        placeholder='Paste Report txId'
        onChange={(e) => {
          e.preventDefault();
          setTxId(e.target.value);
        }}
        value={txId}
      />
      <Loader 
        className={`relative -left-7 animate-spin-slow transition-opacity ${firing ? 'opacity-80' : 'opacity-0'}`}
      />
    </div>
  )
}

export { ReportPasteAndGo }