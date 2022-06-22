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
