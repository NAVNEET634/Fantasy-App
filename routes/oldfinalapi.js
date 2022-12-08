var express = require('express');
var router = express.Router();
var upload = require('./multer');
var pool = require('./pool')






const { Expo } = require('expo-server-sdk')

// const fetch = require('node-fetch')

const request = require('request');
// var payumoney = require('payumoney-node');
// payumoney.setKeys(`${process.env.PAYUMONEYKEY1}`, `${process.env.PAYUMONEYKEY2}`,`${process.env.PAYUMONEYKEY3}`); 
// payumoney.isProdMode(true);

// var msg91=require('msg91-sms');
// var authkey='300563AFuzfOZn9ESb5db12f8f';
// var senderid='DELOTM';
// var route='4';
// var dialcode='91';


require('dotenv').config()
const SendOtp = require('sendotp');
const sendOtp = new SendOtp(`${process.env.MSG91KEY}`);




router.post('/update-user', (req, res) => {
    let body = req.body;

   pool.query(`update users set ? where number = ?`, [req.body, req.body.number], (err, result) => {
        if(err) throw err;
       else {
            res.json({
                status:'200',
                msg:'success',
                description:'success'
            })
        }
    })
})





router.get('/show-all-matches',(req,res)=>{
    let type = req.query.type
    console.log('type h',req.query.type)
        pool.query(`select m.*, (select t.short_name from teams t where t.id=m.team1) as team1name,
        (select t.short_name from teams t where t.id=m.team2) as team2name,
        (select l.name from leauges l where l.id = m.leagueid) as leaguename,
        (select t.logo from teams t where t.id=m.team1) as team1logo,
        (select t.logo from teams t where t.id=m.team2) as team2logo,
        (TIMESTAMPDIFF(MINUTE, now() , concat(m.date, ' ', m.time))-330)*60 as timeleft
            from matches m  where m.status = 'upcoming' order by concat(m.date, ' ', m.time) `,(err,result)=>{
        err ? console.log(err) : res.json(result)
    })
  

})


router.get('/show-all-bet-matches',(req,res)=>{
    pool.query(`select m.*, (select t.short_name from teams t where t.id=m.team1) as team1name,
(select t.short_name from teams t where t.id=m.team2) as team2name,
(select l.name from leauges l where l.id = m.leagueid) as leaguename,
(select t.logo from teams t where t.id=m.team1) as team1logo,
(select t.logo from teams t where t.id=m.team2) as team2logo,
(TIMESTAMPDIFF(MINUTE, now() , concat(m.date, ' ', m.time))-330)*60 as timeleft
    from matches m  where m.status = 'upcoming' order by concat(m.date, ' ', m.time) limit 7`,(err,result)=>{
err ? console.log(err) : res.json(result)
})
})



router.post('/show-single-matches',(req,res)=>{
    pool.query(`select m.*, (select t.short_name from teams t where t.id=m.team1) as team1name,
(select t.short_name from teams t where t.id=m.team2) as team2name,
(select l.name from leauges l where l.id = m.leagueid) as leaguename,
(select t.logo from teams t where t.id=m.team1) as team1logo,
(select t.logo from teams t where t.id=m.team2) as team2logo,
(TIMESTAMPDIFF(MINUTE, now() , concat(m.date, ' ', m.time))-330)*60 as timeleft
    from matches m  where m.id = '${req.body.id}'`,(err,result)=>{
    err ? console.log(err) : res.json(result)
})
})




// get counter

// select  concat(m.date, ' ', m.time) as dateadd , now() , curdate(),


// TIMESTAMPDIFF(MINUTE, now() , concat(m.date, ' ', m.time)) as a

//      from matches m  where m.status = 'upcoming' order by m.date limit 7



router.post('/login',(req,res)=>{
    pool.query(`select * from users where number = '${req.body.number}'`,(err,result)=>{
        if(err) throw err;
        else if(result[0]){
            var otp =  Math.floor(Math.random() * 10000)
            console.log('otp',otp)
           
           
               const message = {
                            to: req.body.token,
                            sound: 'default',
                            title: `${otp} is your OTP to login on the app.`,
                            body: ``,
                            data: { someData: 'goes here' },
                          };
        
                          //request.post('https://exp.host/--/api/v2/push/send').form({message})   
        // request.post({url:'https://exp.host/--/api/v2/push/send',body: JSON.stringify(message)} , function(err,httpResponse,data){
        //     console.log('sending data',body)
        //     if(err) throw err;
        //     else res.json(data)
        //  })
                        
                           fetch('https://exp.host/--/api/v2/push/send', {
                            method: 'POST',
                            headers: {
                              Accept: 'application/json',
                              'Accept-encoding': 'gzip, deflate',
                              'Content-Type': 'application/json',
                            },
                            body: JSON.stringify(message),
                          });
                        


                        

           
           
            sendOtp.send(req.body.number, "DELOTM", otp,(err,result)=>{
                if(err) throw err;
                else{
                   console.log('ipp',result)
                   
                   
                
                    res.json({
                        msg : 'success',
                       status:'200',
                       otp:otp,
                       type:'success',
                       message : result
                    })
                }
               })
        }
        else{
            res.json({
                msg :'user not found'
            })
        }
    })
})



router.post('/add-user',(req,res)=>{



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

      let body = req.body;
    let random_number = Math.random().toString(36).substring(7);
     body['unique_code']= random_number
     body['bonus'] = 100
     body['deposit_cash'] = 50
     body['winning_amount'] = 0
     body['percentage'] = 2
     pool.query(`select id from users where number = '${req.body.number}'`,(err,result)=>{
        if(err) throw err;
        else if(result[0]){
          res.json({
            status : 200,
            type:'already registered'
          })
        }
        else{

        if(req.body.refferal_code==null || req.body.refferal_code==[] || req.body.refferal_code=="" || req.body.refferal_code=="null"){
          pool.query(`insert into users set ?`,body,(err,result)=>{
            if(err) throw err;
            else {

              pool.query(`insert into transcations (name,number,date,amount,color,sign) values('Signup Bonus','${req.body.number}','${today}','${req.body.deposit_cash}','green','+')`,(err,result)=>{
                if(err) throw err;
                else{
                res.json({
                    status : 200,
                    type:'success' 
                })
                }
              })  
                
            }
          })
        }   
        else{

   pool.query(`select id,number from users where unique_code = '${req.body.refferal_code}'`,(err,result)=>{
    if(err) throw err;
    else if(result[0]){
        let usernumber = result[0].number
pool.query(`insert into users set ?`,body,(err,result)=>{
    if(err) throw err;
    else{
pool.query(`update users set deposit_cash = deposit_cash+${req.body.bonus} where unique_code = '${req.body.refferal_code}'`,(err,result)=>{
    if(err) throw err;
    else {
       

              pool.query(`insert into transcations (name,number,date,amount,color,sign) values('Signup Bonus','${req.body.number}','${today}','${req.body.bonus}','green','+')`,(err,result)=>{
                if(err) throw err;
                else{
                  
                pool.query(`insert into transcations (name,number,date,amount,color,sign) values('fferal Bonus','${usernumber}','${today}','${req.body.bonus}','green','+')`,(err,result)=>{
                if(err) throw err;
                else{
                res.json({
                    status : 200,
                    type:'success' 
                })
                }
              })

                }
              })

        // res.json({
        //     status : 200,
        //     type:'success'
        // })
    }
})        
    }
})
    }
    else{
       res.json({
        status : 300,
        type:'invalid proocode'
       })
    }
   })    








        } 
         
        }
     })
  

})



router.post('/check_refferal_code',(req,res)=>{
    let body = req.body;
    pool.query(`select id from users where unique_code = '${req.body.refferal_code}'`,(err,result)=>{
        if(err) throw err;
        else if(result[0]){
          res.json({
            status:200,
            type:'valid'
          })
        }
        else{
            res.json({
                status:300,
                type:'invalid'
            })
        }
    })
})




router.post('/send-otp',(req,res)=>{
     let body = req.body
   console.log(req.body)
   var otp =  Math.floor(Math.random() * 10000)
   pool.query(`select id from users where number='${req.body.number}'`,(err,result)=>{
    if(err) throw err;
    else if(result[0]){
    
    res.json({
        status : 300,
        type:'already registered'
    })
    }
    else{



        const message = {
            to: req.body.token,
            sound: 'default',
            title: `${otp} is your OTP to login on the app.`,
            body: ``,
            data: { someData: 'goes here' },
          };

          //request.post('https://exp.host/--/api/v2/push/send').form({message})   
// request.post({url:'https://exp.host/--/api/v2/push/send',body: JSON.stringify(message)} , function(err,httpResponse,data){
//     console.log('sending data',body)
//     if(err) throw err;
//     else res.json(data)
//  })
        
           fetch('https://exp.host/--/api/v2/push/send', {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Accept-encoding': 'gzip, deflate',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(message),
          });
        



sendOtp.send(req.body.number, "DELOTM", otp,(err,result)=>{
     if(err) throw err;
     else{




         res.json({
            status:'200',
            otp:otp,
            type:'success'
         })
     }
    })
    }
   })
   
})













router.post('/send-otp-namma',(req,res)=>{
    let body = req.body
  console.log(req.body)
  var otp =  Math.floor(Math.random() * 10000)


sendOtp.send(req.body.number, "DELOTM", otp,(err,result)=>{
    if(err) throw err;
    else{
        res.json({
           status:'200',
           otp:otp,
           type:'success'
        })
    }
   })
   

  
})







router.post('/wallet',(req,res)=>{
    pool.query(`select deposit_cash , bonus , winning_amount,name,profile from users where number = '${req.body.number}'`,(err,result)=>{
        if(err) throw err;
        else res.json({
            cash:result
        })
    })
})


router.post('/update',upload.single('pancard'),(req,res)=>{
    let body = req.body
    console.log('body aayi',req.body)
    body['pancard'] = req.file.filename;
   console.log('body aayi',req.body)
       
    pool.query(`update users set ? where number = ?`, [req.body, req.body.number],(err,result)=>{
         if(err) throw err;
         else res.json({
            msg : 'success'
         })
    })
})


router.post('/update/bank_details',upload.single('bank_details'),(req,res)=>{
    let body = req.body
    console.log('body aayi',req.body)
    body['bank_details'] = req.file.filename;
   console.log('body aayi',req.body)
       
    pool.query(`update users set ? where number = ?`, [req.body, req.body.number],(err,result)=>{
         if(err) throw err;
         else res.json({
            msg : 'success'
         })
    })
})



router.post('/pan_card_verification',(req,res)=>{
    pool.query(`select pancard_status from users where number = '${req.body.number}'`,(err,result)=>{
        if(err) throw err;
        else {
            res.json(result)
        }
    })
})




router.post('/bank_verification',(req,res)=>{
    pool.query(`select bank_verification_status from users where number = '${req.body.number}'`,(err,result)=>{
        if(err) throw err;
        else {
            res.json(result)
        }
    })
})





router.post('/contests',(req,res)=>{
    pool.query(`select * from contests where member = '${req.body.member}' and leagueid = '${req.body.leagueid}' and matchid = '${req.body.matchid}' and member > member_joined order by entry_fee`,(err,result)=>{
        if(err) throw err;
        else{
            res.json({
                result
            })
        }

    })
})





router.post('/gl-contests',(req,res)=>{
    pool.query(`select * from contests where member > ${req.body.member} and member < 15 and leagueid = '${req.body.leagueid}' and matchid = '${req.body.matchid}' and member > member_joined and status='not_completed' order by entry_fee`,(err,result)=>{
        if(err) throw err;
       else{
            res.json({
                result
            })
        }
    })
})










router.post('/megagl-contests',(req,res)=>{
    pool.query(`select * from contests where member > 40 and leagueid = '${req.body.leagueid}' and matchid = '${req.body.matchid}' and member > member_joined and status='not_completed' order by entry_fee`,(err,result)=>{
        if(err) throw err;
       else{
            res.json({
                result
            })
        }
    })
})





router.post('/referral_code',(req,res)=>{
    var query=`select refferal_code from users where number = '${req.body.number}';`
    pool.query(`select unique_code from users where number = '${req.body.number}'`,(err,result)=>{
        if(err) throw err;
        else{
            let unique_code = result[0].unique_code
            pool.query(`select count(id) as counter from users where refferal_code = '${unique_code}'`,(err,result)=>{
                if(err) throw err;
                else {
                    res.json({
                        counter : result,
                        unique_code : unique_code
                    })
                }
            })
        }
    })
})



router.post('/transcations',(req,res)=>{
    pool.query(`select * from transcations where number='${req.body.number}' order by id desc limit 30`,(err,result)=>{
        if(err) throw err;
        else {
            res.json({
                result
            })
        }
    })
})


// router.post('/send-otp',(req,res)=>{
//      let body = req.body
//    console.log(req.body)
//    var otp =  Math.floor(Math.random() * 10000)
//    sendOtp.send(req.body.number, "DELOTM", otp,(err,result)=>{
//      if(err) throw err;
//      else{
//          res.json({
//             status:'200',
//             otp:otp,
//             type:'success'
//          })
//      }
//     })
// })





router.post('/join-contests',(req,res)=>{


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


    let body = req.body
    body['status'] = 'upcoming'
    body['send_amount'] = ''
    console.log('data aa rha h',req.body)
 //   let commision = (req.body.entry_fee*2)/100;
    let data = []

pool.query(`select * from  join_contests where number = '${req.body.number}' and contestsid = '${req.body.contestsid}'`,(err,result)=>{
    if(err) throw err;
    else if(result[0]){
      res.json({
          msg : 'join already'
      })
    }
    else {



        pool.query(`select * from users where number = '${req.body.number}'`,(err,result)=>{
            if(err) throw err;
            else if(((+result[0].deposit_cash) + (+result[0].winning_amount) ) >= req.body.entry_fee){
                let referral_code = result[0].refferal_code
                let deposit_cash = result[0].deposit_cash
                let winning_amount = result[0].winning_amount
            console.log('deposit cash',deposit_cash)
            console.log('winning amount',winning_amount)
            console.log('entry fee',req.body.entry_fee)
            console.log('1 condition',(+deposit_cash) > (+req.body.entry_fee))
            console.log('2 condition',(+winning_amount) > (+req.body.entry_fee))
                pool.query(`select leagueid , matchid , entry_fee , member , bonus , prize_pool , team_entry , member_joined , status from contests where id  ='${req.body.contestsid}'`,(err,result)=>{
                    if(err) throw err;
                    else {
                        data = result
                        let member = result[0].member
                        let member_joined = result[0].member_joined
                
                        if((+result[0].member) > (+result[0].member_joined)){
                            console.log('yeh chla')
                           pool.query(`insert into join_contests set ?`,body,(err,result)=>{
                               if(err) throw err;
                               else {
    
    
    pool.query(`select number,percentage from users where unique_code = '${referral_code}'`,(err,result)=>{
        if(err) throw err;
        else if(result[0]){
            let referral_number = result[0].number
            let commision = (req.body.entry_fee*result[0].percentage)/100;
            console.log('commission',commision)
            pool.query(`update users set deposit_cash = deposit_cash+${commision} where unique_code = '${referral_code}'`,(err,result)=>{
                if(err) throw err;
                else {
                    pool.query(`insert into transcations (name , number , date , amount , color , sign) values('Referal Bonus','${referral_number}','${today}', '${commision}','green','+')`,(err,result)=>{
                        if(err) throw err;
                        else {
            
    
    
                            pool.query(`update contests set member_joined = member_joined+1 where id = '${req.body.contestsid}'`,(err,result)=>{
                                if(err) throw err;
                                else {
                                    pool.query(`insert into transcations (name , number , date , amount , color , sign) values('Joined Contest','${req.body.number}','${today}', '${req.body.entry_fee}','red','-')`,(err,result)=>{
                                        if(err) throw err;
                                        else {
                                           if((+deposit_cash) >= (+req.body.entry_fee)){
                                               console.log('first')
                                               pool.query(`update users set deposit_cash = deposit_cash-${req.body.entry_fee} where number = '${req.body.number}'`,(err,result)=>{
                                                   if(err) throw err;
                                                   else {
                                                       if(member==((+member_joined)+1)) {
                                                           data[0].member_joined = 0;
                                                           data[0].status = 'not_completed'
                                                           pool.query(`insert into contests set ?`,data,(err,result)=>{
                                                               if(err) throw err;
                                                               else {
                                                                   res.json({
                                                                       msg : 'joined successfuly',
                                                                       des:'create'
                                                                   })
                                                               }
                                                           })
                                                      }
                                                      else {
                                                          res.json({
                                                              msg : 'joined successfuly'
                                                          })
                                                      }
                                               
                                                   }
                                               })
    
                                           } 
                                           else if((+winning_amount) >= (+req.body.entry_fee)){
                                               console.log('second')
                                               pool.query(`update users set winning_amount = winning_amount-${req.body.entry_fee} where number = '${req.body.number}'`,(err,result)=>{
                                                   if(err) throw err;
                                                   else {
                                                       if(member==((+member_joined)+1)) {
                                                           data[0].member_joined = 0;
                                                           data[0].status = 'not_completed'
                                                           pool.query(`insert into contests set ?`,data,(err,result)=>{
                                                               if(err) throw err;
                                                               else {
                                                                   res.json({
                                                                       msg : 'joined successfuly',
                                                                       des:'create'
                                                                   })
                                                               }
                                                           })
                                                      }
                                                      else {
                                                          res.json({
                                                              msg : 'joined successfuly'
                                                          })
                                                      }
                                               
                                                   }
                                               })
    
    
                                           }
                                           else if(((+deposit_cash) +(+ winning_amount)) >= (+req.body.entry_fee)){
                                               console.log('third')
                                               let remaining_amount = req.body.entry_fee - deposit_cash
                                               let deposit_deduct_amount = req.body.entry_fee - remaining_amount
                                               pool.query(`update users set deposit_cash = deposit_cash-${deposit_deduct_amount} , winning_amount = winning_amount-${remaining_amount} where number = '${req.body.number}'`,(err,result)=>{
                                                   if(err) throw err;
                                                   else {
                                                       if(member==((+member_joined)+1)) {
                                                           data[0].member_joined = 0;
                                                           data[0].status = 'not_completed'
                                                           pool.query(`insert into contests set ?`,data,(err,result)=>{
                                                               if(err) throw err;
                                                               else {
                                                                   res.json({
                                                                       msg : 'joined successfuly',
                                                                       des:'create'
                                                                   })
                                                               }
                                                           })
                                                      }
                                                      else {
                                                          res.json({
                                                              msg : 'joined successfuly'
                                                          })
                                                      }
                                               
                                                   }
                                               })
    
    
    
                                           }
                                           // if(member_joined==2) {
                                           //      data['member_joined'] = 0;
                                           //      data['status'] = 'not_completed'
                                           //      pool.query(`insert into contests set ?`,data,(err,result)=>{
                                           //          if(err) throw err;
                                           //          else {
                                           //              res.json({
                                           //                  msg : 'joined successfuly'
                                           //              })
                                           //          }
                                           //      })
                                           // }
                                           // else {
                                           //     res.json({
                                           //         msg : 'joined successfuly'
                                           //     })
                                           // }
                                        }
                                    })
                                }
                            })
    
    
                        }                        
                    })
                }
            })
        }
        else{
    
    
            pool.query(`update contests set member_joined = member_joined+1 where id = '${req.body.contestsid}'`,(err,result)=>{
                if(err) throw err;
                else {
                    pool.query(`insert into transcations (name , number , date , amount , color , sign) values('Joined Contest','${req.body.number}','${today}', '${req.body.entry_fee}','red','-')`,(err,result)=>{
                        if(err) throw err;
                        else {
                           if(deposit_cash >= req.body.entry_fee){
                               console.log('first')
                               pool.query(`update users set deposit_cash = deposit_cash-${req.body.entry_fee} where number = '${req.body.number}'`,(err,result)=>{
                                   if(err) throw err;
                                   else {
                                       if(member==((+member_joined)+1)) {
                                           data[0].member_joined = 0;
                                           data[0].status = 'not_completed'
                                           pool.query(`insert into contests set ?`,data,(err,result)=>{
                                               if(err) throw err;
                                               else {
                                                   res.json({
                                                       msg : 'joined successfuly',
                                                       des:'create'
                                                   })
                                               }
                                           })
                                      }
                                      else {
                                          res.json({
                                              msg : 'joined successfuly'
                                          })
                                      }
                               
                                   }
                               })
    
                           } 
                           else if((+winning_amount) >= (+req.body.entry_fee)){
                               console.log('second')
                               pool.query(`update users set winning_amount = winning_amount-${req.body.entry_fee} where number = '${req.body.number}'`,(err,result)=>{
                                   if(err) throw err;
                                   else {
                                       if(member==((+member_joined)+1)) {
                                           data[0].member_joined = 0;
                                           data[0].status = 'not_completed'
                                           pool.query(`insert into contests set ?`,data,(err,result)=>{
                                               if(err) throw err;
                                               else {
                                                   res.json({
                                                       msg : 'joined successfuly',
                                                       des:'create'
                                                   })
                                               }
                                           })
                                      }
                                      else {
                                          res.json({
                                              msg : 'joined successfuly'
                                          })
                                      }
                               
                                   }
                               })
    
    
                           }
                           else if(((+deposit_cash) +(+ winning_amount)) >= (+req.body.entry_fee)){
                               console.log('third')
                               let remaining_amount = req.body.entry_fee - deposit_cash
                               let deposit_deduct_amount = req.body.entry_fee - remaining_amount
                               pool.query(`update users set deposit_cash = deposit_cash-${deposit_deduct_amount} , winning_amount = winning_amount-${remaining_amount} where number = '${req.body.number}'`,(err,result)=>{
                                   if(err) throw err;
                                   else {
                                       if(member==((+member_joined)+1)) {
                                           data[0].member_joined = 0;
                                           data[0].status = 'not_completed'
                                           pool.query(`insert into contests set ?`,data,(err,result)=>{
                                               if(err) throw err;
                                               else {
                                                   res.json({
                                                       msg : 'joined successfuly',
                                                       des:'create'
                                                   })
                                               }
                                           })
                                      }
                                      else {
                                          res.json({
                                              msg : 'joined successfuly'
                                          })
                                      }
                               
                                   }
                               })
    
    
    
                           }
                           // if(member_joined==2) {
                           //      data['member_joined'] = 0;
                           //      data['status'] = 'not_completed'
                           //      pool.query(`insert into contests set ?`,data,(err,result)=>{
                           //          if(err) throw err;
                           //          else {
                           //              res.json({
                           //                  msg : 'joined successfuly'
                           //              })
                           //          }
                           //      })
                           // }
                           // else {
                           //     res.json({
                           //         msg : 'joined successfuly'
                           //     })
                           // }
                        }
                    })
                }
            })
    
    
        }
    })
    
    
    
                              
                               }
    
    //yaha
    
                           })
                        }
                        else{
                            console.log('already full')
                            //console.log('inserted data',data[0])
                            data[0].member_joined = 0;
                            data[0].status = 'not_completed'
                            pool.query(`insert into contests set ?`,data,(err,result)=>{
                                if(err) throw err;
                                else {
                                    res.json({
                                        msg : 'contests full',
                                        des:'create'
                                    })
                                }
                            })
                        }
                    }
                })
    
            }
            else {
                res.json({
                    msg : 'wallet low'
                })
    
            }
        })

    }
})


    
})


























router.post('/megagl-join-contests',(req,res)=>{


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

    let body = req.body
    body['status'] = 'upcoming'
    body['send_amount'] = ''
    console.log('data aa rha h',req.body)
 //   let commision = (req.body.entry_fee*2)/100;
    let data = []

pool.query(`select * from  join_contests where number = '${req.body.number}' and contestsid = '${req.body.contestsid}' and teamid = '${req.body.teamid}'`,(err,result)=>{
    if(err) throw err;
    else if(result[0]){
      res.json({
          msg : 'join already'
      })
    }
    else {



        pool.query(`select * from users where number = '${req.body.number}'`,(err,result)=>{
            if(err) throw err;
            else if(((+result[0].deposit_cash) + (+result[0].winning_amount) ) >= req.body.entry_fee){
                let referral_code = result[0].refferal_code
                let deposit_cash = result[0].deposit_cash
                let winning_amount = result[0].winning_amount
            console.log('deposit cash',deposit_cash)
            console.log('winning amount',winning_amount)
            console.log('entry fee',req.body.entry_fee)
            console.log('1 condition',(+deposit_cash) > (+req.body.entry_fee))
            console.log('2 condition',(+winning_amount) > (+req.body.entry_fee))
                pool.query(`select leagueid , matchid , entry_fee , member , bonus , prize_pool , team_entry , member_joined , status from contests where id  ='${req.body.contestsid}'`,(err,result)=>{
                    if(err) throw err;
                    else {
                        data = result
                        let member = result[0].member
                        let member_joined = result[0].member_joined
                
                        if((+result[0].member) > (+result[0].member_joined)){
                            console.log('yeh chla')
                           pool.query(`insert into join_contests set ?`,body,(err,result)=>{
                               if(err) throw err;
                               else {
    
    
            pool.query(`update contests set member_joined = member_joined+1 where id = '${req.body.contestsid}'`,(err,result)=>{
                if(err) throw err;
                else {
                    pool.query(`insert into transcations (name , number , date , amount , color , sign) values('Joined Contest','${req.body.number}','${today}', '${req.body.entry_fee}','red','-')`,(err,result)=>{
                        if(err) throw err;
                        else {
                           if(deposit_cash >= req.body.entry_fee){
                               console.log('first')
                               pool.query(`update users set deposit_cash = deposit_cash-${req.body.entry_fee} where number = '${req.body.number}'`,(err,result)=>{
                                   if(err) throw err;
                                   else {
                                       if(member==((+member_joined)+1)) {
                                           data[0].member_joined = 0;
                                           data[0].status = 'not_completed'
                                           pool.query(`insert into contests set ?`,data,(err,result)=>{
                                               if(err) throw err;
                                               else {
                                                   res.json({
                                                       msg : 'joined successfuly',
                                                       des:'create'
                                                   })
                                               }
                                           })
                                      }
                                      else {
                                          res.json({
                                              msg : 'joined successfuly'
                                          })
                                      }
                               
                                   }
                               })
    
                           } 
                           else if((+winning_amount) >= (+req.body.entry_fee)){
                               console.log('second')
                               pool.query(`update users set winning_amount = winning_amount-${req.body.entry_fee} where number = '${req.body.number}'`,(err,result)=>{
                                   if(err) throw err;
                                   else {
                                       if(member==((+member_joined)+1)) {
                                           data[0].member_joined = 0;
                                           data[0].status = 'not_completed'
                                           pool.query(`insert into contests set ?`,data,(err,result)=>{
                                               if(err) throw err;
                                               else {
                                                   res.json({
                                                       msg : 'joined successfuly',
                                                       des:'create'
                                                   })
                                               }
                                           })
                                      }
                                      else {
                                          res.json({
                                              msg : 'joined successfuly'
                                          })
                                      }
                               
                                   }
                               })
    
    
                           }
                           else if(((+deposit_cash) +(+ winning_amount)) >= (+req.body.entry_fee)){
                               console.log('third')
                               let remaining_amount = req.body.entry_fee - deposit_cash
                               let deposit_deduct_amount = req.body.entry_fee - remaining_amount
                               pool.query(`update users set deposit_cash = deposit_cash-${deposit_deduct_amount} , winning_amount = winning_amount-${remaining_amount} where number = '${req.body.number}'`,(err,result)=>{
                                   if(err) throw err;
                                   else {
                                       if(member==((+member_joined)+1)) {
                                           data[0].member_joined = 0;
                                           data[0].status = 'not_completed'
                                           pool.query(`insert into contests set ?`,data,(err,result)=>{
                                               if(err) throw err;
                                               else {
                                                   res.json({
                                                       msg : 'joined successfuly',
                                                       des:'create'
                                                   })
                                               }
                                           })
                                      }
                                      else {
                                          res.json({
                                              msg : 'joined successfuly'
                                          })
                                      }
                               
                                   }
                               })
    
    
    
                           }
                           // if(member_joined==2) {
                           //      data['member_joined'] = 0;
                           //      data['status'] = 'not_completed'
                           //      pool.query(`insert into contests set ?`,data,(err,result)=>{
                           //          if(err) throw err;
                           //          else {
                           //              res.json({
                           //                  msg : 'joined successfuly'
                           //              })
                           //          }
                           //      })
                           // }
                           // else {
                           //     res.json({
                           //         msg : 'joined successfuly'
                           //     })
                           // }
                        }
                    })
                }
            })
    
    
    
    //yaha tk h
    
                              
                               }
    
    //yaha
    
                           })
                        }
                        else{
                            console.log('already full')
                            //console.log('inserted data',data[0])
                            data[0].member_joined = 0;
                            data[0].status = 'not_completed'
                            pool.query(`insert into contests set ?`,data,(err,result)=>{
                                if(err) throw err;
                                else {
                                    res.json({
                                        msg : 'contests full',
                                        des:'create'
                                    })
                                }
                            })
                        }
                    }
                })
    
            }
            else {
                res.json({
                    msg : 'wallet low'
                })
    
            }
        })

    }
})


    
})





router.post('/my-contests',(req,res)=>{
    pool.query(`select distinct j.contestsid , j.entry_fee, j.id,
    (select c.member from contests c where c.id = j.contestsid) as total_member,
    (select c.member_joined from contests c where c.id = j.contestsid) as total_member_joined,
    (select c.prize_pool from contests c where c.id = j.contestsid) as total_win,
    (select u.name from users u where u.number = '${req.body.number}') as usernmame
    from join_contests j where j.number = '${req.body.number}' and j.leagueid= '${req.body.leagueid}' and j.matchid = '${req.body.matchid}'`,(err,result)=>{
        if(err) throw err;
        else res.json(result)
    })
})




// router.post('/my-contests',(req,res)=>{
//     pool.query(`select j.* ,
//     (select c.member from contests c where c.id = j.contestsid) as total_member,
//     (select c.member_joined from contests c where c.id = j.contestsid) as total_member_joined,
//     (select c.prize_pool from contests c where c.id = j.contestsid) as total_win,
//     (select u.name from users u where u.number = '${req.body.number}') as usernmame,
//     (select t.teamname from myteams t where t.id = j.teamid) as jointeamname
//     from join_contests j where j.number = '${req.body.number}' and j.leagueid= '${req.body.leagueid}' and j.matchid = '${req.body.matchid}'`,(err,result)=>{
//         if(err) throw err;
//         else res.json(result)
//     })
// })

router.post('/upcoming-match',(req,res)=>{
   
    pool.query(`select  distinct j.matchid , j.leagueid,
    (select t.short_name from teams t where t.id = (select m.team1 from matches m where m.id = j.matchid)) as team1name,
    (select t.short_name from teams t where t.id = (select m.team2 from matches m where m.id = j.matchid)) as team2name,
    (select t.logo from teams t where t.id = (select m.team1 from matches m where m.id = j.matchid)) as team1logo,
    (select t.logo from teams t where t.id = (select m.team2 from matches m where m.id = j.matchid)) as team2logo,
    (select lineup_status from matches m where m.id = j.matchid) as  teamlineupstatus,
    (select l.name from leauges l where l.id = j.leagueid) as leaguename,
    (select (TIMESTAMPDIFF(MINUTE, now() , concat(m.date, ' ', m.time))-330)*60 from matches m where m.id = j.matchid)  as timeleft
    from join_contests j where j.number = '${req.body.number}' and (select m.status from matches m where m.id=j.matchid) = 'upcoming';`,(err,result)=>{
        if(err) throw err;
        else res.json(result)
    })
})


router.post('/live-match',(req,res)=>{
    pool.query(`select  distinct j.matchid , j.leagueid,
    (select t.short_name from teams t where t.id = (select m.team1 from matches m where m.id = j.matchid)) as team1name,
    (select t.short_name from teams t where t.id = (select m.team2 from matches m where m.id = j.matchid)) as team2name,
    (select t.logo from teams t where t.id = (select m.team1 from matches m where m.id = j.matchid)) as team1logo,
    (select t.logo from teams t where t.id = (select m.team2 from matches m where m.id = j.matchid)) as team2logo,
    (select m.date from matches m where m.id = j.matchid) as  matchdate,
    (select m.type from matches m where m.id = j.matchid) as  matchtype,
    (select l.name from leauges l where l.id = j.leagueid) as leaguename
    from join_contests j where j.number = '${req.body.number}' and (select m.status from matches m where m.id=j.matchid) = 'live' order by matchdate desc limit 20;`,(err,result)=>{
        if(err) throw err;
        else res.json(result)
    })
})


router.post('/completed-match',(req,res)=>{
    pool.query(`select  distinct j.matchid , j.leagueid,
    (select t.short_name from teams t where t.id = (select m.team1 from matches m where m.id = j.matchid)) as team1name,
    (select t.short_name from teams t where t.id = (select m.team2 from matches m where m.id = j.matchid)) as team2name,
    (select t.logo from teams t where t.id = (select m.team1 from matches m where m.id = j.matchid)) as team1logo,
    (select t.logo from teams t where t.id = (select m.team2 from matches m where m.id = j.matchid)) as team2logo,
    (select m.date from matches m where m.id = j.matchid) as  matchdate,
    (select l.name from leauges l where l.id = j.leagueid) as leaguename
    from join_contests j where j.number = '${req.body.number}' and (select m.status from matches m where m.id=j.matchid) = 'completed' || j.number = '${req.body.number}' and (select m.status from matches m where m.id=j.matchid) = 'abonded' order by matchdate desc limit 20;`,(err,result)=>{
        if(err) throw err;
        else res.json(result)
    })
})




router.post('/get-team-players',(req,res)=>{
    pool.query(`select p.* , 
    (select t.short_name from teams t where t.id = p.teamid) as teamname ,
    (select l.status from lineups l where p.id = l.playerid and l.matchid='${req.body.matchid}' ) as playerstatus,
    (select l.color from lineups l where p.id = l.playerid and l.matchid='${req.body.matchid}' ) as playercolor
    from players p where  p.teamid = '${req.body.team1id}' ||
     p.teamid = '${req.body.team2id}'`,(err,result)=>{
        if(err) throw err;
        else res.json(result)
    })
})

// For lineups query

//select p.* , (select t.short_name from teams t where t.id = p.teamid) as teamname,
// (select l.player from lineups l where p.id = l.player and l.matchid='1'  ) as playeron
//(select l.status from lineups l where p.id = l.playerid and l.matchid='${req.session.matchid}' ) as playerstatus 
// from players p where p.type = 'Wicket Keeper' and p.teamid = '1' ||
//    p.type = 'Wicket Keeper' and p.teamid = '2'


router.post('/get-selected-players',(req,res)=>{
    pool.query(`select p.* , (select t.short_name from teams t where t.id = p.teamid) as teamname from players p where p.id = '${req.body.player1}' || p.id = '${req.body.player2}'
    || p.id = '${req.body.player3}' || p.id = '${req.body.player4}' || p.id = '${req.body.player5}' || p.id = '${req.body.player6}' || p.id = '${req.body.player7}'
    || p.id = '${req.body.player8}' || p.id = '${req.body.player9}' || p.id = '${req.body.player10}' || p.id = '${req.body.player11}'`,(err,result)=>{
        if(err) throw err;
        else res.json(result)
    })
})





router.post('/single-contests',(req,res)=>{
    pool.query(`select j.* ,
    (select u.name from users u where u.number = j.number) as username,
       (select c.member from contests c where c.id = '${req.body.contestsid}') as total_member,
        (select c.member_joined from contests c where c.id = '${req.body.contestsid}') as total_member_joined,
        (select c.prize_pool from contests c where c.id = '${req.body.contestsid}') as total_win,
        (select t.teamname from myteams t where t.id = j.teamid) as myteamname,
        (select m.update_points from matches m where m.id = j.matchid) as matchupdate,
        (select t.playerpoints from myteams t where t.id = j.teamid) as myteamplayerpoints
     from join_contests j where j.contestsid = '${req.body.contestsid}' order by (select t.playerpoints from myteams t where t.id = j.teamid) desc`,(err,result)=>{
         if(err) throw err;
         else res.json(result)
     })
})



router.post('/upcoming-contests-detailed',(req,res)=>{
    pool.query(`select j.* ,
    (select u.name from users u where u.number = j.number) as username,
       (select c.member from contests c where c.id = '${req.body.contestsid}') as total_member,
        (select c.member_joined from contests c where c.id = '${req.body.contestsid}') as total_member_joined,
        (select c.prize_pool from contests c where c.id = '${req.body.contestsid}') as total_win,
        (select t.teamname from myteams t where t.id = j.teamid) as myteamname,
        (select m.update_points from matches m where m.id = j.matchid) as matchupdate,
        (select t.playerpoints from myteams t where t.id = j.teamid) as myteamplayerpoints
     from join_contests j where j.contestsid = '${req.body.contestsid}' order by j.number = '${req.body.number}' desc`,(err,result)=>{
         if(err) throw err;
         //else console.log(result)
         else res.json(result)
     })
})



router.post('/razorpay',(req,res)=>{
    const url = `https://rzp_live_2AYlv8GRAaT63p:iIzpixX7YsDSUVPtAtbO5SMn@api.razorpay.com/v1/orders/`;
      const data = {
          amount:req.body.amount,  // amount in the smallest currency unit
       // amount:100,
        currency: 'INR',
          payment_capture: true
      }
      console.log('data',data)
      const options = {
          method: 'POST',
          body: JSON.stringify(data),
          headers: {
              'Content-Type': 'application/json'
          }
      }
      fetch(url, options)
          .then(res => res.json())
          .then(
              resu => res.send(resu)
          );
   })



   router.post('/razorpay_response',(req,res)=>{


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


    let body = req.body
    let extra = (req.body.amount*10)/100;
    console.log(req.body)
    if((+req.body.amount)>500){
  body['bonus'] = 250
    }
    else{
        body['bonus'] = (req.body.amount*25)/100
    }
  
    body['date'] = today
    console.log('response',req.body)

pool.query(`select * from deposit_cash where number = '${req.body.number}'`,(err,result)=>{
    if(err) throw err;
    else if(result[0]){


        pool.query(`insert into deposit_cash set ?`,req.body , (err,result)=>{
            if(err) throw err;
            else {
                pool.query(`update users set deposit_cash = deposit_cash+${req.body.amount}+${extra}  where number = '${req.body.number}'`,(err,result)=>{
                     if(err) throw err;
                     else {
                         pool.query(`insert into transcations (name , number , date , amount , color , sign) values('Deposit Cash','${req.body.number}','${today}', '${req.body.amount}','green','+')`,(err,result)=>{
                             if(err) throw err;
                             else {
                                pool.query(`insert into transcations (name , number , date , amount , color , sign) values('Deposit Bonus','${req.body.number}','${today}', '${extra}','green','+')`,(err,result)=>{
                                    if(err) throw err;
                                    else {
                                        res.json({
                                            msg :'success'
                                        })
                                    }
                                })
    
    
                             }
                         })
    
                     }
                })
            }
        })
        
        
        
       

    }
    else{

        pool.query(`insert into deposit_cash set ?`,req.body , (err,result)=>{
            if(err) throw err;
            else {
                pool.query(`update users set deposit_cash = deposit_cash+${req.body.amount}+${req.body.bonus}  where number = '${req.body.number}'`,(err,result)=>{
                     if(err) throw err;
                     else {
                         pool.query(`insert into transcations (name , number , date , amount , color , sign) values('Deposit Cash','${req.body.number}','${today}', '${req.body.amount}','green','+')`,(err,result)=>{
                             if(err) throw err;
                             else {
                                
    
    
                                pool.query(`insert into transcations (name , number , date , amount , color , sign) values('Deposit Bonus','${req.body.number}','${today}', '${req.body.bonus}','green','+')`,(err,result)=>{
                                    if(err) throw err;
                                    else {
                                        res.json({
                                            msg :'success'
                                        })
                                    }
                                })
    
    
                             }
                         })
    
                     }
                })
            }
        })
        
        
        
       

    }
})

    
        })
   


router.get('/razorpay-open',(req,res)=>{
    res.render('razorpay')
})        
 


router.get('/success-payment',(req,res)=>{
    res.json({
        msg : 'success'
    })
})


router.get('/failed-payment',(req,res)=>{
    res.json({
        msg : 'failed'
    })
})



router.post('/save-team',(req,res)=>{
    let body = req.body

    pool.query(`select teamname from myteams where number ='${req.body.number}' and matchid = '${req.body.matchid}' and leagueid = '${req.body.leagueid}' order by id desc limit 1`,(err,result)=>{
        if(err) throw err;
        else if(result[0]){
  body['teamname'] = (+result[0].teamname) + 1;
  body['playerpoints'] = 0
  pool.query(`insert into myteams set ?`,body,(err,result)=>{
    if(err) throw err;
    else res.json({
        msg : 'success'
    })
})
        }
        else{
  body['teamname'] = 1;
  body['playerpoints'] = 0
  pool.query(`insert into myteams set ?`,body,(err,result)=>{
    if(err) throw err;
    else res.json({
        msg : 'success'
    })
})
        }
    })
  
})



router.post('/edit-team',(req,res)=>{
    let body = req.body
    console.log('body aa rhi h',req.body)

pool.query(`select matchid from myteams where id = '${req.body.id}'`,(err,result)=>{
    if(err) throw err;
    else {
        pool.query(`select status from matches where id = '${result[0].matchid}'`,(err,result)=>{
            if(err) throw err;
            else if(result[0].status == 'live' || result[0].status == 'completed'){
                console.log('match live...you do not change the team')
            }
            else {
               console.log('yes you can change the team')
               pool.query(`update myteams set ? where id = ?`, [req.body, req.body.id], (err, result) => {
                if(err) throw err;
                else res.json({
                    msg : 'success'
                })
            })
            }
        })
    }
})

   
})


router.post('/show-my-teams',(req,res)=>{
    pool.query(`select m.id , 
    (select p.name from players p where p.id = m.captain) as captainame,
    (select v.name from players v where v.id = m.vicecaptain) as vicecaptainname,
    (select count(id) from join_contests where number = '${req.body.number}' and matchid = '${req.body.matchid}' and contestsid = '${req.body.contestsid}') as counter ,
    (select id from join_contests v where v.teamid = m.id and v.number = '${req.body.number}' and v.leagueid = '${req.body.leagueid}' and v.matchid = '${req.body.matchid}' and v.contestsid = '${req.body.contestsid}' ) as isalreadyjoin
    from myteams m where number = '${req.body.number}' and leagueid = '${req.body.leagueid}' and matchid = '${req.body.matchid}'`,(err,result)=>{
        if(err) throw err;
        else res.json(result)
    })
})



router.post('/get-single-team',(req,res)=>{
    var query = `select * from players where
    id =(select player1 from myteams where id = '${req.body.id}') ||
    id =(select player2 from myteams where id = '${req.body.id}') ||
    id =(select player3 from myteams where id = '${req.body.id}') ||
    id =(select player4 from myteams where id = '${req.body.id}') ||
    id =(select player5 from myteams where id = '${req.body.id}') ||
    id =(select player6 from myteams where id = '${req.body.id}') ||
    id =(select player7 from myteams where id = '${req.body.id}') ||
    id =(select player8 from myteams where id = '${req.body.id}')  ||
    id =(select player9 from myteams where id = '${req.body.id}') ||
    id =(select player10 from myteams where id = '${req.body.id}') ||
    id =(select player11 from myteams where id = '${req.body.id}');`
    var query1=`select * from players where id = (select captain from myteams where id = '${req.body.id}');`
    var query2 = `select * from players where id = (select vicecaptain from myteams where id = '${req.body.id}');`
    pool.query(query+query1+query2,(err,result)=>{
        if(err) throw err;
        else res.json(result)
    })
})









router.post('/get-edit-team',(req,res)=>{
    var query = `select p.* ,
    (select t.name from teams t where t.id = p.teamid) as teamname
    from players p where
    p.id =(select player1 from myteams where id = '${req.body.id}') ||
    p.id =(select player2 from myteams where id = '${req.body.id}') ||
    p.id =(select player3 from myteams where id = '${req.body.id}') ||
    p.id =(select player4 from myteams where id = '${req.body.id}') ||
    p.id =(select player5 from myteams where id = '${req.body.id}') ||
    p.id =(select player6 from myteams where id = '${req.body.id}') ||
    p.id =(select player7 from myteams where id = '${req.body.id}') ||
    p.id =(select player8 from myteams where id = '${req.body.id}')  ||
    p.id =(select player9 from myteams where id = '${req.body.id}') ||
    p.id =(select player10 from myteams where id = '${req.body.id}') ||
    p.id =(select player11 from myteams where id = '${req.body.id}');`
  
    pool.query(query,(err,result)=>{
        if(err) throw err;
        else res.json(result)
    })
})




router.post('/withdrawl-request',(req,res)=>{


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


    let body = req.body
    body['status'] = 'pending'
    

    if(req.body.registered_number){



        pool.query(`insert into withdrawl_request set ?`,body,(err,result)=>{
            if(err) throw err;
            else{
                pool.query(`insert into transcations (name,number,date,amount,color,sign) values('Withdrawl','${req.body.number}','${today}','${req.body.amount}','red','-')`,(err,result)=>{
                    if(err) throw err;
                    else{
    
                 pool.query(`update users set winning_amount = winning_amount-${req.body.amount} where number = '${req.body.registered_number}'`,(err,result)=>{
                     if(err) throw err;
                     else{
                        res.json({
                            status : 200,
                            type:'success' 
                        })
                     }
                 })
    
                   
                    }
                  })  
                
             
            }
        })



    }
    else{



        pool.query(`insert into withdrawl_request set ?`,body,(err,result)=>{
            if(err) throw err;
            else{
                pool.query(`insert into transcations (name,number,date,amount,color,sign) values('Withdrawl','${req.body.number}','${today}','${req.body.amount}','red','-')`,(err,result)=>{
                    if(err) throw err;
                    else{
    
                 pool.query(`update users set winning_amount = winning_amount-${req.body.amount} where number = '${req.body.number}'`,(err,result)=>{
                     if(err) throw err;
                     else{
                        res.json({
                            status : 200,
                            type:'success' 
                        })
                     }
                 })
    
                   
                    }
                  })  
                
             
            }
        })


    }

            
})



router.post('/update-match-status', (req, res) => {
    let body = req.body;

   pool.query(`update matches set ? where id = ?`, [req.body, req.body.id], (err, result) => {
        if(err) throw err;
       else {
            res.json({
                status:'200',
                result:result,
                description:'success'
            })
        }
    })
})





// router.post('/match-live-kro',(req,res)=>{


//     let body = req.body;

//    pool.query(`update matches set ? where id = ?`, [req.body, req.body.id], (err, result) => {
//         if(err) throw err;
//        else {
           
//         pool.query(`select distinct contestsid from join_contests where matchid = '${req.body.id}'`,(err,result)=>{
//             if(err) throw err;
//             else if(result[0]){
//                 for(i=0;i<result.length;i++){
//                     let contestsid = result[i].contestsid
//                     pool.query(`select c.* , (select j.number from join_contests j where j.contestsid = '${contestsid}') as usernumber from contests c where c.id = '${contestsid}'`,(err,result)=>{
//                         if(err) throw err;
//                         else {
  

// for(i=0;i<result.length;i++){
//      let entry_fee = result[i].entry_fee
//     let usernumber = result[i].usernumber

//     if(result[i].member == result[i].member_joined){
//         console.log('contest full')
//     }
//     else{
//         console.log('refunded number',usernumber)
// pool.query(`update users set winning_amount = winning_amount+'${result[0].entry_fee}' where number = '${usernumber}'`,(err,data)=>{
//    if(err) throw err;
//    else {
//     pool.query(`insert into transcations (name,number,date,amount,color,sign) values('Contests Refund','${usernumber}','${today}','${entry_fee}','green','+')`,(err,data)=>{
//        if(err) throw err;
//        else {
//           pool.query(`delete from join_contests where contestsid = '${contestsid}'`,(err,result)=>{
//               if(err) throw err;
//               else console.log('done')
//           })
//        }
//     })
//    }
// })
//     }


// }

    
//                         }
//                     })
               
//                 }
//                 res.json({
//                     msg : 'success'
//                 })
    
//             }
//             else{
//                 res.json({
//                     msg : 'success'
//                 })
//             }
    
//         })


//         }

//     })

    
// })







router.post('/match-live-kro',(req,res)=>{
  let body = req.body;
  
       pool.query(`update matches set ? where id = ?`, [req.body, req.body.id], (err, result) => {
            if(err) throw err;
           else {
               res.json('success');
               
           }
        
    })

})
    


    





router.post('/get-single-team-with-points',(req,res)=>{
    var query = `select p.*,
    (select l.player_points from lineups l  where p.id = l.playerid and l.matchid = '${req.body.matchid}') as playerpoints from players p  where
    p.id =(select player1 from myteams where id = '${req.body.id}' and matchid = '${req.body.matchid}')  ||
    p.id =(select player2 from myteams where id = '${req.body.id}' and matchid = '${req.body.matchid}')  ||
    p.id =(select player3 from myteams where id = '${req.body.id}' and matchid = '${req.body.matchid}')  ||
    p.id =(select player4 from myteams where id = '${req.body.id}' and matchid = '${req.body.matchid}')  ||
    p.id =(select player5 from myteams where id = '${req.body.id}' and matchid = '${req.body.matchid}')  ||
    p.id =(select player6 from myteams where id = '${req.body.id}' and matchid = '${req.body.matchid}')  ||
    p.id =(select player7 from myteams where id = '${req.body.id}' and matchid = '${req.body.matchid}')  ||
    p.id =(select player8 from myteams where id = '${req.body.id}' and matchid = '${req.body.matchid}')  ||
    p.id =(select player9 from myteams where id = '${req.body.id}' and matchid = '${req.body.matchid}')  ||
    p.id =(select player10 from myteams where id = '${req.body.id}' and matchid = '${req.body.matchid}') ||
    p.id =(select player11 from myteams where id = '${req.body.id}' and matchid = '${req.body.matchid}') ;`
    var query1=`select p.* , (select l.player_points from lineups l  where p.id = l.playerid and l.matchid = '${req.body.matchid}') as playerpoints from players p
    where p.id =(select captain from myteams  where id = '${req.body.id}' and matchid = '${req.body.matchid}') ;`
    var query2 = `select p.* , (select l.player_points from lineups l  where p.id = l.playerid and l.matchid = '${req.body.matchid}') as playerpoints from players p
    where p.id =(select vicecaptain from myteams  where id = '${req.body.id}' and matchid = '${req.body.matchid}') ;`
    pool.query(query+query1+query2,(err,result)=>{
        if(err) throw err;
        else {
            res.json(result)
          //  console.log('res',result)
        }
    })
})




router.post('/switch-teams',(req,res)=>{
    pool.query(`update join_contests set teamid = '${req.body.teamid}' where contestsid = '${req.body.contestsid}' and leagueid = '${req.body.leagueid}' and matchid = '${req.body.matchid}'`,(err,result)=>{
        if(err) throw err;
        else res.json({
            msg:'success'
        })
    })
})




router.post('/send-notification',async(req,res)=>{
  pool.query(`select token from users where token is not null`,(err,result)=>{
        if(err) throw err;
   
        else {
            for(i=0;i<result.length;i++) {
                console.log(result[i].token)
                const message = {
                    to: result[i].token,
                    sound: 'default',
                    title: req.body.title,
                    body: req.body.message,
                    data: { someData: 'goes here' },
                  };

                  //request.post('https://exp.host/--/api/v2/push/send').form({message})   
// request.post({url:'https://exp.host/--/api/v2/push/send',body: JSON.stringify(message)} , function(err,httpResponse,data){
//     console.log('sending data',body)
//     if(err) throw err;
//     else res.json(data)
//  })
                
                   fetch('https://exp.host/--/api/v2/push/send', {
                    method: 'POST',
                    headers: {
                      Accept: 'application/json',
                      'Accept-encoding': 'gzip, deflate',
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(message),
                  });
                

            }
            res.json({
                msg : 'success'
            })
        }
    })
})






router.get('/bet-match-details',(req,res)=>{
    pool.query(`select * from matches where id = '${req.body.betid}'`,(err,result)=>{
        if(err) throw err;
        else res.json(result)
    })
})





router.post('/bet-contests',(req,res)=>{


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


    let body = req.body
    console.log('body',req.body)
    pool.query(`select * from users where number ='${req.body.number}'`,(err,result)=>{
        if(err) throw err;
        else if(((+result[0].deposit_cash) + (+result[0].winning_amount) ) > req.body.entry_fee){
                              //  let referral_code = result[0].refferal_code
                let deposit_cash = result[0].deposit_cash
                let winning_amount = result[0].winning_amount
               console.log(result[0].bonus)
                let user_bonus

                if((+result[0].bonus)  >= (+req.body.entry_fee)/10){
                     user_bonus = result[0].bonus
                     bonus_used = (req.body.entry_fee)/10;
                     user_amount_use = req.body.entry_fee - bonus_used
                }
                else {
                     user_bonus = result[0].bonus
                     bonus_used = result[0].bonus
                     user_amount_use = req.body.entry_fee - bonus_used
                }

        
         

            if((+deposit_cash) > (+user_amount_use)){
                pool.query(`update users set deposit_cash = deposit_cash-${user_amount_use} , bonus = bonus-${bonus_used}  where number = '${req.body.number}'`,(err,result)=>{
                  if(err) throw err;
                  else {
                    pool.query(`insert into transcations (name , number , date , amount , color , sign) values('Betting','${req.body.number}','${today}', '${req.body.entry_fee}','red','-')`,(err,result)=>{
                    if(err) throw err;
                    else {
                        pool.query(`insert into bet_join set ?`,body,(err,result)=>{
                            if(err) throw err;
                            else {
                                res.json({
                                    msg : 'success'
                                })
                            }
                        })
                    }

                    })
                  }     
                    

                })
    

            }
            else if((+winning_amount) > (+user_amount_use)){


                pool.query(`update users set winning_amount = winning_amount-${user_amount_use} ,  bonus = bonus-${bonus_used}  where number = '${req.body.number}'`,(err,result)=>{
                    if(err) throw err;
                    else {
                      pool.query(`insert into transcations (name , number , date , amount , color , sign) values('Betting','${req.body.number}','${today}', '${req.body.entry_fee}','red','-')`,(err,result)=>{
                      if(err) throw err;
                      else {
                          pool.query(`insert into bet_join set ?`,body,(err,result)=>{
                              if(err) throw err;
                              else {
                                  res.json({
                                      msg : 'success'
                                  })
                              }
                          })
                      }
  
                      })
                    }     
                      
  
                  })
            }
            else if(((+deposit_cash) +(+ winning_amount)) > (+user_amount_use)){

                let remaining_amount = user_amount_use - deposit_cash
                let deposit_deduct_amount = user_amount_use - remaining_amount
                pool.query(`update users set deposit_cash = deposit_cash-${deposit_deduct_amount} , winning_amount = winning_amount-${remaining_amount} ,  bonus = bonus-${bonus_used}  where number = '${req.body.number}'`,(err,result)=>{
                                   if(err) throw err;
                    else {
                      pool.query(`insert into transcations (name , number , date , amount , color , sign) values('Betting','${req.body.number}','${today}', '${req.body.entry_fee}','red','-')`,(err,result)=>{
                      if(err) throw err;
                      else {
                          pool.query(`insert into bet_join set ?`,body,(err,result)=>{
                              if(err) throw err;
                              else {
                                  res.json({
                                      msg : 'success'
                                  })
                              }
                          })
                      }
  
                      })
                    }     
                      
  
                  })
            }


        }
        else{
            res.json({
                msg : 'wallet low'
            })
         }
            })
})







router.post('/show-single-bet-matches',(req,res)=>{
    
    pool.query(`select m.*, (select t.short_name from teams t where t.id=m.team1) as team1name,
(select t.short_name from teams t where t.id=m.team2) as team2name,
(select l.name from leauges l where l.id = m.leagueid) as leaguename,
(select t.logo from teams t where t.id=m.team1) as team1logo,
(select t.logo from teams t where t.id=m.team2) as team2logo,
(TIMESTAMPDIFF(MINUTE, now() , concat(m.date, ' ', m.time))-330)*60 as timeleft,
(select sum(hold) from bet_join where teamid = '${req.body.team1id}' and matchid = '${req.body.id}' ) as team1hold,
(select sum(hold) from bet_join where teamid = '${req.body.team2id}' and matchid = '${req.body.id}' ) as team2hold,
(select sum(entry_fee) from bet_join where  matchid = '${req.body.id}' ) as teamholdprice
   from matches m  where m.id = '${req.body.id}'`,(err,result)=>{
    err ? console.log(err) : res.json(result)
})
})

// router.post('/bet-contests',(req,res)=>{
//     let body = req.body
//     body['status'] = 'upcoming'
//     body['send_amount'] = ''
//     console.log('data aa rha h',req.body)
//  //   let commision = (req.body.entry_fee*2)/100;
//     let data = []

    



//         pool.query(`select * from users where number = '${req.body.number}'`,(err,result)=>{
//             if(err) throw err;
//             else if(((+result[0].deposit_cash) + (+result[0].winning_amount) ) > req.body.entry_fee){
//                 let referral_code = result[0].refferal_code
//                 let deposit_cash = result[0].deposit_cash
//                 let winning_amount = result[0].winning_amount
//             console.log('deposit cash',deposit_cash)
//             console.log('winning amount',winning_amount)
//             console.log('entry fee',req.body.entry_fee)
//             console.log('1 condition',(+deposit_cash) > (+req.body.entry_fee))
//             console.log('2 condition',(+winning_amount) > (+req.body.entry_fee))
//                 pool.query(`select leagueid , matchid , entry_fee , member , bonus , prize_pool , team_entry , member_joined , status from contests where id  ='${req.body.contestsid}'`,(err,result)=>{
//                     if(err) throw err;
//                     else {
//                         data = result
//                         let member = result[0].member
//                         let member_joined = result[0].member_joined
                
//                         if((+result[0].member) > (+result[0].member_joined)){
//                             console.log('yeh chla')
//                            pool.query(`insert into join_contests set ?`,body,(err,result)=>{
//                                if(err) throw err;
//                                else {
    
    
//     pool.query(`select number,percentage from users where unique_code = '${referral_code}'`,(err,result)=>{
//         if(err) throw err;
//         else if(result[0]){
//             let referral_number = result[0].number
//             let commision = (req.body.entry_fee*result[0].percentage)/100;
//             console.log('commission',commision)
//             pool.query(`update users set deposit_cash = deposit_cash+${commision} where unique_code = '${referral_code}'`,(err,result)=>{
//                 if(err) throw err;
//                 else {
//                     pool.query(`insert into transcations (name , number , date , amount , color , sign) values('Referal Bonus','${referral_number}','${today}', '${commision}','green','+')`,(err,result)=>{
//                         if(err) throw err;
//                         else {
            
    
    
//                             pool.query(`update contests set member_joined = member_joined+1 where id = '${req.body.contestsid}'`,(err,result)=>{
//                                 if(err) throw err;
//                                 else {
//                                     pool.query(`insert into transcations (name , number , date , amount , color , sign) values('Joined Contest','${req.body.number}','${today}', '${req.body.entry_fee}','red','-')`,(err,result)=>{
//                                         if(err) throw err;
//                                         else {
//                                            if((+deposit_cash) > (+req.body.entry_fee)){
//                                                console.log('first')
//                                                pool.query(`update users set deposit_cash = deposit_cash-${req.body.entry_fee} where number = '${req.body.number}'`,(err,result)=>{
//                                                    if(err) throw err;
//                                                    else {
//                                                        if(member==((+member_joined)+1)) {
//                                                            data[0].member_joined = 0;
//                                                            data[0].status = 'not_completed'
//                                                            pool.query(`insert into contests set ?`,data,(err,result)=>{
//                                                                if(err) throw err;
//                                                                else {
//                                                                    res.json({
//                                                                        msg : 'joined successfuly',
//                                                                        des:'create'
//                                                                    })
//                                                                }
//                                                            })
//                                                       }
//                                                       else {
//                                                           res.json({
//                                                               msg : 'joined successfuly'
//                                                           })
//                                                       }
                                               
//                                                    }
//                                                })
    
//                                            } 
//                                            else if((+winning_amount) > (+req.body.entry_fee)){
//                                                console.log('second')
//                                                pool.query(`update users set winning_amount = winning_amount-${req.body.entry_fee} where number = '${req.body.number}'`,(err,result)=>{
//                                                    if(err) throw err;
//                                                    else {
//                                                        if(member==((+member_joined)+1)) {
//                                                            data[0].member_joined = 0;
//                                                            data[0].status = 'not_completed'
//                                                            pool.query(`insert into contests set ?`,data,(err,result)=>{
//                                                                if(err) throw err;
//                                                                else {
//                                                                    res.json({
//                                                                        msg : 'joined successfuly',
//                                                                        des:'create'
//                                                                    })
//                                                                }
//                                                            })
//                                                       }
//                                                       else {
//                                                           res.json({
//                                                               msg : 'joined successfuly'
//                                                           })
//                                                       }
                                               
//                                                    }
//                                                })
    
    
//                                            }
//                                            else if(((+deposit_cash) +(+ winning_amount)) > (+req.body.entry_fee)){
//                                                console.log('third')
//                                                let remaining_amount = req.body.entry_fee - deposit_cash
//                                                let deposit_deduct_amount = req.body.entry_fee - remaining_amount
//                                                pool.query(`update users set deposit_cash = deposit_cash-${deposit_deduct_amount} , winning_amount = winning_amount-${remaining_amount} where number = '${req.body.number}'`,(err,result)=>{
//                                                    if(err) throw err;
//                                                    else {
//                                                        if(member==((+member_joined)+1)) {
//                                                            data[0].member_joined = 0;
//                                                            data[0].status = 'not_completed'
//                                                            pool.query(`insert into contests set ?`,data,(err,result)=>{
//                                                                if(err) throw err;
//                                                                else {
//                                                                    res.json({
//                                                                        msg : 'joined successfuly',
//                                                                        des:'create'
//                                                                    })
//                                                                }
//                                                            })
//                                                       }
//                                                       else {
//                                                           res.json({
//                                                               msg : 'joined successfuly'
//                                                           })
//                                                       }
                                               
//                                                    }
//                                                })
    
    
    
//                                            }
//                                            // if(member_joined==2) {
//                                            //      data['member_joined'] = 0;
//                                            //      data['status'] = 'not_completed'
//                                            //      pool.query(`insert into contests set ?`,data,(err,result)=>{
//                                            //          if(err) throw err;
//                                            //          else {
//                                            //              res.json({
//                                            //                  msg : 'joined successfuly'
//                                            //              })
//                                            //          }
//                                            //      })
//                                            // }
//                                            // else {
//                                            //     res.json({
//                                            //         msg : 'joined successfuly'
//                                            //     })
//                                            // }
//                                         }
//                                     })
//                                 }
//                             })
    
    
//                         }                        
//                     })
//                 }
//             })
//         }
//         else{
    
    
//             pool.query(`update contests set member_joined = member_joined+1 where id = '${req.body.contestsid}'`,(err,result)=>{
//                 if(err) throw err;
//                 else {
//                     pool.query(`insert into transcations (name , number , date , amount , color , sign) values('Joined Contest','${req.body.number}','${today}', '${req.body.entry_fee}','red','-')`,(err,result)=>{
//                         if(err) throw err;
//                         else {
//                            if(deposit_cash > req.body.entry_fee){
//                                console.log('first')
//                                pool.query(`update users set deposit_cash = deposit_cash-${req.body.entry_fee} where number = '${req.body.number}'`,(err,result)=>{
//                                    if(err) throw err;
//                                    else {
//                                        if(member==((+member_joined)+1)) {
//                                            data[0].member_joined = 0;
//                                            data[0].status = 'not_completed'
//                                            pool.query(`insert into contests set ?`,data,(err,result)=>{
//                                                if(err) throw err;
//                                                else {
//                                                    res.json({
//                                                        msg : 'joined successfuly',
//                                                        des:'create'
//                                                    })
//                                                }
//                                            })
//                                       }
//                                       else {
//                                           res.json({
//                                               msg : 'joined successfuly'
//                                           })
//                                       }
                               
//                                    }
//                                })
    
//                            } 
//                            else if((+winning_amount) > (+req.body.entry_fee)){
//                                console.log('second')
//                                pool.query(`update users set winning_amount = winning_amount-${req.body.entry_fee} where number = '${req.body.number}'`,(err,result)=>{
//                                    if(err) throw err;
//                                    else {
//                                        if(member==((+member_joined)+1)) {
//                                            data[0].member_joined = 0;
//                                            data[0].status = 'not_completed'
//                                            pool.query(`insert into contests set ?`,data,(err,result)=>{
//                                                if(err) throw err;
//                                                else {
//                                                    res.json({
//                                                        msg : 'joined successfuly',
//                                                        des:'create'
//                                                    })
//                                                }
//                                            })
//                                       }
//                                       else {
//                                           res.json({
//                                               msg : 'joined successfuly'
//                                           })
//                                       }
                               
//                                    }
//                                })
    
    
//                            }
//                            else if(((+deposit_cash) +(+ winning_amount)) > (+req.body.entry_fee)){
//                                console.log('third')
//                                let remaining_amount = req.body.entry_fee - deposit_cash
//                                let deposit_deduct_amount = req.body.entry_fee - remaining_amount
//                                pool.query(`update users set deposit_cash = deposit_cash-${deposit_deduct_amount} , winning_amount = winning_amount-${remaining_amount} where number = '${req.body.number}'`,(err,result)=>{
//                                    if(err) throw err;
//                                    else {
//                                        if(member==((+member_joined)+1)) {
//                                            data[0].member_joined = 0;
//                                            data[0].status = 'not_completed'
//                                            pool.query(`insert into contests set ?`,data,(err,result)=>{
//                                                if(err) throw err;
//                                                else {
//                                                    res.json({
//                                                        msg : 'joined successfuly',
//                                                        des:'create'
//                                                    })
//                                                }
//                                            })
//                                       }
//                                       else {
//                                           res.json({
//                                               msg : 'joined successfuly'
//                                           })
//                                       }
                               
//                                    }
//                                })
    
    
    
//                            }
//                            // if(member_joined==2) {
//                            //      data['member_joined'] = 0;
//                            //      data['status'] = 'not_completed'
//                            //      pool.query(`insert into contests set ?`,data,(err,result)=>{
//                            //          if(err) throw err;
//                            //          else {
//                            //              res.json({
//                            //                  msg : 'joined successfuly'
//                            //              })
//                            //          }
//                            //      })
//                            // }
//                            // else {
//                            //     res.json({
//                            //         msg : 'joined successfuly'
//                            //     })
//                            // }
//                         }
//                     })
//                 }
//             })
    
    
//         }
//     })
    
    
    
                              
//                                }
    
//     //yaha
    
//                            })
//                         }
//                         else{
//                             console.log('already full')
//                             //console.log('inserted data',data[0])
//                             data[0].member_joined = 0;
//                             data[0].status = 'not_completed'
//                             pool.query(`insert into contests set ?`,data,(err,result)=>{
//                                 if(err) throw err;
//                                 else {
//                                     res.json({
//                                         msg : 'contests full',
//                                         des:'create'
//                                     })
//                                 }
//                             })
//                         }
//                     }
//                 })
    
//             }
//             else {
//                 res.json({
//                     msg : 'wallet low'
//                 })
    
//             }
//         })

    



    
// })





// router.post('/live-match',(req,res)=>{
//     pool.query(`select  distinct j.matchid , j.leagueid,
//     (select t.short_name from teams t where t.id = (select m.team1 from matches m where m.id = j.matchid)) as team1name,
//     (select t.short_name from teams t where t.id = (select m.team2 from matches m where m.id = j.matchid)) as team2name,
//     (select t.logo from teams t where t.id = (select m.team1 from matches m where m.id = j.matchid)) as team1logo,
//     (select t.logo from teams t where t.id = (select m.team2 from matches m where m.id = j.matchid)) as team2logo,
//     (select l.name from leauges l where l.id = j.leagueid) as leaguename
//     from join_contests j where j.number = '${req.body.number}' and (select m.status from matches m where m.id=j.matchid) = 'live' ;`,(err,result)=>{
//         if(err) throw err;
//         else res.json(result)
//     })
// })




router.post('/ongoing-bet',(req,res)=>{
    pool.query(`select  distinct j.matchid ,
    (select t.short_name from teams t where t.id = (select m.team1 from matches m where m.id = j.matchid)) as team1name,
    (select t.short_name from teams t where t.id = (select m.team2 from matches m where m.id = j.matchid)) as team2name,
    (select m.team1 from matches m where m.id = j.matchid) as team1,
    (select m.team2 from matches m where m.id = j.matchid) as team2,
    (select t.logo from teams t where t.id = (select m.team1 from matches m where m.id = j.matchid)) as team1logo,
    (select t.logo from teams t where t.id = (select m.team2 from matches m where m.id = j.matchid)) as team2logo,
 (select l.name from leauges l where l.id = (select m.leagueid from matches m where m.id = j.matchid)) as leaguename
    from bet_join j where j.number = '${req.body.number}' and j.status != 'completed'`,(err,result)=>{
        if(err) throw err;
        else res.json(result)
    })
})






router.post('/complete-bet',(req,res)=>{
    pool.query(`select  distinct j.matchid ,
    (select t.short_name from teams t where t.id = (select m.team1 from matches m where m.id = j.matchid)) as team1name,
    (select t.short_name from teams t where t.id = (select m.team2 from matches m where m.id = j.matchid)) as team2name,
    (select m.team1 from matches m where m.id = j.matchid) as team1,
    (select m.team2 from matches m where m.id = j.matchid) as team2,
    (select t.logo from teams t where t.id = (select m.team1 from matches m where m.id = j.matchid)) as team1logo,
    (select t.logo from teams t where t.id = (select m.team2 from matches m where m.id = j.matchid)) as team2logo,
 (select l.name from leauges l where l.id = (select m.leagueid from matches m where m.id = j.matchid)) as leaguename
    from bet_join j where j.number = '${req.body.number}' and j.status = 'completed'`,(err,result)=>{
        if(err) throw err;
        else res.json(result)
    })
})



router.post('/single-bet-details',(req,res)=>{
   
    pool.query(`select b.* , 
    (select t.name from teams t where t.id = b.teamid) as teamname ,
    (select sum(hold) from bet_join where teamid = '${req.body.team1id}' and matchid = '${req.body.id}' ) as team1hold,
(select sum(hold) from bet_join where teamid = '${req.body.team2id}' and matchid = '${req.body.id}' ) as team2hold,
(select sum(entry_fee) from bet_join where  matchid = '${req.body.id}' ) as teamholdprice
    from bet_join b where b.matchid = '${req.body.id}' and number = '${req.body.number}'`,(err,result)=>{
        if(err) throw err;
        else res.json(result)
    })
})






// select m.* ,
// (select p.type from players p where p.id = m.player1) as player1type,
// (select p.type from players p where p.id = m.player2) as player2type,
// (select p.type from players p where p.id = m.player3) as player3type,
// (select p.type from players p where p.id = m.player4) as player4type,
// (select p.type from players p where p.id = m.player5) as player5type,
// (select p.type from players p where p.id = m.player6) as player6type,
// (select p.type from players p where p.id = m.player8) as player7type,
// (select p.type from players p where p.id = m.player9) as player8type,
// (select p.type from players p where p.id = m.player9) as player9type,
// (select p.type from players p where p.id = m.player10) as player10type,
// (select p.type from players p where p.id = m.player11) as player11type

//  from myteams m where m.id = '1'















// new api





router.post('/single-contests-new',(req,res)=>{
    pool.query(`select j.* ,
       (select u.name from users u where u.number = j.number) as username,
       (select c.member from contests c where c.id = '${req.body.contestsid}') as total_member,
        (select c.member_joined from contests c where c.id = '${req.body.contestsid}') as total_member_joined,
        (select c.prize_pool from contests c where c.id = '${req.body.contestsid}') as total_win,
        (select t.teamname from myteams t where t.id = j.teamid) as myteamname,
        (select m.update_points from matches m where m.id = j.matchid) as matchupdate,
        (select t.playerpoints from myteams t where t.id = j.teamid) as myteamplayerpoints,
 (select l.player_points from lineups l where l.playerid = (select t.player1 from myteams t where t.id = j.teamid) and matchid = '${req.body.matchid}') as player1points,
 (select l.player_points from lineups l where l.playerid = (select t.player2 from myteams t where t.id = j.teamid) and matchid = '${req.body.matchid}') as player2points,
 (select l.player_points from lineups l where l.playerid = (select t.player3 from myteams t where t.id = j.teamid) and matchid = '${req.body.matchid}') as player3points,
 (select l.player_points from lineups l where l.playerid = (select t.player4 from myteams t where t.id = j.teamid) and matchid = '${req.body.matchid}') as player4points,
 (select l.player_points from lineups l where l.playerid = (select t.player5 from myteams t where t.id = j.teamid) and matchid = '${req.body.matchid}') as player5points,
 (select l.player_points from lineups l where l.playerid = (select t.player6 from myteams t where t.id = j.teamid) and matchid = '${req.body.matchid}') as player6points,
 (select l.player_points from lineups l where l.playerid = (select t.player7 from myteams t where t.id = j.teamid) and matchid = '${req.body.matchid}') as player7points,
 (select l.player_points from lineups l where l.playerid = (select t.player8 from myteams t where t.id = j.teamid) and matchid = '${req.body.matchid}') as player8points,
 (select l.player_points from lineups l where l.playerid = (select t.player9 from myteams t where t.id = j.teamid) and matchid = '${req.body.matchid}') as player9points,
 (select l.player_points from lineups l where l.playerid = (select t.player10 from myteams t where t.id = j.teamid) and matchid = '${req.body.matchid}') as player10points,
 (select l.player_points from lineups l where l.playerid = (select t.player11 from myteams t where t.id = j.teamid) and matchid = '${req.body.matchid}') as player11points,  
 (select l.player_points from lineups l where l.playerid = (select t.captain from myteams t where t.id = j.teamid) and matchid = '${req.body.matchid}') as captainpoints,
 ((select l.player_points from lineups l where l.playerid = (select t.vicecaptain from myteams t where t.id = j.teamid) and matchid = '${req.body.matchid}'))/2 as vicecaptainpoints  
     from join_contests j where j.contestsid = '${req.body.contestsid}' order by (select t.playerpoints from myteams t where t.id = j.teamid) desc limit 20`,(err,result)=>{
         if(err) throw err;
         else res.json(result)
     })
})






router.post('/single-leaderboard',(req,res)=>{
    pool.query(`select * from contests where id = '${req.body.id}'`,(err,result)=>{
        if(err) throw err;
       else{
            res.json({
                result
            })
        }
    })
})



router.post('/all-contests',(req,res)=>{
    pool.query(`select * from contests  where leagueid = '${req.body.leagueid}' and matchid = '${req.body.matchid}' and member > member_joined and status='not_completed'`,(err,result)=>{
        if(err) throw err;
       else{
            res.json({
                result
            })
        }
    })
})




// router.post('/megagl-join-contests',(req,res)=>{


//     var today = new Date();
//     var dd = today.getDate();
    
//     var mm = today.getMonth()+1; 
//     var yyyy = today.getFullYear();
//     if(dd<10) 
//     {
//         dd='0'+dd;
//     } 
    
//     if(mm<10) 
//     {
//         mm='0'+mm;
//     } 
//     today = yyyy+'-'+mm+'-'+dd;

//     let body = req.body
//     body['status'] = 'upcoming'
//     body['send_amount'] = ''
//     console.log('data aa rha h',req.body)
//  //   let commision = (req.body.entry_fee*2)/100;
//     let data = []

// pool.query(`select * from  join_contests where number = '${req.body.number}' and contestsid = '${req.body.contestsid}' and teamid = '${req.body.teamid}'`,(err,result)=>{
//     if(err) throw err;
//     else if(result[0]){
//       res.json({
//           msg : 'join already'
//       })
//     }
//     else {



//         pool.query(`select * from users where number = '${req.body.number}'`,(err,result)=>{
//             if(err) throw err;
//             else if(((+result[0].deposit_cash) + (+result[0].winning_amount) ) >= req.body.entry_fee){
//                 let referral_code = result[0].refferal_code
//                 let deposit_cash = result[0].deposit_cash
//                 let winning_amount = result[0].winning_amount
           
//                 pool.query(`select leagueid , matchid , entry_fee , member , bonus , prize_pool , team_entry , member_joined , status from contests where id  ='${req.body.contestsid}'`,(err,result)=>{
//                     if(err) throw err;
//                     else {
//                         data = result
//                         let member = result[0].member
//                         let member_joined = result[0].member_joined
                
//                         if((+result[0].member) > (+result[0].member_joined)){
//                             console.log('yeh chla')
//                            pool.query(`insert into join_contests set ?`,body,(err,result)=>{
//                                if(err) throw err;
//                                else {
    
    
//             pool.query(`update contests set member_joined = member_joined+1 where id = '${req.body.contestsid}'`,(err,result)=>{
//                 if(err) throw err;
//                 else {
//                     pool.query(`insert into transcations (name , number , date , amount , color , sign) values('Joined Contest','${req.body.number}','${today}', '${req.body.entry_fee}','red','-')`,(err,result)=>{
//                         if(err) throw err;
//                         else {
//                            if(deposit_cash >= req.body.entry_fee){
//                                console.log('first')
//                                pool.query(`update users set deposit_cash = deposit_cash-${req.body.entry_fee} where number = '${req.body.number}'`,(err,result)=>{
//                                    if(err) throw err;
//                                    else {
//                                        if(member==((+member_joined)+1)) {
//                                            data[0].member_joined = 0;
//                                            data[0].status = 'not_completed'
//                                            pool.query(`insert into contests set ?`,data,(err,result)=>{
//                                                if(err) throw err;
//                                                else {
//                                                    res.json({
//                                                        msg : 'joined successfuly',
//                                                        des:'create'
//                                                    })
//                                                }
//                                            })
//                                       }
//                                       else {
//                                           res.json({
//                                               msg : 'joined successfuly'
//                                           })
//                                       }
                               
//                                    }
//                                })
    
//                            } 
//                            else if((+winning_amount) >= (+req.body.entry_fee)){
//                                console.log('second')
//                                pool.query(`update users set winning_amount = winning_amount-${req.body.entry_fee} where number = '${req.body.number}'`,(err,result)=>{
//                                    if(err) throw err;
//                                    else {
//                                        if(member==((+member_joined)+1)) {
//                                            data[0].member_joined = 0;
//                                            data[0].status = 'not_completed'
//                                            pool.query(`insert into contests set ?`,data,(err,result)=>{
//                                                if(err) throw err;
//                                                else {
//                                                    res.json({
//                                                        msg : 'joined successfuly',
//                                                        des:'create'
//                                                    })
//                                                }
//                                            })
//                                       }
//                                       else {
//                                           res.json({
//                                               msg : 'joined successfuly'
//                                           })
//                                       }
                               
//                                    }
//                                })
    
    
//                            }
//                            else if(((+deposit_cash) +(+ winning_amount)) >= (+req.body.entry_fee)){
//                                console.log('third')
//                                let remaining_amount = req.body.entry_fee - deposit_cash
//                                let deposit_deduct_amount = req.body.entry_fee - remaining_amount
//                                pool.query(`update users set deposit_cash = deposit_cash-${deposit_deduct_amount} , winning_amount = winning_amount-${remaining_amount} where number = '${req.body.number}'`,(err,result)=>{
//                                    if(err) throw err;
//                                    else {
//                                        if(member==((+member_joined)+1)) {
//                                            data[0].member_joined = 0;
//                                            data[0].status = 'not_completed'
//                                            pool.query(`insert into contests set ?`,data,(err,result)=>{
//                                                if(err) throw err;
//                                                else {
//                                                    res.json({
//                                                        msg : 'joined successfuly',
//                                                        des:'create'
//                                                    })
//                                                }
//                                            })
//                                       }
//                                       else {
                                        
//                                           res.json({
//                                               msg : 'joined successfuly'
//                                           })
//                                       }
                               
//                                    }
//                                })
    
    
    
//                            }
//                            // if(member_joined==2) {
//                            //      data['member_joined'] = 0;
//                            //      data['status'] = 'not_completed'
//                            //      pool.query(`insert into contests set ?`,data,(err,result)=>{
//                            //          if(err) throw err;
//                            //          else {
//                            //              res.json({
//                            //                  msg : 'joined successfuly'
//                            //              })
//                            //          }
//                            //      })
//                            // }
//                            // else {
//                            //     res.json({
//                            //         msg : 'joined successfuly'
//                            //     })
//                            // }
//                         }
//                     })
//                 }
//             })
    
    
    
//     //yaha tk h
    
                              
//                                }
    
//     //yaha
    
//                            })
//                         }
//                         else{
//                             console.log('already full')
//                             //console.log('inserted data',data[0])
//                             data[0].member_joined = 0;
//                             data[0].status = 'not_completed'
//                             pool.query(`insert into contests set ?`,data,(err,result)=>{
//                                 if(err) throw err;
//                                 else {
//                                     res.json({
//                                         msg : 'contests full',
//                                         des:'create'
//                                     })
//                                 }
//                             })
//                         }
//                     }
//                 })
    
//             }
//             else {
//                 res.json({
//                     msg : 'wallet low'
//                 })
    
//             }
//         })

//     }
// })


    
// })





router.post('/all-contests-with-type',(req,res)=>{
    pool.query(`select * from contests  where leagueid = '${req.body.leagueid}' and matchid = '${req.body.matchid}' and contests_name = '${req.body.contests_name}' and member > member_joined and status='not_completed' order by entry_fee`,(err,result)=>{
        if(err) throw err;
       else{
            res.json({
                result
            })
        }
    })
})



module.exports = router;
