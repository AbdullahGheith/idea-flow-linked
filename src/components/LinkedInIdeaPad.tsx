import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Lightbulb, Send, Settings, Trash2, ExternalLink, Moon, Sun } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useTheme } from "next-themes";

interface IdeaItem {
  id: string;
  ideaOrDraft: string;
  postGoal: string;
  tone: string;
  targetAudience: string;
  segment?: string;
  theme?: string;
  keywords: string;
  preferredFormat: string;
  profile: string;
  additionalNotes: string;
  timestamp: string;
}

export default function LinkedInIdeaPad() {
  const [ideas, setIdeas] = useState<IdeaItem[]>([]);
  const [newIdea, setNewIdea] = useState({ 
    ideaOrDraft: '', 
    postGoal: '', 
    tone: '', 
    targetAudience: '', 
    segment: '',
    theme: '',
    keywords: '', 
    preferredFormat: '', 
    profile: '', 
    additionalNotes: '' 
  });
  const [webhookUrl, setWebhookUrl] = useState('https://hook.eu2.make.com/pylsegmoba8j7bo3falxl36wdzztzuhr');
  const [isLoading, setIsLoading] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [tempApiKey, setTempApiKey] = useState('');
  const [showApiKeyDialog, setShowApiKeyDialog] = useState(false);
  const { toast } = useToast();
  const { theme, setTheme } = useTheme();

  // Form options
  const postGoals = [
    'Share a personal experience',
    'Demonstrate expertise',
    'Spark discussion',
    'Promote something (e.g. event, course)',
    'Inspire / reflect'
  ];

  const tones = [
    'Personal / informal',
    'Reflective',
    'Light / humorous',
    'Bold / opinionated'
  ];

  const targetAudiences = [
    'Cybersecurity students',
    'Security professionals',
    'Founders / startup people',
    'Tech-curious followers',
    'Newcomers to the field'
  ];

  const mjmSegments = [
    'Samarbejdspartner',
    'Erhvervskunder', 
    'Privatkunder'
  ];

  const mjmTargetAudiences = {
    'Samarbejdspartner': [
      'Ejendomsadministrator',
      'Boligforening',
      'Byggefirma',
      'Entreprenører'
    ],
    'Erhvervskunder': [
      'Virksomhed',
      'Kontorbygninger',
      'Hoteller & Restauranter',
      'Butikker & Showrooms'
    ],
    'Privatkunder': [
      'Renoveringsprojekt',
      'Lejlighedsejere',
      'Nybyg',
      'Flyttelejlighed',
      'Sommerhus'
    ]
  };

  const mjmThemes = [
    'Opfriskning af hjemmet',
    'Klargøring før salg',
    'Børnevenlige malerløsninger',
    'Nybyggeri & maling fra start',
    'Vedligeholdelse af ejendomme',
    'Professionelle kontorløsninger',
    'Butiksindretning & showroom',
    'Maling til hoteller & restauranter',
    'Samarbejde med byggefirmaer',
    'Malerarbejdets rolle i totalentrepriser',
    'Kvalitet i større byggeprojekter',
    'Samarbejde på tværs af faggrupper',
    'Entreprenørens guide',
    'Personligt brand'
  ];

  const creativeFormats = [
    'AI can choose',
    'Selfie-style',
    'AI-generated image',
    'Stock photo',
    'Meme',
    'Screenshot'
  ];

  const profiles = [
    'Default',
    'MJM'
  ];

  // Load data from localStorage on mount
  useEffect(() => {
    const savedIdeas = localStorage.getItem('linkedin-ideas');
    const savedWebhook = localStorage.getItem('make-webhook-url');
    const savedApiKey = localStorage.getItem('linkedin-pad-api-key');
    
    if (savedIdeas) {
      setIdeas(JSON.parse(savedIdeas));
    }
    if (savedWebhook) {
      setWebhookUrl(savedWebhook);
    }
    if (savedApiKey) {
      setApiKey(savedApiKey);
    } else {
      setShowApiKeyDialog(true);
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

  // Save API key
  const saveApiKey = () => {
    if (!tempApiKey.trim()) {
      toast({
        title: "API Key Required",
        description: "Please enter your API key to continue.",
        variant: "destructive",
      });
      return;
    }
    
    setApiKey(tempApiKey);
    localStorage.setItem('linkedin-pad-api-key', tempApiKey);
    setShowApiKeyDialog(false);
    setTempApiKey('');
    
    toast({
      title: "API Key Saved",
      description: "Your API key has been saved successfully.",
    });
  };

  // Clear API key and show dialog
  const reenterApiKey = () => {
    setApiKey('');
    setTempApiKey('');
    localStorage.removeItem('linkedin-pad-api-key');
    setShowApiKeyDialog(true);
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
          "x-make-apikey": apiKey,
        },
        body: JSON.stringify({
          ideaOrDraft: idea.ideaOrDraft,
          postGoal: idea.postGoal,
          tone: idea.tone,
          targetAudience: idea.targetAudience,
          segment: idea.segment,
          theme: idea.theme,
          keywords: idea.keywords,
          preferredFormat: idea.preferredFormat,
          profile: idea.profile,
          additionalNotes: idea.additionalNotes,
          timestamp: idea.timestamp,
          source: "LinkedIn Idea Pad",
          platform: "LinkedIn"
        }),
      });

      if (response.ok) {
        toast({
          title: "Idea Sent to Make.com",
          description: "Your LinkedIn idea has been sent to your Make.com scenario successfully!",
        });
      } else if (response.status === 401) {
        toast({
          title: "Authentication Error",
          description: "Invalid API key. Please check your API key in settings.",
          variant: "destructive",
        });
      } else {
        toast({
          title: `Error ${response.status}`,
          description: "Failed to send idea to Make.com. Please check your webhook URL and API key.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error triggering Make.com webhook:", error);
      toast({
        title: "Network Error",
        description: "Failed to connect to Make.com. Please check your internet connection and webhook URL.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Add new idea
  const addIdea = async () => {
    if (!newIdea.ideaOrDraft.trim()) {
      toast({
        title: "Missing Information",
        description: "Please fill in the idea or draft field.",
        variant: "destructive",
      });
      return;
    }

    if (!newIdea.profile.trim()) {
      toast({
        title: "Missing Information", 
        description: "Please select a profile.",
        variant: "destructive",
      });
      return;
    }

    const idea: IdeaItem = {
      id: Date.now().toString(),
      ideaOrDraft: newIdea.ideaOrDraft,
      postGoal: newIdea.postGoal,
      tone: newIdea.tone,
      targetAudience: newIdea.targetAudience,
      segment: newIdea.segment,
      theme: newIdea.theme,
      keywords: newIdea.keywords,
      preferredFormat: newIdea.preferredFormat,
      profile: newIdea.profile,
      additionalNotes: newIdea.additionalNotes,
      timestamp: new Date().toISOString(),
    };

    const updatedIdeas = [idea, ...ideas];
    saveIdeas(updatedIdeas);
    setNewIdea({ 
      ideaOrDraft: '', 
      postGoal: '', 
      tone: '', 
      targetAudience: '', 
      segment: '',
      theme: '',
      keywords: '', 
      preferredFormat: '', 
      profile: '', 
      additionalNotes: '' 
    });

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
    <>
      {/* API Key Dialog */}
      <Dialog open={showApiKeyDialog} onOpenChange={() => {}}>
        <DialogContent className="sm:max-w-md" onPointerDownOutside={(e) => e.preventDefault()}>
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Lightbulb className="h-5 w-5 text-primary" />
              </div>
              <span>LinkedIn Idea Pad - API Key Required</span>
            </DialogTitle>
            <DialogDescription>
              Please enter your API key to access the LinkedIn Idea Pad. Your key will be saved locally for future use.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="apikey">API Key</Label>
              <Input
                id="apikey"
                type="password"
                placeholder="Enter your API key..."
                value={tempApiKey}
                onChange={(e) => setTempApiKey(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && saveApiKey()}
              />
            </div>
            <Button 
              onClick={saveApiKey} 
              className="w-full bg-gradient-primary hover:shadow-glow transition-all duration-300"
            >
              Save API Key & Continue
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Main Application - only show when API key exists */}
      {apiKey && (
        <div className="min-h-screen bg-gradient-to-br from-background via-accent/20 to-background">
          {/* Header */}
          <div className="bg-gradient-hero shadow-elegant">
            <div className="container mx-auto px-4 py-6">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center space-x-2 md:space-x-3">
                  <div className="p-1.5 md:p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                    <Lightbulb className="h-6 w-6 md:h-8 md:w-8 text-white" />
                  </div>
                  <div>
                    <h1 className="text-lg md:text-2xl font-bold text-white">LinkedIn Idea Pad</h1>
                    <p className="text-xs md:text-base text-white/80 hidden sm:block">Capture ideas and trigger Make.com automations</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-1 md:space-x-2">
                  <Button 
                    variant="secondary" 
                    size="sm" 
                    className="bg-white/20 backdrop-blur-sm border-white/20 text-white hover:bg-white/30"
                    onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                  >
                    {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                  </Button>
                  
                  <Button 
                    variant="secondary" 
                    size="sm" 
                    className="bg-white/20 backdrop-blur-sm border-white/20 text-white hover:bg-white/30 text-xs md:text-sm"
                    onClick={reenterApiKey}
                  >
                    <span className="hidden sm:inline">Change API Key</span>
                    <span className="sm:hidden">API</span>
                  </Button>
                  
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="secondary" size="sm" className="bg-white/20 backdrop-blur-sm border-white/20 text-white hover:bg-white/30 text-xs md:text-sm">
                        <Settings className="h-4 w-4 md:mr-2" />
                        <span className="hidden md:inline">Settings</span>
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
              <Label htmlFor="profile">Profile (required)</Label>
              <select
                id="profile"
                value={newIdea.profile}
                onChange={(e) => {
                  const newProfile = e.target.value;
                  setNewIdea({ 
                    ...newIdea, 
                    profile: newProfile,
                    // Reset dependent fields when profile changes
                    targetAudience: '',
                    segment: '',
                    theme: ''
                  });
                }}
                className="w-full px-3 py-2 border border-input bg-card rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring z-50 relative"
              >
                <option value="">Select profile</option>
                {profiles.map((profile) => (
                  <option key={profile} value={profile}>{profile}</option>
                ))}
              </select>
            </div>

            <div>
              <Label htmlFor="ideaOrDraft">Idea or Raw Draft (required)</Label>
              <Textarea
                id="ideaOrDraft"
                placeholder='Briefly describe what the post is about. e.g., "CTF takeaway", "DevSecOps lesson", "Why students underestimate X"'
                value={newIdea.ideaOrDraft}
                onChange={(e) => setNewIdea({ ...newIdea, ideaOrDraft: e.target.value })}
                rows={3}
              />
              {newIdea.ideaOrDraft.trim() && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-2"
                  onClick={async () => {
                    if (!newIdea.profile.trim()) {
                      toast({
                        title: "Profile Required",
                        description: "Please select a profile before populating fields.",
                        variant: "destructive",
                      });
                      return;
                    }
                    
                    try {
                      setIsLoading(true);
                      const response = await fetch('https://hook.eu2.make.com/2ypmffht4y8yurpeordogjbnrxldm52x', {
                        method: "POST",
                        headers: {
                          "Content-Type": "application/json",
                          "x-make-apikey": apiKey,
                        },
                        body: JSON.stringify({
                          draftContent: newIdea.ideaOrDraft,
                          profile: newIdea.profile,
                          timestamp: new Date().toISOString(),
                          source: "LinkedIn Idea Pad - Populate Fields"
                        }),
                      });

                      if (response.ok) {
                        const data = await response.json();
                        
                        // Update form fields based on the response
                        setNewIdea(prev => ({
                          ...prev,
                          postGoal: data.goal || prev.postGoal,
                          tone: data.tone || prev.tone,
                          targetAudience: data.audience || prev.targetAudience,
                          segment: data.segment || prev.segment,
                          theme: data.theme || prev.theme,
                          preferredFormat: data.creative_format || prev.preferredFormat,
                          keywords: data.keywords || prev.keywords,
                          additionalNotes: data.additional_notes || prev.additionalNotes,
                        }));

                        toast({
                          title: "Fields Populated",
                          description: "Form fields have been automatically filled based on your content.",
                        });
                      } else {
                        toast({
                          title: "Error",
                          description: "Failed to send content to Make.com.",
                          variant: "destructive",
                        });
                      }
                    } catch (error) {
                      console.error("Error calling webhook:", error);
                      toast({
                        title: "Network Error",
                        description: "Failed to connect to Make.com.",
                        variant: "destructive",
                      });
                    } finally {
                      setIsLoading(false);
                    }
                  }}
                  disabled={isLoading}
                >
                  {isLoading ? 'Sending...' : 'Populate Fields'}
                </Button>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="postGoal">Post Goal</Label>
                <select
                  id="postGoal"
                  value={newIdea.postGoal}
                  onChange={(e) => setNewIdea({ ...newIdea, postGoal: e.target.value })}
                  className="w-full px-3 py-2 border border-input bg-card rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring z-50 relative"
                >
                  <option value="">Select post goal</option>
                  {postGoals.map((goal) => (
                    <option key={goal} value={goal}>{goal}</option>
                  ))}
                </select>
              </div>

              <div>
                <Label htmlFor="tone">Tone</Label>
                <select
                  id="tone"
                  value={newIdea.tone}
                  onChange={(e) => setNewIdea({ ...newIdea, tone: e.target.value })}
                  className="w-full px-3 py-2 border border-input bg-card rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring z-50 relative"
                >
                  <option value="">Select tone</option>
                  {tones.map((tone) => (
                    <option key={tone} value={tone}>{tone}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {newIdea.profile === 'MJM' ? (
                <>
                  <div>
                    <Label htmlFor="segment">Segment</Label>
                    <select
                      id="segment"
                      value={newIdea.segment}
                      onChange={(e) => setNewIdea({ ...newIdea, segment: e.target.value, targetAudience: '' })}
                      className="w-full px-3 py-2 border border-input bg-card rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring z-50 relative"
                    >
                      <option value="">Select segment</option>
                      {mjmSegments.map((segment) => (
                        <option key={segment} value={segment}>{segment}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <Label htmlFor="targetAudience">Target Audience</Label>
                    <select
                      id="targetAudience"
                      value={newIdea.targetAudience}
                      onChange={(e) => setNewIdea({ ...newIdea, targetAudience: e.target.value })}
                      className="w-full px-3 py-2 border border-input bg-card rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring z-50 relative"
                      disabled={!newIdea.segment}
                    >
                      <option value="">Select target audience</option>
                      {newIdea.segment && mjmTargetAudiences[newIdea.segment as keyof typeof mjmTargetAudiences]?.map((audience) => (
                        <option key={audience} value={audience}>{audience}</option>
                      ))}
                    </select>
                  </div>
                </>
              ) : (
                <div>
                  <Label htmlFor="targetAudience">Target Audience</Label>
                  <select
                    id="targetAudience"
                    value={newIdea.targetAudience}
                    onChange={(e) => setNewIdea({ ...newIdea, targetAudience: e.target.value })}
                    className="w-full px-3 py-2 border border-input bg-card rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring z-50 relative"
                  >
                    <option value="">Select target audience</option>
                    {targetAudiences.map((audience) => (
                      <option key={audience} value={audience}>{audience}</option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <Label htmlFor="preferredFormat">Creative Format</Label>
                <select
                  id="preferredFormat"
                  value={newIdea.preferredFormat}
                  onChange={(e) => setNewIdea({ ...newIdea, preferredFormat: e.target.value })}
                  className="w-full px-3 py-2 border border-input bg-card rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring z-50 relative"
                >
                  <option value="">Select format</option>
                  {creativeFormats.map((format) => (
                    <option key={format} value={format}>{format}</option>
                  ))}
                </select>
              </div>
            </div>

            {newIdea.profile === 'MJM' && (
              <div>
                <Label htmlFor="theme">Theme</Label>
                <select
                  id="theme"
                  value={newIdea.theme}
                  onChange={(e) => setNewIdea({ ...newIdea, theme: e.target.value })}
                  className="w-full px-3 py-2 border border-input bg-card rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring z-50 relative"
                >
                  <option value="">Select theme</option>
                  {mjmThemes.map((theme) => (
                    <option key={theme} value={theme}>{theme}</option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <Label htmlFor="keywords">Keywords or Hashtags (optional)</Label>
              <Input
                id="keywords"
                placeholder="e.g., #cybersecurity #devsecops #CTF #studentlife"
                value={newIdea.keywords}
                onChange={(e) => setNewIdea({ ...newIdea, keywords: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="additionalNotes">Additional Notes (optional)</Label>
              <Textarea
                id="additionalNotes"
                placeholder="Add context, links, or anything the AI should consider"
                value={newIdea.additionalNotes}
                onChange={(e) => setNewIdea({ ...newIdea, additionalNotes: e.target.value })}
                rows={3}
              />
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
                        <CardTitle className="text-lg line-clamp-2">{idea.ideaOrDraft}</CardTitle>
                         <div className="flex items-center flex-wrap gap-2 mt-2">
                           {idea.postGoal && <Badge variant="secondary">{idea.postGoal}</Badge>}
                           {idea.tone && <Badge variant="outline">{idea.tone}</Badge>}
                           {idea.targetAudience && <Badge className="bg-primary/10 text-primary hover:bg-primary/20">{idea.targetAudience}</Badge>}
                           {idea.segment && <Badge variant="outline">{idea.segment}</Badge>}
                           {idea.theme && <Badge className="bg-secondary text-secondary-foreground">{idea.theme}</Badge>}
                           {idea.profile && <Badge className="bg-accent text-accent-foreground">{idea.profile}</Badge>}
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
                          title="Send to Make.com"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => deleteIdea(idea.id)}
                          title="Delete idea"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {idea.preferredFormat && (
                      <div>
                        <span className="text-sm font-medium text-muted-foreground">Format: </span>
                        <span className="text-sm">{idea.preferredFormat}</span>
                      </div>
                    )}
                    
                    {idea.keywords && (
                      <div>
                        <span className="text-sm font-medium text-muted-foreground">Keywords: </span>
                        <span className="text-sm text-primary">{idea.keywords}</span>
                      </div>
                    )}
                    
                    {idea.additionalNotes && (
                      <div>
                        <span className="text-sm font-medium text-muted-foreground">Notes: </span>
                        <p className="text-sm text-foreground/80 whitespace-pre-wrap mt-1">{idea.additionalNotes}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
            )}
          </div>
          </div>
        </div>
      )}
    </>
  );
}