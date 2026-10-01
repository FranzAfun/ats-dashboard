import { RouterProvider } from 'react-router-dom'
import AccessProvider from './app/AccessProvider.jsx'
import BootGate from './app/BootGate.jsx'
import { router } from './routes/router.js'

function App() {
  return (
    <AccessProvider>
      <BootGate router={router}>
        <RouterProvider router={router} />
      </BootGate>
    </AccessProvider>
  )
}

export default App
