import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { NextUIProvider } from '@nextui-org/react'
import { ThemeProvider } from './context/theme'
import '@radix-ui/themes/styles.css';
import { Theme } from '@radix-ui/themes';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider>
    <NextUIProvider>
    <Theme>
    <main className="text-foreground bg-background">
    <App />
    </main>
    </Theme>
    </NextUIProvider>
    </ThemeProvider>
  </React.StrictMode>,
)
