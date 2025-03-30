"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "@/components/ui/use-toast"
import { Twitter, Facebook, Linkedin, Send, Share2, Link2, Copy, CheckCircle2 } from "lucide-react"

interface PortfolioShareProps {
  portfolioId: string
  isPublic: boolean
  onPublicStatusChange: (isPublic: boolean) => Promise<void>
}

export function PortfolioShare({ portfolioId, isPublic, onPublicStatusChange }: PortfolioShareProps) {
  const [showShareDialog, setShowShareDialog] = useState(false)
  const [activeTab, setActiveTab] = useState<"social" | "embed" | "link">("social")
  const [customMessage, setCustomMessage] = useState("")
  const [isCopied, setIsCopied] = useState(false)
  
  const handleShareClick = () => {
    if (!isPublic) {
      toast({
        title: "Portfolio is private",
        description: "You need to make your portfolio public before sharing",
        variant: "destructive"
      })
      return
    }
    
    setShowShareDialog(true)
  }
  
  const handleMakePublic = async () => {
    try {
      await onPublicStatusChange(true)
      
      toast({
        title: "Portfolio is now public",
        description: "Your portfolio is now visible to others with the share link"
      })
      
      setShowShareDialog(true)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to make portfolio public",
        variant: "destructive"
      })
    }
  }
  
  const shareToSocial = async (platform: string) => {
    try {
      const response = await fetch('/api/social-share', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          portfolioId,
          platform,
          message: customMessage
        })
      })
      
      if (!response.ok) {
        throw new Error('Failed to share portfolio')
      }
      
      const data = await response.json()
      
      // Open share URL in a new window
      window.open(data.shareUrl, '_blank')
      
      toast({
        title: "Shared successfully",
        description: `Your portfolio has been shared to ${platform}`
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to share portfolio",
        variant: "destructive"
      })
    }
  }
  
  const copyShareLink = () => {
    const shareUrl = `${window.location.origin}/shared-portfolio/${portfolioId}`
    navigator.clipboard.writeText(shareUrl)
    setIsCopied(true)
    
    toast({
      title: "Copied to clipboard",
      description: "Share link has been copied to your clipboard"
    })
    
    setTimeout(() => setIsCopied(false), 2000)
  }
  
  const getEmbedCode = () => {
    return `<iframe src="${window.location.origin}/embed/portfolio/${portfolioId}" width="100%" height="450" frameborder="0"></iframe>`
  }
  
  const copyEmbedCode = () => {
    const embedCode = getEmbedCode()
    navigator.clipboard.writeText(embedCode)
    
    toast({
      title: "Copied to clipboard",
      description: "Embed code has been copied to your clipboard"
    })
  }
  
  return (
    <>
      <Button 
        variant="outline" 
        size="sm" 
        className="flex items-center gap-2"
        onClick={isPublic ? handleShareClick : handleMakePublic}
      >
        <Share2 className="h-4 w-4" />
        {isPublic ? "Share Portfolio" : "Make Public & Share"}
      </Button>
      
      <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Share Your Portfolio</DialogTitle>
            <DialogDescription>
              Share your investment strategy and performance with others
            </DialogDescription>
          </DialogHeader>
          
          <Tabs defaultValue="social" value={activeTab} onValueChange={(value) => setActiveTab(value as any)}>
            <TabsList className="grid grid-cols-3">
              <TabsTrigger value="social">Social Media</TabsTrigger>
              <TabsTrigger value="embed">Embed</TabsTrigger>
              <TabsTrigger value="link">Link</TabsTrigger>
            </TabsList>
            
            <TabsContent value="social" className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="customMessage">Custom Message (Optional)</Label>
                <Input
                  id="customMessage"
                  placeholder="Check out my investment portfolio!"
                  value={customMessage}
                  onChange={(e) => setCustomMessage(e.target.value)}
                />
              </div>
              
              <div className="flex flex-col gap-3 mt-4">
                <Button 
                  variant="outline" 
                  className="justify-start gap-2 text-[#1DA1F2] hover:text-[#1DA1F2]/90 hover:bg-[#1DA1F2]/10"
                  onClick={() => shareToSocial('twitter')}
                >
                  <Twitter className="h-4 w-4" />
                  Share on Twitter
                </Button>
                
                <Button 
                  variant="outline"
                  className="justify-start gap-2 text-[#4267B2] hover:text-[#4267B2]/90 hover:bg-[#4267B2]/10"
                  onClick={() => shareToSocial('facebook')}
                >
                  <Facebook className="h-4 w-4" />
                  Share on Facebook
                </Button>
                
                <Button 
                  variant="outline"
                  className="justify-start gap-2 text-[#0A66C2] hover:text-[#0A66C2]/90 hover:bg-[#0A66C2]/10"
                  onClick={() => shareToSocial('linkedin')}
                >
                  <Linkedin className="h-4 w-4" />
                  Share on LinkedIn
                </Button>
                
                <Button 
                  variant="outline"
                  className="justify-start gap-2 text-[#0088cc] hover:text-[#0088cc]/90 hover:bg-[#0088cc]/10"
                  onClick={() => shareToSocial('telegram')}
                >
                  <Send className="h-4 w-4" />
                  Share on Telegram
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="embed" className="space-y-4 py-4">
              <div className="rounded-md bg-muted p-3">
                <div className="text-xs font-mono break-all whitespace-pre-wrap">
                  {getEmbedCode()}
                </div>
              </div>
              
              <Button 
                variant="secondary" 
                className="w-full mt-2"
                onClick={copyEmbedCode}
              >
                <Copy className="h-4 w-4 mr-2" />
                Copy Embed Code
              </Button>
              
              <div className="bg-muted/50 rounded-md p-4 mt-4 text-xs text-muted-foreground">
                <p>
                  Embedding allows you to display your portfolio on your website or blog.
                  The embedded view will update automatically as your portfolio changes.
                </p>
              </div>
            </TabsContent>
            
            <TabsContent value="link" className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Share Link</Label>
                <div className="flex">
                  <Input
                    className="rounded-r-none"
                    value={`${window.location.origin}/shared-portfolio/${portfolioId}`}
                    readOnly
                  />
                  <Button 
                    variant="secondary" 
                    className="rounded-l-none"
                    onClick={copyShareLink}
                  >
                    {isCopied ? (
                      <CheckCircle2 className="h-4 w-4" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
              
              <div className="mt-4 text-center">
                <p className="text-sm text-muted-foreground">
                  Anyone with this link can view your portfolio
                </p>
              </div>
            </TabsContent>
          </Tabs>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowShareDialog(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
