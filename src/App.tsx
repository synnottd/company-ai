import { ThemeProvider } from './components/theme-provider'
import { ModeToggle } from './components/mode-toggle'
import { ConversationViewer } from './components/conversation-viewer'
import type { Message } from './types/message'

const messages: Message[] = [
  { id: 1, text: "Hey! How are you?", sender: "user", time: "10:00" },
  { id: 2, text: "I'm good, thanks! And you?", sender: "ai", time: "10:01" },
  { id: 3, text: "Doing well!", sender: "user", time: "10:02" },
  { id: 4, text: "What are you up to?", sender: "ai", time: "10:03" },
  { id: 5, text: "Just working on a project.", sender: "user", time: "10:04" },
  { id: 6, text: "Sounds interesting!", sender: "ai", time: "10:05" },
  { id: 7, text: "Yeah, it's pretty cool.", sender: "user", time: "10:06" },
  { id: 8, text: "What about you?", sender: "ai", time: "10:07" },
];


function App() {

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <div className='flex flex-col justify-center items-center h-screen'>
        <div className='flex w-full justify-end grow shrink'><ModeToggle /></div>
        <ConversationViewer messages={messages} />
      </div>
  </ThemeProvider>
  )
}

export default App
