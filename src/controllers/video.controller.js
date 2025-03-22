import mongoose, { isValidObjectId } from "mongoose"
import { Video } from "../models/video.model.js"
import { User } from "../models/user.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import { json } from "express"


const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query
    //TODO: get all videos based on query, sort, pagination
})

const publishAVideo = asyncHandler(async (req, res) => {
    // TODO: get video, upload to cloudinary, create video
    const { title, description } = req.body
    if (!title || !description) {
        throw new ApiError(400, "Please provide a title and description")
    }

    const { videoFile } = req.files
    const { thumbnail } = req.files
    if (!videoFile || !thumbnail) {
        throw new ApiError(400, "Please provide a video file or thumbnail")
    }


    const uploadedVideo = await uploadOnCloudinary(videoFile[0].path)
    const uploadedThumbnail = await uploadOnCloudinary(thumbnail[0].path)
    if (!uploadedVideo || !uploadedThumbnail) {
        throw new ApiError(500, "Error uploading video or thumbnail")
    }

    const video = await Video.create({
        title,
        description,
        videoFile: uploadedVideo.url,
        thumbnail: uploadedThumbnail.url,
        duration: uploadedVideo.duration,
        owner: req.user._id
    })
    return res.status(200).json(new ApiResponse(200, video, "Video uploaded successfully"))

})

const getVideoById = asyncHandler(async (req, res) => {
    //TODO: get video by id
    const { videoId } = req.params
    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video id")
    }
    const video = await Video.findById(videoId)
    if (!video) {
        throw new ApiError(404, "Video not found")
    }
    return res.status(200).json(new ApiResponse(200, video, "Video found"))
})

const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: update video details like title, description, thumbnail

    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video id")
    }

    const { title, description } = req.body
    const thumbnail = req.file
    if (!thumbnail) {
        throw new ApiError(400, "Please provide a thumbnail")
    }
    const uploadedThumbnail = await uploadOnCloudinary(thumbnail.path)
    if (!uploadedThumbnail) {
        throw new ApiError(500, "Error uploading  thumbnail")
    }


    if (!title || !description) {
        throw new ApiError(400, "Please provide a title and description")
    }
    const videoUpdate = await Video.findByIdAndUpdate(videoId, {
        $set: {
            title,
            description,
            thumbnail: uploadedThumbnail.url
        },
    },
        { new: true }
    )
    console.log("videoUpdate", videoUpdate)
    return res.status(200), json(new ApiResponse(200), { videoUpdate }, "Video updated successfully")

})

const deleteVideo = asyncHandler(async (req, res) => {
    //TODO: delete video
    const { videoId } = req.params
    const video = await Video.findById(videoId)
    if (!video) {
        throw new ApiError(404, "Video not found")
    }
    console.log("videoFind", video)
    await Video.findByIdAndDelete(videoId)
    return res.status(200).json(new ApiResponse(200), {}, "Video deleted successfully")
})

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params

    const video = await Video.findById(videoId);
    console.log("videoFOund", video)
    if (!video) {
        throw new ApiError(404, "Video not found");
    }

    const videoUpdate = await Video.findByIdAndUpdate(
        videoId,
        { $set: { isPublished: !video.isPublished } },
        { new: true }
    );

    return res.status(200).json(
        new ApiResponse(200, videoUpdate, "Video updated successfully")
    );

})

export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
}
