import { AppContextProvider } from './context/Create_context'
import Notification from './components/Notifiction'

function App() {
  
  return (
    <AppContextProvider>
      <div>
        <Notification />
      </div>
    </AppContextProvider>
  )
}

export default App
