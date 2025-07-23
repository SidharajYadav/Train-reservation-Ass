

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head />
      <body className="bg-gray-100 text-gray-900 p-4 font-sans">
        {children}
      </body>
    </html>
  );
}
 
