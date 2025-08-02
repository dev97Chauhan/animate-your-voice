import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  Zap, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Download, 
  Play,
  Trash2,
  RefreshCw
} from "lucide-react";
import { toast } from "sonner";

interface ProcessingJob {
  id: string;
  videoName: string;
  audioName: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number;
  createdAt: Date;
  completedAt?: Date;
  resultUrl?: string;
  estimatedTime?: number;
}

interface ProcessingQueueProps {
  onStartProcessing: (videoFile: File, audioFile: File) => void;
  videoFile: File | null;
  audioFile: File | null;
}

export const ProcessingQueue = ({ onStartProcessing, videoFile, audioFile }: ProcessingQueueProps) => {
  const [jobs, setJobs] = useState<ProcessingJob[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  // Mock processing simulation
  const simulateProcessing = (jobId: string) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 15 + 5; // Random progress between 5-20%
      
      setJobs(prev => prev.map(job => 
        job.id === jobId 
          ? { ...job, progress: Math.min(progress, 100) }
          : job
      ));

      if (progress >= 100) {
        clearInterval(interval);
        setJobs(prev => prev.map(job => 
          job.id === jobId 
            ? { 
                ...job, 
                status: 'completed' as const, 
                progress: 100, 
                completedAt: new Date(),
                resultUrl: `#result-${jobId}` // Mock URL
              }
            : job
        ));
        setIsProcessing(false);
        toast.success('Lip sync processing completed!');
      }
    }, 1000);

    return () => clearInterval(interval);
  };

  const startProcessing = () => {
    if (!videoFile || !audioFile) {
      toast.error('Please upload both video/image and audio files');
      return;
    }

    const newJob: ProcessingJob = {
      id: `job-${Date.now()}`,
      videoName: videoFile.name,
      audioName: audioFile.name,
      status: 'processing',
      progress: 0,
      createdAt: new Date(),
      estimatedTime: 120 // 2 minutes estimate
    };

    setJobs(prev => [newJob, ...prev]);
    setIsProcessing(true);
    
    toast.success('Processing started! This may take a few minutes...');
    
    // Simulate processing
    setTimeout(() => {
      simulateProcessing(newJob.id);
    }, 1000);

    // Call the parent handler
    onStartProcessing(videoFile, audioFile);
  };

  const deleteJob = (jobId: string) => {
    setJobs(prev => prev.filter(job => job.id !== jobId));
    toast.info('Job removed from queue');
  };

  const getStatusIcon = (status: ProcessingJob['status']) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'processing':
        return <RefreshCw className="h-4 w-4 text-blue-500 animate-spin" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-500" />;
    }
  };

  const getStatusBadge = (status: ProcessingJob['status']) => {
    const variants = {
      pending: 'secondary',
      processing: 'default',
      completed: 'secondary',
      failed: 'destructive'
    } as const;

    return (
      <Badge variant={variants[status]} className="capitalize">
        {status}
      </Badge>
    );
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6">
      {/* Start Processing Card */}
      <Card className="bg-gradient-primary text-primary-foreground border-0 shadow-glow">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            AI Lip Sync Processing
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="opacity-90">Video/Image:</p>
              <p className="font-medium truncate">
                {videoFile ? videoFile.name : 'Not uploaded'}
              </p>
            </div>
            <div>
              <p className="opacity-90">Audio:</p>
              <p className="font-medium truncate">
                {audioFile ? audioFile.name : 'Not uploaded'}
              </p>
            </div>
          </div>
          
          <Button
            variant="glass"
            onClick={startProcessing}
            disabled={!videoFile || !audioFile || isProcessing}
            className="w-full hover:bg-white/20"
          >
            <Zap className="h-4 w-4 mr-2" />
            {isProcessing ? 'Processing...' : 'Start Lip Sync'}
          </Button>
          
          {(!videoFile || !audioFile) && (
            <p className="text-xs opacity-75 text-center">
              Upload both files to start processing
            </p>
          )}
        </CardContent>
      </Card>

      {/* Processing Queue */}
      {jobs.length > 0 && (
        <Card className="bg-card/80 backdrop-blur-glass border border-white/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              Processing Queue ({jobs.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {jobs.map((job) => (
              <div
                key={job.id}
                className="p-4 rounded-lg bg-card/50 border border-white/5 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(job.status)}
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-sm">{job.videoName}</p>
                        <span className="text-muted-foreground">+</span>
                        <p className="font-medium text-sm">{job.audioName}</p>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Started {job.createdAt.toLocaleTimeString()}
                        {job.completedAt && ` • Completed ${job.completedAt.toLocaleTimeString()}`}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {getStatusBadge(job.status)}
                    
                    {job.status === 'completed' && job.resultUrl && (
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Play className="h-3 w-3" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Download className="h-3 w-3" />
                        </Button>
                      </div>
                    )}
                    
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteJob(job.id)}
                      className="h-8 w-8 hover:bg-destructive/20 hover:text-destructive"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>

                {job.status === 'processing' && (
                  <div className="space-y-2">
                    <Progress value={job.progress} className="h-2" />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>{Math.round(job.progress)}% complete</span>
                      {job.estimatedTime && (
                        <span>
                          ~{formatDuration(Math.round(job.estimatedTime * (1 - job.progress / 100)))} remaining
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {job.status === 'completed' && (
                  <div className="p-3 rounded-md bg-green-500/10 border border-green-500/20">
                    <p className="text-sm text-green-400 font-medium">
                      ✨ Lip sync completed successfully!
                    </p>
                    <p className="text-xs text-green-400/80 mt-1">
                      Processing time: {job.completedAt && 
                        Math.round((job.completedAt.getTime() - job.createdAt.getTime()) / 1000)}s
                    </p>
                  </div>
                )}

                {job.status === 'failed' && (
                  <div className="p-3 rounded-md bg-red-500/10 border border-red-500/20">
                    <p className="text-sm text-red-400 font-medium">
                      Processing failed. Please try again.
                    </p>
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
};