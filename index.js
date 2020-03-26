const express =  require('express');
const router  = require('./routes/index');
const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.urlencoded({extended: true}));
app.use(express.json());
// set up the view engine
app.set('view engine','ejs');
app.set('views','./views');
app.use('/', router);
app.listen(PORT, (err)=>{
    if (err) console.log(err);
    else console.log('App is running on PORT', PORT);
})