import { createContext, useContext, useState } from 'react'

const BookmarksContext = createContext(null)
const STORAGE_KEY = 'a-max-bookmarks'

function readBookmarks() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
    return Array.isArray(saved) ? saved : []
  } catch {
    return []
  }
}

function getBookmarkKey(item) {
  return `${item.type}:${item.title}:${item.creator}`
}

export function BookmarksProvider({ children }) {
  const [bookmarks, setBookmarks] = useState(readBookmarks)

  const toggleBookmark = item => {
    const bookmark = { ...item, key: getBookmarkKey(item) }
    setBookmarks(current => {
      const next = current.some(saved => saved.key === bookmark.key)
        ? current.filter(saved => saved.key !== bookmark.key)
        : [...current, bookmark]
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      return next
    })
  }

  const isBookmarked = item => bookmarks.some(saved => saved.key === getBookmarkKey(item))

  return <BookmarksContext.Provider value={{ bookmarks, toggleBookmark, isBookmarked }}>{children}</BookmarksContext.Provider>
}

export function useBookmarks() {
  const context = useContext(BookmarksContext)
  if (!context) throw new Error('useBookmarks must be used inside BookmarksProvider')
  return context
}
