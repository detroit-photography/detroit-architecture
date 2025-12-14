import { redirect } from 'next/navigation'

// Redirect /headshots to root /
export default function HeadshotsRedirect() {
  redirect('/')
}
