export const metadata = { title: 'OpStreak', description: 'Build your streak. Show up every day.' }
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1"/>
        <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=DM+Sans:wght@400;500;600&display=swap" rel="stylesheet"/>
      </head>
      <body style={{margin:0,padding:0,background:'#FFF8F2',fontFamily:"'DM Sans',sans-serif"}}>{children}</body>
    </html>
  )
}
