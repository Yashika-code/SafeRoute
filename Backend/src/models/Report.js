// userid,issuetype,description,location,severity,imageurl,isAnonyms,upvotes,downvotes,status
import mongoose from "mongoose";

const reportSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: false
        },
        issueType: {
            type: String,
            required: true,
            enum: ["dark_street", "harassment", "accident", "unsafe_area"]
        },
        description: {
            type: String,
            maxLength: 500
        },
        location: {
            latitude: {
                type: Number,
                required: true
            },
            longitude: {
                type: Number,
                required: true
            }
        },

        severity: {
            type: String,
            enum: ["low", "medium", "high"],
            default: "low"
        },
        imageUrl: {
            type: String
        },
        isAnonymous: {
            type: Boolean,
            default: false
        },
        upvotes: {
            type: Number,
            default: 0
        },
        downvotes: {
            type: Number,
            default: 0
        },
        status: {
            enum: ["pending", "approved", "rejected"],
            type: String,
            default: "pending"
        }
    },
    {
        timestamps: true
    }
)

export const Report = mongoose.model("Report", reportSchema);