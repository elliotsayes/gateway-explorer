import { zArweaveTxId, zGatewayAddressRegistryItem } from '@/types'
import { z } from 'zod'
import { Input } from './ui/input';
import { useEffect, useState } from 'react';
import { queryClient, reportTxQueryBuilder } from '@/lib/query';
import { useNavigate } from '@tanstack/react-router';

interface ReportPasteAndGoProps {
  garData?: Array<z.infer<typeof zGatewayAddressRegistryItem>>
  initialTxId?: string
  fallbackFqdnKey: string
}

const ReportPasteAndGo = (props: ReportPasteAndGoProps) => {
  const { garData, initialTxId, fallbackFqdnKey } = props;

  const [txId, setTxId] = useState<string>(initialTxId ?? "");
  const [firing, setFiring] = useState<boolean>(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (!garData || firing || txId === initialTxId) {
      return;
    }

    const txParse = zArweaveTxId.safeParse(txId);
    if (!txParse.success) {
      return;
    }

    async function fetchReport() {
      setFiring(true);
      const res = await queryClient.ensureQueryData(
        reportTxQueryBuilder(txId),
      );
      const garItem = garData?.find((item) => item.observerWallet === res.reportData.observerAddress)
      navigate({
        to: "/gateway/$host/reports/tx/$txId",
        params: { host: garItem?.fqdnKey ?? fallbackFqdnKey, txId: txId },
      })
    }
    fetchReport();
  }, [navigate, garData, initialTxId, txId, fallbackFqdnKey, firing]);

  return (
    <>
      <Input
        type='text'
        placeholder='Paste Report txId'
        onChange={(e) => {
          e.preventDefault();
          setTxId(e.target.value);
        }}
        value={txId}
      />
    </>
  )
}

export { ReportPasteAndGo }