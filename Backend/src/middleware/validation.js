

const dataMethods = ['body', 'params', 'query', 'headers', 'file', 'files']

export const validationMiddleware = (schema) => {
    return (req, res, next) => {
        const validationResult = []

        for (const key of dataMethods) {
            if(schema[key]){
                const result = schema[key].validate(req[key], {abortEarly: false})
                if(result?.error?.details){
                    for (const obj of result.error.details) {
                        validationResult.push(obj.path[0])
                    }
                }
            }
        }

        if(validationResult.length){
            return res.send({message: 'Validation Errors', validationResult})
        }
        next()
    }
}