
/*------------------------------------------------------------------IMPORTAR OBJETOS Y CLASES------------------------------------------------------------------*/

//import {limites} from './Clases-Objects/limites.js' //ACTUALMENTE SE TOMAN A TRAVES DE UN HTTP GET EN FUNCION calcDeducciones()
import validadors from '../Clases-Objects/validador.js'
import sueldos from '../Clases-Objects/sueldo.js'
import { httpGet } from './ajax.js'
import {reiniciar, ocultarFechas, meses} from '../Clases-Objects/fecha.js'


/*------------------------------------------------------------------DECLARACION DE VARIABLES E INICIALIZACION------------------------------------------------------------------*/
var validator = new validadors();
var conyuge = false;
var mesSeleccionado,añoSeleccionado;

initialize();

function initialize(){
    let ua = navigator.oscpu.toLowerCase();
    let mobiles = ["mobile","android","iphone","ipad","phone","nokia"]
    for(const tipo of mobiles){
        if(ua.includes(tipo)){
            document.getElementById('linkedin').setAttribute("href","https://www.linkedin.com/in/seroselli/?app=fbl");//prueba de apertura de link en navegador movil
            break;//NO FUNCIONA
        }
    }
    if(localStorage.getItem("tyc")){
        $("#avisoTerminos").hide();
    }
    

    limpiarTodo(); //LIMPIA FORMULARIO Y REINICIA VALIDACIONES
    checkTema();//CHEQUEA EL TEMA DARK O LIGHT
}



/*------------------------------------------------------------------EVENTOS USUARIO------------------------------------------------------------------*/

addEventListener("keyup",data => { //recibir evento de tecla enter y realizar diferentes acciones
    
    if(data.key == "Enter"){
        if( $("#calculadora").is(":visible")){
            validarDato("formulario",);//muestra el resultado o alert si da error la validacion
        }
        if( $("#resultado").is(":visible")){
            limpiarTodo();
            pasarPagina("calculadora");
        }
    }
    if(data.explicitOriginalTarget.localName == "input"){//si di enter dentro del input
        validarDato('numero',data.explicitOriginalTarget.id);
    }
})

$(function(){

    $("#s-bg-color").click(()=>{//BOTON CAMBIAR COLORES
        toggleTema();
    })
    $("#hijos").on("input",()=>{
        $("#cantHijos").empty();
        $("#cantHijos").text($("#hijos").val());//ACTUALIZAR VALOR DEL INPUT RANGE
    })
    $("#btnCalcular").click(()=>{//BOTON CALCULAR EN CALCULADORA
        validarDato("formulario",);
    })
    $("#btnPageCalculadora").click(()=>{ //BOTON VOLVER A CALCULADORA
        pasarPagina("calculadora");
    })
    $("#s-btnHistorial").click(()=>{//VER HISTORIAL
        limpiarTodo();
        generarListado();
        pasarPagina("historial");
    })
    $("#btnCalculadora").click(()=>{//VOLVER A CALCULADORA DESDE RESULTADO
        limpiarTodo();
        pasarPagina("calculadora");
    })
    $("#limpiarHistorial").click(()=>{//BOTON LIMPIAR HISTORIAL
        cleanHistory($("#limpiarHistorial").text() == "Esta seguro?")
    })
    $("#cartelito").click(()=>{//CERRAR CARTELITO
        cerrarAlerta();
    });
    $("#single").click(()=>{//SOLTERO
        $("#couple").removeClass("coupleOn").addClass("coupleOff");
        $("#single").removeClass("singleOff").addClass("singleOn");
    });
    $("#couple").click(()=>{//EN PAREJA
        $("#couple").removeClass("coupleOff").addClass("coupleOn");
        $("#single").removeClass("singleOn").addClass("singleOff");
    });

    $("#cobro").click(()=>{//abro circulo de fechas
        if($(".circle").css("display") == "flex"){
            $(".circle").css("display", "none");
            ocultarFechas();
            
        }else{
            $(".circle").css("display", "flex");
        }
    })
    $(".output").click(()=>{
            $(".circle").css("display", "none");//al hacer click fuera del selector de fecha
            ocultarFechas();
    })
    $("#listaCard").click(data=>{
        let ide = data.target.parentElement.id;
        if(ide.slice(0,4)=="item"){
           let index = parseInt(ide.slice(11,ide.length));//encuentro el "id" del item
            mostrarItem(index);
        }
})

$("#mostrarListado").click(data=>{
    let ide = data.target.parentElement.id;
    if(ide.slice(0,4)=="item"){
       let index = parseInt(ide.slice(11,ide.length));//encuentro el "id" del item
        mostrarItem(index);
    }
})
    $("#s-btnMenu").click(()=>{//switchar menu de contacto
        toggleHeader();
    })

    $("#ocultarTexto").click(()=>{//switchar menu de contacto
        $("#avisoTerminos").hide();
        localStorage.setItem("tyc",JSON.stringify(true))
    })
})


/*------------------------------------------------------------------FUNCIONES DE CALCULADORA------------------------------------------------------------------*/

function validarDato(tipo,id) { //-------VALIDACION DE DATOS--------
    let ide = "#"+id
    switch(tipo){
        case 'texto':
            if(validator.texto(id)){//devuelve true si hay un error
                $(ide).addClass("is-invalid");
            }
            else{
                $(ide).removeClass("is-invalid");
            }
        break;
        case 'numero':
            $(ide).removeClass();
            if(validator.numero(id)){//devuelve true si hay un error
                    $(ide).addClass("form-control is-invalid");
            }
            else{
                $(ide).addClass("form-control");
                    if(id == "sueldoBruto" && $(ide).val() >=20000){
                        $(ide).addClass("is-valid");
                    }
                    
            }

        break;
        case 'formulario':
            for (let i = 0; i < 4; i++) { //revisa si hay errores en los inputs de texto (almacenados en validator)
                if(validator.error[i]){
                    let ide = "#" + validator.verId(i);
                    alerta("Debe completar los campos correctamente");
                    $(ide).focus();//si hay error, te lleva al mismo para que lo corrijas
                    break;
                };
                if(!validator.error[i] && i==3){ //si no encuentra errores en la validacion 
                    conyuge = $("#couple").hasClass("coupleOn");
                    calcular($("#sueldoBruto").val(),$("#hijos").val(),$("#credito").val(),$("#alquiler").val(),$("#domestica").val());
                };
            }
        break;
    }
}

async function calcular(sueldoBruto, hijos, credito,alquiler,domestica) {//-------FUNCION PRINCIPAL DE LA CALCULADORA ASINCRONICA--------
    if(sueldoBruto >=20000){
        toggleSpinner();
        validarFecha();
        let deduccion = await calcDeducciones(sueldoBruto, hijos, credito,alquiler,domestica);
        let sueldoNuevo = new sueldos(sueldoBruto,calcAportes(sueldoBruto),await calcRetenciones(sueldoBruto, deduccion), deduccion ,verMes()); //USO AWAIT PARA ESPERAR EL RESULTADO ANTES DE AVANZAR
        mostrarSueldo(sueldoNuevo); //imprime valores en pagina resultado y lo muestra
        guardarSueldo(sueldoNuevo); //guarda los nuevos valores en el local storage
    }
    else{
        alerta("El sueldo bruto debe ser mayor a $20.000");
        $("#sueldoBruto").val(20000);
        validarDato("numero","sueldoBruto");
        $("#sueldoBruto").focus();
    }
}


async function calcDeducciones(sueldoBruto, hijos, credito,alquiler,domestica){ //sub funcion de calcular async, espera respuesta de servidor
    let limites = await httpGet("https://4754e748b0179b305c08fd4332bc4b1d.m.pipedream.net"); //ESPERA RESPUESTA DEL SERVIDOR ANTES DE AVANZAR
    if(sueldoBruto>limites.minimoImponible){
        conyuge *=(80033.97/12); //por conyuge se deduce un monto anual
        hijos = hijos*(40361.43/12); //por cada hijo, es una deducción
        credito = credito>0? credito:0; //NaN = 0
        credito = credito>(limites.topes[0])?(limites.topes[0]):credito;
        alquiler = alquiler>0 ? alquiler:0; //NaN = 0
        alquiler = (alquiler*12*0.4)>(limites.topes[1]/12)?limites.topes[1]:(alquiler*0.4); //genera un tope de topeAlquiler o deduce el 40% del alquiler
        domestica = domestica>0 ? domestica:0; //NaN = 0
        domestica = domestica>limites.topes[2]? limites.topes[2] : domestica; //genera un tope de topeDomestica
        return parseFloat(conyuge+hijos+alquiler+credito+domestica);
    }
    else{
        return false;
    }   
}

async function calcRetenciones(sueldoBruto, deduccion){//CALCULA LAS RETENCIONES DEL IIGG
    let limites = await httpGet("https://4754e748b0179b305c08fd4332bc4b1d.m.pipedream.net"); //ESPERA RESPUESTA DEL SERVIDOR ANTES DE AVANZAR
    let excedente =  deduccion!=false ? sueldoBruto - deduccion - limites.minimoImponible : sueldoBruto - limites.minimoImponible;
    return excedente > 0 ? (((excedente*12)*0.12 + limites.ganancias)/12).toFixed(2): 0;
}


function calcAportes(sueldo) {//sub funcion de calcular
    return (sueldo*0.11) + (sueldo*0.03) + (sueldo*0.03);
}

function validarFecha(){//-------SI EL USUARIO DEJA SIN SELECCIONAR LA FECHA, SE PONE POR DEFECTO EL MES ACTUAL--------
    if($("#btnMes").text()=="MES"){
        let dato = Date.now();
        dato = new Date(dato)
        mesSeleccionado =  meses[dato.getMonth()];
    }
    else{
        mesSeleccionado = $("#btnMes").text();
    }
    if($("#btnAño").text()=="AÑO"){
        let dato = Date.now();
        dato = new Date(dato)
        añoSeleccionado =  dato.getFullYear();
    }
    else{
        añoSeleccionado = $("#btnAño").text();
    }

}

/*------------------------------------------------------------------FUNCIONES DE RESULTADO------------------------------------------------------------------*/

function mostrarSueldo(sueldoNeto) { //-------MUESTRA RESULTADO--------
    $("#mostrandoResultado").empty();
    $("#mostrandoResultado").append(`
    <p class="fs-3">Cálculo de Sueldo Neto correspondiente al mes ${sueldoNeto.sMes}</p>
    <p class="fs-3">Sueldo Bruto ingresado: $` + new Intl.NumberFormat(["ban", "id"]).format(parseFloat(sueldoNeto.sBruto).toFixed(2)) + `</p>
    <p class="fs-3">Retenciones por IIGG: $`+ new Intl.NumberFormat(["ban", "id"]).format(parseFloat(sueldoNeto.sRetencion).toFixed(2)) + `</p>
    <p class="fs-3">Aportes al estado: $`+ new Intl.NumberFormat(["ban", "id"]).format(parseFloat(sueldoNeto.sAportes).toFixed(2)) + `</p>
    <p class="fs-1" style="color: tomato;">Sueldo Neto en mano: $`+ new Intl.NumberFormat(["ban", "id"]).format(parseFloat(sueldoNeto.sNeto).toFixed(2)) + `</p>
    `);
    toggleSpinner();
    pasarPagina("resultado");
}

function guardarSueldo(sueldoNuevo) {//-------GUARDA EL SUELDO EN LOCALSTORAGE--------
    if(localStorage.getItem('history')==null){//si el local storage esta vacio
        let arreglo = [];
        arreglo.push(sueldoNuevo)
        localStorage.setItem('history',JSON.stringify(arreglo)); // crea un arreglo y agrega un nuevo sueldo JSON
    }
    else{//si el local storage contiene algo
      let historial = JSON.parse(localStorage.getItem('history'));  
      historial.push(sueldoNuevo);
      localStorage.setItem('history',JSON.stringify(historial));// agrega el sueldo nuevo al historial JSON
    }
}

/*------------------------------------------------------------------FUNCIONES DE HISTORIAL------------------------------------------------------------------*/


function generarListado() {//-------GENERA Y DIBUJA EL LISTADO DEL HISTORIAL POR COLUMNAS--------
    let historial = JSON.parse(localStorage.getItem('history'));//toma el historial del localstorage
    if(historial != null){//revisa si hay o no historial
        $("#limpiarHistorial").attr("disabled", false);
        let index = 0;
        for (const item of historial){
            $("#mostrarListado").append('<div id="itemListado'+ index +'" class="row align-items-center justify-content-center itemListado"'+'></div>');
            let id = "#itemListado"+index;
            $(id).append('<div id="listadoFecha'+ index +'" class="col-2 text-center text-responsive-1 border-start"'+'>'+calcularFecha(item.sFecha,true)+'</div>');
            $(id).append('<div id="listadoMes'+ index +'" class="col-2 text-center text-responsive-1 border-start"'+'>'+item.sMes+'</div>');
            $(id).append('<div id="listadoBruto'+ index +'" class="col-2 text-center text-responsive-1 border-start"  title="$'+new Intl.NumberFormat(["ban", "id"]).format((item.sBruto).toFixed(2))+'" >'+"$" + roundNumbers(item.sBruto) +'</div>');
            $(id).append('<div id="listadoRetenciones'+ index +'" class="col-2 text-center text-responsive-1 border-start"  title="$'+new Intl.NumberFormat(["ban", "id"]).format((item.sRetencion).toFixed(2))+'" >'+"$" + roundNumbers(item.sRetencion) +'</div>');
            $(id).append('<div id="listadoAportes'+ index +'" class="col-2 text-center text-responsive-1 border-start"  title="$'+new Intl.NumberFormat(["ban", "id"]).format((item.sAportes).toFixed(2))+'" >'+"$" + roundNumbers(item.sAportes) +'</div>');
            $(id).append('<div id="listadoNeto'+ index +'" class="col-2 text-center text-responsive-1 fw-bold border-start" style="color: red;" title="$'+new Intl.NumberFormat(["ban", "id"]).format((item.sNeto).toFixed(2))+'" >'+"$" + roundNumbers(item.sNeto) +'</div>');
            index+=1;
        }
    }
    else{
        $("#limpiarHistorial").attr("disabled", true);
        alerta("No hay registro de historial");
    }

}

function mostrarItem(index){//para dispositivos moviles que necesitan ampliar la información
    $("#cartelito div div").removeClass("text-center");
    let item = "#itemListado" + index;
    $(".selected").removeClass("selected");
    $(item).addClass("selected");
    let historial = JSON.parse(localStorage.getItem('history'));
    if(historial!=null){
        let mostrar =   "<u>Registro:</u> <b>" + calcularFecha(historial[index].sFecha,false) + "</b><br>" +
                        "<u>Mes:</u> <b>"+ historial[index].sMes + "</b><br>" +
                        "<u>Sueldo Bruto:</u> <b>$" + new Intl.NumberFormat(["ban", "id"]).format((historial[index].sBruto).toFixed(2)) + "</b><br>" +
                        "<u>Retenciones:</u> <b>$" + new Intl.NumberFormat(["ban", "id"]).format((historial[index].sRetencion).toFixed(2)) + "</b><br>" +
                        "<u>Aportes:</u> <b>$" + new Intl.NumberFormat(["ban", "id"]).format((historial[index].sAportes).toFixed(2)) + "</b><br>" +
                        "<u>Sueldo Neto:</u> <b>$" + new Intl.NumberFormat(["ban", "id"]).format((historial[index].sNeto).toFixed(2)) + "</b>";
                        alerta(mostrar);
    }
    
}



function roundNumbers(numero){ //funcion para aplicar prefijos en caso de numeros altos (evitar ocupar espacio)
    numero = parseFloat(numero);
    if(numero>999999999999){
        let b = (parseFloat(numero) / 100000000000).toFixed(2)
        return ( new Intl.NumberFormat(["ban", "id"]).format(b) + "B")
    }
    if(numero>=1000000 && numero <=999999999999){
        let m = (parseFloat(numero) / 1000000).toFixed(2)
        return (new Intl.NumberFormat(["ban", "id"]).format(m) + "M")
    }
    if(numero<=999999){
       return (new Intl.NumberFormat(["ban", "id"]).format(numero.toFixed(2)))
    }

}

function cleanHistory(sure){//-------LIMPIA EL HISTORIAL, CONFIRMACION--------
    if(sure){
        localStorage.clear();
        $("#limpiarHistorial").text("Borrar Historial")
        $("#limpiarHistorial").removeClass("btn-warning");
        alerta("Historial borrado");
        $("#historial").css("left","2000px");
        $("#calculadora").show();
        setTimeout(() => {
            $("#calculadora").css("left","0px");
            $("#historial").hide();
        }, 300); 
    }
    else{
        $("#limpiarHistorial").addClass("btn-danger");
        $("#limpiarHistorial").text("Esta seguro?");
    }
}

/*------------------------------------------------------------------FUNCIONES GLOBALES------------------------------------------------------------------*/

function calcularFecha(numero, corta) { //-------CONVIERTE EL NUMERO DATE EN FECHA LEGIBLE--------
    let fecha = new Date(numero);
    let año = fecha.getFullYear();
    let dia = (fecha.getDay()+2)<10?"0"+(fecha.getDay()+2):fecha.getDay()+2;
    let mes = (fecha.getMonth()+1)<10?"0"+(fecha.getMonth()+1):fecha.getMonth()+1;
    let hora = fecha.getHours()<10?"0"+(fecha.getHours()):fecha.getHours();
    let min = fecha.getMinutes()<10?"0"+fecha.getMinutes():fecha.getMinutes();
    let seg = fecha.getSeconds()<10?"0"+fecha.getSeconds():fecha.getSeconds();
    return corta? dia + "/" + mes + "/" + año: dia + "/" + mes + "/" + año + " " + hora + ":" + min + ":" + seg;
  }

function verMes(){  //-------MUESTRA EL MES ACTUAL--------
  return  mesSeleccionado + "/" + añoSeleccionado;
}

function alerta(texto){//-------MUESTRA UN "ALERT" CUSTOMIZADO--------
    $("#textoCartelito").empty();
    $("#textoCartelito").append(texto);
    $("#cartelito").fadeIn("fast");
}
function cerrarAlerta(){//-------CIERRA EL ALERT--------
         $("#cartelito").fadeOut("fast");
         setTimeout(() => {
            $("#cartelito div div").addClass("text-center");
        }, 200);
        
}

function checkTema(){//-------REVISA LA CONFIGURACION DE COLOR EN LOCAL STORAGE--------
    let tema = localStorage.getItem("theme");
    if (tema!=null){
        if(tema == "night"){
            $("#bg-color").removeClass("moon").addClass("sun");
            $("body").css("background-color","rgb(39, 39, 39)");
            $(".letras-color").css("color","white");

        }else{
            $("#bg-color").removeClass("sun").addClass("moon");
            $("body").css("background-color","white");
            $(".letras-color").css("color","black");
        }
    }
}

function toggleTema(){//-------SWITCHEA LA CONFIGURACION DE COLOR--------
    if($("#bg-color").hasClass("moon")){
        $("#bg-color").removeClass("moon").addClass("sun");
        $("body").css("background-color","rgb(39, 39, 39)");
        $(".letras-color").css("color","white");
        localStorage.removeItem("theme");
        localStorage.setItem("theme","night");
    }else{
        $("#bg-color").removeClass("sun").addClass("moon");
        $("body").css("background-color","white");
        $(".letras-color").css("color","black");
        localStorage.removeItem("theme");
        localStorage.setItem("theme","day");
    }

}

function toggleSpinner(){//switchea el spinner
    if($("#spinner").is(":visible")){
        $("#spinner").hide();
    }
    else{
        $("#spinner").show();
    }
}

function limpiarTodo() {//-------LIMPIAR TABLAS E INPUTS--------
    validator.reset();
    $("input").val("").removeClass("is-valid").removeClass("is-invalid");
    $("#mostrarListado").empty();
    $("#hijos").val("0");
    $("#cantHijos").text("0");
    $("#single").trigger("click");
    
    reiniciar();
    $("#sueldoBruto").focus();
}

function toggleHeader(){
    if($("#btnMenu").hasClass("btnMenu")){
        $("#btnMenu").css("transform","scale(0.1)");
        $(".barraAzul").css("height","40px");
        setTimeout(() => {
            $("#btnMenu").removeClass("btnMenu").addClass("btnCross");
                $("#btnMenu").css("transform","scale(1)");
                $(".headerr").css("display","flex");
        }, 100);
    }
    else{
        $("#btnMenu").css("transform","scale(0.1)");
        setTimeout(() => {
            $("#btnMenu").removeClass("btnCross").addClass("btnMenu");
                $(".headerr").hide();
                $("#btnMenu").css("transform","scale(1)");
                $(".barraAzul").css("height","4px");
        }, 100);

    }
}

function pasarPagina(pagina){//-------FUNCION DE PASAR PAGINA, RECIBE QUE PAGINA ABRIR--------
    $("#limpiarHistorial").text("Borrar Historial");
    switch (pagina){
        case 'historial':
            if($("#calculadora").is(":visible")){
                $("#calculadora").css("left","-2000px");
                $("#historial").show();
                setTimeout(() => {
                    $("#historial").css("left","0px");
                    $("#calculadora").hide();
                }, 400);
            }
            if($("#resultado").is(":visible")){
                $("#resultado").css("left","-2000px");
                $("#historial").show();
                setTimeout(() => {
                    $("#historial").css("left","0px");
                    $("#resultado").hide();
                }, 400);
            }
        break;
        case 'resultado':
            $("#calculadora").css("left","2000px");
            $("#resultado").show();
            setTimeout(() => {
                $("#calculadora").hide();
                $("#resultado").css("left","0px");
            }, 400);        
        break;
        case 'calculadora':
            if($("#historial").is(":visible")){
                $("#historial").css("left","2000px");
                $("#calculadora").show();
                setTimeout(() => {
                    $("#calculadora").css("left","0px");
                    $("#historial").hide();
                }, 100);      
            }else{
                $("#resultado").css("left","-2000px");
                $("#calculadora").show();
                setTimeout(() => {
                    $("#resultado").hide();
                    $("#calculadora").css("left","0px");
                }, 400);  
            }
        break;
    }
}

/*------------------------------------------------------------------FIN INDEX.JS------------------------------------------------------------------*/
