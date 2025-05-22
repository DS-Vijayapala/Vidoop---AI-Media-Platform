import React, { useState, useEffect, useCallback } from "react";
import { getCldImageUrl, getCldVideoUrl } from "next-cloudinary";
import { Download, Clock, FileDown, FileUp, AlertTriangle } from "lucide-react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { filesize } from "filesize";
import { Video } from "@/types/index";

dayjs.extend(relativeTime);

interface VideoCardProps {

    video: Video;
    onDownload: (url: string, title: string) => void;

}

const VideoCard: React.FC<VideoCardProps> = ({ video, onDownload }) => {

    const [isHovered, setIsHovered] = useState(false);

    const [previewError, setPreviewError] = useState(false);

    const getThumbnailUrl = useCallback((publicId: string) => {

        return getCldImageUrl({

            src: publicId,
            width: 400,
            height: 225,
            crop: "fill",
            gravity: "auto",
            format: "jpg",
            quality: "auto",
            assetType: "video",

        });

    }, []);

    const getFullVideoUrl = useCallback((publicId: string) => {

        return getCldVideoUrl({

            src: publicId,
            width: 1920,
            height: 1080,

        });

    }, []);

    const getPreviewVideoUrl = useCallback((publicId: string) => {

        return getCldVideoUrl({

            src: publicId,
            width: 400,
            height: 225,
            rawTransformations: ["e_preview:duration_15:max_seg_9:min_seg_dur_1"],

        });

    }, []);

    const formatSize = useCallback((size: number) => filesize(size), []);

    const formatDuration = useCallback((seconds: number) => {

        const minutes = Math.floor(seconds / 60);

        const remainingSeconds = Math.round(seconds % 60);

        return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;

    }, []);

    const compressionPercentage = Math.round(

        (1 - Number(video.compressedSize) / Number(video.originalSize)) * 100

    );

    useEffect(() => {

        setPreviewError(false);

    }, [isHovered]);

    const handlePreviewError = () => {

        setPreviewError(true);

    };

    return (

        <div
            className="card bg-base-100 shadow-lg hover:shadow-2xl rounded-xl 
            transition-all duration-300 border border-base-300"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >

            {/* Thumbnail / Video */}

            <figure className="aspect-video relative overflow-hidden rounded-t-xl">

                {isHovered ? (

                    previewError ? (

                        <div className="w-full h-full flex items-center justify-center 
                        bg-error bg-opacity-10 text-error font-medium">
                            <AlertTriangle className="mr-2" />

                            Preview not available

                        </div>

                    ) : (

                        <video
                            src={getPreviewVideoUrl(video.publicId)}
                            autoPlay
                            muted
                            loop
                            className="w-full h-full object-cover"
                            onError={handlePreviewError}
                        />

                    )

                ) : (

                    <img
                        src={getThumbnailUrl(video.publicId)}
                        alt={video.title}
                        className="w-full h-full object-cover"
                    />

                )}

                {/* Duration badge */}

                <div className="absolute bottom-2 right-2 bg-base-100 bg-opacity-80 px-2 py-1 rounded-md 
                flex items-center text-sm text-base-content font-semibold">

                    <Clock size={14} className="mr-1" />

                    {formatDuration(video.duration)}

                </div>

            </figure>

            {/* Body */}

            <div className="card-body p-4 space-y-2">

                <h2 className="card-title text-xl">{video.title}</h2>

                <p className="text-sm text-base-content/70">{video.description}</p>

                <p className="text-xs text-base-content/60">

                    Uploaded {dayjs(video.createdAt).fromNow()}

                </p>

                {/* Sizes */}

                <div className="grid grid-cols-2 gap-4 mt-2">

                    <div className="flex items-start">

                        <FileUp size={20} className="mr-2 text-primary" />

                        <div>

                            <div className="text-sm font-semibold">Original</div>

                            <div className="text-xs text-base-content/60">

                                {formatSize(Number(video.originalSize))}

                            </div>

                        </div>

                    </div>

                    <div className="flex items-start">

                        <FileDown size={20} className="mr-2 text-secondary" />

                        <div>

                            <div className="text-sm font-semibold">Compressed</div>

                            <div className="text-xs text-base-content/60">

                                {formatSize(Number(video.compressedSize))}

                            </div>

                        </div>

                    </div>

                </div>

                {/* Compression % and Download Button */}

                <div className="flex items-center justify-between pt-4 border-t border-base-300">

                    <div className="text-sm font-semibold">

                        Compression:{" "}

                        <span className="text-success font-bold">{compressionPercentage}%</span>

                    </div>

                    <button
                        className="btn btn-sm btn-primary"
                        onClick={() =>
                            onDownload(getFullVideoUrl(video.publicId), video.title)
                        }
                    >
                        <Download size={16} className="mr-1" />
                        Download
                    </button>

                </div>

            </div>

        </div>

    );

};

export default VideoCard;
