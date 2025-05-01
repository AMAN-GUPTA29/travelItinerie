/**
 * main.jsx
 * 
 * Entry point of the React application.
 * 
 * @module
 * @description
 * This file:
 * - Sets up the React application
 * - Imports global styles
 * - Renders the root App component
 * - Configures React Query client
 * 
 * @example
 * // This file is automatically executed when the application starts
 */

import React from 'react'
import ReactDOM from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import App from './App'
import './index.css'

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </React.StrictMode>,
)
