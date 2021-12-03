var transacciones = document.getElementById('transacciones')
//dependencia_select.innerHTML="<select name='dependenciaid' id='dependencia_select'><option value=5>cargando...</option></select>"
function obtener_transacciones(){
	var request=new XMLHttpRequest();
	request.open("POST","/gobchain");
	request.send()
	request.onreadystatechange=function(){
		if(request.readyState==4 && request.status==200){
			data=JSON.parse(request.responseText)
			data=data["data"]
			transacciones.innerHTML=""
			data.forEach(item=>{
				transacciones.innerHTML+=`<div><p>${item["Key"]}</p></div>`
			});
		}
	}
}
obtener_transacciones()