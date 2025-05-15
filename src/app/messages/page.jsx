"use client"
import { useState, useEffect, useRef } from "react"
import axios from "axios"
import { useSession } from "next-auth/react"
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
  X,
  RotateCcw,
  Share2,
  Smile,
  Paperclip,
  AlertCircle,
  Users,
  UserPlus,
  UserMinus,
} from "lucide-react"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import EmojiPicker from "emoji-picker-react"
import baseUrl from "../api/baseUrl"
import useUser from "@/src/hooks/useUser"
import { toast } from 'sonner';

export default function MessageApp() {
  const { data: session } = useSession()
  const user = useUser()
  // State for conversations and active chat
  const [conversations, setConversations] = useState([])
  const [activeChatId, setActiveChatId] = useState(null)
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
  const [isLoading, setIsLoading] = useState(true)
  const [selectedMessages, setSelectedMessages] = useState([])
  const [showParticipants, setShowParticipants] = useState(false)
  const [participants, setParticipants] = useState([])
  const [newParticipantId, setNewParticipantId] = useState("")
  const messagesEndRef = useRef(null)
  const fileInputRef = useRef(null)
  const editFileInputRef = useRef(null)

  const activeChat = conversations.find((chat) => chat.id === activeChatId)

  // Axios config with authorization headers
  const axiosConfig = {
    headers: {
      Authorization: `Bearer ${session?.accessToken}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    withCredentials: true
  }

  // Fetch conversations on component mount
  useEffect(() => {
    const fetchConversations = async () => {
      try {
        setIsLoading(true)
        const response = await axios.get(`${baseUrl}/messages/conversations/`, axiosConfig)
        setConversations(response.data)

        // On mobile, show sidebar only if there are conversations
        if (window.innerWidth < 768) {
          setShowSidebar(response.data.length > 0)
        }

        if (response.data.length > 0) {
          setActiveChatId(response.data[0].id)
        }
      } catch (error) {
        console.error("Error fetching conversations:", error)
        toast({
          title: "Error",
          description: "Failed to fetch conversations",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    if (session?.accessToken && user?.user?.user_id) {
      fetchConversations()
    }
  }, [session?.accessToken, user?.user?.user_id])

  // Fetch messages for active conversation when it changes
  useEffect(() => {
    if (activeChatId && session?.accessToken) {
      const fetchMessages = async () => {
        try {
          const response = await axios.get(`${baseUrl}/messages/conversations/${activeChatId}/messages/`, axiosConfig)
          updateConversation(activeChatId, { messages: response.data })
        } catch (error) {
          console.error("Error fetching messages:", error)
          toast({
            title: "Error",
            description: "Failed to fetch messages",
            variant: "destructive",
          })
        }
      }

      fetchMessages()
    }
  }, [activeChatId, session?.accessToken])

  // Fetch participants when active chat changes
  useEffect(() => {
    if (activeChatId) {
      const fetchParticipants = async () => {
        try {
          const response = await axios.get(
            `${baseUrl}/messages/conversations/${activeChatId}/participants/`,
            axiosConfig
          )
          setParticipants(response.data)
        } catch (error) {
          console.error("Error fetching participants:", error)
        }
      }
      fetchParticipants()
    }
  }, [activeChatId])

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [activeChat?.messages, replyingTo])

  // Responsive sidebar handling
  useEffect(() => {
    const handleResize = () => {
      // On desktop, always show sidebar
      if (window.innerWidth >= 1024) {
        setShowSidebar(true)
      }
      // On mobile, show sidebar only if there are conversations
      else if (window.innerWidth < 768) {
        setShowSidebar(conversations.length > 0)
      }
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [conversations.length])

  const handleSendMessage = async () => {
    if (!newMessage.trim() && !selectedFile && !selectedSticker) return

    const messageData = {
      text: newMessage,
      sticker: selectedSticker,
      reply_to: replyingTo?.id,
    }

    try {
      // Send the message to the server
      const response = await axios.post(
        `${baseUrl}/messages/conversations/${activeChatId}/messages/`,
        messageData,
        axiosConfig,
      )

      // Update local state with the sent message
      updateConversation(activeChatId, {
        messages: [...activeChat.messages, response.data],
        lastMessage: truncateMessage(newMessage || selectedSticker || "Attachment"),
        time: "Just now",
        unread: 0,
      })

      setNewMessage("")
      setSelectedFile(null)
      setSelectedSticker(null)
      setReplyingTo(null)
    } catch (error) {
      console.error("Error sending message:", error)
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive",
      })
    }
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

  // Start a new conversation
  const startNewConversation = async (participantId) => {
    try {
      const headers = {
        Authorization: `Bearer ${session?.accessToken}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      }

      const response = await axios.post(
        `${baseUrl}/messages/conversations/start/`,
        { participant_id: participantId },
        { headers },
      )

      setConversations((prev) => [response.data, ...prev])
      setActiveChatId(response.data.id)

      // On mobile, hide sidebar after starting a conversation
      if (window.innerWidth < 768) {
        setShowSidebar(false)
      }

      toast({
        title: "Success",
        description: "Conversation started",
      })
    } catch (error) {
      console.error("Error starting conversation:", error)
      toast({
        title: "Error",
        description: "Failed to start conversation",
        variant: "destructive",
      })
    }
  }

  // Delete a conversation
  const deleteChat = async (chatId) => {
    try {
      await axios.delete(`${baseUrl}/messages/conversations/${chatId}/delete/`, axiosConfig)

      setConversations((prev) => prev.filter((chat) => chat.id !== chatId))

      if (activeChatId === chatId) {
        setActiveChatId(conversations.length > 1 ? conversations.find((chat) => chat.id !== chatId)?.id || "" : "")
      }

      // On mobile, show sidebar if no active chat
      if (window.innerWidth < 768 && conversations.length <= 1) {
        setShowSidebar(false)
      }

      toast({
        title: "Success",
        description: "Conversation deleted",
      })
    } catch (error) {
      console.error("Error deleting conversation:", error)
      toast({
        title: "Error",
        description: "Failed to delete conversation",
        variant: "destructive",
      })
    }
  }

  // Mark conversation as read
  const markConversationAsRead = async (chatId) => {
    try {
      await axios.post(`${baseUrl}/messages/conversations/${chatId}/mark-read/`, {}, axiosConfig)
      updateConversation(chatId, { unread: 0 })
    } catch (error) {
      console.error("Error marking conversation as read:", error)
    }
  }

  // Search conversations
  const searchConversations = async (query) => {
    try {
      const response = await axios.get(`${baseUrl}/messages/search-inbox/`, {
        ...axiosConfig,
        params: { query },
      })
      return response.data
    } catch (error) {
      console.error("Error searching conversations:", error)
      return []
    }
  }

  // Message actions
  const deleteMessage = async (messageId) => {
    try {
      await axios.delete(`${baseUrl}/messages/conversations/${activeChatId}/messages/${messageId}/delete/`, axiosConfig)
      updateConversation(activeChatId, {
        messages: activeChat.messages.filter((msg) => msg.id !== messageId),
        lastMessage:
          activeChat.messages.length > 1
            ? truncateMessage(activeChat.messages[activeChat.messages.length - 2].text)
            : "No messages",
        time: "Just now",
      })
      toast({
        title: "Success",
        description: "Message deleted",
      })
    } catch (error) {
      console.error("Error deleting message:", error)
      toast({
        title: "Error",
        description: "Failed to delete message",
        variant: "destructive",
      })
    }
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

  const saveEditedMessage = async () => {
    if (!editedMessageText.trim() && !editAttachment && !selectedSticker) return

    try {
      const response = await axios.put(
        `${baseUrl}/messages/messages/${editingMessageId}/update/`,
        {
          text: editedMessageText,
          sticker: selectedSticker,
        },
        axiosConfig,
      )

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
      toast({
        title: "Success",
        description: "Message updated",
      })
    } catch (error) {
      console.error("Error updating message:", error)
      toast({
        title: "Error",
        description: "Failed to update message",
        variant: "destructive",
      })
    }
  }

  const replyToMessage = (message) => {
    setReplyingTo(message)
  }

  const cancelReply = () => {
    setReplyingTo(null)
  }

  // Chat actions
  const toggleMute = async (chatId) => {
    try {
      await axios.post(`${baseUrl}/messages/conversations/${chatId}/mute/`, {}, axiosConfig)
      setConversations((prev) =>
        prev.map((chat) => {
          if (chat.id === chatId) {
            return { ...chat, isMuted: !chat.isMuted }
          }
          return chat
        }),
      )
      toast({
        title: "Success",
        description: `Conversation ${activeChat?.isMuted ? "unmuted" : "muted"}`,
      })
    } catch (error) {
      console.error("Error toggling mute:", error)
      toast({
        title: "Error",
        description: "Failed to toggle mute",
        variant: "destructive",
      })
    }
  }

  const togglePin = async (chatId) => {
    try {
      await axios.post(`${baseUrl}/messages/conversations/${chatId}/pin/`, {}, axiosConfig)
      setConversations((prev) =>
        prev.map((chat) => {
          if (chat.id === chatId) {
            return { ...chat, isPinned: !chat.isPinned }
          }
          return chat
        }),
      )
      toast({
        title: "Success",
        description: `Conversation ${activeChat?.isPinned ? "unpinned" : "pinned"}`,
      })
    } catch (error) {
      console.error("Error toggling pin:", error)
      toast({
        title: "Error",
        description: "Failed to toggle pin",
        variant: "destructive",
      })
    }
  }

  const reportChat = (chatId) => {
    alert(`Reported chat ${chatId}`)
  }

  // Bulk message operations
  const toggleMessageSelection = (messageId) => {
    setSelectedMessages((prev) =>
      prev.includes(messageId)
        ? prev.filter((id) => id !== messageId)
        : [...prev, messageId]
    )
  }

  const bulkDeleteMessages = async () => {
    if (selectedMessages.length === 0) return

    try {
      await axios.post(
        `${baseUrl}/messages/conversations/${activeChatId}/bulk-delete/`,
        { message_ids: selectedMessages },
        axiosConfig
      )

      updateConversation(activeChatId, {
        messages: activeChat.messages.filter((msg) => !selectedMessages.includes(msg.id)),
      })

      setSelectedMessages([])
      toast({
        title: "Success",
        description: "Messages deleted",
      })
    } catch (error) {
      console.error("Error deleting messages:", error)
      toast({
        title: "Error",
        description: "Failed to delete messages",
        variant: "destructive",
      })
    }
  }

  // Participant management
  const addParticipant = async () => {
    if (!newParticipantId.trim()) return

    try {
      const response = await axios.post(
        `${baseUrl}/messages/conversations/${activeChatId}/add-participant/`,
        { user_id: newParticipantId },
        axiosConfig
      )

      setParticipants((prev) => [...prev, response.data])
      setNewParticipantId("")
      toast({
        title: "Success",
        description: "Participant added",
      })
    } catch (error) {
      console.error("Error adding participant:", error)
      toast({
        title: "Error",
        description: "Failed to add participant",
        variant: "destructive",
      })
    }
  }

  const removeParticipant = async (userId) => {
    try {
      await axios.post(
        `${baseUrl}/messages/conversations/${activeChatId}/remove-participant/`,
        { user_id: userId },
        axiosConfig
      )

      setParticipants((prev) => prev.filter((p) => p.id !== userId))
      toast({
        title: "Success",
        description: "Participant removed",
      })
    } catch (error) {
      console.error("Error removing participant:", error)
      toast({
        title: "Error",
        description: "Failed to remove participant",
        variant: "destructive",
      })
    }
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

  const addReaction = async (messageId, reaction) => {
    try {
      await axios.post(
        `${baseUrl}/messages/conversations/${activeChatId}/messages/${messageId}/react/`,
        { reaction },
        axiosConfig,
      )

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
    } catch (error) {
      console.error("Error adding reaction:", error)
    }
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
        <DropdownMenuItem className="text-red-500" onClick={() => deleteMessage(message.id)}>
          <Trash size={16} className="mr-2" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )

  // WhatsApp-style Edit Message Modal
  const EditMessageModal = () => (
    <div
      className={`fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 ${editingMessageId ? "block" : "hidden"}`}
    >
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
                <button onClick={removeEditAttachment} className="p-1 rounded-full hover:bg-gray-100">
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
            <button onClick={cancelEditing} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">
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

  // Participants Modal
  const ParticipantsModal = () => (
    <div
      className={`fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 ${showParticipants ? "block" : "hidden"}`}
    >
      <div className="bg-white rounded-lg w-full max-w-md">
        <div className="p-4 border-b flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900">Participants</h3>
          <button onClick={() => setShowParticipants(false)} className="p-1 rounded-full hover:bg-gray-100">
            <X size={20} />
          </button>
        </div>

        <div className="p-4">
          <div className="flex mb-4">
            <Input
              value={newParticipantId}
              onChange={(e) => setNewParticipantId(e.target.value)}
              placeholder="Enter user ID"
              className="flex-1 mr-2"
            />
            <Button onClick={addParticipant} className="bg-brand hover:bg-brand/80">
              <UserPlus size={16} className="mr-1" />
              Add
            </Button>
          </div>

          <div className="space-y-2">
            {participants.map((participant) => (
              <div key={participant.id} className="flex items-center justify-between p-2 border rounded">
                <div className="flex items-center">
                  <Avatar className="h-8 w-8 mr-2">
                    <AvatarImage src={participant.avatar} />
                    <AvatarFallback>{participant.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <span>{participant.name}</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeParticipant(participant.id)}
                  className="text-red-500 hover:bg-red-50"
                >
                  <UserMinus size={16} />
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )

  // On mobile, show empty state if no conversations
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768
  const shouldShowEmptyState = isMobile && conversations.length === 0

  return (
    <div className="flex flex-col flex-1 w-full bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b py-3 px-4">
        <div className="max-w-7xl px-4 mx-auto flex items-center justify-between">
          <h1 className="text-xl font-semibold text-gray-800">Messaging</h1>
          <div className="flex items-center space-x-4">
            <button className="p-2 rounded-full hover:bg-gray-100">
              <MoreHorizontal size={20} className="text-gray-600" />
            </button>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden max-w-7xl mx-auto w-full relative">
        {/* Sidebar - shown only if there are conversations on mobile */}
        {showSidebar && conversations.length > 0 && (
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
                    markConversationAsRead(chat.id)
                    if (isMobile) setShowSidebar(false)
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
          {shouldShowEmptyState ? (
            <EmptyConversationState startNewConversation={startNewConversation} />
          ) : activeChat ? (
            <ActiveChatView
              activeChat={activeChat}
              activeChatId={activeChatId}
              isMobile={isMobile}
              showSidebar={showSidebar}
              setShowSidebar={setShowSidebar}
              togglePin={togglePin}
              toggleMute={toggleMute}
              reportChat={reportChat}
              deleteChat={deleteChat}
              messagesEndRef={messagesEndRef}
              replyingTo={replyingTo}
              editingMessageId={editingMessageId}
              cancelReply={cancelReply}
              selectedFile={selectedFile}
              removeAttachment={removeAttachment}
              newMessage={newMessage}
              setNewMessage={setNewMessage}
              handleSendMessage={handleSendMessage}
              selectedSticker={selectedSticker}
              setSelectedSticker={setSelectedSticker}
              showEmojiPicker={showEmojiPicker}
              setShowEmojiPicker={setShowEmojiPicker}
              onEmojiClick={onEmojiClick}
              fileInputRef={fileInputRef}
              handleFileChange={handleFileChange}
              MessageActions={MessageActions}
              addReaction={addReaction}
              selectedMessages={selectedMessages}
              toggleMessageSelection={toggleMessageSelection}
              bulkDeleteMessages={bulkDeleteMessages}
              setShowParticipants={setShowParticipants}
            />
          ) : (
            <NoConversationSelectedView startNewConversation={startNewConversation} />
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto w-full border-t"></div>

      {/* WhatsApp-style Edit Message Modal */}
      <EditMessageModal />

      {/* Participants Modal */}
      <ParticipantsModal />
    </div>
  )
}

// Component for empty conversation state (mobile)
function EmptyConversationState({ startNewConversation }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center bg-gray-50 p-6">
      <div className="max-w-md text-center">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">No conversations</h2>
        <p className="text-gray-600 mb-6">Start a new conversation to begin messaging</p>
        <Button
          className="bg-brand hover:bg-brand/80 text-white"
          onClick={() => startNewConversation("some-participant-id")}
        >
          New Message
        </Button>
      </div>
    </div>
  )
}

// Component for no conversation selected view (desktop)
function NoConversationSelectedView({ startNewConversation }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center bg-gray-50 p-6">
      <div className="max-w-md text-center">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Select a conversation</h2>
        <p className="text-gray-600 mb-6">Choose an existing conversation or start a new one to begin messaging</p>
        <Button
          className="bg-brand hover:bg-brand/80 text-white"
          onClick={() => startNewConversation("some-participant-id")}
        >
          New Message
        </Button>
      </div>
    </div>
  )
}

// Component for active chat view
function ActiveChatView({
  activeChat,
  activeChatId,
  isMobile,
  showSidebar,
  setShowSidebar,
  togglePin,
  toggleMute,
  reportChat,
  deleteChat,
  messagesEndRef,
  replyingTo,
  editingMessageId,
  cancelReply,
  selectedFile,
  removeAttachment,
  newMessage,
  setNewMessage,
  handleSendMessage,
  selectedSticker,
  setSelectedSticker,
  showEmojiPicker,
  setShowEmojiPicker,
  onEmojiClick,
  fileInputRef,
  handleFileChange,
  MessageActions,
  addReaction,
  selectedMessages,
  toggleMessageSelection,
  bulkDeleteMessages,
  setShowParticipants,
}) {
  return (
    <>
      {/* Chat Header */}
      <div className="p-3 border-b flex items-center">
        {isMobile && !showSidebar && (
          <button className="mr-2 p-2 rounded-full hover:bg-gray-100" onClick={() => setShowSidebar(true)}>
            <ChevronLeft size={20} />
          </button>
        )}
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
            <DropdownMenuItem onClick={() => setShowParticipants(true)}>
              <Users size={16} className="mr-2" />
              Participants
            </DropdownMenuItem>
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

      {/* Bulk actions bar */}
      {selectedMessages.length > 0 && (
        <div className="p-2 border-b bg-gray-50 flex justify-between items-center">
          <span className="text-sm">{selectedMessages.length} selected</span>
          <div className="flex space-x-2">
            <Button
              variant="ghost"
              size="sm"
              className="text-red-500 hover:bg-red-50"
              onClick={bulkDeleteMessages}
            >
              <Trash size={16} className="mr-1" />
              Delete
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => toggleMessageSelection([])}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 bg-[#f5f5f5]">
        <div className="space-y-4 max-w-3xl mx-auto">
          {activeChat.messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.sent ? "justify-end" : "justify-start"} ${selectedMessages.includes(msg.id) ? "bg-blue-50 rounded-lg" : ""}`}
              onClick={() => selectedMessages.length > 0 && toggleMessageSelection(msg.id)}
            >
              <div
                className={`max-w-xs md:max-w-md rounded-2xl px-4 py-3 relative group ${msg.sent ? "bg-brand text-white rounded-br-none" : "bg-white border rounded-bl-none shadow-sm"} ${selectedMessages.includes(msg.id) ? "ring-2 ring-blue-500" : ""}`}
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
                {msg.sticker && <div className="text-4xl mb-2">{msg.sticker}</div>}

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
                    {msg.text && <p className={msg.sent ? "text-white" : "text-gray-800"}>{msg.text}</p>}

                    {/* Desktop message actions (always visible on hover) */}
                    <div
                      className={`absolute ${msg.sent ? "-right-8 md:-right-10" : "-left-8 md:-left-10"} top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 hidden md:block`}
                    >
                      <MessageActions message={msg} align={msg.sent ? "end" : "start"} />
                    </div>

                    {/* Mobile message actions (dropdown) */}
                    <div className="flex md:hidden justify-end mt-1">
                      <MessageActions message={msg} />
                    </div>

                    {/* Reactions */}
                    {msg.reactions?.length > 0 && (
                      <div className={`flex items-center mt-1 space-x-1 ${msg.sent ? "justify-end" : "justify-start"}`}>
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
                        <span className={`text-xs ${msg.sent ? "text-blue-100" : "text-gray-500"}`}>edited</span>
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
            onClick={() => setSelectedSticker(selectedSticker ? null : "😀")}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <span className="text-xl">{selectedSticker || "😀"}</span>
          </button>

          {/* Emoji picker */}
          <div className="relative">
            <button onClick={() => setShowEmojiPicker(!showEmojiPicker)} className="p-2 rounded-full hover:bg-gray-100">
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
            disabled={!newMessage.trim() && !selectedFile && !selectedSticker}
            size="icon"
            className="rounded-full bg-brand hover:bg-brand/80 disabled:opacity-50"
          >
            <Send size={20} />
          </Button>
        </div>
      </div>
    </>
  )
}