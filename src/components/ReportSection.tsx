import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Camera, Upload, MapPin, Clock, Send, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const ReportSection = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setUploadedFiles(prev => [...prev, ...files]);
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setUploadedFiles([]);
      // Reset form
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      const form = e.target as HTMLFormElement;
      form.reset();
      
      toast({
        title: "Report Submitted Successfully!",
        description: "Your billboard report has been submitted for review. Report ID: #BG2024001",
      });
    }, 2000);
  };

  return (
    <section id="report" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Report Unauthorized Billboard
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Help make your city better by reporting unauthorized or non-compliant billboards. 
            Your contribution makes a difference.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Report Form */}
          <Card className="bg-card border-border shadow-card p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="location" className="text-foreground">Location</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="location"
                      placeholder="Enter address or coordinates"
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="timestamp" className="text-foreground">Date & Time</Label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="timestamp"
                      type="datetime-local"
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
              </div>

              <div>
                <Label htmlFor="description" className="text-foreground">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe the billboard issue (size, placement, content, compliance concerns, etc.)"
                  className="min-h-[100px]"
                  required
                />
              </div>

              <div>
                <Label className="text-foreground">Billboard Images</Label>
                <div 
                  className="mt-2 border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary transition-colors cursor-pointer"
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    const files = Array.from(e.dataTransfer.files);
                    setUploadedFiles(prev => [...prev, ...files]);
                  }}
                >
                  <div className="flex flex-col items-center space-y-4">
                    <div className="p-4 bg-gradient-accent rounded-lg">
                      <Upload className="h-8 w-8 text-primary" />
                    </div>
                    <div>
                      <p className="text-foreground font-medium">Upload Billboard Photos</p>
                      <p className="text-muted-foreground text-sm">
                        Drag and drop images or click to browse
                      </p>
                    </div>
                    <Button type="button" variant="outline" size="sm">
                      <Camera className="h-4 w-4 mr-2" />
                      Choose Files
                    </Button>
                  </div>
                </div>
                
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                
                {uploadedFiles.length > 0 && (
                  <div className="mt-4 space-y-2">
                    <Label className="text-foreground">Uploaded Files:</Label>
                    {uploadedFiles.map((file, index) => (
                      <div key={index} className="flex items-center justify-between bg-muted/50 rounded-lg p-3">
                        <div className="flex items-center space-x-3">
                          <Camera className="h-4 w-4 text-primary" />
                          <span className="text-sm text-foreground">{file.name}</span>
                          <span className="text-xs text-muted-foreground">
                            ({(file.size / 1024 / 1024).toFixed(2)} MB)
                          </span>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFile(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="category" className="text-foreground">Violation Type</Label>
                  <select
                    id="category"
                    className="w-full px-3 py-2 bg-background border border-input rounded-md text-foreground"
                    required
                  >
                    <option value="">Select violation type</option>
                    <option value="size">Incorrect Dimensions</option>
                    <option value="placement">Poor Placement</option>
                    <option value="safety">Safety Hazard</option>
                    <option value="content">Inappropriate Content</option>
                    <option value="permit">Missing Permit</option>
                  </select>
                </div>
                
                <div>
                  <Label htmlFor="priority" className="text-foreground">Priority Level</Label>
                  <select
                    id="priority"
                    className="w-full px-3 py-2 bg-background border border-input rounded-md text-foreground"
                    required
                  >
                    <option value="">Select priority</option>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-gradient-primary hover:shadow-glow transition-all duration-300"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                    Submitting Report...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Submit Report
                  </>
                )}
              </Button>
            </form>
          </Card>

          {/* Guidelines & Tips */}
          <div className="space-y-6">
            <Card className="bg-card border-border shadow-card p-6">
              <h3 className="text-xl font-semibold text-foreground mb-4">Reporting Guidelines</h3>
              <div className="space-y-3 text-muted-foreground">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <p>Take clear, well-lit photos from multiple angles</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <p>Include surrounding context in your photos</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <p>Provide accurate location information</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <p>Be specific about the violation or concern</p>
                </div>
              </div>
            </Card>

            <Card className="bg-gradient-accent border-primary/20 p-6">
              <h3 className="text-xl font-semibold text-foreground mb-4">What Happens Next?</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-sm font-semibold">
                    1
                  </div>
                  <p className="text-foreground">AI analysis validates your report</p>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-sm font-semibold">
                    2
                  </div>
                  <p className="text-foreground">Authorities are notified automatically</p>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-sm font-semibold">
                    3
                  </div>
                  <p className="text-foreground">You receive updates on the resolution</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ReportSection;
