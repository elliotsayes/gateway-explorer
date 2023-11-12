import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
// import GarLoader from './components/GarLoader'
import { LoadTest } from './lib/observer/LoadTest'

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      {/* <GarLoader /> */}
      <LoadTest />
    </QueryClientProvider>
  )
}

export default App
