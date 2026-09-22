const express = require('express')
const crypto = require('node:crypto')
const cors = require('cors')
const movies = require('./movies.json')
const { validateMovie, validatePartialMovie } = require('./schemas/movie')

const app = express()
app.disable('x-powered-by')
app.use(cors())
app.use(express.json())


app.get('/movies',(req,res)=>{
    //res.header('Access-Control-Allow-Origin','*')
    const { genre } = req.query

    if(genre){
        const filteredMovies = movies.filter(movie =>
            movie.genre.some(g => g.toLowerCase() === genre.toLowerCase())
        )
        return res.json(filteredMovies)
    }

    res.json(movies)
})

app.get('/movies/:id',(req,res)=>{
    const { id } = req.params
    const movie = movies.find(movie => movie.id == id)
    
    if(movie)return res.json(movie)
    
    res.status(404).json({'message': 'movie not found'})
})

app.post('/movies',(req,res)=>{
    const result = validateMovie(req.body)

    if(result.error){
        return res.status(400).json({message: JSON.parse(result.error.message)})
    }

    const newMovie = {
        id: crypto.randomUUID(),
        ...result.data
    }

    //no api rest
    movies.push(newMovie)

    res.status(201).json(newMovie)
})

app.patch('/movies/:id',(req,res)=>{
    const result = validatePartialMovie(req.body)
    if(result.error){
        return res.status(400).json({message: JSON.parse(result.error.message)})
    }

    const { id } = req.params
    const movieIndex = movies.findIndex(movie=>movie.id == id)
    if(movieIndex === -1){
        return res.status(404).json({message: 'movie not found'})
    }

    const movie = movies[movieIndex]

    const updatedMovie = {
        ...movie,
        ...result.data
    }

    movies[movieIndex] = updatedMovie

    return res.json(updatedMovie)
})

app.delete('/movies/:id',(req,res)=>{
    //res.header('Access-Control-Allow-Origin','*')
    const { id } = req.params
    const movieIndex = movies.findIndex(movie=>movie.id==id)

    if(movieIndex==-1){
        res.status(404).json({message: 'movie not found'})
    }

    movies.splice(movieIndex,1)

    return res.json({message: 'movie deleted'})
})
 
app.options('/movies/:id',(req,res)=>{
    //res.header('Access-Control-Allow-Origin','*') 
    //res.header('Access-Control-Allow-Methods','GET, POST, DELETE, PATCH')
    res.send(200)
})

const PORT = process.env.PORT ?? 1234
app.listen(PORT,() => {
    console.log(`server is listening on http://localhost:${PORT}`)
})
