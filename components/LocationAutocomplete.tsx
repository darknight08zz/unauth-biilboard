"use client"

import * as React from "react"
import { MapPin, Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"

interface LocationAutocompleteProps {
    value: string
    onChange: (value: string, coords?: { lat: number; lng: number }) => void
    onSelect?: (coords: { lat: number; lng: number }) => void
    className?: string
}

export function LocationAutocomplete({ value, onChange, onSelect, className }: LocationAutocompleteProps) {
    const [open, setOpen] = React.useState(false)
    const [inputValue, setInputValue] = React.useState(value)
    const [suggestions, setSuggestions] = React.useState<any[]>([])
    const [loading, setLoading] = React.useState(false)
    const wrapperRef = React.useRef<HTMLDivElement>(null)

    // Sync internal state with prop if it changes externally
    React.useEffect(() => {
        setInputValue(value)
    }, [value])

    // Close dropdown when clicking outside
    React.useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setOpen(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
        }
    }, [])

    // Debounce search
    React.useEffect(() => {
        const timer = setTimeout(async () => {
            if (inputValue.length > 2 && open) {
                setLoading(true)
                try {
                    const response = await fetch(
                        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
                            inputValue
                        )}&limit=10`
                    )
                    const data = await response.json()
                    setSuggestions(data)
                } catch (error) {
                    console.error("Error fetching locations:", error)
                    setSuggestions([])
                } finally {
                    setLoading(false)
                }
            } else {
                setSuggestions([])
            }
        }, 500)

        return () => clearTimeout(timer)
    }, [inputValue, open])

    const handleSelect = (suggestion: any) => {
        const displayName = suggestion.display_name
        const lat = parseFloat(suggestion.lat)
        const lon = parseFloat(suggestion.lon)

        setInputValue(displayName)
        onChange(displayName, { lat, lng: lon })
        if (onSelect) {
            onSelect({ lat, lng: lon })
        }
        setOpen(false)
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value
        setInputValue(newValue)
        onChange(newValue) // Update parent with text only initially
        setOpen(true)
    }

    return (
        <div className="relative" ref={wrapperRef}>
            <div className="relative">
                <MapPin className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Enter location (City, State, Country)..."
                    value={inputValue}
                    onChange={handleInputChange}
                    className={`pl-8 ${className || ""}`}
                    onFocus={() => {
                        if (inputValue.length > 2) setOpen(true)
                    }}
                />
                {loading && (
                    <Loader2 className="absolute right-2 top-2.5 h-4 w-4 animate-spin text-muted-foreground" />
                )}
            </div>

            {open && suggestions.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-popover text-popover-foreground rounded-md border shadow-md max-h-[200px] overflow-y-auto">
                    <ul className="py-1">
                        {suggestions.map((suggestion) => (
                            <li
                                key={suggestion.place_id}
                                className="px-3 py-2 hover:bg-accent hover:text-accent-foreground cursor-pointer text-sm flex flex-col"
                                onClick={() => handleSelect(suggestion)}
                            >
                                <span className="font-medium">{suggestion.name || suggestion.display_name.split(',')[0]}</span>
                                <span className="text-xs text-muted-foreground truncate">{suggestion.display_name}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    )
}
