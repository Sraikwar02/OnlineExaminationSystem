const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');
const csrf = require('csurf');
const flash = require('connect-flash');
const fs = require('fs');
const helmet=require('helmet');
const compression=require('compression');
const morgan= require('morgan');
const https= require('https');

const User = require('./models/user');

const session = require('express-session');
const mongoose = require("mongoose");
const MongoDBStore = require('connect-mongodb-session')(session);

const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const studentRoutes = require('./routes/student');
const teacherRoutes = require('./routes/teacher');

const errorController = require('./controllers/error');

const accessLogStream = fs.createWriteStream(path.join(__dirname,'access.log'),{ flags:'a'});

app.use(helmet());
app.use(compression());
app.use(morgan('combined',{stream : accessLogStream }));
 
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

const MONGODB_URI = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.b2u22.mongodb.net/${process.env.MONGO_DEFAULT_DATABASE}`;

// const privateKey = fs.readFileSync('server.key');
// const certificate = fs.readFileSync('server.cert');

const csrfProtection=csrf();

const store = new MongoDBStore({
    uri: MONGODB_URI,
    collection: 'sessions',
});

app.use(session({
    secret: 'my secret',
    resave: false,
    saveUninitialized: false,
    store:store
  }));

app.set('view engine', 'ejs');
app.set('views');

app.use(csrfProtection);
app.use(flash());


app.use((req,res,next)=>{
  res.locals.isAuthenticated=req.session.isLoggedIn;
  res.locals.csrfToken=req.csrfToken();
  next();
});

app.use((req, res, next) => {
    // throw new Error('sync Dummy');
      if (!req.session.user) {
        return next();
      }
      User.findById(req.session.user._id)
        .then(user => {
          if(!user) {
            return next();
          }
          req.user = user;
          next();
        })
        .catch(err =>{
          next(new Error(err));
        } );
    });

app.use('/auth',authRoutes);
app.use('/admin',adminRoutes);
app.use('/student',studentRoutes);
app.use('/teacher',teacherRoutes);


app.get('/',(req,res,next)=>{
  res.render('index', {
      title:'index'
  })
});

app.use('/500',errorController.get500);

app.use('/',errorController.get404);

app.use((error,req,res,next)=>{
  
  let isLoggedIn;
  if ("session" in req && "isLoggedIn" in req.session) {
    isLoggedIn = req.session.isLoggedIn;
  } else {
    isLoggedIn = false;
  }
  res.status(500).render("500", {
    title: "Error!",
    path: "/500",
    isAuthenticated: isLoggedIn
  });
});


mongoose.connect(MONGODB_URI,{ useUnifiedTopology: true})
    .then(result => {
        // https.createServer({key: privateKey,cert:certificate},app).listen(process.env.PORT ||3000);
        app.listen(process.env.PORT ||3000);
        console.log('server started');
    }).catch(err => {
        console.log(err);
    });