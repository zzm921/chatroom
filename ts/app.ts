import express = require('express');
import path = require('path');
import logger = require('morgan');
import cookieParser = require('cookie-parser');
import bodyParser = require('body-parser');
import user = require('./routes/user')
import login = require('./routes/login')
import register = require('./routes/register')


let app = express();

var allowCrossDomain = function (req: any, res: any, next: any) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
}
app.use(allowCrossDomain);
// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
// app.set('views', __dirname + '../views')
// // 指定模板文件的后缀名为html
// app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../public')));
app.use("/user", user.router)
app.use("/login", login.router)
app.use("/register", register.router)




app.use(function (req: express.Request, res: express.Response, next: express.NextFunction) {
  //  res.locals.user = req.session.user;
  // let e = req.session.error;
  res.locals.message = '';
  let err = new Error('Not Found')
  next(err)
})

// error handler
app.use(function (err: any, req: any, res: any, next: any) {
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  res.status(err.status || 500)
  res.end()
})

module.exports = app;
