


export const asyncHandler = (fn) => {
    return (req, res, next) => {
        fn(req, res, next).catch((err) => {
            next(new Error(err))
        })
    }
}



export const globalErrorHandler = (err, req, res, next) => {
    return res.send({message: err.message, stack: err.stack})
}