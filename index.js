
/*INICIO DECLARACION DE OBJETOS Y CLASES*/
//import {limites} from './Clases-Objects/limites.js'
import validadors from './Clases-Objects/validador.js'
import sueldoHistorial from './Clases-Objects/sueldoHistorial.js'
import sueldos from './Clases-Objects/sueldo.js'
import { httpGet } from './ajax.js'
import {reiniciar, ocultarFechas}from './Clases-Objects/fecha.js'

/*FIN DECLARACION DE OBJETOS Y CLASES*/
/*--------------------------------------------------------------------------------------------------------------------------------*/
/*INICIO DE EJECUCIÓN DE CODIGO JS*/

let validator = new validadors();
let conyuge = false;
limpiarTodo(); //LIMPIA FORMULARIO Y REINICIA VALIDACIONES



addEventListener("keyup",data => { //recibir evento de tecla enter y realizar diferentes acciones
    if(data.key == "Enter"){
        if(document.getElementById('calculadora').style.display == "block"){
            validarDato("formulario",);//muestra el resultado o alert si da error la validacion
        }
    }

    if(data.explicitOriginalTarget.localName == "input"){
        validarDato('numero',data.explicitOriginalTarget.id);
    }
})


/*aplicacion de JQuery*/

$(document).ready(()=>{
    $("#hijos").on("input",()=>{
        $("#cantHijos").empty();
        $("#cantHijos").append($("#hijos").val());//ACTUALIZAR VALOR DE RANGE
    })
    $("#btnCalcular").click(()=>{//BOTON CALCULAR EN CALCULADORA
        validarDato("formulario",);
    })
    $("#btnPageCalculadora").click(()=>{ //DESDE HISTORIAL A CALCULADORA
        $("#historial").slideUp("fast");
        $("#calculadora").delay(300).slideDown("fast");                 
    })
    $("#btnHistorial").click(()=>{//DESDE CALCULADORA A HISTORIAL
        limpiarTodo();
        $("#mostrarListado").empty();//borra si quedo registro de historial viejo
        generarListado();
        $("#calculadora").delay(50).slideUp("fast");
        $("#historial").delay(300).slideDown("fast");
    })
    $("#btnCalculadora").click(()=>{//VOLVER A CALCULADORA DESDE RESULTADO
        $("#resultado").slideUp("fast");
        $("#calculadora").delay(300).slideToggle("fast");
        limpiarTodo();
    })
    $("#limpiarHistorial").click(()=>{//BOTON LIMPIAR HISTORIAL
        localStorage.clear();
        $("#historial").slideUp("fast");
        $("#calculadora").delay(300).slideDown("fast");
    })
    $("#cartelito").click(()=>{//CERRAR CARTELITO
        cerrarAlerta();
    });
    $("#single").click(()=>{
        $("#couple").removeClass("btnRelation-active");
        $("#couple").addClass("btnRelation");
        $("#single").removeClass("btnRelation");
        $("#single").addClass("btnRelation-active");  
    });
    $("#couple").click(()=>{
        $("#single").removeClass("btnRelation-active");
        $("#single").addClass("btnRelation");
        $("#couple").removeClass("btnRelation");
        $("#couple").addClass("btnRelation-active");  
    });
    $("#hijos").change(()=>{
        $("#cantHijos").val($("#hijos").val())
    })
    $("#cobro").click(()=>{
        if($(".circle").css("display") == "flex"){
            $(".circle").css("display", "none");
            ocultarFechas();
            
        }else{
            $(".circle").css("display", "flex");
        }
    })
    $(".output").click(()=>{
            $(".circle").css("display", "none");
            ocultarFechas();
    })

})






/*FIN DE EJECUCIÓN DE CODIGO JS*/
/*--------------------------------------------------------------------------------------------------------------------------------*/
/*DECLARACION DE FUNCIONES*/
function validarDato(tipo,id) { //funcion validacion
    switch(tipo){
        case 'texto':
            document.getElementById(id).className = validator.texto(id)? "form-control is-invalid":"form-control";
        break;
        case 'numero':
            document.getElementById(id).className = validator.numero(id)? "form-control is-invalid":"form-control";
        break;
        case 'formulario':
            for (let i = 0; i < 4; i++) { //revisa si hay errores en los inputs de texto (almacenados en validator)
                if(validator.error[i]){
                    document.getElementById(validator.verId(i)).focus(); //si hay error, te lleva al mismo para que lo corrijas
                    alerta("Debe completar los campos correctamentes");
                    break;
                };
                if(!validator.error[i] && i==3){ //si no encuentra errores en la validacion 
                    conyuge = $("#couple").hasClass("btnRelation-active");
                    calcular();
                };
            }
        break;
    }
}

function limpiarTodo() {
    validator.reset();
    $("input").val("");
    $("#mostrarListado").empty();//borra tabla de historial
    $("#hijos").val("0");
    $("#cantHijos").text("0");
    $("#single").trigger("click");
    reiniciar();
    $("#sueldoBruto").focus();
}

async function calcular() {
    let sueldoBruto = parseFloat(document.getElementById('sueldoBruto').value);
    let sueldoNuevo = new sueldos(sueldoBruto,calcAportes(sueldoBruto),await calcDeducciones(sueldoBruto));
    mostrarSueldo(sueldoNuevo); //imprime valores en pagina resultado y lo muestra
    guardarSueldo(sueldoNuevo); //guarda los nuevos valores en el local storage
}


async function calcDeducciones(bruto){ //sub funcion de calcular async, espera respuesta de servidor
    let limites = httpGet("https://4754e748b0179b305c08fd4332bc4b1d.m.pipedream.net");
    if(bruto>limites.minimoImponible){;
        conyuge *=(80033.97/12); //por conyuge se deduce un monto anual
        let hijos = parseFloat(document.getElementById('hijos').value);
        hijos = hijos*(40361.43/12); //por cada hijo, es una deducción
        let credito = parseFloat(document.getElementById('credito').value)//devuelve NaN si esta vacio
        credito = credito>0? credito:0; //NaN = 0
        credito = credito>(limites.topes[0])?(limites.topes[0]):credito;
        let alquiler = parseFloat(document.getElementById('alquiler').value); //devuelve NaN si esta vacio
        alquiler = alquiler>0 ? alquiler:0; //NaN = 0
        alquiler = (alquiler*12*0.4)>(limites.topes[1]/12)?limites.topes[1]:(alquiler*0.4); //genera un tope de topeAlquiler o deduce el 40% del alquiler
        let domestica = parseFloat(document.getElementById('domestica').value);//devuelve NaN si esta vacio
        domestica = domestica>0 ? domestica:0; //NaN = 0
        domestica = domestica>limites.topes[2]? limites.topes[2] : domestica; //genera un tope de topeDomestica
        return parseFloat(conyuge+hijos+alquiler+credito+domestica);
    }
    else{
        return false;
    }   

}

function calcAportes(sueldo) {//sub funcion de calcular
    return (sueldo*0.11) + (sueldo*0.03) + (sueldo*0.03);
}

function mostrarSueldo(sueldoNeto) {
    $("#sueldoNeto").empty().append(("Sueldo Neto: $" + sueldoNeto.verSueldoNeto()).toString());//imprime valores en pagina resultado
    $("#retenciones").empty().append(("Aportes: $" + sueldoNeto.verAportes()).toString());//imprime valores en pagina resultado
    $("#aportes").empty().append(("Retenciones: $" + sueldoNeto.verRetencion()).toString());//imprime valores en pagina resultado
    $("#calculadora").slideUp("slow");
    $("#resultado").delay(600).slideDown("fast");

}



/*FUNCIONES DE HISTORIAL*/

function guardarSueldo(sueldoNuevo) {
    let item = new sueldoHistorial(sueldoNuevo.verSueldoBruto(),sueldoNuevo.verRetencion(),sueldoNuevo.verAportes(),sueldoNuevo.verSueldoNeto(),verMes());//crea un nuevo objeto de la clase sueldohistorial para poder guardarlo en storage
    if(localStorage.getItem('history')==null){//si el local storage esta vacio
        let arreglo = [];
        arreglo.push(item)
        localStorage.setItem('history',JSON.stringify(arreglo)); // crea un arreglo y agrega un nuevo sueldo JSON
    }
    else{//si el local storage contiene algo
      let historial = JSON.parse(localStorage.getItem('history'));  
      historial.push(item);
      localStorage.setItem('history',JSON.stringify(historial));// agrega el sueldo nuevo al historial JSON
    }
}

function calcularFecha(numero) { //convierte el numero date en fecha
    let fecha = new Date(numero);
    let año = fecha.getFullYear();
    let dia = (fecha.getDay()+2)<10?"0"+(fecha.getDay()+2):fecha.getDay()+2;
    let mes = (fecha.getMonth()+1)<10?"0"+(fecha.getMonth()+1):fecha.getMonth()+1;
    let hora = fecha.getHours()<10?"0"+(fecha.getHours()):fecha.getHours();
    let min = fecha.getMinutes()<10?"0"+fecha.getMinutes():fecha.getMinutes();
    let seg = fecha.getSeconds()<10?"0"+fecha.getSeconds():fecha.getSeconds();
    return dia + "/" + mes + "/" + año + " " + hora + ":" + min  + ":" + seg;
  }


function generarListado() {
    let historial = JSON.parse(localStorage.getItem('history'));//toma el historial del localstorage
    if(historial != null){//revisa si hay o no historial
        for (let index = 0; index < historial.length; index++) {
            let elemento = document.createElement('div');
            elemento.setAttribute('id','itemListado'+index);
            elemento.className = "row align-items-center justify-content-center";
            elemento.style.color = "white";
            document.getElementById('mostrarListado').appendChild(elemento);//crea un fila para mostrar cada elemento del JSON

            elemento = document.createElement('div');
            elemento.setAttribute('id','listadoFecha'+index);
            elemento.className = "col text-center text-responsive-1 my-1";
            elemento.innerHTML = calcularFecha(historial[index].sfecha);
            document.getElementById('itemListado'+index).appendChild(elemento);//crea una nueva columna donde muestra la fecha

            elemento = document.createElement('div');
            elemento.setAttribute('id','listadoMes'+index);
            elemento.className = "col text-center text-responsive-1 my-1";
            elemento.innerHTML = historial[index].sMes;
            document.getElementById('itemListado'+index).appendChild(elemento);//crea una nueva columna donde muestra la fecha

            elemento = document.createElement('div');
            elemento.setAttribute('id','listadoBruto'+index);
            elemento.className = "col text-center text-responsive-1 my-1";
            elemento.innerHTML = "$" + historial[index].sBruto;
            document.getElementById('itemListado'+index).appendChild(elemento);//crea una nueva columna donde muestra la Sueldo Bruto

            elemento = document.createElement('div');
            elemento.setAttribute('id','listadoReten'+index);
            elemento.className = "col text-center text-responsive-1 my-1";
            elemento.innerHTML = "$" +historial[index].sRetencion;
            document.getElementById('itemListado'+index).appendChild(elemento);//crea una nueva columna donde muestra las Retenciones

            elemento = document.createElement('div');
            elemento.setAttribute('id','listadoAportes'+index);
            elemento.className = "col text-center text-responsive-1 my-1";
            elemento.innerHTML = "$" + historial[index].sAportes;
            document.getElementById('itemListado'+index).appendChild(elemento);//crea una nueva columna donde muestra los Aportes

            elemento = document.createElement('div');
            elemento.setAttribute('id','listadoNeto'+index);
            elemento.className = "col text-center text-responsive-1 my-1 fw-bold";
            elemento.style.color = "red";
            elemento.innerHTML = "$" + historial[index].sNeto;
            document.getElementById('itemListado'+index).appendChild(elemento);//crea una nueva columna donde muestra la Sueldo Neto
        }
    }
    else{
        alerta("No hay registro de historial");
    }
}


function verMes(){

  return  $("#btnMes").text()+ "/" + $("#btnAño").text();
    
}

function alerta(texto){
    $("#textoCartelito").empty();
    $("#textoCartelito").append(texto);
    $("#cartelito").fadeIn("fast");
}
function cerrarAlerta(){
    $("#cartelito").fadeOut("fast");
    $("#resultado").slideUp("fast");
    $("#historial").slideUp("fast");
    $("#calculadora").delay(300).slideDown("fast");    
}