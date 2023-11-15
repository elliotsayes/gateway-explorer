interface PassFailCellProps {
  pass: boolean;
  children?: React.ReactNode;
}

export const PassFailCell = ({ pass, children }: PassFailCellProps) => {
  return (
    pass ? (
      <div className="flex flex-row items-center gap-2 max-w-[10rem]">
        <div className="h-2 w-2 rounded-full bg-green-400" />
        <span className="text-xs text-muted-foreground line-clamp-1">Pass</span>
        {children}
      </div>
    ) : (
      <div className="flex flex-row items-center gap-2 max-w-[8rem]">
        <div className="h-2 w-2 rounded-full bg-red-400" />
        <span className="text-xs text-muted-foreground line-clamp-1 text-clip">Fail</span>
        {children}
      </div>
    )
  )
}
