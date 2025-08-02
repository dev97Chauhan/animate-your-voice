import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Upload, Video, Image, Music, X } from "lucide-react";
import { toast } from "sonner";

interface FileUploaderProps {
  onVideoUpload: (file: File) => void;
  onAudioUpload: (file: File) => void;
  uploadedVideo: File | null;
  uploadedAudio: File | null;
}

export const FileUploader = ({ onVideoUpload, onAudioUpload, uploadedVideo, uploadedAudio }: FileUploaderProps) => {
  const [dragOver, setDragOver] = useState<'video' | 'audio' | null>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const audioInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent, type: 'video' | 'audio') => {
    e.preventDefault();
    setDragOver(type);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(null);
  };

  const handleDrop = (e: React.DragEvent, type: 'video' | 'audio') => {
    e.preventDefault();
    setDragOver(null);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      
      if (type === 'video') {
        if (file.type.startsWith('video/') || file.type.startsWith('image/')) {
          onVideoUpload(file);
          toast.success(`${file.type.startsWith('video/') ? 'Video' : 'Image'} uploaded successfully!`);
        } else {
          toast.error('Please upload a video or image file');
        }
      } else {
        if (file.type.startsWith('audio/')) {
          onAudioUpload(file);
          toast.success('Audio uploaded successfully!');
        } else {
          toast.error('Please upload an audio file');
        }
      }
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>, type: 'video' | 'audio') => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      
      if (type === 'video') {
        onVideoUpload(file);
        toast.success(`${file.type.startsWith('video/') ? 'Video' : 'Image'} uploaded successfully!`);
      } else {
        onAudioUpload(file);
        toast.success('Audio uploaded successfully!');
      }
    }
  };

  const removeFile = (type: 'video' | 'audio') => {
    if (type === 'video') {
      onVideoUpload(null as any);
    } else {
      onAudioUpload(null as any);
    }
    toast.info(`${type === 'video' ? 'Video/Image' : 'Audio'} removed`);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Video/Image Upload */}
      <Card className="relative">
        <div
          className={`p-8 border-2 border-dashed rounded-lg transition-all duration-300 ${
            dragOver === 'video' 
              ? 'border-primary bg-primary/10 shadow-glow' 
              : 'border-border hover:border-primary/50'
          } ${uploadedVideo ? 'bg-card' : 'bg-card/50'}`}
          onDragOver={(e) => handleDragOver(e, 'video')}
          onDragLeave={handleDragLeave}
          onDrop={(e) => handleDrop(e, 'video')}
        >
          {uploadedVideo ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {uploadedVideo.type.startsWith('video/') ? (
                    <Video className="h-8 w-8 text-primary" />
                  ) : (
                    <Image className="h-8 w-8 text-primary" />
                  )}
                  <div>
                    <p className="font-medium text-foreground">{uploadedVideo.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {(uploadedVideo.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeFile('video')}
                  className="hover:bg-destructive/20 hover:text-destructive"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
              {uploadedVideo.type.startsWith('video/') && (
                <video
                  src={URL.createObjectURL(uploadedVideo)}
                  className="w-full max-h-48 rounded-lg object-cover"
                  controls
                />
              )}
              
              {uploadedVideo.type.startsWith('image/') && (
                <img
                  src={URL.createObjectURL(uploadedVideo)}
                  alt="Uploaded"
                  className="w-full max-h-48 rounded-lg object-cover"
                />
              )}
            </div>
          ) : (
            <div className="text-center space-y-4">
              <div className="mx-auto h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                <Upload className="h-8 w-8 text-primary animate-float" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Upload Video or Image</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Drag & drop or click to select
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  Supports MP4, AVI, MOV, JPG, PNG
                </p>
              </div>
              <Button
                variant="gradient"
                onClick={() => videoInputRef.current?.click()}
                className="mt-4"
              >
                <Upload className="h-4 w-4 mr-2" />
                Choose File
              </Button>
            </div>
          )}
          
          <input
            ref={videoInputRef}
            type="file"
            accept="video/*,image/*"
            onChange={(e) => handleFileSelect(e, 'video')}
            className="hidden"
          />
        </div>
      </Card>

      {/* Audio Upload */}
      <Card className="relative">
        <div
          className={`p-8 border-2 border-dashed rounded-lg transition-all duration-300 ${
            dragOver === 'audio' 
              ? 'border-primary bg-primary/10 shadow-glow' 
              : 'border-border hover:border-primary/50'
          } ${uploadedAudio ? 'bg-card' : 'bg-card/50'}`}
          onDragOver={(e) => handleDragOver(e, 'audio')}
          onDragLeave={handleDragLeave}
          onDrop={(e) => handleDrop(e, 'audio')}
        >
          {uploadedAudio ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Music className="h-8 w-8 text-primary" />
                  <div>
                    <p className="font-medium text-foreground">{uploadedAudio.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {(uploadedAudio.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeFile('audio')}
                  className="hover:bg-destructive/20 hover:text-destructive"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
              <audio
                src={URL.createObjectURL(uploadedAudio)}
                className="w-full"
                controls
              />
            </div>
          ) : (
            <div className="text-center space-y-4">
              <div className="mx-auto h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                <Music className="h-8 w-8 text-primary animate-float" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Upload Audio</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Drag & drop or click to select
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  Supports MP3, WAV, AAC, OGG
                </p>
              </div>
              <Button
                variant="gradient"
                onClick={() => audioInputRef.current?.click()}
                className="mt-4"
              >
                <Upload className="h-4 w-4 mr-2" />
                Choose File
              </Button>
            </div>
          )}
          
          <input
            ref={audioInputRef}
            type="file"
            accept="audio/*"
            onChange={(e) => handleFileSelect(e, 'audio')}
            className="hidden"
          />
        </div>
      </Card>
    </div>
  );
};