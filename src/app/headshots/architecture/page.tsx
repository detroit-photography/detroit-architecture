import { redirect } from 'next/navigation'

// Redirect /headshots/architecture to the main architecture site at root
export default function ArchitectureRedirect() {
  redirect('/')
}

