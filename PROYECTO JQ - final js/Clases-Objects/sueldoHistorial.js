export default class sueldoHistorial{
    constructor(bruto,retencion,aportes,neto,mes) {
        this.sBruto = bruto;
        this.sMes = mes;
        this.sRetencion = retencion;
        this.sAportes = aportes;
        this.sNeto = neto;
        this.sfecha = Date.now();
    }
}