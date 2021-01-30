const path = require('path')
const express =require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const connectDB = require('./config/db')
const morgan = require('morgan')
const exphbs = require('express-handlebars')
const passport = require('passport')
const methodOverride = require('method-override')
const session = require('express-session')
const MongoStore = require('connect-mongo')(session)

//Load config
dotenv.config({path:'./config/config.env'})

// passport config
require('./config/passport')(passport)


connectDB() 

const app = express()

//Body parser
app.use(express.urlencoded({extended: false}))
app.use(express.json())

// method override
app.use(methodOverride(function (req, res) {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
      // look in urlencoded POST bodies and delete it
      let method = req.body._method
      delete req.body._method
      return method
    }
  }))


if(process.env.NODE_ENV==='development'){
    app.use(morgan('dev'))
}


//handlebars Helper
const { formatDate,stripTags,truncate,editIcon,select } = require('./helpers/hbs')

// handlebars
app.engine('.hbs', exphbs({helpers:{formatDate,stripTags,truncate,editIcon,select},
    defaultLayout:'main', extname: '.hbs'}));
app.set('view engine', '.hbs');

// session
app.use(session({
    secret:'keyboard cat',
    resave: false,
    saveUninitialized:true,
    store: new MongoStore({mongooseConnection: mongoose.connection})
}))

// passport middlewar
app.use(passport.initialize())
app.use(passport.session())

//set global ver
app.use(function (req,res , next){
    res.locals.user = req.user || null
    next()
})


// static folder
app.use(express.static(path.join(__dirname,'public')))

require('./models/User')
// Routes
app.use('/',require('./routes/index'))
app.use('/auth',require('./routes/auth'))
app.use('/stories',require('./routes/stories'))



const PORT = process.env.PORT || 3000

app.listen(PORT,console.log(`server is running in ${process.env.NODE_ENV} mode on port ${PORT}`))