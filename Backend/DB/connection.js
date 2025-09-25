import mongoose from 'mongoose'


export const connectDB = async () => {
    return await mongoose.connect(process.env.DB_LOCAL_URL)
    .then(() => console.log('DB Connected'))
    .catch(() => console.log('DB Connection Failed'))
}