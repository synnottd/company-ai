import { ThemeProvider } from './components/theme-provider'
import { ModeToggle } from './components/mode-toggle'
import { ConversationViewer } from './components/conversation-viewer'
import { setupWorker } from 'msw/browser'
import { handlers } from './mocks'
import { useEffect } from 'react'
import { getAllReports } from './lib/reportDB'
import { Toaster } from './components/ui/sonner'
 
export const worker = setupWorker(...handlers);
worker.start();

function App() {
  useEffect(() => {getAllReports().then(console.log)}, []);
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <main className='flex flex-col justify-center items-center h-screen'>
        <div className='flex w-full justify-end grow shrink'><ModeToggle /></div>
        <ConversationViewer />
      </main>
      <Toaster />
  </ThemeProvider>
  )
}

export default App
