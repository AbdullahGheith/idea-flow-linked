import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Lightbulb, Send, Settings, Trash2, ExternalLink } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

interface IdeaItem {
  id: string;
  title: string;
  content: string;
  category: string;
  timestamp: string;
}

export default function LinkedInIdeaPad() {
  const [ideas, setIdeas] = useState<IdeaItem[]>([]);
  const [newIdea, setNewIdea] = useState({ title: '', content: '', category: '' });
  const [webhookUrl, setWebhookUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Categories for LinkedIn posts
  const categories = [
    'Industry Insights', 'Personal Growth', 'Leadership', 'Tech Trends', 
    'Career Tips', 'Networking', 'Motivation', 'Business Strategy'
  ];

  // Load data from localStorage on mount
  useEffect(() => {
    const savedIdeas = localStorage.getItem('linkedin-ideas');
    const savedWebhook = localStorage.getItem('make-webhook-url');
    
    if (savedIdeas) {
      setIdeas(JSON.parse(savedIdeas));
    }
    if (savedWebhook) {
      setWebhookUrl(savedWebhook);
    }
  }, []);

  // Save ideas to localStorage
  const saveIdeas = (updatedIdeas: IdeaItem[]) => {
    setIdeas(updatedIdeas);
    localStorage.setItem('linkedin-ideas', JSON.stringify(updatedIdeas));
  };

  // Save webhook URL
  const saveWebhookUrl = (url: string) => {
    setWebhookUrl(url);
    localStorage.setItem('make-webhook-url', url);
  };

  // Trigger Make.com webhook
  const triggerMakeWebhook = async (idea: IdeaItem) => {
    if (!webhookUrl) {
      toast({
        title: "Webhook Not Configured",
        description: "Please set up your Make.com webhook URL in settings.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);
      
      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        mode: "no-cors",
        body: JSON.stringify({
          title: idea.title,
          content: idea.content,
          category: idea.category,
          timestamp: idea.timestamp,
          source: "LinkedIn Idea Pad",
          platform: "LinkedIn"
        }),
      });

      toast({
        title: "Idea Sent to Make.com",
        description: "Your LinkedIn idea has been sent to your Make.com scenario. Check your automation flow!",
      });
    } catch (error) {
      console.error("Error triggering Make.com webhook:", error);
      toast({
        title: "Error",
        description: "Failed to send idea to Make.com. Please check your webhook URL.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Add new idea
  const addIdea = async () => {
    if (!newIdea.title.trim() || !newIdea.content.trim()) {
      toast({
        title: "Missing Information",
        description: "Please fill in both title and content for your idea.",
        variant: "destructive",
      });
      return;
    }

    const idea: IdeaItem = {
      id: Date.now().toString(),
      title: newIdea.title,
      content: newIdea.content,
      category: newIdea.category || 'General',
      timestamp: new Date().toISOString(),
    };

    const updatedIdeas = [idea, ...ideas];
    saveIdeas(updatedIdeas);
    setNewIdea({ title: '', content: '', category: '' });

    // Trigger Make.com webhook
    await triggerMakeWebhook(idea);

    toast({
      title: "Idea Added!",
      description: "Your LinkedIn idea has been saved and sent to Make.com.",
    });
  };

  // Delete idea
  const deleteIdea = (id: string) => {
    const updatedIdeas = ideas.filter(idea => idea.id !== id);
    saveIdeas(updatedIdeas);
    
    toast({
      title: "Idea Deleted",
      description: "Your idea has been removed from the pad.",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/20 to-background">
      {/* Header */}
      <div className="bg-gradient-hero shadow-elegant">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                <Lightbulb className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">LinkedIn Idea Pad</h1>
                <p className="text-white/80">Capture ideas and trigger Make.com automations</p>
              </div>
            </div>
            
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="secondary" size="sm" className="bg-white/20 backdrop-blur-sm border-white/20 text-white hover:bg-white/30">
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Make.com Integration Settings</DialogTitle>
                  <DialogDescription>
                    Configure your Make.com webhook URL to automatically trigger flows when you add new ideas.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="webhook">Make.com Webhook URL</Label>
                    <Input
                      id="webhook"
                      placeholder="https://hook.make.com/..."
                      value={webhookUrl}
                      onChange={(e) => saveWebhookUrl(e.target.value)}
                    />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Create a webhook trigger in Make.com and paste the URL here. Your ideas will be automatically sent to your Make.com scenario.
                  </p>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Add New Idea Form */}
        <Card className="mb-8 shadow-card border-0 bg-gradient-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Lightbulb className="h-5 w-5 text-primary" />
              <span>New LinkedIn Idea</span>
            </CardTitle>
            <CardDescription>
              Capture your next great LinkedIn post idea
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="title">Idea Title</Label>
              <Input
                id="title"
                placeholder="What's your main point?"
                value={newIdea.title}
                onChange={(e) => setNewIdea({ ...newIdea, title: e.target.value })}
              />
            </div>
            
            <div>
              <Label htmlFor="content">Content</Label>
              <Textarea
                id="content"
                placeholder="Elaborate on your idea. What story will you tell? What insights will you share?"
                value={newIdea.content}
                onChange={(e) => setNewIdea({ ...newIdea, content: e.target.value })}
                rows={4}
              />
            </div>

            <div>
              <Label htmlFor="category">Category</Label>
              <select
                id="category"
                value={newIdea.category}
                onChange={(e) => setNewIdea({ ...newIdea, category: e.target.value })}
                className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="">Select a category</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <Button 
              onClick={addIdea} 
              className="w-full bg-gradient-primary hover:shadow-glow transition-all duration-300"
              disabled={isLoading}
            >
              {isLoading ? (
                <>Adding & Triggering...</>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Add Idea & Trigger Make.com
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Ideas List */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold mb-4">Your Ideas ({ideas.length})</h2>
          
          {ideas.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <Lightbulb className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No ideas yet. Add your first LinkedIn post idea above!</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {ideas.map((idea) => (
                <Card key={idea.id} className="shadow-card hover:shadow-elegant transition-all duration-300">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg">{idea.title}</CardTitle>
                        <div className="flex items-center space-x-2 mt-2">
                          <Badge variant="secondary">{idea.category}</Badge>
                          <span className="text-sm text-muted-foreground">
                            {new Date(idea.timestamp).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => triggerMakeWebhook(idea)}
                          disabled={isLoading}
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => deleteIdea(idea.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-foreground/80 whitespace-pre-wrap">{idea.content}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}