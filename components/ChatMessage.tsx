import Image from 'next/image'
import Markdown from 'react-markdown'

interface ChatMessageProps {
  message: {
    id: string
    text: string
    userId: string
    username: string
    createdAt: any
  }
  currentUserId?: string
}

export default function ChatMessage({ message, currentUserId }: ChatMessageProps) {
  const isOwnMessage = message.userId === currentUserId

  return (
    <div className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
      <div className={`flex items-start max-w-[80%] md:max-w-xl`}>
        {!isOwnMessage && (
          <div className="flex-shrink-0 mr-2">
            <Image
              src="/placeholder.svg"
              alt="User"
              width={40}
              height={40}
              className="rounded-full"
            />
          </div>
        )}
        <div
          className={`px-3 py-2 rounded-lg ${
            isOwnMessage ? 'bg-green-700 text-white' : 'bg-white text-green-900 shadow-md'
          }`}
        >
          <p className="font-semibold">{message.username}</p>
          <Markdown>{message.text}</Markdown>
          <p className="text-xs mt-1 opacity-75">
            {message.createdAt?.toDate().toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  )
}