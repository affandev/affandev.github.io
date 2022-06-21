const labels = []
function getData(){


  fetch(base_url+ route_getuser, {
  method: 'GET',
  headers: {
    'Accept': 'application/json, text/plain, */*',
    'Content-Type': 'application/json',
    'mode': 'cors'
  },
 
}).then(res => res.json())
  .then((res)=> {
	// console.log(res)
    for(let i in res){
        labels.push(res[i].photo)
    }
	

  });
    

}  
getData()
function tampil(){
  
  var kirim = { photo : dataHasil}
       

  fetch(base_url+ route_cari, {
    method: 'POST',
    headers: {
      'Accept': 'application/json, text/plain, */*',
      'Content-Type': 'application/json',
      'mode': 'cors'
    },
    body: JSON.stringify(kirim)
  }).then(res1 => res1.json())
    .then((res1)=> {
     
      console.log(res1)
  //  document.getElementById('nip').innerHTML =res1[0].nip
  //  document.getElementById('nama').innerHTML = res1[0].nama
  //  document.getElementById('jabatan').innerHTML =res1[0].jabatan
  
    });
}