
let activeMenu =0;
let content1,content2;
const meses = ["ENE","FEB","MAR","ABR","MAY","JUN","JUL","AGO","SEP","OCT","NOV","DIC"]
let mesSeleccionado = "MES",añoSeleccionado = "AÑO";





addEventListener("click",elemento => {
    let id = elemento.explicitOriginalTarget.id;
    let tag = elemento.explicitOriginalTarget.nodeName;
    if(activeMenu==0){//si el menu esta cerrado
        if(id == "btnAño"){
            abrirMenuAños(); //muestro años
        }
        if(id == "btnMes"){
            abrirMenuMeses(); //muestro meses
        }
    }
    if((activeMenu == 1 || activeMenu == 2) && tag == "path"){
            let item;
            let clases = elemento.explicitOriginalTarget.classList;
            for (let i = 0; i < clases.length; i++) {
                if(clases[i].length <= 3){
                    item = clases[i];//busco la clase mXX o aXX ( a la cual se le hizo click)
                }
            }
            itemSeleccionado(item);
    }
    if(activeMenu==1){ //si el menu meses esta abierto
        if(id == "btnMes"){
            ocultarFechas(); //muestro años
        }
        if(id == "btnAño"){
            abrirMenuAños(); //muestro meses
        }
    }
    if(activeMenu==2){
        if(id == "btnAño"){
            ocultarFechas(); //muestro años
        }
        if(id == "btnMes"){
            abrirMenuMeses(); //muestro meses
        }
    }

})


function itemSeleccionado(item){
    if(activeMenu === 1){
        mesSeleccionado = meses[item.slice(1)-1];
        ocultarFechas();
        if(añoSeleccionado != ""){
            $(".circle").css("display", "none");
        }
        actualizarDatos();
    }   
    if(activeMenu === 2){
        añoSeleccionado = (2013+parseInt(item.slice(1)));
        ocultarFechas();
        if(mesSeleccionado != ""){
            $(".circle").css("display", "none");
        }
        actualizarDatos();
    }
    
}


function actualizarDatos(){
    $("#btnMes").text(mesSeleccionado);
    $("#btnAño").text(añoSeleccionado);
    $("#cobro").text(mesSeleccionado + "/" + añoSeleccionado );
}

function abrirBotones(){
    ocultarFechas();
    $("#svgFecha").show();
    let nModulo = 0; 
    let content =  setInterval(() => {
        nModulo += 1;
        let clase = ".modulo.m" + nModulo;
        $(clase).slideDown();
        if(nModulo == 12){
            clearInterval(content);
        }
    }, 10);
    
}


async function abrirMenuAños(){
    abrirBotones();

    let nModulo = 0;
    content1 =  setInterval(() => {
        nModulo += 1;
        let clase = ".letra.a" + nModulo;
        $(clase).slideDown();
        if(nModulo == 12){
            clearInterval(content1);
            activeMenu = 2;
            $(".output").show();
        }
    }, 10);
}
async function abrirMenuMeses(){
    abrirBotones();
    let nModulo = 0; 
    content2 =  setInterval(() => {
        nModulo += 1;
        let clase = ".letra.m" + nModulo;
        $(clase).slideDown();
        if(nModulo == 12){
            clearInterval(content2);
            activeMenu = 1;
            $(".output").show();
        }
    }, 10);
    
}

export async function ocultarFechas(){
    clearInterval(content1);
    clearInterval(content2);
    $(".output").hide();
    $(".modulo").hide();
    $(".letra").hide();
    $("#svgFecha").hide();
    activeMenu = 0;
}

export function reiniciar(){
    $("#btnAño").text("AÑO");
    $("#btnMes").text("MES");
    $("#cobro").text("Fecha de cobro");
    mesSeleccionado = "MES";
    añoSeleccionado = "AÑO";

}

