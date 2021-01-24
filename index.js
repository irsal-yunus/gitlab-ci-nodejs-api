const Joi = require('joi');
//const Joi = require("@hapi/joi");
const express = require('express');
const app = express();

app.use(express.json());

const courses = [
    { id: 1, name: 'course1'},
    { id: 2, name: 'course2'},
    { id: 3, name: 'course3'},
];

app.get('/', (req, res) => {
    res.send('Hello World!!!');
});

app.get('/api/courses', (req, res) => {
    res.send(courses);
});

app.post('/api/courses', (req, res) => { 

    const schema = Joi.object({
        name: Joi.string().min(3).required()        
        });   

    const validation = schema.validate(req.body);
    if(validation.error){
        res.status(400).send(validation.error.details[0].message);
        return ;
    }    
    
    if (!req.body.name || req.body.name.length < 3) {
        res.status(400).send('Name is required and shoul be minimum 3 characters.');
        return;
    }

    const course = {
        id: courses.length + 1,
        name: req.body.name
    };
    courses.push(course);
    res.send(course);
});

app.put('/api/courses/:id', (req, res) => {
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if (!course) return res.status(404).send('The course with the given ID was not found');   

    const schema = Joi.object({
        name: Joi.string().min(3).required()        
        });

    const validation = schema.validate(req.body);
    //const validation = validateCourse(req.body);
    //const { error } = validateCourse(req.body); //result.error
    
    if(validation.error){
        res.status(400).send(validation.error.details[0].message);
        return ;
    }     

    // Update course
    course.name = req.body.name;
    res.send(course);
    // Return the updated course
});

/* function validateCourse(course) {
    const schema = Joi.object({
        name: Joi.string().min(3).required()        
        });

    return schema.validate(course.body);
} */

app.delete('/api/courses/:id', (req, res) => {
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if (!course) return res.status(404).send('The course with the given ID was not found'); 

    
    // Delete 
    const index = courses.indexOf(course);
    courses.splice(index, 1);
    res.send(course);
    // Return the same course

});

app.get('/api/courses/:id', (req, res) => {
    //res.send(req.params.id);
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if (!course) return res.status(404).send('The course with the given ID was not found');
    res.send(course);
})

const port = process.env.PORT || 3000;
app.listen(3000, () => console.log(`Listening on port ${port}...`));
