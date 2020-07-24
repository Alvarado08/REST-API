//LIBRARY DECLARATIONS FOR API
const express = require('express');
const app = express();
const Joi = require('joi');
app.use(express.json());

//SIMULATION OF DB WITH AN ARRAY OF OUR DATA MOVIES (NAME,GENRE,PRICE)
const movies = [
    {id: 1, genre: 'horror', price: '$15' },
    {id: 2, genre: 'action', price: '$25' },
    {id: 3, genre: 'romance', price: '$10' },
    {id: 4, genre: 'drama', price: '$15' },
    {id: 5, genre: 'comedy', price: '$20' }
];

//GET SECTION /api/rentals, /api/rentals/:id 
app.get('/api/rentals', (req, res) => {
    res.send(movies);
});
app.get('/api/rentals/:genre', (req, res) => {
    const movie = movies.find(m => m.genre === req.params.genre);
    if(!movie) return res.status(404).send('Genre does not exist');
    res.send(movie);
});
//POST SECTION /api/rentals
app.post('/api/rentals', (req, res) => {
    const {error} = validateMovie(req.body);
    if(error) return res.status(400).send(error.details[0].message);
    const movie = {
       id: movies.length + 1,
       genre: req.body.genre,
       price: req.body.price 
    };
    movies.push(movie);
    res.send(movie);
});

//PUT SECTION  /api/rentals/:id (include id:)
app.put('/api/rentals/:id', (req, res) =>{
    const movie = movies.find(m => m.id === parseInt(req.params.id));
    if(!movie) return res.status(404).send('Movie not found');

    const {error} = validateMovie(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    movie.genre = req.body.genre;
    movie.price = req.body.price;
    res.send(movie);
})
//DELETE SECTION /api/rentals/:id
app.delete('/api/rentals/:id', (req, res) =>{
    const movie = movies.find(m => m.id === parseInt(req.params.id));
    if(!movie) return res.status(404).send('Movie does not exist');

    const index = movies.indexOf(movie);
    movies.splice(index, 1);
    res.send(`Succesfully removed: ${movie.id} genre: ${movie.genre}`);
});

//VALIDATION 
function validateMovie(movie){
    const schema = { //USED TO SET VALIDATION RULES/PROPERTIES SUCH AS TYPES AND NUMBER OF CHARACTERS NEEDED IN ORDER TO BE ACCEPTED
        genre: Joi.string().min(5).required(),
        price: Joi.string().min(3).required()
    };
    return Joi.validate(movie, schema);
}
//PORT ASSIGNMENT (LOCALHOST)
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
