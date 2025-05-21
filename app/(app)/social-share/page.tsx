"use client"

import React, { useState, useEffect, useRef } from 'react'
import { CldImage } from 'next-cloudinary';

const socialFormats = {

    "Instagram Square (1:1)": { width: 1080, height: 1080, aspectRatio: "1:1" },
    "Instagram Portrait (4:5)": { width: 1080, height: 1350, aspectRatio: "4:5" },
    "Twitter Post (16:9)": { width: 1200, height: 675, aspectRatio: "16:9" },
    "Twitter Header (3:1)": { width: 1500, height: 500, aspectRatio: "3:1" },
    "Facebook Cover (205:78)": { width: 820, height: 312, aspectRatio: "205:78" },

};

type SocialFormat = keyof typeof socialFormats;

export default function SocialShare() {

    const [uploadedImage, setUploadedImage] = useState<string | null>(null);

    const [selectedFormat, setSelectedFormat] = useState<SocialFormat>("Instagram Square (1:1)");

    const [isUploading, setIsUploading] = useState(false);

    const [isTransforming, setIsTransforming] = useState(false);

    const imageRef = useRef<HTMLImageElement>(null);


    useEffect(() => {

        if (uploadedImage) {

            setIsTransforming(true);

        }

    }, [selectedFormat, uploadedImage])

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {

        const file = event.target.files?.[0];

        if (!file) return;

        setIsUploading(true);

        const formData = new FormData();

        formData.append("file", file);

        try {

            const response = await fetch("/api/image-upload", {

                method: "POST",
                body: formData

            })

            if (!response.ok) throw new Error("Failed to upload image");

            const data = await response.json();

            setUploadedImage(data.publicId);


        } catch (error) {

            console.log(error)

            alert("Failed to upload image");

        } finally {

            setIsUploading(false);

        }

    };

    const handleDownload = () => {

        if (!imageRef.current) return;

        fetch(imageRef.current.src)

            .then((response) => response.blob())

            .then((blob) => {

                const url = window.URL.createObjectURL(blob)

                const link = document.createElement("a");

                link.href = url;

                link.download = `${selectedFormat
                    .replace(/\s+/g, "_")
                    .toLowerCase()}.png`;

                document.body.appendChild(link);

                link.click();

                document.body.removeChild(link);

                window.URL.revokeObjectURL(url);

                document.body.removeChild(link);

            })
    }


    return (

        <div className="container mx-auto px-4 py-8 max-w-4xl">

            <h1 className="text-4xl font-extrabold text-center mb-10 text-primary">

                Social Media Image Creator

            </h1>

            <div className="bg-base-100 rounded-2xl shadow-xl p-6">

                <div className="space-y-6">

                    {/* Upload Section */}
                    <div>

                        <h2 className="text-2xl font-semibold mb-2">📤 Upload Image</h2>

                        <div className="form-control">

                            <label className="label">

                                <span className="label-text text-base font-medium">Choose an image file</span>

                            </label>

                            <input
                                type="file"
                                onChange={handleFileUpload}
                                className="file-input file-input-bordered file-input-primary w-full"
                            />

                        </div>

                    </div>

                    {/* Uploading Indicator */}

                    {isUploading && (

                        <div className="mt-4">

                            <progress className="progress progress-primary w-full"></progress>

                        </div>

                    )}

                    {/* Format Selection & Preview */}

                    {uploadedImage && (

                        <div className="space-y-6">

                            <div>

                                <h2 className="text-2xl font-semibold mb-2">📱 Select Format</h2>

                                <select
                                    className="select select-bordered w-full"
                                    value={selectedFormat}
                                    onChange={(e) => setSelectedFormat(e.target.value as SocialFormat)}
                                >

                                    {Object.keys(socialFormats).map((format) => (

                                        <option key={format} value={format}>

                                            {format}

                                        </option>
                                    ))}

                                </select>

                            </div>

                            {/* Image Preview */}

                            <div className="bg-base-200 p-4 rounded-xl relative shadow-inner">

                                <h3 className="text-lg font-semibold mb-3">🖼️ Preview</h3>

                                <div className="flex justify-center items-center overflow-hidden min-h-[200px]">

                                    {isTransforming && (

                                        <div className="absolute inset-0 flex items-center justify-center 
                                        bg-base-100 bg-opacity-70 z-10 rounded-xl">

                                            <span className="loading loading-bars loading-lg text-primary"></span>

                                        </div>

                                    )}

                                    <CldImage
                                        width={socialFormats[selectedFormat].width}
                                        height={socialFormats[selectedFormat].height}
                                        src={uploadedImage}
                                        sizes="100vw"
                                        alt="transformed image"
                                        crop="fill"
                                        aspectRatio={socialFormats[selectedFormat].aspectRatio}
                                        gravity="auto"
                                        ref={imageRef}
                                        onLoad={() => setIsTransforming(false)}
                                        className="rounded-lg"
                                    />

                                </div>

                            </div>

                            {/* Download Button */}
                            <div className="flex justify-end">

                                <button className="btn btn-primary btn-wide" onClick={handleDownload}>

                                    ⬇️ Download for {selectedFormat}

                                </button>

                            </div>

                        </div>

                    )}

                </div>

            </div>

        </div>

    );

}
