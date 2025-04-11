"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useContent } from "@/providers/content-provider"
import { useToast } from "@/components/ui/use-toast"
import type { LandingPageContent } from "@/lib/content/landing-page"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Trash2, Save } from "lucide-react"

export function ConfigEditor() {
  const { content, updateContent, resetContent } = useContent()
  const [editableContent, setEditableContent] = useState<LandingPageContent>(content)
  const { toast } = useToast()

  const handleSave = async () => {
    try {
      await updateContent(editableContent)
      toast({
        title: "Content updated",
        description: "Your changes have been saved successfully."
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update content. Please try again.",
        variant: "destructive"
      })
    }
  }

  const handleReset = () => {
    resetContent()
    setEditableContent(content)
    toast({
      title: "Content reset",
      description: "Content has been reset to default values."
    })
  }

  const addFeature = () => {
    setEditableContent({
      ...editableContent,
      features: [
        ...editableContent.features,
        {
          id: Math.random().toString(),
          title: "New Feature",
          description: "Feature description",
          icon: "Sparkles"
        }
      ]
    })
  }

  const removeFeature = (id: string) => {
    setEditableContent({
      ...editableContent,
      features: editableContent.features.filter(f => f.id !== id)
    })
  }

  const addTestimonial = () => {
    setEditableContent({
      ...editableContent,
      testimonials: [
        ...editableContent.testimonials,
        {
          id: Math.random().toString(),
          quote: "New testimonial",
          author: "Author Name",
          role: "Role",
          rating: 5
        }
      ]
    })
  }

  const removeTestimonial = (id: string) => {
    setEditableContent({
      ...editableContent,
      testimonials: editableContent.testimonials.filter(t => t.id !== id)
    })
  }

  return (
    <div className="container py-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Content Editor</h2>
        <div className="flex gap-2">
          <Button onClick={handleSave}>
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
          <Button variant="outline" onClick={handleReset}>
            Reset to Default
          </Button>
        </div>
      </div>

      <Tabs defaultValue="hero">
        <TabsList>
          <TabsTrigger value="hero">Hero</TabsTrigger>
          <TabsTrigger value="features">Features</TabsTrigger>
          <TabsTrigger value="pricing">Pricing</TabsTrigger>
          <TabsTrigger value="testimonials">Testimonials</TabsTrigger>
        </TabsList>

        <TabsContent value="hero">
          <Card>
            <CardHeader>
              <CardTitle>Hero Section</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">Title</label>
                <Input
                  value={editableContent.hero.title}
                  onChange={(e) => setEditableContent({
                    ...editableContent,
                    hero: { ...editableContent.hero, title: e.target.value }
                  })}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Subtitle</label>
                <Input
                  value={editableContent.hero.subtitle}
                  onChange={(e) => setEditableContent({
                    ...editableContent,
                    hero: { ...editableContent.hero, subtitle: e.target.value }
                  })}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Description</label>
                <Textarea
                  value={editableContent.hero.description}
                  onChange={(e) => setEditableContent({
                    ...editableContent,
                    hero: { ...editableContent.hero, description: e.target.value }
                  })}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="features">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Features</CardTitle>
              <Button onClick={addFeature} size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Add Feature
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {editableContent.features.map((feature, index) => (
                  <div key={feature.id} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-start mb-4">
                      <h4 className="font-medium">Feature {index + 1}</h4>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFeature(feature.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium">Title</label>
                        <Input
                          value={feature.title}
                          onChange={(e) => {
                            const newFeatures = [...editableContent.features]
                            newFeatures[index] = { ...feature, title: e.target.value }
                            setEditableContent({ ...editableContent, features: newFeatures })
                          }}
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Description</label>
                        <Textarea
                          value={feature.description}
                          onChange={(e) => {
                            const newFeatures = [...editableContent.features]
                            newFeatures[index] = { ...feature, description: e.target.value }
                            setEditableContent({ ...editableContent, features: newFeatures })
                          }}
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Icon</label>
                        <Input
                          value={feature.icon}
                          onChange={(e) => {
                            const newFeatures = [...editableContent.features]
                            newFeatures[index] = { ...feature, icon: e.target.value }
                            setEditableContent({ ...editableContent, features: newFeatures })
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pricing">
          <Card>
            <CardHeader>
              <CardTitle>Pricing Plans</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {editableContent.pricing.map((plan, index) => (
                  <div key={plan.id} className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-4">Plan: {plan.name}</h4>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium">Name</label>
                        <Input
                          value={plan.name}
                          onChange={(e) => {
                            const newPlans = [...editableContent.pricing]
                            newPlans[index] = { ...plan, name: e.target.value }
                            setEditableContent({ ...editableContent, pricing: newPlans })
                          }}
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Price</label>
                        <Input
                          type="number"
                          value={plan.price}
                          onChange={(e) => {
                            const newPlans = [...editableContent.pricing]
                            newPlans[index] = { ...plan, price: Number(e.target.value) }
                            setEditableContent({ ...editableContent, pricing: newPlans })
                          }}
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Description</label>
                        <Textarea
                          value={plan.description}
                          onChange={(e) => {
                            const newPlans = [...editableContent.pricing]
                            newPlans[index] = { ...plan, description: e.target.value }
                            setEditableContent({ ...editableContent, pricing: newPlans })
                          }}
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Features (one per line)</label>
                        <Textarea
                          value={plan.features.join('\n')}
                          onChange={(e) => {
                            const newPlans = [...editableContent.pricing]
                            newPlans[index] = { ...plan, features: e.target.value.split('\n') }
                            setEditableContent({ ...editableContent, pricing: newPlans })
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="testimonials">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Testimonials</CardTitle>
              <Button onClick={addTestimonial} size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Add Testimonial
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {editableContent.testimonials.map((testimonial, index) => (
                  <div key={testimonial.id} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-start mb-4">
                      <h4 className="font-medium">Testimonial {index + 1}</h4>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeTestimonial(testimonial.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium">Quote</label>
                        <Textarea
                          value={testimonial.quote}
                          onChange={(e) => {
                            const newTestimonials = [...editableContent.testimonials]
                            newTestimonials[index] = { ...testimonial, quote: e.target.value }
                            setEditableContent({ ...editableContent, testimonials: newTestimonials })
                          }}
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Author</label>
                        <Input
                          value={testimonial.author}
                          onChange={(e) => {
                            const newTestimonials = [...editableContent.testimonials]
                            newTestimonials[index] = { ...testimonial, author: e.target.value }
                            setEditableContent({ ...editableContent, testimonials: newTestimonials })
                          }}
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Role</label>
                        <Input
                          value={testimonial.role}
                          onChange={(e) => {
                            const newTestimonials = [...editableContent.testimonials]
                            newTestimonials[index] = { ...testimonial, role: e.target.value }
                            setEditableContent({ ...editableContent, testimonials: newTestimonials })
                          }}
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Rating (1-5)</label>
                        <Input
                          type="number"
                          min="1"
                          max="5"
                          value={testimonial.rating}
                          onChange={(e) => {
                            const newTestimonials = [...editableContent.testimonials]
                            newTestimonials[index] = { ...testimonial, rating: Number(e.target.value) }
                            setEditableContent({ ...editableContent, testimonials: newTestimonials })
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}