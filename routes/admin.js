var express = require('express');
const pool = require('./pool');
var router = express.Router();
var table = 'admin'

/* GET home page. */


router.get('/', function(req, res, next) {
  res.render('admin', { title: 'Admin Login' , msg : '' });
});


router.post('/login',(req,res)=>{
  console.log(req.body)
  var query = `select * from ${table} where email = '${req.body.email}' and password = '${req.body.password}'`
  pool.query(query,(err,result)=>{
    if(err) throw err;
    else if(result[0]) {
      console.log(result)
      req.session.adminid = result[0].id;
      res.redirect('/admin/dashboard');
    }
    else res.render('admin' ,{title : 'Admin Login' ,  msg : 'Invalid Credentials'})
  })
})





router.get('/dashboard',(req,res)=>{
  if(req.session.adminid){
    var query = `select count(id) as counter from leauges;`
    var query1 =`select count(id) as counter from teams;`
    var query2 = `select count(id) as counter from matches where status = 'upcoming';`
    var query3 = `select count(id) as counter from matches where status = 'completed';`
    var query4 = `select sum(amount) as counter from deposit_cash;`
    var query5 = `select sum(amount) as counter from withdrawl_request where status = 'completed';`
    var query6 = `select sum(amount) as counter from withdrawl_request where status = 'pending';`
    pool.query(query+query1+query2+query3+query4+query5+query6,(err,result)=>{
      if(err) throw err;
      else res.render('dashboard' , {title : 'Admin Dashboard', result:result})
    })
  //  res.render('dashboard' , {title : 'Admin Dashboard'})
  }
  else res.render('admin' ,{title : 'Admin Login' ,  msg : 'Invalid Credentials'})

})


router.get('/logout',(req,res)=>{
  req.session.adminid = null;
  res.redirect('/admin');
})


router.get('/change-password',(req,res)=>{
  if(req.session.adminid) {
   res.render('ChangePassword',{title:'Change Password' , msg : ''})
  }
  else res.render('admin' ,{title : 'Admin Login' ,  msg : 'Invalid Credentials'})

})


router.post('/change-password-request',(req,res)=>{
  if(req.body.new_password == req.body.confirm_new_password) {
    
var query = `select * from ${table} where password = '${req.body.old_password}'`
pool.query(query,(err,result)=>{
  if(err) throw err;
  else if(result[0]) {

    var query = `update ${table} set password = '${req.body.new_password}'`
    pool.query(query,(err,result)=>{
      if(err) throw err;
      else {
        req.session.adminid = null;
        res.redirect('/admin')
      }
    })

  }
  else res.render('ChangePassword' ,{title : 'Change Password' ,  msg : 'Invalid Old Password'})

})

  }
  else res.render('ChangePassword' ,{title : 'Change Password' ,  msg : 'Password Must Be Same'})

})



// Withdrawl Report 

router.get('/withdrawl-request/:type',(req,res)=>{
  var query = `select * from withdrawl_request where status = '${req.params.type}' order by id desc;`
  pool.query(query,(err,result)=>{
    if(err) throw err;
    else res.render('withdrawl_request',{result:result , title : req.params.type + ' ' + 'Withdrawl Request'})
  })
})


// Date Wise Report Start

router.get('/withdrawl-report',(req,res)=>{
  if(req.session.adminid) {
   res.render('withdrawl_report',{title:'Withdrawl Report'})
  }
  else res.render('admin' ,{title : 'Admin Login' ,  msg : 'Invalid Credentials'})

})

router.post('/withdrawl-report',(req,res)=>{
  console.log(req.body)
  var query = `select * from withdrawl_request where date between '${req.body.from_date}' and '${req.body.to_date}' order by id desc;`
  pool.query(query,(err,result)=>{
    if(err) throw err;
    else res.json(result)
  })

})


// Date Wise Report End



router.post('/user',(req,res)=>{
  var query = `select * from users where number = '${req.body.number}';`
  pool.query(query,(err,result)=>{
    if(err) throw err;
    else res.json(result)
  })
})




router.get('/lineups',(req,res)=>{
  pool.query(`select m.*, (select t.short_name from teams t where t.id=m.team1) as team1name,
  (select t.short_name from teams t where t.id=m.team2) as team2name,
  (select l.name from leauges l where l.id = m.leagueid) as leaguename,
  (select t.logo from teams t where t.id=m.team1) as team1logo,
  (select t.logo from teams t where t.id=m.team2) as team2logo,
  (TIMESTAMPDIFF(MINUTE, now() , concat(m.date, ' ', m.time))-330) as timeleft
      from matches m  where m.status = 'upcoming' order by concat(m.date, ' ', m.time) limit 20`,(err,result)=>{
      err ? console.log(err) : res.render('lineups',{result , title : 'Lineups Out'})
  })
})







router.get('/completed-match',(req,res)=>{
  pool.query(`select m.*, (select t.short_name from teams t where t.id=m.team1) as team1name,
  (select t.short_name from teams t where t.id=m.team2) as team2name,
  (select l.name from leauges l where l.id = m.leagueid) as leaguename
    from matches m  where m.status = 'completed' order by id desc limit 20`,(err,result)=>{
      err ? console.log(err) : res.render('completedMatch',{result , title : 'Completed Match'})
  })
})




router.get('/lineups-out',(req,res)=>{
  req.session.team1id = req.query.team1id
  req.session.team2id = req.query.team2id
  req.session.matchid = req.query.matchid
 res.render('lineup-out')
})







router.get('/get-teams',(req,res)=>{
  pool.query(`select p.* , 
  (select t.short_name from teams t where t.id = p.teamid) as teamname,
  (select l.status from lineups l where p.id = l.playerid and l.matchid='${req.session.matchid}' ) as playerstatus ,
  (select l.player_points from lineups l where p.id = l.playerid and l.matchid='${req.session.matchid}' ) as playerpoints 
  from players p where  p.teamid = '${req.session.team1id}'  ||
  p.teamid = '${req.session.team2id}'  `,(err,result)=>{
      if(err) throw err;
      else res.json(result)
  })
})



router.get('/get-teams-wicketkeeper',(req,res)=>{
  pool.query(`select p.* , 
  (select t.short_name from teams t where t.id = p.teamid) as teamname,
  (select l.status from lineups l where p.id = l.playerid and l.matchid='${req.session.matchid}' ) as playerstatus ,
  (select l.player_points from lineups l where p.id = l.playerid and l.matchid='${req.session.matchid}' ) as playerpoints 
  from players p where  p.teamid = '${req.session.team1id}' and type = 'Wicket Keeper' ||
  p.teamid = '${req.session.team2id}' and type = 'Wicket Keeper' 
  ||  p.teamid = '${req.session.team1id}' and type = 'GK' ||
  p.teamid = '${req.session.team2id}' and type = 'GK'
  `,(err,result)=>{
      if(err) throw err;
      else res.json(result)
  })
})




router.get('/get-teams-bastmen',(req,res)=>{
  pool.query(`select p.* , 
  (select t.short_name from teams t where t.id = p.teamid) as teamname,
  (select l.status from lineups l where p.id = l.playerid and l.matchid='${req.session.matchid}' ) as playerstatus ,
  (select l.player_points from lineups l where p.id = l.playerid and l.matchid='${req.session.matchid}' ) as playerpoints 
  from players p where  p.teamid = '${req.session.team1id}' and type = 'Bastmen' ||
  p.teamid = '${req.session.team2id}' and type = 'Bastmen' 
  ||  p.teamid = '${req.session.team1id}' and type = 'DEF' ||
  p.teamid = '${req.session.team2id}' and type = 'DEF'
  
  
  
  `,(err,result)=>{
      if(err) throw err;
      else res.json(result)
  })
})



router.get('/get-teams-bowler',(req,res)=>{
  pool.query(`select p.* , 
  (select t.short_name from teams t where t.id = p.teamid) as teamname,
  (select l.status from lineups l where p.id = l.playerid and l.matchid='${req.session.matchid}' ) as playerstatus ,
  (select l.player_points from lineups l where p.id = l.playerid and l.matchid='${req.session.matchid}' ) as playerpoints 
  from players p where  p.teamid = '${req.session.team1id}' and type = 'Bowler' ||
  p.teamid = '${req.session.team2id}' and type = 'Bowler' 
  ||  p.teamid = '${req.session.team1id}' and type = 'ST' ||
  p.teamid = '${req.session.team2id}' and type = 'ST'
  `,(err,result)=>{
      if(err) throw err;
      else res.json(result)
  })
})



router.get('/get-teams-allrounder',(req,res)=>{
  pool.query(`select p.* , 
  (select t.short_name from teams t where t.id = p.teamid) as teamname,
  (select l.status from lineups l where p.id = l.playerid and l.matchid='${req.session.matchid}' ) as playerstatus ,
  (select l.player_points from lineups l where p.id = l.playerid and l.matchid='${req.session.matchid}' ) as playerpoints 
  from players p where  p.teamid = '${req.session.team1id}' and type = 'All Rounder' ||
  p.teamid = '${req.session.team2id}' and type = 'all Rounder' 
  ||  p.teamid = '${req.session.team1id}' and type = 'MID' ||
  p.teamid = '${req.session.team2id}' and type = 'MID'
  
  `,(err,result)=>{
      if(err) throw err;
      else res.json(result)
  })
})









router.get('/live-match',(req,res)=>{
  pool.query(`select m.*, (select t.short_name from teams t where t.id=m.team1) as team1name,
  (select t.short_name from teams t where t.id=m.team2) as team2name,
  (select l.name from leauges l where l.id = m.leagueid) as leaguename,
  (select t.logo from teams t where t.id=m.team1) as team1logo,
  (select t.logo from teams t where t.id=m.team2) as team2logo,
  (select b.status from bet_join b where b.matchid = m.id limit 1) as betstatus,
  (TIMESTAMPDIFF(MINUTE, now() , concat(m.date, ' ', m.time))-330) as timeleft
      from matches m  where m.status = 'live'`,(err,result)=>{
      if(err) throw err;
      //else res.json(result)
     else res.render('liveMatch',{result,title:'Live Match'})
  })
})













router.post('/update-points',(req,res)=>{
  console.log(req.body)
  let vicecaptainpoints = req.body.player_points/2
  pool.query(`update lineups set player_points = player_points + '${req.body.player_points}' where playerid='${req.body.playerid}' and matchid = '${req.session.matchid}'`,(err,result)=>{
    if(err) throw err;
    else {

      pool.query(`select player1,player2,player3,player4,player5,player6,player7,player8,player9,player10,player11,captain,vicecaptain,teamname,number,id from myteams where matchid = '${req.session.matchid}' `,(err,result)=>{
          if(err) throw err;
          else if(result[0]){
          for(i=0;i<result.length;i++){
              let captain = result[i].captain
              let vicecaptain = result[i].vicecaptain
              let teamname = result[i].teamname
              let number = result[i].number
              let teamid = result[i].id
         //     console.log('yea,',number)
              
              if(result[i].player1 == req.body.playerid || result[i].player2 == req.body.playerid || result[i].player3 == req.body.playerid || result[i].player4 == req.body.playerid ||
                  result[i].player5 == req.body.playerid || result[i].player6 == req.body.playerid || result[i].player7 == req.body.playerid || result[i].player8 == req.body.playerid ||
                  result[i].player9 == req.body.playerid || result[i].player10 == req.body.playerid || result[i].player11 == req.body.playerid ){
  
  
  pool.query(`update myteams set playerpoints = playerpoints + '${req.body.player_points}' 
  where matchid = '${req.session.matchid}' and player1 = '${req.body.playerid}' and id = '${teamid}'  and number = '${number}' ||
   matchid = '${req.session.matchid}' and player2 = '${req.body.playerid}' and id = '${teamid}'  and number = '${number}' ||
   matchid = '${req.session.matchid}' and player3 = '${req.body.playerid}' and id = '${teamid}'  and number = '${number}' ||
   matchid = '${req.session.matchid}' and player4 = '${req.body.playerid}' and id = '${teamid}'  and number = '${number}' ||
   matchid = '${req.session.matchid}' and player5 = '${req.body.playerid}' and id = '${teamid}'  and number = '${number}' ||
   matchid = '${req.session.matchid}' and player6 = '${req.body.playerid}' and id = '${teamid}'  and number = '${number}' ||
   matchid = '${req.session.matchid}' and player7 = '${req.body.playerid}' and id = '${teamid}'  and number = '${number}' ||
   matchid = '${req.session.matchid}' and player8 = '${req.body.playerid}' and id = '${teamid}'   and number = '${number}' ||
   matchid = '${req.session.matchid}' and player9 = '${req.body.playerid}' and id = '${teamid}'  and number = '${number}' ||
   matchid = '${req.session.matchid}' and player10 = '${req.body.playerid}' and id = '${teamid}'  and number = '${number}' ||
   matchid = '${req.session.matchid}' and player11 = '${req.body.playerid}' and id = '${teamid}'  and number = '${number}'
  
  `,(err,result)=>{
      if(err) throw err;
      else {
          console.log('result',result)
          console.log('vicecaptain',vicecaptain)
          if(captain==req.body.playerid){
              pool.query(`update myteams set playerpoints = playerpoints + ${req.body.player_points} where matchid = '${req.session.matchid}' and captain = '${captain}' and id = '${teamid}'  and number = '${number}'`,(err,result)=>{
                
              })
          }
          else if(vicecaptain == req.body.playerid){
              pool.query(`update myteams set playerpoints = playerpoints + ${vicecaptainpoints} where matchid = '${req.session.matchid}' and vicecaptain = '${vicecaptain}' and id = '${teamid}'  and number = '${number}'`,(err,result)=>{
  
              })
          }
      }
  })
  
                  }
                  else{
                      console.log('done')
                  }
          }
          res.json({
              msg : 'success'
          })
          }
          else{
              res.json({
                  msg : 'success'
              })
          }
      })
       
    }
  })

})

// router.get('/',(req,res)=>{
//   pool.query(`select player1,player2,player3,player4,player5,player6,player7,player8,player9,player10,player11,captain,vicecaptain from myteams where matchid = '${req.session.matchid}' `,(err,result)=>{
//       if(err) throw err;
//       else if(result[0]){
//       for(i=0;i<result.length;i++){
//           let captain = result[i].captain
//           let vicecaptain = result[i].vicecaptain
//           if(result[i].player1 == req.body.playerid || result[i].player2 == req.body.playerid || result[i].player3 == req.body.playerid || result[i].player4 == req.body.playerid ||
//               result[i].player5 == req.body.playerid || result[i].player6 == req.body.playerid || result[i].player7 == req.body.playerid || result[i].player8 == req.body.playerid ||
//               result[i].player9 == req.body.playerid || result[i].player10 == req.body.playerid || result[i].player11 == req.body.playerid ){


// pool.query(`update myteams set playerpoints = playerpoints + ${req.body.player_points} where matchid = '${req.session.matchid}'`,(err,result)=>{
//   if(err) throw err;
//   else {
//       if(captain==req.body.playerid){
//           pool.query(`update myteams set playerpoints = playerpoints + ${req.body.player_points} where matchid = '${req.session.matchid}'`,(err,result)=>{

//           })
//       }
//       else if(vicecaptain == req.body.playerid){
//           pool.query(`update myteams set playerpoints = playerpoints + (${req.body.player_points}/2).toFixed(1) where matchid = '${req.session.matchid}'`,(err,result)=>{

//           })
//       }
//   }
// })

//               }
//               else{
//                   console.log('done')
//               }
//       }
//       res.json({
//           msg : 'success'
//       })
//       }
//       else{
//           res.json({
//               msg : 'success'
//           })
//       }
//   })

// })

















router.post('/cancel-contest',(req,res)=>{
  let body = req.body




  var today = new Date();
  var dd = today.getDate();
  
  var mm = today.getMonth()+1; 
  var yyyy = today.getFullYear();
  if(dd<10) 
  {
      dd='0'+dd;
  } 
  
  if(mm<10) 
  {
      mm='0'+mm;
  } 
  today = yyyy+'-'+mm+'-'+dd;


  console.log('res',body)
  pool.query(`select j.number ,
  (select c.entry_fee from contests c where c.id = j.contestsid ) as refund
  from join_contests j where j.contestsid = '${req.body.id}' 
  `,(err,result)=>{
   if(err) throw err;
   else{
      console.log(result)
      for(i=0;i<result.length;i++){
          let usernumber = result[i].number
          let refundamount = result[i].refund
          pool.query(`update users set winning_amount = winning_amount+'${result[i].refund}' where number = '${result[i].number}'`,(err,data)=>{
                 if(err) throw err;
                 else {
                  pool.query(`insert into transcations (name,number,date,amount,color,sign) values('Contests Refund','${usernumber}','${today}','${refundamount}','green','+')`,(err,data)=>{
                     if(err) throw err;
                     else {
                        pool.query(`delete from join_contests where contestsid = '${req.body.id}'`,(err,result)=>{
                            if(err) throw err;
                            else console.log('success')
                        })
                     }
                  })
                 }
              })
      }
      res.json({
          msg:'success'
      })
   } 

  })
})































router.get('/user-joined',(req,res)=>{
  pool.query(`select j.entry_fee ,j.teamid ,j.matchid, (select u.name from users u where u.number = j.number) as username from join_contests j where j.matchid = '${req.query.matchid}' order by id desc`,(err,result)=>{
      if(err) throw err;
      else res.render('userjoined',{result:result})
  })
})





































































/// new api












module.exports = router;



