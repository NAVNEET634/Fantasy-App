var express = require('express');
var router = express.Router();
var upload = require('./multer');
var pool = require('./pool')

var table = 'prize_breakup';


router.get('/',(req,res)=>{
    if(req.session.adminid) {
     res.render('prize_breakup',{title:'Add Prize Breakup'})
    }
    else res.render('admin' ,{title : 'Admin Login' ,  msg : 'Invalid Credentials'})

})


router.post('/insert',(req,res)=>{
	let body = req.body
	console.log(req.body)
	pool.query(`insert into ${table} set ?`,body,(err,result)=>{
		if(err) throw err;
		else res.json({
			status:200
		})
	})
})


router.get('/show',(req,res)=>{
	pool.query(`select * from ${table}`,(err,result)=>{
		err ? console.log(err) : res.json(result)
	})
})



router.get('/delete', (req, res) => {
    const { id } = req.query
    pool.query(`delete from ${table} where id = ${id}`, (err, result) => {
        if(err) throw err;
        else res.json(result);
    })
})

router.post('/update', (req, res) => {
    console.log(req.body)
    pool.query(`update ${table} set ? where id = ?`, [req.body, req.body.id], (err, result) => {
        if(err) throw err;
        else res.json(result);
    })
})



module.exports = router;