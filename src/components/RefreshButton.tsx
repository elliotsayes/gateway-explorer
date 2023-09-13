import { Button } from "@/components/ui/button";
import { RefreshCcw } from "lucide-react";

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isRefreshing: boolean
  onClick: () => void
}

const RefreshButton = ({ isRefreshing, onClick, ...props }: Props) => {
  return (
    <Button onClick={isRefreshing ? undefined: onClick } disabled={isRefreshing} size={"icon"} {...props} >
      <RefreshCcw className={`h-4 w-4 ${isRefreshing && 'animate-spin-ccw'}`} />
    </Button>
  );
}

export { RefreshButton }