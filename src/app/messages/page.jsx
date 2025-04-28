'use client'
import { useState, useEffect, useRef } from 'react'
import { PaperAirplaneIcon } from '@heroicons/react/24/outline'
import { EllipsisIcon } from 'lucide-react'
import Footer from '@/src/components/common/Footer/Footer'
import { Card } from '@/components/ui/card'

export default function MessageApp() {
    const [conversations, setConversations] = useState([
        {
            id: '1',
            name: 'Career Support',
            avatar: '/support-avatar.png',
            lastMessage: 'We can help with your resume',
            time: '10:30 AM',
            unread: 0,
            messages: [
                { id: '1-1', text: 'Welcome to our job support program!', time: '10:20 AM', sent: false },
                { id: '1-2', text: 'We noticed you were looking for frontend roles', time: '10:25 AM', sent: false }
            ]
        }
    ])

    const [activeChatId, setActiveChatId] = useState('1')
    const [newMessage, setNewMessage] = useState('')
    const [showSidebar, setShowSidebar] = useState(true)
    const messagesEndRef = useRef(null)

    // Get active chat data
    const activeChat = conversations.find(chat => chat.id === activeChatId)

    // Auto-scroll to bottom when messages change
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [activeChat?.messages])

    // Toggle sidebar on mobile
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 768) {
                setShowSidebar(false)
            } else {
                setShowSidebar(true)
            }
        }

        handleResize() // Set initial state
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    const handleSendMessage = () => {
        if (!newMessage.trim()) return

        // Create new message object
        const sentMessage = {
            id: `${activeChatId}-${Date.now()}`,
            text: newMessage,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            sent: true
        }

        // Update conversations state
        setConversations(prev => prev.map(chat => {
            if (chat.id === activeChatId) {
                return {
                    ...chat,
                    messages: [...chat.messages, sentMessage],
                    lastMessage: newMessage,
                    time: 'Just now'
                }
            }
            return chat
        }))

        // Clear input
        setNewMessage('')

        // Simulate reply after 1 second
        setTimeout(() => {
            const replyMessages = [
                "Thanks for your message!",
                "We'll get back to you shortly",
                "Can you share more details?"
            ]
            const randomReply = replyMessages[Math.floor(Math.random() * replyMessages.length)]

            setConversations(prev => prev.map(chat => {
                if (chat.id === activeChatId) {
                    return {
                        ...chat,
                        messages: [
                            ...chat.messages,
                            {
                                id: `${activeChatId}-${Date.now()}`,
                                text: randomReply,
                                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                                sent: false
                            }
                        ],
                        lastMessage: randomReply,
                        time: 'Just now'
                    }
                }
                return chat
            }))
        }, 1000)
    }

    return (
        <div className='bg-white flex-1 flex flex-col'>
            <div className="flex flex-1 w-full max-w-7xl mx-auto overflow-hidden">
                {/* Sidebar - Conversation List */}
                {showSidebar && (
                    <Card className="bg-white w-full md:w-80 border-r-0  flex-shrink-0 absolute md:relative z-10 h-full md:h-auto">
                        <div className="p-4 border-b flex items-center justify-between">
                            <h1 className="text-xl font-bold">Messages</h1>
                            <button
                                className="md:hidden p-1 rounded-full hover:bg-gray-100"
                                onClick={() => setShowSidebar(false)}
                            >
                                &times;
                            </button>
                        </div>
                        <div className="overflow-y-auto h-[calc(100%-60px)]">
                            {conversations.map(chat => (
                                <div
                                    key={chat.id}
                                    className={`p-4 border-b flex items-center cursor-pointer hover:bg-gray-50 ${activeChatId === chat.id ? 'bg-blue-50' : ''
                                        }`}
                                    onClick={() => {
                                        setActiveChatId(chat.id)
                                        if (window.innerWidth < 768) {
                                            setShowSidebar(false)
                                        }
                                    }}
                                >
                                    <img
                                        src={chat.avatar}
                                        alt={chat.name}
                                        className="w-12 h-12 rounded-full object-cover"
                                    />
                                    <div className="ml-3 flex-1">
                                        <div className="flex justify-between items-center">
                                            <h3 className="font-medium">{chat.name}</h3>
                                            <span className="text-xs text-gray-500">{chat.time}</span>
                                        </div>
                                        <p className="text-sm text-gray-500 truncate">{chat.lastMessage}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>
                )}

                {/* Main Chat Area */}
                <Card className={`flex-1 border-r-l flex flex-col ${!showSidebar ? 'w-full' : ''}`}>
                    {activeChat ? (
                        <>
                            <div className="p-3 border-b flex items-center">
                                <button
                                    className="md:hidden mr-2 p-1 rounded-full hover:bg-gray-100"
                                    onClick={() => setShowSidebar(true)}
                                >
                                    &larr;
                                </button>
                                <img
                                    src={activeChat.avatar}
                                    alt={activeChat.name}
                                    className="w-10 h-10 rounded-full object-cover"
                                />
                                <div className="ml-3 flex-1">
                                    <h2 className="font-medium">{activeChat.name}</h2>
                                    <p className="text-xs text-gray-500">Online</p>
                                </div>
                                <button className="p-2 rounded-full hover:bg-gray-100">
                                    <EllipsisIcon className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
                                <div className="space-y-3">
                                    {activeChat.messages.map(msg => (
                                        <div
                                            key={msg.id}
                                            className={`flex ${msg.sent ? 'justify-end' : 'justify-start'}`}
                                        >
                                            <div
                                                className={`max-w-xs md:max-w-md rounded-lg p-3 ${msg.sent
                                                        ? 'bg-blue-500 text-white rounded-br-none'
                                                        : 'bg-white border rounded-bl-none'
                                                    }`}
                                            >
                                                <p>{msg.text}</p>
                                                <p className={`text-xs mt-1 ${msg.sent ? 'text-blue-100' : 'text-gray-400'
                                                    }`}>
                                                    {msg.time}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                    <div ref={messagesEndRef} />
                                </div>
                            </div>

                            <div className="p-3 border-t bg-white">
                                <div className="flex items-center">
                                    <input
                                        type="text"
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                                        placeholder="Type a message..."
                                        className="flex-1 border rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
                                    />
                                    <button
                                        onClick={handleSendMessage}
                                        disabled={!newMessage.trim()}
                                        className="ml-2 p-2 bg-blue-500 text-white rounded-full disabled:opacity-50"
                                    >
                                        <PaperAirplaneIcon className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex items-center justify-center bg-gray-50">
                            <p className="text-gray-500">Select a conversation to start chatting</p>
                        </div>
                    )}
                </Card>
            </div>
            <div className='max-w-7xl mx-auto w-full'>
                <Footer />
            </div>
        </div>
    )
}