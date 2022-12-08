
let leagues = []
let table = 'leagues'



$('#show').click(function(){
$.getJSON(`/${table}/show`, data => {
    console.log(data)
    leagues = data
    makeTable(data)
  
})
})



$('.save').click(function(){
  if($('#from_date').val()==[] || $('#from_date').val()=="") alert('Select From Date')
  else if($('#to_date').val()==[] || $('#to_date').val()=="") alert('Select To Date')
  else{
   let insertObj = {
    from_date : $('#from_date').val(),
    to_date:$('#to_date').val()
   }
   $.post(`/admin/withdrawl-report`,insertObj,data=>{
    makeTable(data)
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
        
       
      
      
        <div class="table-responsive">
          <table class="table align-items-center table-dark table-flush">
            <thead class="thead-dark">
              <tr>
              <th scope="col"> Registerd Number</th>
              <th scope="col">Amount</th>
              <th scope="col">Withdrawl Type</th>
              <th scope="col">UPI</th>
              <th scope="col">Date</th>
              </tr>
            </thead>
            <tbody>
                  <tr>`
                  $.each(data, function(i, item) {
                    table += `<th scope="row">
                      <div class="media align-items-center">
                        <div class="media-body">
                          <span class="mb-0 text-sm">${item.registered_number}</span>
                        </div>
                      </div>
                    </th>
                   
                   


           <th scope="row">
                      <div class="media align-items-center">
                        <div class="media-body">
                          <span class="mb-0 text-sm">${item.amount}</span>
                        </div>
                      </div>
                    </th>



                    <th scope="row">
                    <div class="media align-items-center">
                      <div class="media-body">
                        <span class="mb-0 text-sm">${item.withdrawl_request}</span>
                      </div>
                    </div>
                  </th>



                  <th scope="row">
                  <div class="media align-items-center">
                    <div class="media-body">
                      <span class="mb-0 text-sm">${item.number}</span>
                    </div>
                  </div>
                </th>



                <th scope="row">
                <div class="media align-items-center">
                  <div class="media-body">
                    <span class="mb-0 text-sm">${item.date}</span>
                  </div>
                </div>
              </th>

         
                  
                  </tr>`
                  })
                  
              table +=` </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>`
      $('#result').html(table)
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
   $('#pshort_name').val(result.short_name)
    $('#pname').val(result.name)
    

 })


 
$('#update').click(function(){  //data insert in database
    let updateobj = {
        id: $('#pid').val(),
        short_name:$('#pshort_name').val(),
        name: $('#pname').val(),
        
      
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