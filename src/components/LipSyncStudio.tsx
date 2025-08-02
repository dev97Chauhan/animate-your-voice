import { useState } from "react";
import { FileUploader } from "./FileUploader";
import { MediaTrimmer } from "./MediaTrimmer";
import { ProcessingQueue } from "./ProcessingQueue";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Wand2, 
  Upload, 
  Scissors, 
  Zap, 
  Sparkles,
  Video
} from "lucide-react";

export const LipSyncStudio = () => {
  const [uploadedVideo, setUploadedVideo] = useState<File | null>(null);
  const [uploadedAudio, setUploadedAudio] = useState<File | null>(null);
  const [videoTrimRange, setVideoTrimRange] = useState<[number, number] | null>(null);
  const [audioTrimRange, setAudioTrimRange] = useState<[number, number] | null>(null);

  const handleVideoUpload = (file: File | null) => {
    setUploadedVideo(file);
    setVideoTrimRange(null);
  };

  const handleAudioUpload = (file: File | null) => {
    setUploadedAudio(file);
    setAudioTrimRange(null);
  };

  const handleVideoTrimmed = (startTime: number, endTime: number) => {
    setVideoTrimRange([startTime, endTime]);
  };

  const handleAudioTrimmed = (startTime: number, endTime: number) => {
    setAudioTrimRange([startTime, endTime]);
  };

  const handleStartProcessing = (videoFile: File, audioFile: File) => {
    console.log('Starting processing with:', {
      video: videoFile.name,
      audio: audioFile.name,
      videoTrim: videoTrimRange,
      audioTrim: audioTrimRange
    });
  };

  return (
    <div className="min-h-screen bg-gradient-background">
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-primary py-16">
        <div className="absolute inset-0 bg-black/10 opacity-20"></div>
        
        <div className="relative container mx-auto px-4">
          <div className="text-center space-y-6">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="p-3 rounded-full bg-white/10 backdrop-blur-sm">
                <Wand2 className="h-8 w-8 text-white animate-pulse-glow" />
              </div>
              <h1 className="text-4xl md:text-6xl font-bold text-white">
                AI Lip Sync Studio
              </h1>
            </div>
            
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Transform any image or video with synchronized lip movements using advanced AI technology
            </p>
            
            <div className="flex items-center justify-center gap-8 pt-4">
              <div className="flex items-center gap-2 text-white/80">
                <Sparkles className="h-5 w-5" />
                <span>High Quality Output</span>
              </div>
              <div className="flex items-center gap-2 text-white/80">
                <Video className="h-5 w-5" />
                <span>Advanced Trimming</span>
              </div>
              <div className="flex items-center gap-2 text-white/80">
                <Zap className="h-5 w-5" />
                <span>Fast Processing</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <Tabs defaultValue="upload" className="space-y-8">
          <TabsList className="grid w-full grid-cols-3 bg-card/50 backdrop-blur-glass border border-white/10">
            <TabsTrigger value="upload" className="flex items-center gap-2">
              <Upload className="h-4 w-4" />
              Upload Files
            </TabsTrigger>
            <TabsTrigger 
              value="trim" 
              disabled={!uploadedVideo && !uploadedAudio}
              className="flex items-center gap-2"
            >
              <Scissors className="h-4 w-4" />
              Trim Media
            </TabsTrigger>
            <TabsTrigger 
              value="process"
              disabled={!uploadedVideo || !uploadedAudio}
              className="flex items-center gap-2"
            >
              <Zap className="h-4 w-4" />
              Process
            </TabsTrigger>
          </TabsList>

          {/* Upload Tab */}
          <TabsContent value="upload" className="space-y-6">
            <div className="text-center space-y-2 mb-8">
              <h2 className="text-2xl font-semibold text-foreground">
                Upload Your Media Files
              </h2>
              <p className="text-muted-foreground">
                Start by uploading a video or image along with an audio file
              </p>
            </div>
            
            <FileUploader
              onVideoUpload={handleVideoUpload}
              onAudioUpload={handleAudioUpload}
              uploadedVideo={uploadedVideo}
              uploadedAudio={uploadedAudio}
            />

            {uploadedVideo && uploadedAudio && (
              <Card className="bg-gradient-secondary/20 border border-white/20 backdrop-blur-glass">
                <CardContent className="p-6 text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Sparkles className="h-5 w-5 text-primary animate-pulse" />
                    <p className="font-medium text-foreground">
                      Files uploaded successfully!
                    </p>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    You can now proceed to trim your media or start processing directly
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Trim Tab */}
          <TabsContent value="trim" className="space-y-6">
            <div className="text-center space-y-2 mb-8">
              <h2 className="text-2xl font-semibold text-foreground">
                Trim Your Media
              </h2>
              <p className="text-muted-foreground">
                Fine-tune the timing by trimming your video and audio files
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {uploadedVideo && (
                <MediaTrimmer
                  file={uploadedVideo}
                  type="video"
                  onTrimmed={handleVideoTrimmed}
                />
              )}
              
              {uploadedAudio && (
                <MediaTrimmer
                  file={uploadedAudio}
                  type="audio"
                  onTrimmed={handleAudioTrimmed}
                />
              )}
            </div>

            {(videoTrimRange || audioTrimRange) && (
              <Card className="bg-gradient-secondary/20 border border-white/20 backdrop-blur-glass">
                <CardContent className="p-6">
                  <h3 className="font-medium text-foreground mb-4 flex items-center gap-2">
                    <Scissors className="h-5 w-5 text-primary" />
                    Trim Summary
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    {videoTrimRange && (
                      <div>
                        <p className="text-muted-foreground">Video Trim:</p>
                        <p className="font-medium text-foreground">
                          {videoTrimRange[0].toFixed(1)}s - {videoTrimRange[1].toFixed(1)}s
                          ({(videoTrimRange[1] - videoTrimRange[0]).toFixed(1)}s duration)
                        </p>
                      </div>
                    )}
                    {audioTrimRange && (
                      <div>
                        <p className="text-muted-foreground">Audio Trim:</p>
                        <p className="font-medium text-foreground">
                          {audioTrimRange[0].toFixed(1)}s - {audioTrimRange[1].toFixed(1)}s
                          ({(audioTrimRange[1] - audioTrimRange[0]).toFixed(1)}s duration)
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Process Tab */}
          <TabsContent value="process" className="space-y-6">
            <div className="text-center space-y-2 mb-8">
              <h2 className="text-2xl font-semibold text-foreground">
                AI Processing
              </h2>
              <p className="text-muted-foreground">
                Generate lip-synced videos with advanced AI technology
              </p>
            </div>

            <ProcessingQueue
              onStartProcessing={handleStartProcessing}
              videoFile={uploadedVideo}
              audioFile={uploadedAudio}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};