const z = require('zod')

const movieSchema = z.object({
        title: z.string({
            invalide_type_error: 'Movie title must be a string',
            required_error: 'Movie title is required'
        }),
        year: z.number().int().min(1900).max(2027),
        director: z.string(),
        duration: z.number().int().positive(),
        poster: z.string().url(),
        genre: z.array(z.enum(['Drama','Adventure','Sci-Fi','Action'])),
        rate: z.number().min(0).max(10).default(5)
    })

function validateMovie(object){
    return movieSchema.safeParse(object)
}
function validatePartialMovie(object){
    return movieSchema.partial().safeParse(object)
}

module.exports = {
    validateMovie,
    validatePartialMovie
}