"use client"
import { useState, useEffect, useRef } from "react"
import {
  Send,
  MoreHorizontal,
  Search,
  ChevronLeft,
  Pin,
  Bell,
  BellOff,
  Trash,
  Pencil,
  Check,
  X,
  RotateCcw,
  Share2,
  Smile,
  ImageIcon,
  Paperclip,
  AlertCircle,
} from "lucide-react"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuPortal
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import EmojiPicker from "emoji-picker-react"

export default function MessageApp() {
  // State for conversations and active chat
  const [conversations, setConversations] = useState([
    {
      id: "1",
      name: "Career Support Team",
      avatar: "/support-avatar.png",
      position: "Career Advisor",
      lastMessage: "We can help with your resume",
      time: "10:30 AM",
      unread: 0,
      isMuted: false,
      isPinned: false,
      messages: [
        { id: "1-1", text: "Welcome to our job support program!", time: "10:20 AM", sent: false },
        { id: "1-2", text: "We noticed you were looking for frontend roles", time: "10:25 AM", sent: false },
        { id: "1-3", text: "Would you like us to review your portfolio?", time: "10:28 AM", sent: false },
      ],
    },
    {
      id: "2",
      name: "Alex Johnson",
      avatar: "",
      position: "Senior Developer at TechCorp",
      lastMessage: "About the project timeline...",
      time: "Yesterday",
      unread: 2,
      isMuted: true,
      isPinned: true,
      messages: [],
    },
    {
      id: "3",
      name: "Mentorship Program",
      avatar: "/mentorship-avatar.png",
      position: "Professional Network",
      lastMessage: "Your mentor has accepted your request",
      time: "May 20",
      unread: 0,
      isMuted: false,
      isPinned: false,
      messages: [],
    },
  ])

  const [activeChatId, setActiveChatId] = useState("1")
  const [newMessage, setNewMessage] = useState("")
  const [showSidebar, setShowSidebar] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [editingMessageId, setEditingMessageId] = useState(null)
  const [editedMessageText, setEditedMessageText] = useState("")
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [replyingTo, setReplyingTo] = useState(null)
  const [selectedFile, setSelectedFile] = useState(null)
  const [editAttachment, setEditAttachment] = useState(null)
  const [selectedSticker, setSelectedSticker] = useState(null)
  const messagesEndRef = useRef(null)
  const fileInputRef = useRef(null)
  const editFileInputRef = useRef(null)

  const activeChat = conversations.find((chat) => chat.id === activeChatId)

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [activeChat?.messages, replyingTo])

  // Responsive sidebar
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setShowSidebar(true)
      } else if (window.innerWidth < 768) {
        if (activeChatId && !showSidebar) {
          // Keep showing the active chat
        } else {
          setShowSidebar(true)
        }
      }
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [activeChatId, showSidebar])

  const handleSendMessage = () => {
    if (!newMessage.trim() && !selectedFile && !selectedSticker) return

    const sentMessage = {
      id: `${activeChatId}-${Date.now()}`,
      text: newMessage,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      sent: true,
      file: selectedFile,
      sticker: selectedSticker,
      replyTo: replyingTo,
    }

    updateConversation(activeChatId, {
      messages: [...activeChat.messages, sentMessage],
      lastMessage: truncateMessage(newMessage || selectedFile?.name || "Sticker"),
      time: "Just now",
      unread: 0,
    })

    setNewMessage("")
    setSelectedFile(null)
    setSelectedSticker(null)
    setReplyingTo(null)

    // Simulate reply
    setTimeout(() => {
      const replyMessages = [
        "Thanks for your message!",
        "We'll get back to you shortly",
        "Can you share more details?",
        "I've forwarded this to our team",
        "Let me check that for you",
      ]
      const randomReply = replyMessages[Math.floor(Math.random() * replyMessages.length)]

      updateConversation(activeChatId, {
        messages: [
          ...activeChat.messages,
          sentMessage,
          {
            id: `${activeChatId}-${Date.now()}`,
            text: randomReply,
            time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            sent: false,
          },
        ],
        lastMessage: truncateMessage(randomReply),
        time: "Just now",
      })
    }, 1000)
  }

  const updateConversation = (chatId, updates) => {
    setConversations((prev) =>
      prev.map((chat) => {
        if (chat.id === chatId) {
          return { ...chat, ...updates }
        }
        return chat
      }),
    )
  }

  const truncateMessage = (text) => {
    return text.length > 30 ? `${text.substring(0, 30)}...` : text
  }

  // Message actions
  const deleteMessage = (messageId) => {
    updateConversation(activeChatId, {
      messages: activeChat.messages.filter((msg) => msg.id !== messageId),
      lastMessage:
        activeChat.messages.length > 1
          ? truncateMessage(activeChat.messages[activeChat.messages.length - 2].text)
          : "No messages",
      time: "Just now",
    })
  }

  const startEditingMessage = (message) => {
    setEditingMessageId(message.id)
    setEditedMessageText(message.text)
    setEditAttachment(message.file || null)
    setSelectedSticker(message.sticker || null)
  }

  const cancelEditing = () => {
    setEditingMessageId(null)
    setEditedMessageText("")
    setEditAttachment(null)
    setSelectedSticker(null)
  }

  const saveEditedMessage = () => {
    if (!editedMessageText.trim() && !editAttachment && !selectedSticker) return

    updateConversation(activeChatId, {
      messages: activeChat.messages.map((msg) => {
        if (msg.id === editingMessageId) {
          return {
            ...msg,
            text: editedMessageText,
            file: editAttachment,
            sticker: selectedSticker,
            isEdited: true,
          }
        }
        return msg
      }),
      lastMessage: truncateMessage(editedMessageText || editAttachment?.name || "Sticker"),
      time: "Just now",
    })

    cancelEditing()
  }

  const replyToMessage = (message) => {
    setReplyingTo(message)
  }

  const cancelReply = () => {
    setReplyingTo(null)
  }

  // Chat actions
  const deleteChat = (chatId) => {
    setConversations((prev) => prev.filter((chat) => chat.id !== chatId))
    if (activeChatId === chatId) {
      setActiveChatId(conversations.length > 1 ? conversations.find((chat) => chat.id !== chatId)?.id || "" : "")
    }
  }

  const toggleMute = (chatId) => {
    setConversations((prev) =>
      prev.map((chat) => {
        if (chat.id === chatId) {
          return { ...chat, isMuted: !chat.isMuted }
        }
        return chat
      }),
    )
  }

  const togglePin = (chatId) => {
    setConversations((prev) =>
      prev.map((chat) => {
        if (chat.id === chatId) {
          return { ...chat, isPinned: !chat.isPinned }
        }
        return chat
      }),
    )
  }

  const reportChat = (chatId) => {
    alert(`Reported chat ${chatId}`)
  }

  // File handling
  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setSelectedFile({
        name: file.name,
        type: file.type.startsWith("image") ? "image" : "file",
        url: URL.createObjectURL(file),
      })
    }
  }

  const handleEditFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setEditAttachment({
        name: file.name,
        type: file.type.startsWith("image") ? "image" : "file",
        url: URL.createObjectURL(file),
      })
    }
  }

  const removeAttachment = () => {
    setSelectedFile(null)
  }

  const removeEditAttachment = () => {
    setEditAttachment(null)
  }

  // Emoji handling
  const onEmojiClick = (emojiData) => {
    setNewMessage((prev) => prev + emojiData.emoji)
    setShowEmojiPicker(false)
  }

  const onEditEmojiClick = (emojiData) => {
    setEditedMessageText((prev) => prev + emojiData.emoji)
  }

  const addReaction = (messageId, reaction) => {
    updateConversation(activeChatId, {
      messages: activeChat.messages.map((msg) => {
        if (msg.id === messageId) {
          return {
            ...msg,
            reactions: msg.reactions ? [...msg.reactions, reaction] : [reaction],
          }
        }
        return msg
      }),
    })
  }

  const filteredConversations = [...conversations]
    .sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1
      if (!a.isPinned && b.isPinned) return 1
      return 0
    })
    .filter((chat) => chat.name.toLowerCase().includes(searchQuery.toLowerCase()))

  // Message actions component
  const MessageActions = ({ message, align = "end" }) => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className={`p-1 rounded-full ${message.sent ? "hover:bg-transparent" : "hover:bg-transparent"}`}>
          <MoreHorizontal size={16} className={message.sent && "text-gray-500"} />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align={align} className="w-48">
        <DropdownMenuItem onClick={() => replyToMessage(message)}>
          <RotateCcw size={16} className="mr-2" />
          Reply
        </DropdownMenuItem>
        {message.sent && (
          <DropdownMenuItem onClick={() => startEditingMessage(message)}>
            <Pencil size={16} className="mr-2" />
            Edit
          </DropdownMenuItem>
        )}
        <DropdownMenuItem>
          <Share2 size={16} className="mr-2" />
          Share
        </DropdownMenuItem>
        <DropdownMenuItem 
          className="text-red-500" 
          onClick={() => deleteMessage(message.id)}
        >
          <Trash size={16} className="mr-2" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )

  // WhatsApp-style Edit Message Modal
  const EditMessageModal = () => (
    <div className={`fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 ${editingMessageId ? 'block' : 'hidden'}`}>
      <div className="bg-white rounded-lg w-full max-w-md">
        <div className="p-4 border-b">
          <h3 className="text-lg font-medium text-gray-900">Edit message</h3>
        </div>
        
        <div className="p-4">
          <div className="relative">
            <Input
              value={editedMessageText}
              onChange={(e) => setEditedMessageText(e.target.value)}
              placeholder="Edit your message..."
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              autoFocus
            />
            <div className="absolute right-2 top-2 flex space-x-1">
              <button 
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className="p-1 rounded-full hover:bg-gray-100"
              >
                <Smile size={20} className="text-gray-400" />
              </button>
              {editAttachment && (
                <button 
                  onClick={removeEditAttachment}
                  className="p-1 rounded-full hover:bg-gray-100"
                >
                  <X size={20} className="text-gray-400" />
                </button>
              )}
            </div>
            
            {showEmojiPicker && (
              <div className="absolute right-0 bottom-12 z-10">
                <EmojiPicker onEmojiClick={onEditEmojiClick} width={300} height={350} />
              </div>
            )}
          </div>
          
          {editAttachment && (
            <div className="mt-3 p-3 border rounded-lg flex items-center justify-between">
              <div className="flex items-center">
                <Paperclip size={16} className="mr-2" />
                <span className="text-sm truncate">{editAttachment.name}</span>
              </div>
            </div>
          )}
          
          <div className="mt-3 flex justify-end space-x-2">
            <button 
              onClick={cancelEditing}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              Cancel
            </button>
            <button 
              onClick={saveEditedMessage}
              className="px-4 py-2 bg-blue-500 text-white hover:bg-blue-600 rounded-lg disabled:opacity-50"
              disabled={!editedMessageText.trim() && !editAttachment}
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="flex flex-col flex-1 w-full bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b py-3 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <h1 className="text-xl font-semibold text-gray-800">Messaging</h1>
          <div className="flex items-center space-x-4">
            <button className="p-2 rounded-full hover:bg-gray-100">
              <MoreHorizontal size={20} className="text-gray-600" />
            </button>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden max-w-7xl mx-auto w-full relative">
        {/* Sidebar */}
        {showSidebar && (
          <Card className="w-full md:w-96 lg:w-80 xl:w-96 bg-white border-r flex flex-col h-full absolute md:relative z-10">
            <div className="p-3 border-b">
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search messages"
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <div className="flex-1 overflow-y-auto">
              {filteredConversations.map((chat) => (
                <div
                  key={chat.id}
                  className={`flex items-center p-3 border-b cursor-pointer hover:bg-gray-50 ${activeChatId === chat.id ? "bg-blue-50" : ""}`}
                  onClick={() => {
                    setActiveChatId(chat.id)
                    if (window.innerWidth < 1024) setShowSidebar(false)
                  }}
                >
                  <div className="relative">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={chat.avatar || "/placeholder.svg"} />
                      <AvatarFallback>{chat.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    {chat.isPinned && (
                      <Pin size={16} className="absolute -top-1 -right-1 text-brand bg-white rounded-full p-0.5" />
                    )}
                  </div>
                  <div className="ml-3 flex-1 min-w-0">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <h3 className="font-semibold text-gray-900 truncate">{chat.name}</h3>
                        {chat.isMuted && <BellOff size={16} className="ml-1 text-gray-400" />}
                      </div>
                      <div className="flex items-center">
                        <span className="text-xs text-gray-500 whitespace-nowrap ml-2">{chat.time}</span>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button
                              className="ml-2 p-1 rounded-full hover:bg-transparent"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <MoreHorizontal size={20} className="text-gray-600  " />
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuItem onClick={() => togglePin(chat.id)}>
                              <Pin size={16} className="mr-2" />
                              {chat.isPinned ? "Unpin chat" : "Pin chat"}
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => toggleMute(chat.id)}>
                              {chat.isMuted ? (
                                <>
                                  <Bell size={16} className="mr-2" />
                                  Unmute notifications
                                </>
                              ) : (
                                <>
                                  <BellOff size={16} className="mr-2" />
                                  Mute notifications
                                </>
                              )}
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => reportChat(chat.id)}>
                              <AlertCircle size={16} className="mr-2" />
                              Report
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-red-500" onClick={() => deleteChat(chat.id)}>
                              <Trash size={16} className="mr-2" />
                              Delete chat
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                    <p className="text-sm text-gray-500 truncate">{chat.position}</p>
                    <p className="text-sm text-gray-600 truncate">{chat.lastMessage}</p>
                  </div>
                  {chat.unread > 0 && (
                    <span className="ml-2 bg-brand text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {chat.unread}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Main Chat Area */}
        <div className={`flex-1 flex flex-col bg-white ${!showSidebar && "w-full"} transition-all duration-300`}>
          {activeChat ? (
            <>
              {/* Chat Header */}
              <div className="p-3 border-b flex items-center">
                <button
                  className="lg:hidden mr-2 p-2 rounded-full hover:bg-gray-100"
                  onClick={() => setShowSidebar(true)}
                >
                  <ChevronLeft size={20} />
                </button>
                <Avatar className="h-10 w-10">
                  <AvatarImage src={activeChat.avatar || "/placeholder.svg"} />
                  <AvatarFallback>{activeChat.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="ml-3 flex-1">
                  <h2 className="font-semibold">{activeChat.name}</h2>
                  <p className="text-xs text-gray-500">{activeChat.position}</p>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="p-2 rounded-full hover:bg-transparent">
                      <MoreHorizontal size={20} className="text-gray-600" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem onClick={() => togglePin(activeChatId)}>
                      <Pin size={16} className="mr-2" />
                      {activeChat.isPinned ? "Unpin chat" : "Pin chat"}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => toggleMute(activeChatId)}>
                      {activeChat.isMuted ? (
                        <>
                          <Bell size={16} className="mr-2" />
                          Unmute notifications
                        </>
                      ) : (
                        <>
                          <BellOff size={16} className="mr-2" />
                          Mute notifications
                        </>
                      )}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => reportChat(activeChatId)}>
                      <AlertCircle size={16} className="mr-2" />
                      Report
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-red-500" onClick={() => deleteChat(activeChatId)}>
                      <Trash size={16} className="mr-2" />
                      Delete chat
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 bg-[#f5f5f5]">
                <div className="space-y-4 max-w-3xl mx-auto">
                  {activeChat.messages.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.sent ? "justify-end" : "justify-start"}`}>
                      <div
                        className={`max-w-xs md:max-w-md rounded-2xl px-4 py-3 relative group ${msg.sent ? "bg-brand text-white rounded-br-none" : "bg-white border rounded-bl-none shadow-sm"}`}
                      >
                        {/* Reply indicator */}
                        {msg.replyTo && (
                          <div
                            className={`text-xs mb-2 p-2 rounded-lg ${msg.sent ? "bg-beand text-blue-100" : "bg-gray-100 text-gray-600"}`}
                          >
                            Replying to: {msg.replyTo.text}
                          </div>
                        )}

                        {/* Sticker */}
                        {msg.sticker && (
                          <div className="text-4xl mb-2">
                            {msg.sticker}
                          </div>
                        )}

                        {/* File attachment */}
                        {msg.file && (
                          <div className="mb-2">
                            {msg.file.type === "image" ? (
                              <img
                                src={msg.file.url || "/placeholder.svg"}
                                alt={msg.file.name}
                                className="max-w-full rounded-lg"
                              />
                            ) : (
                              <div className="flex items-center p-2 bg-white/20 rounded border">
                                <Paperclip size={16} className="mr-2" />
                                <span className="truncate">{msg.file.name}</span>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Message content */}
                        {editingMessageId === msg.id ? null : (
                          <>
                            {msg.text && (
                              <p className={msg.sent ? "text-white" : "text-gray-800"}>{msg.text}</p>
                            )}

                            {/* Desktop message actions (always visible on hover) */}
                            <div className={`absolute ${msg.sent ? "-right-8 md:-right-10" : "-left-8 md:-left-10"} top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 hidden md:block`}>
                              <MessageActions message={msg} align={msg.sent ? "end" : "start"} />
                            </div>

                            {/* Mobile message actions (dropdown) */}
                            <div className="flex md:hidden justify-end mt-1">
                              <MessageActions message={msg} />
                            </div>

                            {/* Reactions */}
                            {msg.reactions?.length > 0 && (
                              <div
                                className={`flex items-center mt-1 space-x-1 ${msg.sent ? "justify-end" : "justify-start"}`}
                              >
                                {msg.reactions.map((reaction, i) => (
                                  <span key={i} className="text-xs">
                                    {reaction}
                                  </span>
                                ))}
                              </div>
                            )}

                            {/* Message footer */}
                            <div className="flex items-center justify-end mt-1 space-x-2">
                              {msg.isEdited && (
                                <span className={`text-xs ${msg.sent ? "text-blue-100" : "text-gray-500"}`}>
                                  edited
                                </span>
                              )}
                              <p className={`text-xs ${msg.sent ? "text-blue-100" : "text-gray-500"}`}>{msg.time}</p>
                            </div>

                            {/* Reaction picker */}
                            <div
                              className={`absolute ${msg.sent ? "-right-8" : "-left-8"} bottom-0 opacity-0 group-hover:opacity-100`}
                            >
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <button className="p-1 rounded-full hover:bg-transparent">
                                    <Smile size={16} className={msg.sent ? "text-gray-600" : "text-gray-500"} />
                                  </button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="p-1">
                                  <div className="flex space-x-1">
                                    {["❤️", "👍", "😂", "🎉"].map((emoji) => (
                                      <button
                                        key={emoji}
                                        className="p-1 hover:bg-gray-100 rounded"
                                        onClick={() => addReaction(msg.id, emoji)}
                                      >
                                        {emoji}
                                      </button>
                                    ))}
                                  </div>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              </div>

              {/* Reply preview */}
              {replyingTo && (
                <div className="border-t p-2 bg-gray-50 flex justify-between items-center">
                  <div>
                    <p className="text-xs text-gray-500">Replying to:</p>
                    <p className="text-sm truncate">{replyingTo.text}</p>
                  </div>
                  <button onClick={cancelReply} className="p-1 rounded-full hover:bg-gray-200">
                    <X size={16} />
                  </button>
                </div>
              )}

              {/* Attachment preview */}
              {selectedFile && (
                <div className="border-t p-2 bg-gray-50 flex justify-between items-center">
                  <div className="flex items-center">
                    <Paperclip size={16} className="mr-2" />
                    <span className="text-sm truncate">{selectedFile.name}</span>
                  </div>
                  <button onClick={removeAttachment} className="p-1 rounded-full hover:bg-gray-200">
                    <X size={16} />
                  </button>
                </div>
              )}

              {/* Message Input */}
              <div className="p-4 border-t bg-white">
                <div className="flex items-center space-x-2">
                  {/* Attachment button */}
                  <button onClick={() => fileInputRef.current.click()} className="p-2 rounded-full hover:bg-gray-100">
                    <Paperclip size={20} className="text-gray-600" />
                  </button>
                  <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" />

                  {/* Sticker button */}
                  <button 
                    onClick={() => setSelectedSticker(selectedSticker ? null : '😀')} 
                    className="p-2 rounded-full hover:bg-gray-100"
                  >
                    <span className="text-xl">{selectedSticker || '😀'}</span>
                  </button>

                  {/* Emoji picker */}
                  <div className="relative">
                    <button
                      onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                      className="p-2 rounded-full hover:bg-gray-100"
                    >
                      <Smile size={20} className="text-gray-600" />
                    </button>
                    {showEmojiPicker && (
                      <div className="absolute bottom-12 left-0 z-10">
                        <EmojiPicker onEmojiClick={onEmojiClick} width={300} height={350} />
                      </div>
                    )}
                  </div>

                  {/* Message input */}
                  <Input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                    placeholder="Type a message..."
                    className="flex-1 rounded-full px-4 py-3"
                    disabled={!!selectedSticker}
                  />

                  {/* Send button */}
                  <Button
                    onClick={handleSendMessage}
                    disabled={(!newMessage.trim() && !selectedFile && !selectedSticker)}
                    size="icon"
                    className="rounded-full bg-brand hover:bg-brand/80 disabled:opacity-50"
                  >
                    <Send size={20} />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center bg-gray-50 p-6">
              <div className="max-w-md text-center">
                <h2 className="text-xl font-semibold text-gray-800 mb-2">Select a conversation</h2>
                <p className="text-gray-600 mb-6">
                  Choose an existing conversation or start a new one to begin messaging
                </p>
                <Button className="bg-brand hover:bg-brand/80">New Message</Button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto w-full border-t">
      </div>

      {/* WhatsApp-style Edit Message Modal */}
      <EditMessageModal />
    </div>
  )
}