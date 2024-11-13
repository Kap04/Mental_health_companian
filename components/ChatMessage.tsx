import Image from 'next/image'
import Markdown from 'react-markdown'

// Define the type for Firestore Timestamp
interface Timestamp {
  toDate: () => Date;
  seconds: number;
  nanoseconds: number;
}

interface ChatMessageProps {
  message: {
    id: string
    text: string
    userId: string
    username: string
    createdAt: Timestamp | Date | number // Allow multiple timestamp formats
  }
  currentUserId?: string
}

export default function ChatMessage({ message, currentUserId }: ChatMessageProps) {
  const isOwnMessage = message.userId === currentUserId

  // Format the timestamp based on its type
  const formatTimestamp = (timestamp: Timestamp | Date | number) => {
    if (timestamp instanceof Date) {
      return timestamp.toLocaleString()
    }
    if (typeof timestamp === 'number') {
      return new Date(timestamp).toLocaleString()
    }
    if ('toDate' in timestamp) {
      return timestamp.toDate().toLocaleString()
    }
    return 'Invalid date'
  }

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
            {formatTimestamp(message.createdAt)}
          </p>
        </div>
      </div>
    </div>
  )
}