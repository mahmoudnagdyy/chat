import { Schema, model } from "mongoose";
import bcrypt from 'bcryptjs'


const userSchema = new Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true
        },

        email: {
            type: String,
            required: true,
            unique: true
        },

        password: {
            type: String,
            required: true
        },
    },
    {
        timestamps: true
    }
)

userSchema.pre('save', function () {
    this.password = bcrypt.hashSync(this.password, +process.env.SALT_ROUND)
})

const userModel = model('User', userSchema)
export default userModel