import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@/styles/index.css'
import { notFound } from '@/content/notFound'
import { LandingPage } from '@/pages/LandingPage'
import { NotFoundPage } from '@/pages/NotFoundPage'

/**
 * Respaldo de la 404: si el hosting manda una ruta desconocida a index.html (un fallback SPA, o
 * vite preview), se muestra la página no encontrada y no la landing. Netlify sirve 404.html directo.
 */
const isLanding = ['/', '/index.html'].includes(window.location.pathname)
if (!isLanding) document.title = notFound.title

createRoot(document.getElementById('root')!).render(<StrictMode>{isLanding ? <LandingPage /> : <NotFoundPage />}</StrictMode>)
