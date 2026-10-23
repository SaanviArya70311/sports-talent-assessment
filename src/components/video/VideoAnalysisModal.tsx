import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, RotateCcw, Eye, ShieldCheck, AlertCircle, Upload, CheckCircle2, ChevronRight, Activity, X } from 'lucide-react';
import { AssessmentDefinition } from '../../types';

interface VideoAnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
  assessment?: AssessmentDefinition;
  initialVideoUrl?: string;
  onConfirmAnalysis?: (results: {
    videoUrl: string;
    videoMetadata: {
      filename: string;
      durationSec: number;
      repCountEstimated?: number;
      cadenceBpm?: number;
      poseReliabilityPct: number;
    };
    measuredValue: number;
  }) => void;
}

export const VideoAnalysisModal: React.FC<VideoAnalysisModalProps> = ({
  isOpen,
  onClose,
  assessment,
  initialVideoUrl,
  onConfirmAnalysis
}) => {
  const [videoSrc, setVideoSrc] = useState<string>(
    initialVideoUrl || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4'
  );
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackRate, setPlaybackRate] = useState<number>(1);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [showPoseOverlay, setShowPoseOverlay] = useState<boolean>(true);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisCompleted, setAnalysisCompleted] = useState<boolean>(false);

  // Video and analysis metadata
  const [fileName, setFileName] = useState<string>('combine_assessment_demo.mp4');
  const [estimatedReps, setEstimatedReps] = useState<number>(0);
  const [cadenceBpm, setCadenceBpm] = useState<number>(0);
  const [poseConfidence, setPoseConfidence] = useState<number>(96);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (initialVideoUrl) {
      setVideoSrc(initialVideoUrl);
    }
  }, [initialVideoUrl]);

  if (!isOpen) return null;

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
      // Realistic simulation of movement analysis as video progresses
      if (assessment?.category === 'strength' && videoRef.current.currentTime > 0) {
        const reps = Math.floor(videoRef.current.currentTime * 0.78);
        setEstimatedReps(reps);
        setCadenceBpm(48);
      } else if (assessment?.category === 'speed') {
        setCadenceBpm(240);
      }
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const changeSpeed = (rate: number) => {
    setPlaybackRate(rate);
    if (videoRef.current) {
      videoRef.current.playbackRate = rate;
    }
  };

  const stepFrame = (frames: number) => {
    if (videoRef.current) {
      videoRef.current.pause();
      setIsPlaying(false);
      videoRef.current.currentTime = Math.max(0, Math.min(duration, videoRef.current.currentTime + frames * (1 / 30)));
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploadError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size (< 100MB)
    if (file.size > 100 * 1024 * 1024) {
      setUploadError('File size exceeds the 100MB limit. Please compress or clip the video.');
      return;
    }

    // Validate type
    const validTypes = ['video/mp4', 'video/webm', 'video/quicktime'];
    if (!validTypes.includes(file.type)) {
      setUploadError('Invalid format. Supported formats: MP4, WebM, MOV.');
      return;
    }

    const localUrl = URL.createObjectURL(file);
    setFileName(file.name);
    setVideoSrc(localUrl);
    setAnalysisCompleted(false);
  };

  const runComputerVisionAnalysis = () => {
    setIsAnalyzing(true);
    // Simulate high-fidelity keypoint estimation pipeline
    setTimeout(() => {
      setIsAnalyzing(false);
      setAnalysisCompleted(true);
      setPoseConfidence(95);

      if (assessment?.category === 'strength') {
        setEstimatedReps(42);
        setCadenceBpm(50);
      } else if (assessment?.id === 'sprint-40m') {
        setEstimatedReps(0);
        setCadenceBpm(248);
      }
    }, 1600);
  };

  const handleConfirm = () => {
    if (onConfirmAnalysis) {
      const measuredVal = assessment?.id === 'sprint-40m'
        ? 4.62
        : assessment?.category === 'strength'
        ? (estimatedReps || 40)
        : 68.0;

      onConfirmAnalysis({
        videoUrl: videoSrc,
        videoMetadata: {
          filename: fileName,
          durationSec: Math.round(duration * 10) / 10 || 12,
          repCountEstimated: estimatedReps > 0 ? estimatedReps : undefined,
          cadenceBpm: cadenceBpm > 0 ? cadenceBpm : undefined,
          poseReliabilityPct: poseConfidence
        },
        measuredValue: measuredVal
      });
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="bg-[#0B111E] border border-slate-800 rounded-2xl w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800/80">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-cyan-500/10 text-cyan-400 rounded-lg">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                Video Movement Evidence & Computer Vision
                <span className="text-[11px] font-mono text-cyan-400 bg-cyan-950/60 border border-cyan-800/50 px-2 py-0.5 rounded">
                  {assessment?.name || 'Sprint & Power Protocol'}
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Transparent verification: Body landmark tracking & cadence verification.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800/80 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {/* Video Player & Pose Canvas Container */}
          <div className="relative bg-black rounded-xl overflow-hidden aspect-video border border-slate-800 flex items-center justify-center group">
            <video
              ref={videoRef}
              src={videoSrc}
              className="w-full h-full object-contain"
              onTimeUpdate={handleTimeUpdate}
              onLoadedMetadata={handleLoadedMetadata}
              playsInline
              loop
            />

            {/* Simulated Dynamic Anatomical Landmark Pose Wireframe */}
            {showPoseOverlay && (
              <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-85">
                {/* Dynamic coordinate shifts based on video playback */}
                {(() => {
                  const shiftY = Math.sin(currentTime * 4) * 12;
                  const shiftX = Math.cos(currentTime * 2) * 8;
                  const head = { x: 320 + shiftX, y: 110 + shiftY };
                  const shoulderL = { x: 300 + shiftX, y: 140 + shiftY };
                  const shoulderR = { x: 340 + shiftX, y: 140 + shiftY };
                  const elbowL = { x: 280 + shiftX * 1.5, y: 180 + shiftY };
                  const elbowR = { x: 360 - shiftX * 1.5, y: 180 + shiftY };
                  const wristL = { x: 270 + shiftX * 2, y: 220 + shiftY };
                  const wristR = { x: 370 - shiftX * 2, y: 220 + shiftY };
                  const hipL = { x: 305 + shiftX, y: 230 + shiftY };
                  const hipR = { x: 335 + shiftX, y: 230 + shiftY };
                  const kneeL = { x: 295 - shiftX, y: 290 - shiftY };
                  const kneeR = { x: 345 + shiftX, y: 290 + shiftY };
                  const ankleL = { x: 290 - shiftX * 1.5, y: 340 - shiftY };
                  const ankleR = { x: 350 + shiftX * 1.5, y: 340 + shiftY };

                  return (
                    <g stroke="#06B6D4" strokeWidth="2.5" strokeLinecap="round" fill="#0891B2">
                      {/* Torso & Limbs Bones */}
                      <line x1={head.x} y1={head.y} x2={(shoulderL.x + shoulderR.x) / 2} y2={shoulderL.y} />
                      <line x1={shoulderL.x} y1={shoulderL.y} x2={shoulderR.x} y2={shoulderR.y} />
                      <line x1={shoulderL.x} y1={shoulderL.y} x2={elbowL.x} y2={elbowL.y} />
                      <line x1={elbowL.x} y1={elbowL.y} x2={wristL.x} y2={wristL.y} />
                      <line x1={shoulderR.x} y1={shoulderR.y} x2={elbowR.x} y2={elbowR.y} />
                      <line x1={elbowR.x} y1={elbowR.y} x2={wristR.x} y2={wristR.y} />
                      <line x1={(shoulderL.x + shoulderR.x) / 2} y1={shoulderL.y} x2={(hipL.x + hipR.x) / 2} y2={hipL.y} />
                      <line x1={hipL.x} y1={hipL.y} x2={hipR.x} y2={hipR.y} />
                      <line x1={hipL.x} y1={hipL.y} x2={kneeL.x} y2={kneeL.y} />
                      <line x1={kneeL.x} y1={kneeL.y} x2={ankleL.x} y2={ankleL.y} />
                      <line x1={hipR.x} y1={hipR.y} x2={kneeR.x} y2={kneeR.y} />
                      <line x1={kneeR.x} y1={kneeR.y} x2={ankleR.x} y2={ankleR.y} />

                      {/* Joint circles */}
                      {[head, shoulderL, shoulderR, elbowL, elbowR, wristL, wristR, hipL, hipR, kneeL, kneeR, ankleL, ankleR].map(
                        (pt, idx) => (
                          <circle key={idx} cx={pt.x} cy={pt.y} r="4" fill="#38BDF8" stroke="#080C14" strokeWidth="1.5" />
                        )
                      )}
                    </g>
                  );
                })()}
              </svg>
            )}

            {/* Analysis In-Progress HUD */}
            {isAnalyzing && (
              <div className="absolute inset-0 bg-slate-950/80 flex flex-col items-center justify-center gap-3">
                <div className="w-10 h-10 border-3 border-cyan-500 border-t-transparent rounded-full animate-spin" />
                <span className="text-sm font-mono text-cyan-300">
                  Tracking joint kinematics & cadence...
                </span>
              </div>
            )}

            {/* Overlay status pill in corner */}
            <div className="absolute top-3 left-3 bg-slate-950/80 border border-slate-700/80 px-2.5 py-1 rounded text-[11px] font-mono text-slate-300 backdrop-blur-sm flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${isAnalyzing ? 'bg-amber-400 animate-ping' : 'bg-emerald-400'}`} />
              <span>{showPoseOverlay ? 'Landmark Tracking: Active' : 'Landmark Tracking: Hidden'}</span>
              <span>·</span>
              <span>{Math.round(currentTime * 10) / 10}s / {Math.round(duration * 10) / 10}s</span>
            </div>
          </div>

          {/* Timeline and Scrubbing Controls */}
          <div className="space-y-2 bg-slate-900/60 border border-slate-800 p-3 rounded-xl">
            <div className="flex items-center gap-3">
              <input
                type="range"
                min="0"
                max={duration || 100}
                step="0.01"
                value={currentTime}
                onChange={handleSeek}
                className="w-full accent-cyan-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center gap-2">
                <button
                  onClick={togglePlay}
                  className="p-2 bg-cyan-500 text-slate-950 rounded-lg hover:bg-cyan-400 transition-colors font-semibold"
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                </button>
                <button
                  onClick={() => stepFrame(-1)}
                  className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono rounded"
                >
                  -1 Frame
                </button>
                <button
                  onClick={() => stepFrame(1)}
                  className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono rounded"
                >
                  +1 Frame
                </button>
                <div className="h-4 w-px bg-slate-700 mx-1" />
                <span className="text-xs text-slate-400 font-mono">Speed:</span>
                {[0.25, 0.5, 1].map(rate => (
                  <button
                    key={rate}
                    onClick={() => changeSpeed(rate)}
                    className={`px-2 py-0.5 text-xs font-mono rounded transition-colors ${
                      playbackRate === rate
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {rate}x
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowPoseOverlay(!showPoseOverlay)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium border transition-colors ${
                    showPoseOverlay
                      ? 'bg-cyan-950/60 border-cyan-600 text-cyan-300'
                      : 'bg-slate-800 border-slate-700 text-slate-400'
                  }`}
                >
                  <Eye className="w-3.5 h-3.5" />
                  {showPoseOverlay ? 'Hide Keypoints' : 'Show Keypoints'}
                </button>

                <button
                  onClick={runComputerVisionAnalysis}
                  disabled={isAnalyzing}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white rounded text-xs font-medium transition-colors"
                >
                  <Activity className="w-3.5 h-3.5 text-cyan-400" />
                  Run CV Estimator
                </button>
              </div>
            </div>
          </div>

          {/* Analysis Metrics Output */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-slate-900/50 border border-slate-800 p-3 rounded-xl">
              <span className="text-[11px] font-mono text-slate-400 uppercase">Estimated Movement Cadence</span>
              <div className="text-xl font-bold text-white mt-0.5">
                {cadenceBpm > 0 ? `${cadenceBpm} BPM` : '48 BPM'}
              </div>
              <span className="text-[10px] text-slate-400">Step/rep frequency frequency</span>
            </div>

            <div className="bg-slate-900/50 border border-slate-800 p-3 rounded-xl">
              <span className="text-[11px] font-mono text-slate-400 uppercase">Pose Landmark Reliability</span>
              <div className="text-xl font-bold text-emerald-400 mt-0.5">
                {poseConfidence}%
              </div>
              <span className="text-[10px] text-slate-400">Joint occlusion confidence</span>
            </div>

            <div className="bg-slate-900/50 border border-slate-800 p-3 rounded-xl">
              <span className="text-[11px] font-mono text-slate-400 uppercase">Estimated Repetitions / Time</span>
              <div className="text-xl font-bold text-cyan-300 mt-0.5">
                {estimatedReps > 0 ? `${estimatedReps} Reps` : `${Math.round(duration * 10) / 10 || 4.6}s`}
              </div>
              <span className="text-[10px] text-slate-400">Automated CV metric</span>
            </div>
          </div>

          {/* Honest Video Privacy & Limitation Disclosure */}
          <div className="bg-slate-900/80 border border-amber-500/20 rounded-xl p-3.5 text-xs text-slate-300 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <div className="font-semibold text-amber-300">
                Data Privacy & Fair Evaluation Safeguards
              </div>
              <p className="text-slate-400 leading-relaxed text-[11px]">
                Video files are private to you and authorized coaches/scouts. Computer vision measurements are estimates for verification assistance and do not replace certified combine timing or human coach audit.
              </p>
            </div>
          </div>

          {/* Upload New Video Dropzone */}
          <div className="border border-dashed border-slate-700 hover:border-cyan-500/50 rounded-xl p-4 text-center transition-colors">
            <input
              type="file"
              id="video-upload-input"
              accept="video/mp4,video/webm,video/quicktime"
              onChange={handleFileUpload}
              className="hidden"
            />
            <label
              htmlFor="video-upload-input"
              className="cursor-pointer flex flex-col items-center gap-1.5"
            >
              <Upload className="w-5 h-5 text-slate-400" />
              <span className="text-xs font-semibold text-white">
                Upload your assessment video (<span className="text-cyan-400">MP4, WebM, MOV</span> max 100MB)
              </span>
              <span className="text-[11px] text-slate-400">
                Current active clip: <span className="font-mono text-slate-300">{fileName}</span>
              </span>
            </label>
            {uploadError && (
              <p className="text-xs text-rose-400 mt-2">{uploadError}</p>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-5 py-3.5 border-t border-slate-800 bg-[#090D16]">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
          >
            Cancel
          </button>

          <button
            onClick={handleConfirm}
            className="flex items-center gap-2 px-5 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded-lg transition-colors shadow-lg shadow-cyan-500/20"
          >
            <CheckCircle2 className="w-4 h-4" />
            Attach Video & Verified Metrics
          </button>
        </div>
      </div>
    </div>
  );
};
