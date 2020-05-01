// modules
const express = require('express');
const path = require('path');
const cookieSession = require('cookie-session');

const FeedbackService = require('./services/FeedbackService');
const SpeakerService = require('./services/SpeakerService');

const feedbackService = new FeedbackService('./data/feedback.json');
const speakersService = new SpeakerService('./data/speakers.json');

const routes = require('./routes');

// execute express function
const app = express();

// port that application should listn to
const port = 3000;

// instatiates the ejs view engine

app.set('trust proxy', 1);

// session middleware
app.use(
  cookieSession({
    name: 'session',
    keys: ['Sdfsdfsefrgerg', 'FWEFWefwefweht'],
  })
);

// ejs middleware
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, './views'));

// middleware for loading static files
app.use(express.static(path.join(__dirname, './static')));

// global variable set at start of app middleware
app.locals.siteName = 'ROUX Meetups';

// global variable middleware
app.use(async (request, response, next) => {
  try {
    const names = await speakersService.getNames();
    response.locals.speakerNames = names;
    return next();
  } catch (error) {
    return next(error);
  }
});

app.use(
  '/',
  routes({
    feedbackService,
    speakersService,
  })
);

app.listen(port, () => {
  console.log(`Express server listening on port ${port}!`);
});
