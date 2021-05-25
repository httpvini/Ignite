let courses = ["javascript", "java", "python"]

exports.save = (courseParam)=>{
    const course = courseParam.toLowerCase();
    let existingCourse = courses.includes(course) ? true : false;
    if(!existingCourse){
        courses.push(course);
        console.log(course, "foi salvo ");
        return courses;
    } else {
        return `${course} já existe`
    }
}

exports.update = (oldCourseParam, newCourseParam) =>{
    const oldCourse = oldCourseParam.toLowerCase();
    const newCourse = newCourseParam.toLowerCase();
    let coursesIndex = courses.indexOf(oldCourse);
    courses[coursesIndex] = newCourse;
    console.log(`curso: ${oldCourse} foi atualizado para: ${newCourse}`)
    return courses;
}

exports.delete = (courseParam) =>{
    const course = courseParam.toLowerCase();
    let coursesIndex = courses.indexOf(course);
    delete courses[coursesIndex];
    console.log(`${course} deletado`)
    return courses;
}

exports.getCourses = ()=>{
    return courses;
}