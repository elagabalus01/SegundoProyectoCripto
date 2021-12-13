// Se selecciona el select de dependencia
var dependencia_select = document.getElementById('dependencia_select')

// Se hace una solicitud asíncrona para obtener las dependencias
var request=new XMLHttpRequest();
request.open("POST","/dependencias");
request.send()
request.onreadystatechange=function(){
	if(request.readyState==4 && request.status==200){
		data=JSON.parse(request.responseText)
		data=data["data"]
		dependencia_select.innerHTML=""
		data.forEach(item=>{
			dependencia_select.innerHTML+=`<option value=${item["dependenciaid"]}>${item["dependencia"]}</option>`
		});
	}
}