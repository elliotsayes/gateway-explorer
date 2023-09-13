import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import GarLoader from './components/GarLoader'

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <GarLoader />
    </QueryClientProvider>
  )
}

export default App
