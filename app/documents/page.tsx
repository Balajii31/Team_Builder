"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, ExternalLink } from "lucide-react"

export default function DocumentsPage() {
  // Mock uploaded file for demonstration
  const uploadedFile = {
    id: "presentation-1",
    name: "Project_Presentation.pdf",
    url: "/api/upload/presentation.pdf" // This would be the actual URL from your upload
  }

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Documents</h1>
        <p className="text-muted-foreground">View your project presentation</p>
      </div>

      <div className="max-w-2xl mx-auto">
        <Card className="p-8">
          <CardHeader className="pb-6">
            <CardTitle className="text-2xl text-center">Project Presentation</CardTitle>
            <CardDescription className="text-center">Your uploaded project PDF presentation</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex flex-col items-center gap-4 p-6 border-2 border-dashed border-primary/20 rounded-lg bg-primary/5">
                <FileText className="h-12 w-12 text-red-500" />
                <div className="text-center">
                  <span className="text-lg font-medium block">{uploadedFile.name}</span>
                  <span className="text-sm text-muted-foreground">PDF Document</span>
                </div>
                <Button size="lg" asChild>
                  <a href={uploadedFile.url} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-5 w-5 mr-2" />
                    View Presentation
                  </a>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}