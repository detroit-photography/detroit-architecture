// Legacy /headshots routes - redirect to new root structure
// This layout catches all /headshots/* routes and redirects them

export default function HeadshotsRedirectLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // The individual pages will handle redirects
  return <>{children}</>
}
