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
			cont = 0
			transacciones.innerHTML=""
			data.forEach(item=>{
				cont += 1
				record = item["Record"]
				transacciones.innerHTML+=`
    <div class="col-md-6 col-lg-4 pb-3">
        <!-- Copy the content below until next comment-->
        <div class="card card-custom bg-dark border-dark border-0 text-white">
            <div class="card-custom-img" style="background-image: url(../img/fondo.jpg);"></div>
            <div class="card-custom-avatar"><img class="img-fluid" src="../img/blockchain2.png"></div>
            <div class="card-body" style="overflow-y: auto">
                <h4 class="card-title">Movimiento: ${cont}</h4>
                <p class="card-text">Registrado por: ${record["responsable"]}</p>
                <p class="card-text">Dependencia: ${record["dependencia"]}</p>
                <p class="card-text">Fecha: ${record["fecha"]}</p>
                <p class="card-text">Monto: ${record["monto"]}</p>
                <p class="card-text">Descripción: ${record["referencia"]}</p>
            </div>
        </div><!-- Copy until here-->
    </div>`
			});
		}
	}
}
obtener_transacciones()