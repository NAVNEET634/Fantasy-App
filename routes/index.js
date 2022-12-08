var express = require('express');
const fs = require('fs');
const pool = require('./pool');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  const data = fs.readFileSync('./views/index.html').toString();
  res.send(data);
  // res.render('index.html', { title: 'Home' , description : 'Fantasy Cricket App! Play & Win Real Cash | Download the HOG Games.' });
});


router.get('/about', (req, res) => {
  const data = fs.readFileSync('./views/about.html').toString();
  res.send(data);
  // res.render('about.html',{ title: 'About Us' , description : 'Download the HOG app to play multi-games. Play now by creating a team & using your skills to earn money daily. ' });
})


router.get('/contact', (req, res) => {
  res.render('contact', { title: 'Contact Us', description: 'The only platform to play various games and win real cash prizes. Download HOG app now!', msg: '' });
})


router.get('/privacy-policy', (req, res) => {
  const data = fs.readFileSync('./views/privacy-policy.html').toString();
  res.send(data);
  // res.render('privacy_policy', { title: 'Privacy Policy', description: '' });
})



router.get('/term-and-condition', (req, res) => {
  const data = fs.readFileSync('./views/term-and-condition.html').toString();
  res.send(data);
  // res.render('terms', { title: 'Terms and Conditions', description: '' });
})


router.post('/contact', (req, res) => {
  // res.send(req.body)
  let body = req.body;
  pool.query(`insert into contact set ?`, body, (err, result) => {
    if (err) throw err;
    else res.render('contact', { msg: 'Successfully Submitted...' })
  })
})




router.get('/robots.txt', (req, res) => {
  res.render('robots');
})

router.get('/sitemap.xml', (req, res) => {
  res.render('sitemap')
})


module.exports = router;