"use client"

import { useEffect, useState } from "react"

export default function PopulatePage() {
  const [result, setResult] = useState<string>("Populating...")

  useEffect(() => {
    fetch("/api/populate", { method: "POST" })
      .then(res => res.json())
      .then(data => setResult(JSON.stringify(data, null, 2)))
      .catch(err => setResult("Error: " + err.message))
  }, [])

  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="mb-6 text-2xl font-semibold">Populate Dummy Data</h1>
      <pre className="bg-muted p-4 rounded-lg overflow-auto">{result}</pre>
    </main>
  )
}