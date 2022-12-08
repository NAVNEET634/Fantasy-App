
let addgroup = []
let wishes = []
let table = 'teams'

$.getJSON(`/leagues/show`, data => {
    addgroup = data
    console.log('leagues',data)
    fillDropDown('leagueid', data, 'Choose League Name', 0)
  
})

$('#show').click(function(){
$.getJSON(`/${table}/show`, data => {
    console.log(data)
    wishes = data
    makeTable(data)
  
})
})



$('.save').click(function(){
  if($('#name').val()==[] || $('#name').val()=="") alert('Enter Name')
  else if($('#short_name').val()==[] || $('#short_name').val()=="") alert('Enter Short Name')
  else{
   let insertObj = {
    name : $('#name').val(),
    short_name:$('#short_name').val()
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
          <h3 class="text-white mb-0">All Teams</h3>
          <br>
          <button type="button" id="back" class="btn btn-sm btn-primary">BacK</button>
       
          <button type="button" class="btn btn-dark btn-sm float-right" id="exportBtn1" style="float: right;margin-right:20px;margin-bottom:20px">Export Data</button>
        

          </div>
          <input type="text"  class="form-control float-right" id="myInput" onkeyup="myFunction()" placeholder="Search Here.." title="Type in a name" style="position:absolute;right:20px;width:150px;margin:10px;height:30px;border-radius:5px;margin-top:25px">

       
      
      
        <div class="table-responsive">
          <table class="table align-items-center table-dark table-flush" id='myTable'>
            <thead class="thead-dark">
              <tr>
              <th scope="col">League Name</th>

                <th scope="col">Name</th>
              
                <th scope="col">Short Name</th>

                <th scope="col">Image</th>
                <th scope="col"></th>
              </tr>
            </thead>
            <tbody>
                  <tr>`
                  $.each(board, function(i, item) {
                    table += `
                    
                    
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
                          <span class="mb-0 text-sm">${item.name}</span>
                        </div>
                      </div>
                    </th>
                   
                   


           <th scope="row">
                      <div class="media align-items-center">
                        <div class="media-body">
                          <span class="mb-0 text-sm">${item.short_name}</span>
                        </div>
                      </div>
                    </th>


   <th scope="row">
            <div class="media align-items-center">
              <a href="#" class="avatar rounded-circle mr-3">
                <img alt="Image placeholder" src="/images/${item.logo}">
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



$('#result').on('click', '.edit', function() {
    const id = $(this).attr('id')
    const result = wishes.find(item => item.id == id);
    fillDropDown('pleagueid', addgroup, 'League Name', result.leagueid)
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
        leagueid:$('#pleagueid').val()
        
      
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



$(document).ready(function () {
  $('#result').on('click', '#exportBtn1', function() {
  
          TableToExcel.convert(document.getElementById("myTable"), {
              name: "Countries.xlsx",
              sheet: {
              name: "Sheet1"
              }
            });
          });
    });


    function myFunction() {
      var input, filter, table, tr, td, i, txtValue;
      input = document.getElementById("myInput");
      filter = input.value.toUpperCase();
      table = document.getElementById("myTable");
      tr = table.getElementsByTagName("tr");
      for (i = 0; i < tr.length; i++) {
        td = tr[i].getElementsByTagName("td")[0];
        if (td) {
          txtValue = td.textContent || td.innerText;
          if (txtValue.toUpperCase().indexOf(filter) > -1) {
            tr[i].style.display = "";
          } else {
            tr[i].style.display = "none";
          }
        }
      }
    }
  
  
  

//===================================Page Functioality Ends========================//