import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },

        phone: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },

        password: {
            type: String,
            required: true,
            select : false,
            minlength: 6
        },

        role: {
            type: String,
            enum: ["student", "teacher", "admin"],
            default: "student",
        },
        // subscriptions must be array 
        subscriptions: [
            {
                type: String,
                enum: [
                    "basic",
                    "jee_foundation",
                    "jee",
                    "neet_foundation",
                    "neet",
                    "cet",
                    "nda"
                ]
            }
        ]
    },
    {
        timestamps: true,
    }
);

const User = mongoose.model("User", userSchema);

export default User;