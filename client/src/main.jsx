import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App, { ScrollToTop } from './App'
import { BookmarksProvider } from './context/BookmarksContext'
import './styles.css'
import './logo-theme.css'

createRoot(document.getElementById('root')).render(
  <React.StrictMode><BrowserRouter><ScrollToTop /><BookmarksProvider><App /></BookmarksProvider></BrowserRouter></React.StrictMode>
)