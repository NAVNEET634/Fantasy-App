var express = require('express');
var router = express.Router();
var upload = require('./multer');
var pool = require('./pool')

var table = 'matches';


router.get('/',(req,res)=>{
    if(req.session.adminid) {
     res.render('matches',{title:'Add Match'})
    }
    else res.render('admin' ,{title : 'Admin Login' ,  msg : 'Invalid Credentials'})

})



let H2H = [15,21,35,59,88,120,230,435,575,876,1299,1749,2875,5750]
let H3H = [17,27,35,77,125,230,387,777,1149,1547,3850]
let H4H  = [12,19,35,49,88,179,299,525,899,1499,1799,2999]
let hot_contests = [{entry:39 , member : 341880 , prizepool : 10000000  , entry_type : 'multi entry' , member_enter : 20} , {entry:99 , member : 12318 , prizepool : 1000000 , entry_type : 'multi entry' , member_enter : 20 } , {entry : 1149 , member: 530 , prizepool : 500000 , entry_type : 'multi entry' , member_enter : 20}]
let contests_for_champions = [{entry:39999 , member : 30 , prizepool : 100000 , entry_type : 'multi entry' , member_enter : 20} , {entry:2999 , member : 20 , prizepool : 50000 , entry_type : 'multi entry' , member_enter : 15 } , {entry : 7777 , member: 7 , prizepool : 10000 , entry_type : 'single' , member_enter : 1}]
let pratice_contests = [{entry:0 , member : 10000 , prizepool : 0 } , {entry:0 , member : 5000 , prizepool : 0 } , {entry : 0 , member: 1000 , prizepool : 0}]

for(i=0;i<hot_contests.length;i++){
	console.log(hot_contests[i].entry)
}


// body['prize_pool'] = (req.body.member*req.body.entry_fee) - (Math.round(req.body.member*req.body.entry_fee*0.1));
// body['status'] = 'not_completed'
// body['member_joined'] = 0


router.post('/insert',(req,res)=>{
	let body = req.body
	body['status'] = 'upcoming'
	console.log(req.body)
	pool.query(`insert into ${table} set ?`,body,(err,result)=>{
		if(err) throw err;
		else {
			//console.log('result aaya',result.insertId)
		// 	res.json({
		// 	status:200
		// })
}

for(var i=0;i<H2H.length;i++){
	pool.query(`insert into contests (leagueid,matchid,entry_fee,member,bonus,prize_pool,team_entry,status,member_joined,contests_name,member_entry) 
	           values('${req.body.leagueid}' , '${result.insertId}' , '${H2H[i]}' , '2' , '0' , '${(2*H2H[i]) - (Math.round(2*H2H[i]*0.1))}' , 'single' ,'not_completed', '0' , 'H2H' , '1' )`,(err,result)=>{
				   if(err) throw err;
				   else console.log('2')
			   })
}

for(var i=0;i<H3H.length;i++){
	pool.query(`insert into contests (leagueid,matchid,entry_fee,member,bonus,prize_pool,team_entry,status,member_joined,contests_name,member_entry) 
	           values('${req.body.leagueid}' , '${result.insertId}' , '${H3H[i]}' , '3' , '0' , '${(3*H3H[i]) - (Math.round(3*H3H[i]*0.1))}' , 'single' ,'not_completed', '0' , 'H3H' , '1')`,(err,result)=>{
				   if(err) throw err;
				   else console.log('3')
			   })
}



for(var i=0;i<H4H.length;i++){
	pool.query(`insert into contests (leagueid,matchid,entry_fee,member,bonus,prize_pool,team_entry,status,member_joined,contests_name,member_entry) 
	           values('${req.body.leagueid}' , '${result.insertId}' , '${H4H[i]}' , '4' , '0' , '${(4*H4H[i]) - (Math.round(4*H4H[i]*0.1))}' , 'single' ,'not_completed', '0' , 'H4H'  , '1')`,(err,result)=>{
				   if(err) throw err;
				   else console.log('4')
			   })
}



for(var i=0;i<hot_contests.length;i++){
	pool.query(`insert into contests (leagueid,matchid,entry_fee,member,bonus,prize_pool,team_entry,status,member_joined,contests_name,member_entry) 
	           values('${req.body.leagueid}' , '${result.insertId}' , '${hot_contests[i].entry}' , '${hot_contests[i].member}' , '0' , '${hot_contests[i].prizepool}' , 'multi entry' ,'not_completed', '0','hot_contests' , '${hot_contests[i].member_enter}' )`,(err,result)=>{
				   if(err) throw err;
				   else console.log('5')
			   })
}


for(var i=0;i<contests_for_champions.length;i++){
	pool.query(`insert into contests (leagueid,matchid,entry_fee,member,bonus,prize_pool,team_entry,status,member_joined,contests_name,member_entry) 
	           values('${req.body.leagueid}' , '${result.insertId}' , '${contests_for_champions[i].entry}' , '${contests_for_champions[i].member}' , '0' , '${contests_for_champions[i].prizepool}' , 'multi entry' ,'not_completed', '0','contests_for_champions' , '${contests_for_champions[i].member_enter}' )`,(err,result)=>{
				   if(err) throw err;
				   else console.log('5')
			   })
}



for(var i=0;i<pratice_contests.length;i++){
	pool.query(`insert into contests (leagueid,matchid,entry_fee,member,bonus,prize_pool,team_entry,status,member_joined,contests_name, member_entry) 
	           values('${req.body.leagueid}' , '${result.insertId}' , '${pratice_contests[i].entry}' , '${pratice_contests[i].member}' , '0' , '${pratice_contests[i].prizepool}' , 'single' ,'not_completed', '0','pratice_contests' ,'1' )`,(err,result)=>{
				   if(err) throw err;
				   else console.log('5')
			   })
}


	res.json({
			status:200
		})

	})
})	



router.get('/show',(req,res)=>{
	pool.query(`select m.*, (select t.name from teams t where t.id=m.team1) as team1name,
(select t.name from teams t where t.id=m.team2) as team2name,
(select l.name from leauges l where l.id = m.leagueid) as leaguename
	 from ${table} m order by m.id desc`,(err,result)=>{
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