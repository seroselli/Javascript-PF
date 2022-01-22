export default class sueldos {
    constructor (bruto,aportes, retencion,deduccion ,mes){
        this.sBruto = parseFloat(bruto) ;
        this.sAportes = parseFloat(aportes);
        this.sDeduccion = parseFloat(deduccion);
        this.sMes = mes;
        this.sRetencion = parseFloat(retencion);
        let neto = parseFloat(bruto-aportes-retencion);
        this.sNeto = neto;
        this.sFecha = Date.now();
    }
}