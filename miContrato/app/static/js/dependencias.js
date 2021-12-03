var dependencia_select = document.getElementById('dependencia_select')
//dependencia_select.innerHTML="<select name='dependenciaid' id='dependencia_select'><option value=5>cargando...</option></select>"

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