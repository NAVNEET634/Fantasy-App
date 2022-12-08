
let leagues = []
let table = 'pointssystem'



$('#show').click(function(){
$.getJSON(`/${table}/show`, data => {
    console.log(data)
    leagues = data
    makeTable(data)
  
})
})



$.getJSON(`/format/show`, data => {
    addgroup = data
    console.log('leagues',data)
    fillDropDown('formatid', data, 'Choose Format', 0)
  
})

$('.save').click(function(){
    // alert('hi')

    // alert( $('#formatid').val() )


  if($('#formatid').val()=='null' || $('#formatid').val()=="" || $('#formatid').val() == undefined) alert('Select Format')

  else if($('#name').val()==[] || $('#name').val()=="" || $('#name').val() == undefined) alert('Enter Points Name')
  else if($('#points').val()==[] || $('#points').val()=="" || $('#points').val() == undefined) alert('Enter Points')
 
  else{
   let insertObj = {
    formatid : $('#formatid').val(),
    name : $('#name').val(),
    points:$('#points').val(),
    type:$('#type').val(),
    subheading:$('#subheading').val()


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
          <h3 class="text-white mb-0">All Points System</h3>
          <br>
          <button type="button" id="back" class="btn btn-sm btn-primary">BacK</button>
        </div>
       
      
      
        <div class="table-responsive">
          <table class="table align-items-center table-dark table-flush">
            <thead class="thead-dark">
              <tr>
              <th scope="col">Format Name</th>
              <th scope="col">Type</th>
              <th scope="col">Points Name</th>
              <th scope="col">Points</th>
              <th scope="col">Subheading</th>
              <th scope="col"></th>
              </tr>
            </thead>
            <tbody>
                  <tr>`
                  $.each(data, function(i, item) {
                    table += `
                    <th scope="row">
                      <div class="media align-items-center">
                        <div class="media-body">
                          <span class="mb-0 text-sm">${item.formatname}</span>
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
                      <div class="media-body">
                        <span class="mb-0 text-sm">${item.name}</span>
                      </div>
                    </div>
                  </th>



                  <th scope="row">
                  <div class="media align-items-center">
                    <div class="media-body">
                      <span class="mb-0 text-sm">${item.points}</span>
                    </div>
                  </div>
                </th>


                <th scope="row">
                <div class="media align-items-center">
                  <div class="media-body">
                    <span class="mb-0 text-sm">${item.subheading}</span>
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
    fillDropDown('pformatid', addgroup, 'League Name', result.formatid)

    $('#editdiv').show()
    $('#insertdiv').hide() 
    $('#result').hide()
    $('#pid').val(result.id)
   $('#pformatid').val(result.formatid)
   $('#ptype').val(result.type)

    $('#pname').val(result.name)
    $('#ppoints').val(result.points)
    $('#psubheading').val(result.subheading)



    

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