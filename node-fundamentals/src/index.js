const express = require('express');
const app = express();
const CourseService = require('./services/courseService')

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.get('/courses', (req, res)=>{
    const courses = CourseService.getCourses();
    res.status(200).json(courses);
})

app.post('/courses', (req, res)=> {
    const response = CourseService.save(req.body.course);
    res.status(201).json(response);
})

app.put('/courses/:course', (req, res)=>{
    const oldCourse = req.params.course;
    const newCourse = req.body.newCourse;
    const response = CourseService.update(oldCourse, newCourse);
    res.status(200).json(response);
})

app.patch('/courses/:course', (req, res)=>{
    const oldCourse = req.params.course;
    const newCourse = req.body.newCourse;
    const response = CourseService.update(oldCourse, newCourse);
    res.status(200).json(response);
})

app.delete('/courses/:course', (req, res)=>{
    const course = req.params.course;
    const response = CourseService.delete(course)
    res.status(200).json(response);
})

app.listen(5000, ()=>{
    console.log("MAGIC FUCKING HAPPENING!!!!!!!")
});