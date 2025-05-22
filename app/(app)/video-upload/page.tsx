"use client";

import { use, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

function VideoUpload() {

    const [file, setFile] = useState<File | null>(null);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState(""); // For file size errors

    const router = useRouter();

    const MAX_FILE_SIZE = 70 * 1024 * 1024; // 70MB

    const handleSubmit = async (e: React.FormEvent) => {

        e.preventDefault();

        if (!file) return;

        if (file.size > MAX_FILE_SIZE) {

            setError("File size too large. Please upload a video under 70MB.");

            return;
        }

        setIsUploading(true);

        setError(""); // Clear any previous error

        const formData = new FormData();

        formData.append("file", file);

        formData.append("title", title);

        formData.append("description", description);

        formData.append("originalSize", file.size.toString());

        try {

            await axios.post("/api/video-upload", formData);

            router.push("/");

        } catch (error) {

            console.error(error);

            setError("Upload failed. Please try again.");

        } finally {

            setIsUploading(false);
        }

    };

    return (

        <div className="container mx-auto px-4 py-8 max-w-2xl">

            <div className="bg-base-100 shadow-xl rounded-2xl p-6">

                <h1 className="text-3xl font-bold mb-6 text-center text-primary">

                    🎬 Upload a Video

                </h1>

                {error && (

                    <div className="alert alert-error mb-4">

                        <span>{error}</span>

                    </div>

                )}

                <form onSubmit={handleSubmit} className="space-y-5">

                    {/* Title */}

                    <div className="form-control">

                        <label className="label">

                            <span className="label-text font-medium">Video Title</span>

                        </label>

                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="input input-bordered w-full"
                            placeholder="Enter a descriptive title"
                            required
                        />

                    </div>

                    {/* Description */}

                    <div className="form-control">

                        <label className="label">

                            <span className="label-text font-medium">Description</span>

                        </label>

                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="textarea textarea-bordered w-full"
                            placeholder="Briefly describe your video"
                        />

                    </div>

                    {/* File Input */}

                    <div className="form-control">

                        <label className="label">

                            <span className="label-text font-medium">Select a Video File</span>

                        </label>

                        <input
                            type="file"
                            accept="video/*"
                            onChange={(e) => setFile(e.target.files?.[0] || null)}
                            className="file-input file-input-bordered w-full"
                            required
                        />

                        <span className="text-xs text-gray-500 mt-1">

                            Max file size: 70MB

                        </span>

                    </div>

                    {/* Upload Button */}

                    <button

                        type="submit"
                        className={`btn btn-primary w-full ${isUploading ? "btn-disabled" : ""}`}
                        disabled={isUploading}
                    >

                        {isUploading ? (

                            <>
                                <span className="loading loading-spinner loading-sm mr-2"></span>
                                Uploading...
                            </>

                        ) : (

                            "Upload Video"

                        )}

                    </button>

                </form>

            </div>

        </div>

    );

}


export default VideoUpload;
