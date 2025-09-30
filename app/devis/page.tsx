// app/devis/page.tsx
'use client'
import { useSearchParams } from 'next/navigation'
import { QuoteClient } from "./components/quote-client"
import QuotesListClient from './components/quote-list-client'

export default function QuoteViewPage() {
  const searchParams = useSearchParams()
  const id = searchParams.get('id') || ''
  
  if (id) {
    return <QuoteClient id={id} />
  }
  
  return <QuotesListClient />
}