

export class AceptacionView{
    general(padre){
        let html = '';
        html = `
        <div class="container-fluid">
            <div class="row">
                <div class="col-xs-12 col-md-8">
                    <h3 class="title h2" id="content">General</h3>
                    <p>Los presentes términos y condiciones detallados a continuación constituyen el entero acuerdo entre las partes y derogan cualquier acuerdo anterior entre las partes en esta materia.</p>
                    <p>La declaración de que alguna de las disposiciones de estos términos y condiciones fuese inválida o no ejecutable, no tendrá efecto alguno sobre las demás provisiones de estos términos y condiciones, las cuales permanecerán con total efecto y vigencia.</p>
                    <p>Estos términos y condiciones generales son aplicables al uso de los sistemas y servicios ofrecidos por la Calculadora de Impuesto a las Ganancias.</p>
				</div>
            </div>
        </div>
        `
        $(padre).html(html);
        $("#general").addClass("selectedLi");
        $("#terminos").removeClass("selectedLi");
        $("#modificaciones").removeClass("selectedLi");
    }

    terminos(padre){
        let html = '';
        html = `
        <div class="container-fluid">
            <div class="row">
                <div class="col-xs-12 col-md-8">
                <h3 class="title h2" id="content">Aceptación de términos y condiciones</h3>
                <p>El acceso a o uso de la Calculadora de Impuesto a las Ganancias (en adelante "IIGG") requiere que todos los visitantes se adhieran a los términos y condiciones, aceptándolos desde ese momento, plenamente y sin reserva alguna.</p>
                <p>Así también se aceptarán las condiciones particulares que en el futuro puedan complementarlos, sustituirlos o modificarlos en algún sentido en relación con los servicios y contenidos del Portal.</p>
                <p>Por el solo hecho de ingresar y hacer uso de este Portal, usted (en adelante "el usuario") adhiere en forma inmediata a todos y cada uno de los siguientes términos y condiciones.</p>
                <p>El Usuario deberá leer detenidamente la totalidad de los términos y condiciones, incluyendo las condiciones particulares, antes de acceder o utilizar cualquier servicio del Portal bajo su entera responsabilidad.</p>
            </div>
            </div>
        </div>
        `
        $(padre).html(html);
        $("#general").removeClass("selectedLi");
        $("#terminos").addClass("selectedLi");
        $("#modificaciones").removeClass("selectedLi");
    }

    modificaciones(padre){
        let html = '';
        html = `
        <div class="container-fluid">
            <div class="row">
                <div class="col-xs-12 col-md-8">
                <h3 class="title h2" id="content">Modificación del Portal</h3>
                <p>La Calculadora de Impuestos a las Ganancias se reserva el derecho de modificar o eliminar el contenido, estructura, diseño, servicios y condiciones de acceso o uso de este Portal, en cualquier momento y sin necesidad de previo aviso.</p></div>
            </div>
        </div>
        `
        $(padre).html(html);
        $("#general").removeClass("selectedLi");
        $("#terminos").removeClass("selectedLi");
        $("#modificaciones").addClass("selectedLi");
    }

}

export class AceptacionController{

    constructor(aceptacionView){
        this.aceptacionView = aceptacionView;
    }

    general(app){
        this.aceptacionView.general(app);
    }
    terminos(app){
        this.aceptacionView.terminos(app);
    }
    modificaciones(app){
        this.aceptacionView.modificaciones(app);
    }
}

export const ErrorComponent = (padre) => {
    $(padre).html(`
    <div class="container-fluid">
        <div class="row">
            <div class="col-xs-12 col-md-8">
            <h3 class="title h2" id="content">Página no encontrada</h3>
            <p>La página que estas queriendo acceder no se encontró o no existe</p></div>
        </div>
    </div>
`)
}