let httpError = [
    "Hubo un problema al comunicarse con el servidor",
    "La URL indicada tiene un error o esta mal escrita",
    "El servidor tiene un problema",
    "El formulario no es JSON"
];

export async function httpGet(url,form){

    if(form==null){
    let respuesta = await $.get(url)
        .done(data=>{
            if(JSON.stringify(data) == "{}"){
               respuesta = null;
            }
        })
        .fail(data=>{respuesta = data.statusText})
        return respuesta;
    }
    else{
        if(typeof(form) == JSON){
            let respuesta = $.get(url,form);
            respuesta.done(data=>{
                if(JSON.stringify(data) == "  " || JSON.stringify(data) == undefined){
                    console.log(httpError[1]);
                }
                console.log(data)})
            respuesta.fail(()=>{console.log(httpError[0])})
        }
        else{
            console.log(httpError[3]);
        }

        }

    }

export async function httpPost(url,formulario){ //sin uso
    let respuesta  =  await $.post(url,formulario);
    return respuesta != null ? respuesta : JSON.parse(httpError[0]);
}