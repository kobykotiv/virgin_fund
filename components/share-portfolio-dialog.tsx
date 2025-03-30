"use client"
import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Copy, Twitter, Facebook, Linkedin, Link as LinkIcon } from "lucide-react"
import { toast } from "sonner"

interface SharePortfolioDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  portfolioId: string
  portfolioName: string
  isPublic?: boolean
}

export function SharePortfolioDialog({
  open,
  onOpenChange,
  portfolioId,
  portfolioName,
  isPublic = false
}: SharePortfolioDialogProps) {
  const [isPublicPortfolio, setIsPublicPortfolio] = useState(isPublic)
  const [isLoading, setIsLoading] = useState(false)
  const [shareUrl, setShareUrl] = useState("")
  
  // Generate share URL when dialog opens or portfolio visibility changes
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : ''
  
  const generateShareUrl = () => {
    return `${baseUrl}/shared-portfolio/${portfolioId}`
  }
  
  const handleVisibilityChange = async (value: boolean) => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/portfolios/share', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          portfolioId,
          isPublic: value
        })
      })
      
      if (!response.ok) {
        throw new Error('Failed to update portfolio visibility')
      }
      
      setIsPublicPortfolio(value)
      
      if (value) {
        const url = generateShareUrl()
        setShareUrl(url)
        toast.success('Portfolio is now public and can be shared')
      } else {
        setShareUrl("")
        toast.success('Portfolio is now private')
      }
    } catch (error) {
      toast.error('Failed to update sharing settings')
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }
  
  const copyToClipboard = () => {
    if (!shareUrl) {
      const url = generateShareUrl()
      setShareUrl(url)
      navigator.clipboard.writeText(url)
    } else {
      navigator.clipboard.writeText(shareUrl)
    }
    toast.success('Link copied to clipboard')
  }
  
  const shareToSocialMedia = async (platform: string) => {
    if (!isPublicPortfolio) {
      toast.error('Make your portfolio public first to share it')
      return
    }
    
    try {
      const response = await fetch('/api/portfolios/social-share', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          portfolioId,
          platform
        })
      })
      
      if (!response.ok) {
        throw new Error('Failed to generate share link')
      }
      
      const data = await response.json()
      
      // Open the share URL in a new window
      window.open(data.url, '_blank')
      toast.success(`Shared to ${platform}`)
    } catch (error) {
      toast.error('Failed to share portfolio')
      console.error(error)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share Portfolio</DialogTitle>
          <DialogDescription>
            Make your portfolio public to share it with others
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex items-center justify-between py-4">
          <Label htmlFor="public-mode" className="font-medium">
            Make portfolio public
          </Label>
          <Switch
            id="public-mode"
            checked={isPublicPortfolio}
            onCheckedChange={handleVisibilityChange}
            disabled={isLoading}
          />
        </div>
        
        {isPublicPortfolio && (
          <>
            <div className="flex items-center space-x-2">
              <Input
                value={shareUrl || generateShareUrl()}
                readOnly
                className="flex-1"
              />
              <Button size="icon" variant="outline" onClick={copyToClipboard}>
                <Copy className="h-4 w-4" />
              </Button>
            </div>
            
            <Tabs defaultValue="social" className="w-full mt-4">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="social">Social Media</TabsTrigger>
                <TabsTrigger value="embed">Embed</TabsTrigger>
              </TabsList>
              <TabsContent value="social" className="pt-4">
                <div className="flex justify-around">
                  <Button variant="outline" size="icon" onClick={() => shareToSocialMedia('twitter')}>
                    <Twitter className="h-5 w-5" />
                  </Button>
                  <Button variant="outline" size="icon" onClick={() => shareToSocialMedia('facebook')}>
                    <Facebook className="h-5 w-5" />
                  </Button>
                  <Button variant="outline" size="icon" onClick={() => shareToSocialMedia('linkedin')}>
                    <Linkedin className="h-5 w-5" />
                  </Button>
                  <Button variant="outline" size="icon" onClick={copyToClipboard}>
                    <LinkIcon className="h-5 w-5" />
                  </Button>
                </div>
              </TabsContent>
              <TabsContent value="embed" className="pt-4">
                <Input
                  value={`<iframe src="${baseUrl}/embed/portfolio/${portfolioId}" width="100%" height="400" frameborder="0"></iframe>`}
                  readOnly
                />
                <p className="text-sm text-muted-foreground mt-2">
                  Copy this code to embed your portfolio on your website.
                </p>
              </TabsContent>
            </Tabs>
          </>
        )}
        
        <DialogFooter className="mt-4">
          <Button onClick={() => onOpenChange(false)}>Done</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
