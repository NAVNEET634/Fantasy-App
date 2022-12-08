let addgroup = []
let wishes = []
let table = 'contests'
let leagues = []

$.getJSON(`/leagues/show`, data => {
    leagues = data
    console.log('leagues',data)
    fillDropDown('leagueid', data, 'Choose League Name', 0)
  
})




$('#leagueid').change(() => {
    const filteredData = teams.filter(item => item.leagueid == $('#leagueid').val())
    fillDropDown('matchid', filteredData, 'Choose Match', 0)
      
})



$.getJSON(`/matches/show`, data => {
    teams = data
    console.log('matches',data)
    fillDropDown('matchid', [], 'Choose Match', 0)
   
})





$('.save').click(function(){
  if($('#leagueid').val()==[] || $('#leagueid').val()=="") alert('Choose League Name')
  else if($('#matchid').val()==[] || $('#matchid').val()=="") alert('Choose Match Name')
    else if($('#entry_fee').val()==[] || $('#entry_fee').val()=="") alert('Enter Entry Fee')
      else if($('#member').val()==[] || $('#member').val()=="") alert('Enter Member')
     else if($('#bonus').val()==[] || $('#bonus').val()=="") alert('Enter Bonus')   
     
  else{
   let insertObj = {
    leagueid : $('#leagueid').val(),
    matchid:$('#matchid').val(),
    entry_fee:$('#entry_fee').val(),
    member:$('#member').val(),
    bonus : $('#bonus').val(),
    team_entry: $('#team_entry').val(),
    contests_name: $('#contests_name').val(),
    member_entry: $('#member_entry').val()

   
   }
   $.post(`/${table}/insert`,insertObj,data=>{
    alert('Successfully Inserted')
   })
  }
})








function fillDropDown1(id, data, label, selectedid = 0) {
  console.log("data",data)
    $(`#${id}`).empty()
    $(`#${id}`).append($('<option>').val("null").text(label))

    $.each(data, (i, item) => {
      console.log('yes',item.id)
        if (item.id == selectedid) {
          
            $(`#${id}`).append($('<option selected>').val(item.name).text(item.name))
        } else {
            $(`#${id}`).append($('<option>').val(item.name).text(item.name))
        }
    })
}











$('#show').click(function(){
$.getJSON(`/${table}/show`, data => {
    console.log(data)
    wishes = data
    makeTable(data)
  
})
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
          <h3 class="text-white mb-0">All Players</h3>
          <br>
          <button type="button" id="back" class="btn btn-sm btn-primary">BacK</button>
        </div>
       
      
      
        <div class="table-responsive">
          <table class="table align-items-center table-dark table-flush">
            <thead class="thead-dark">
              <tr>
                <th scope="col"> League Name</th>
              
                <th scope="col">Team Name</th>
                <th scope="col">Player Name</th>
                <th scope="col">Player Type</th>
                <th scope="col">Player Image</th>
                <th scope="col"></th>
              </tr>
            </thead>
            <tbody>
                  <tr>`
                  $.each(board, function(i, item) {
                    table += `<th scope="row">
                      <div class="media align-items-center">
                        <div class="media-body">
                          <span class="mb-0 text-sm">${item.leaguename}</span>
                        </div>
                      </div>
                    </th>
                   
                   
           <th scope="row">
                      <div class="media align-items-center">
                        <div class="media-body">
                          <span class="mb-0 text-sm">${item.teamname} </span>
                        </div>
                      </div>
                    </th>
                    <th scope="row">
                      <div class="media align-items-center">
                        <div class="media-body">
                          <span class="mb-0 text-sm">${item.name}</span>
                        </div>
                      </div>
                    </th>
                    <th scope="row">
                      <div class="media align-items-center">
                        <div class="media-body">
                          <span class="mb-0 text-sm">${item.type}</span>
                        </div>
                      </div>
                    </th>
                     <th scope="row">
            <div class="media align-items-center">
              <a href="#" class="avatar rounded-circle mr-3">
                <img alt="Image placeholder" src="/images/${item.image}">
              </a>
              
            </div>
          </th>
         
 
         
                    <td class="text-right">
                      <div class="dropdown">
                        <a class="btn btn-sm btn-icon-only text-light" href="#" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                          <i class="fas fa-ellipsis-v"></i>
                        </a>
                        <div class="dropdown-menu dropdown-menu-right dropdown-menu-arrow">
                       <button class=" dropdown-item btn btn-outline-success edit" id="${item.id}">Edit Data</button>
                          <button class=" dropdown-item btn btn-outline-success updateimage" id="${item.id}">Edit Image</button>
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
    fillDropDown('pteam', filteredData, 'Choose Team', 0)
 
})



$('#result').on('click', '.edit', function() {
    const id = $(this).attr('id')
    const result = wishes.find(item => item.id == id);
    fillDropDown('pleagueid', leagues, 'League Name', result.leagueid)
    $('#pteamid').append($('<option>').val(result.team).text(result.teamname))
    
    $('#editdiv').show()
    $('#insertdiv').hide() 
    $('#result').hide()
    $('#pid').val(result.id)
   $('#pname').val(result.name)
    

 })


 
$('#update').click(function(){  //data insert in database
    let updateobj = {
        id: $('#pid').val(),
        leagueid:$('#pleagueid').val(),
        teamid: $('#pteamid').val(),
        name:$('#pname').val(),
        
      
    }

    $.post(`/${table}/update`, updateobj , function(data) {
       update()
    })
})


function refresh() 
{
    $.getJSON(`/${table}/show`, data => makeTable(data))
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
