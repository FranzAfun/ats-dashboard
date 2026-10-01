import { RouterProvider } from 'react-router-dom'
import AccessProvider from './app/AccessProvider.jsx'
import { router } from './routes/router.js'

function App() {
  return (
    <AccessProvider>
      <RouterProvider router={router} />
    </AccessProvider>
  )
}

export default App
