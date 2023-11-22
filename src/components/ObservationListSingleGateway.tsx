interface Props {
  host: string;
}

export const ObservationListSingleGateway = ({ host }: Props) => {
  console.log("Rendering ObservationListSingleGateway")
  return (
    <div>
      <p>ObservationListSingleGateway: {host}</p>
    </div>
  )
}
