let addgroup = []
let wishes = []
let table = 'matches'
let leagues = []

$.getJSON(`/leagues/show`, data => {
    leagues = data
    console.log('leagues',data)
    fillDropDown('leagueid', data, 'Choose League Name', 0)
  
})




$('#leagueid').change(() => {
    const filteredData = teams.filter(item => item.leagueid == $('#leagueid').val())
    fillDropDown('team1', filteredData, 'Choose First Team', 0)
        fillDropDown('team2', filteredData, 'Choose Second Team', 0)
})



$.getJSON(`/teams/show`, data => {
    teams = data
    console.log('leagues',data)
    fillDropDown('team1', [], 'Choose First Team', 0)
    fillDropDown('team2', [], 'Choose Second Team', 0)
  
})

$('#show').click(function(){
$.getJSON(`/${table}/show`, data => {
    console.log(data)
    wishes = data
    makeTable(data)
  
})
})





$('.save').click(function(){
  if($('#leagueid').val()==[] || $('#leagueid').val()=="") alert('Choose League Name')
  else if($('#team1').val()==[] || $('#team1').val()=="") alert('Choose Team 1')
    else if($('#team2').val()==[] || $('#team2').val()=="") alert('Choose Team 2')
      else if($('#date').val()==[] || $('#date').val()=="") alert('Choose Date')
        else if($('#time').val()==[] || $('#time').val()=="") alert('Choose Time')
      else if($('#name').val()==[] || $('#name').val()=="") alert('Enter Match No.')    
  else{
   let insertObj = {
    leagueid : $('#leagueid').val(),
    team1:$('#team1').val(),
    team2:$('#team2').val(),
    date:$('#date').val(),
    time:$('#time').val(),
    name:$('#name').val(),
    type : $('#type').val(),
    lock_status : $('#lock_status').val()
   }
   $.post(`/${table}/insert`,insertObj,data=>{
    alert('Successfully Inserted')
   })
  }
})




function fillDropDown(id, data, label, selectedid = 0) {
    $(`#${id}`).empty()
    $(`#${id}`).append($('<option>').val("null").text(label))

    $.each(data, (i, item) => {
        if (item.id == selectedid) {
            $(`#${id}`).append($('<option selected>').val(item.id).text(item.name))
        } else {
            $(`#${id}`).append($('<option>').val(item.id).text(item.name))
        }
    })
}

    





function makeTable(board){
    let table = ` <div class="row mt-5">
    <div class="col">
      <div class="card bg-default shadow">
        <div class="card-header bg-transparent border-0">
          <h3 class="text-white mb-0">All Matches</h3>
          <br>
          <button type="button" id="back" class="btn btn-sm btn-primary">BacK</button>
        </div>
       
      
      
        <div class="table-responsive">
          <table class="table align-items-center table-dark table-flush">
            <thead class="thead-dark">
              <tr>
                <th scope="col"> Match No.</th>
              
                <th scope="col"> League Name</th>
              
                <th scope="col">Match</th>
                <th scope="col">Date & Time</th>
                <th scope="col">Lock</th>
                <th scope="col"></th>
              </tr>
            </thead>
            <tbody>
                  <tr>`
                  $.each(board, function(i, item) {
                    table += `<th scope="row">
                      <div class="media align-items-center">
                        <div class="media-body">
                          <span class="mb-0 text-sm">${item.name}</span>
                        </div>
                      </div>
                    </th>
                   
                   <th scope="row">
                      <div class="media align-items-center">
                        <div class="media-body">
                          <span class="mb-0 text-sm">${item.leaguename}</span>
                        </div>
                      </div>
                    </th>
           <th scope="row">
                      <div class="media align-items-center">
                        <div class="media-body">
                          <span class="mb-0 text-sm">${item.team1name} vs ${item.team2name}</span>
                        </div>
                      </div>
                    </th>
                    <th scope="row">
                      <div class="media align-items-center">
                        <div class="media-body">
                          <span class="mb-0 text-sm">${item.date} at ${item.time}</span>
                        </div>
                      </div>
                    </th>


                    <th scope="row">
                    <div class="media align-items-center">
                      <div class="media-body">
                        <span class="mb-0 text-sm">${item.lock_status}</span>
                      </div>
                    </div>
                  </th>
 
         
                    <td class="text-right">
                      <div class="dropdown">
                        <a class="btn btn-sm btn-icon-only text-light" href="#" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                          <i class="fas fa-ellipsis-v"></i>
                        </a>
                        <div class="dropdown-menu dropdown-menu-right dropdown-menu-arrow">
                       <button class=" dropdown-item btn btn-outline-success edit" id="${item.id}">Edit Data</button>
                      <button class=" dropdown-item btn btn-outline-success delete" id="${item.id}">Delete</button>
                        </div>
                      </div>
                    </td>
                  </tr>`
                  })
                  
              table +=` </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>`
      $('#result').html(table)
      $('#insertdiv').hide()
      $('#result').show()
}


$('#result').on('click', '.delete', function() {
    const id = $(this).attr('id')
    $.get(`/${table}/delete`,  { id }, data => {
        refresh()
    })
})



$('#pleagueid').change(() => {
    const filteredData = teams.filter(item => item.leagueid == $('#pleagueid').val())
    fillDropDown('pteam1', filteredData, 'Choose Team1', 0)
    fillDropDown('pteam2', filteredData, 'Choose Team2', 0)
})



$('#result').on('click', '.edit', function() {
    const id = $(this).attr('id')
    const result = wishes.find(item => item.id == id);
    fillDropDown('pleagueid', leagues, 'League Name', result.leagueid)
    $('#pteam1').append($('<option>').val(result.team1).text(result.team1name))
    $('#pteam2').append($('<option>').val(result.team2).text(result.team2name))
 
    $('#editdiv').show()
    $('#insertdiv').hide() 
    $('#result').hide()
    $('#pid').val(result.id)
   $('#pdate').val(result.date)
    $('#ptime').val(result.time)
 $('#pname').val(result.name)
 $('#plock_status').val(result.lock_status)

    

 })


 
$('#update').click(function(){  //data insert in database
    let updateobj = {
        id: $('#pid').val(),
        leagueid:$('#pleagueid').val(),
        team1: $('#pteam1').val(),
        team2:$('#pteam2').val(),
        date:$('#pdate').val(),
        time:$('#ptime').val(),
        name:$('#pname').val(),
        lock_status:$('#plock_status').val()
        
        
      
    }

    $.post(`/${table}/update`, updateobj , function(data) {
       update()
    })
})


function refresh() 
{
  $.getJSON(`/${table}/show`, data => {
    console.log(data)
    wishes = data
    makeTable(data)
  
})
}
function update()
{
    $('#result').show()
    $('#editdiv').hide()
    $('#insertdiv').show() 
    refresh()
    refresh()
}

//================================Page Functionality=============================//
$('#editdiv').hide()
$('#updateimagediv').hide()

$('#result').on('click', '#back', function() {
    $('#result').hide()
    $('#insertdiv').show()
})

$('#back1').click(function(){
    $('#result').show()
    $('#insertdiv').hide()
    $('#editdiv').hide()
    $('#updateimagediv').hide()

})

$('#back2').click(function(){
    $('#result').show()
    $('#insertdiv').hide()
    $('#editdiv').hide()
    $('#updateimagediv').hide()
})



$('#result').on('click', '.updateimage', function() {
    const id = $(this).attr('id')
    const result = wishes.find(item => item.id == id);
    $('#peid').val(result.id)
    $('#updateimagediv').show()
    $('#result').hide()
    $('#insertdiv').hide()
    $('#editdiv').hide()
})