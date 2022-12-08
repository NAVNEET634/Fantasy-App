var express = require('express');
var router = express.Router();
var upload = require('./multer');
var pool = require('./pool')

var table = 'contests';

router.get('/',(req,res)=>{
    if(req.session.adminid) {
     res.render('contests',{title:'Add Contests'})
    }
    else res.render('admin' ,{title : 'Admin Login' ,  msg : 'Invalid Credentials'})

})


router.post('/insert',(req,res)=>{
	let body = req.body
    body['prize_pool'] = (req.body.member*req.body.entry_fee) - (Math.round(req.body.member*req.body.entry_fee*0.1));
    body['status'] = 'not_completed'
    body['member_joined'] = 0
    console.log(req.body)
	pool.query(`insert into ${table} set ?`,body,(err,result)=>{
		if(err) throw err;
		else res.json({
			status:200
		})
	})
})


router.get('/show',(req,res)=>{
	pool.query(`select p.* , 
        (select t.name from teams t where t.id = p.teamid) as teamname,
         (select l.name from leauges l where l.id = p.leagueid) as leaguename
         from ${table} p`,(err,result)=>{
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