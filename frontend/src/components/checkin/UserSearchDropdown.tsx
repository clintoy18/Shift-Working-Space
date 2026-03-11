import React, { useState, useRef, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { CheckCircle2, Search, X } from "lucide-react"
import type { IUser } from "@/interfaces/models/IUser"
import { cn } from "@/lib/utils"

interface UserSearchDropdownProps {
  users: IUser[]
  selectedUser: IUser | null
  onSelect: (user: IUser) => void
  onClear: () => void
  placeholder?: string
  loading?: boolean
}

/**
 * UserSearchDropdown Component
 * Provides searchable user selection with dropdown
 * Shows user details and visual feedback for selection
 */
export const UserSearchDropdown: React.FC<UserSearchDropdownProps> = ({
  users,
  selectedUser,
  onSelect,
  onClear,
  placeholder = "Search user by name or email...",
  loading = false,
}) => {
  const [searchQuery, setSearchQuery] = useState("")
  const [showDropdown, setShowDropdown] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Filter users based on search query (only "shifty" role)
  const filteredUsers = users.filter((user) => {
    if (user.role !== "shifty") {
      return false
    }

    const query = searchQuery.toLowerCase()
    return (
      user.fullName?.toLowerCase().includes(query) ||
      user.email?.toLowerCase().includes(query)
    )
  })

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleSelectUser = (user: IUser) => {
    onSelect(user)
    setSearchQuery(user.fullName || "")
    setShowDropdown(false)
  }

  const handleClear = () => {
    setSearchQuery("")
    onClear()
    setShowDropdown(false)
    inputRef.current?.focus()
  }

  return (
    <div ref={dropdownRef} className="relative">
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
        <Input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value)
            setShowDropdown(true)
          }}
          onFocus={() => setShowDropdown(true)}
          disabled={loading}
          className="h-11 pl-10 pr-10"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Dropdown List */}
      {showDropdown && searchQuery && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-background border border-muted rounded-lg shadow-lg z-50 max-h-64 overflow-y-auto">
          {loading ? (
            <div className="p-4 text-center text-sm text-muted-foreground">
              Loading users...
            </div>
          ) : filteredUsers.length > 0 ? (
            filteredUsers.map((user) => (
              <button
                key={user.id}
                type="button"
                onClick={() => handleSelectUser(user)}
                className={cn(
                  "w-full text-left px-4 py-3 border-b border-muted last:border-b-0 transition",
                  "hover:bg-muted focus:bg-muted focus:outline-none"
                )}
              >
                <p className="font-semibold text-foreground text-sm">
                  {user.fullName}
                </p>
                <p className="text-xs text-muted-foreground">{user.email}</p>
                {user.membershipStatus && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Membership: {user.membershipStatus}
                  </p>
                )}
              </button>
            ))
          ) : (
            <div className="p-4 text-center">
              <Search className="w-8 h-8 mx-auto mb-2 text-muted-foreground opacity-50" />
              <p className="text-sm text-muted-foreground">No users found</p>
              <p className="text-xs text-muted-foreground mt-1">
                Try searching by name or email
              </p>
            </div>
          )}
        </div>
      )}

      {/* Selected User Display */}
      {selectedUser && (
        <div className="mt-3 p-4 bg-primary/5 border border-primary/20 rounded-lg space-y-2">
          <div className="flex items-start justify-between">
            <div>
              <p className="font-semibold text-foreground text-sm">
                {selectedUser.fullName}
              </p>
              <p className="text-xs text-muted-foreground">{selectedUser.email}</p>
              {selectedUser.membershipStatus && (
                <p className="text-xs text-muted-foreground mt-1">
                  Membership: {selectedUser.membershipStatus}
                </p>
              )}
            </div>
            <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-1" />
          </div>
          <button
            type="button"
            onClick={handleClear}
            className="text-xs text-primary hover:text-primary/80 font-medium underline"
          >
            Clear selection
          </button>
        </div>
      )}
    </div>
  )
}

export default UserSearchDropdown
