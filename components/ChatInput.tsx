import { useState } from 'react'
import { Send } from 'lucide-react'

interface ChatInputProps {
  onSendMessage: (text: string) => void
}

export default function ChatInput({ onSendMessage }: ChatInputProps) {
  const [input, setInput] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (input.trim()) {
      onSendMessage(input)
      setInput('')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="relative">
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type your message..."
        className="w-full focus:outline-none focus:placeholder-gray-400 text-black placeholder-gray-400 pl-4 pr-20 py-3 rounded-full bg-white shadow-md"
      />
      <button
        type="submit"
        className="absolute right-2 top-1/2 transform -translate-y-1/2 inline-flex items-center justify-center rounded-full p-2 transition duration-500 ease-in-out text-white bg-green-900 hover:bg-green-700 focus:outline-none"
      >
        <Send size={20} />
      </button>
    </form>
  )
}