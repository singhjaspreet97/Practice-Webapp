const mongoose = require('mongoose'); 

mongoose.connect('mongodb://localhost/playground')
 .then(() => console.log('Connected to MongoDB...'))
 .catch(err => console.error('Could not connect to MongoDB...', err));

const courseSchema = new mongoose.Schema({
   name: { 
       type: String, 
       required:true,
       minlength: 5,
       maxlength: 255,
       // match: /pattern/
     },
   category: {
       type: String,
       required: true,
       enum: ['web', 'mobile', 'network'],
       lowercase: true,
       //uppercase: true,
       trim: true
   },
   author: String,
   tags: {
       type: Array,
       validate: {
           isAsync: true,
           validator: function(v, callback) {
               setTimeout(() => {
                   //Do some async work
                const result = v && v.length > 0;
                callback(result);
               }, 4000);
           },
           message: 'A course should have at least one tag.'
       }
   },
   date: { type: Date,default: Date.now },
   isPublished: Boolean,
   price: {
       type: Number,
       required: function() { return this.isPublished; },
       min: 10,
       max: 200,
       get: v => Math.round(v),
       set: v => Math.round(v)
   }
}); 

const Course = mongoose.model('Course', courseSchema); 
 
async function createCourse() {
    const course = new Course({
        name: 'Angular Course',
        category: 'Web',
        author: 'Jaspreet',
        tags: ['frontend'],
        isPublished: true,
        price: 15.8
     });
    try {
        const result = await course.save();
        console.log(result); 
    }
    catch (ex) {
        for (field in ex.errors)
        console.log(ex.errors[field].message);
    }   
}

async function getCourses() {
    const pageNumber = 2;
    const pageSize = 10;
    // /api/courses?pageNumber=2&pageSize=10

    const courses = await Course
    .find({ _id: '5b51e322df3b38381c6a0e4c' })
    //.skip(_pageNumber - 1) * pageSize
    //.limit(pageSize)
    .sort({ name: 1 }) 
    //.count()
    .select({ name: 1, tags: 1 });
    console.log(courses[0].price);
}

async function updateCourse(id) {
    // const result = awaitCourse.update({ _id: id} ,
    const course = await Course.findByIdAndUpdate(id , {
        $set: {
            author: 'Jason',
            isPublished: false
        }
    }, { new: true });
    console.log(course);
}

async function removeCourse(id) {
   //const result = await Course.deleteOne({ _id: id});
   const course = await Course.findByIdAndRemove(id);
   console.log(course);
}

createCourse();