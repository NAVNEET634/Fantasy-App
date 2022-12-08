
let leagues = []
let table = 'prize_pool'



$('#show').click(function(){
$.getJSON(`/${table}/show`, data => {
    console.log(data)
    leagues = data
    makeTable(data)
  
})
})



$('.save').click(function(){
  if($('#contests_size').val()==[] || $('#contests_size').val()=="") alert('Enter Contests Size')
  else if($('#entry_fee').val()==[] || $('#entry_fee').val()=="") alert('Enter Entry Fee')
  else if($('#entry_fee').val()==[] || $('#entry_fee').val()=="") alert('Enter Entry Fee')


  else{
   let insertObj = {
    contests_size : $('#contests_size').val(),
    entry_fee:$('#entry_fee').val(),
    contests_name:$('#contests_name').val(),
    prize_pool:$('#prize_pool').val(),

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

    





function makeTable(data){
    let table = ` <div class="row mt-5">
    <div class="col">
      <div class="card bg-default shadow">
        <div class="card-header bg-transparent border-0">
          <h3 class="text-white mb-0">All Prize Pool</h3>
          <br>
          <button type="button" id="back" class="btn btn-sm btn-primary">BacK</button>
        </div>
       
      
      
        <div class="table-responsive">
          <table class="table align-items-center table-dark table-flush">
            <thead class="thead-dark">
              <tr>
                <th scope="col">Contests Name</th>
                <th scope="col">Contests Size</th>
                <th scope="col">Entry</th>
                <th scope="col">Prize Pool</th>

                <th scope="col"></th>
              </tr>
            </thead>
            <tbody>
                  <tr>`
                  $.each(data, function(i, item) {
                    table += `<th scope="row">
                      <div class="media align-items-center">
                        <div class="media-body">
                          <span class="mb-0 text-sm">${item.contests_name}</span>
                        </div>
                      </div>
                    </th>
                   
                   


           <th scope="row">
                      <div class="media align-items-center">
                        <div class="media-body">
                          <span class="mb-0 text-sm">${item.contests_size}</span>
                        </div>
                      </div>
                    </th>



                    <th scope="row">
                    <div class="media align-items-center">
                      <div class="media-body">
                        <span class="mb-0 text-sm">${item.entry_fee}</span>
                      </div>
                    </div>
                  </th>


                  <th scope="row">
                  <div class="media align-items-center">
                    <div class="media-body">
                      <span class="mb-0 text-sm">${item.prize_pool}</span>
                    </div>
                  </div>
                </th>

         
                    <td class="text-right">
                      <div class="dropdown">
                        <a class="btn btn-sm btn-icon-only text-light" href="#" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                          <i class="fas fa-ellipsis-v"></i>
                        </a>
                        <div class="dropdown-menu dropdown-menu-right dropdown-menu-arrow">
                        <button class=" dropdown-item btn btn-outline-success edit" id="${item.id}">Edit</button>

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



$('#result').on('click', '.edit', function() {
    // alert('h')
    const id = $(this).attr('id')
    const result = leagues.find(item => item.id == id);
    $('#editdiv').show()
    $('#insertdiv').hide() 
    $('#result').hide()
    $('#pid').val(result.id)
   $('#pcontests_size').val(result.contests_size)
    $('#pcontests_name').val(result.contests_name)
    $('#pentry_fee').val(result.entry_fee)
    $('#pprize_pool').val(result.prize_pool)

    

 })


 
$('#update').click(function(){  //data insert in database
    let updateobj = {
        id: $('#pid').val(),
        contests_size:$('#pcontests_size').val(),
        contests_name: $('#pcontests_name').val(),
        entry_fee: $('#pentry_fee').val(),
        prize_pool: $('#pprize_pool').val(),

        
      
    }

    $.post(`/${table}/update`, updateobj , function(data) {
       update()
    })
})


function refresh() 
{
  
    $.getJSON(`/${table}/show`, data => {
        console.log(data)
        leagues = data
        makeTable(data)
      
    })
}


function update()
{
    $('#result').show()
    $('#editdiv').hide()
    $('#insertdiv').show() 
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
    const result = student.find(item => item.id == id);
    $('#peid').val(result.id)
    $('#updateimagediv').show()
    $('#result').hide()
    $('#insertdiv').hide()
    $('#editdiv').hide()
})

//===================================Page Functioality Ends========================//