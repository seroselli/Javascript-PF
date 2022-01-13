import {limites} from './limites.js'

export default class sueldos {
    constructor (bruto, aportes,deduccion, mes){
        this.sBruto = bruto;
        this.sAportes = aportes;
        this.sDeduccion = deduccion;
        this.excedente = this.sDeduccion!=false ? this.sBruto - this.sDeduccion - limites.minimoImponible : this.sBruto - limites.minimoImponible;
        this.mes = mes;
        this.retencion = this.excedente > 0 ? (((this.excedente*12)*0.12 + limites.ganancias)/12).toFixed(2): 0;
        this.sNeto = (this.sBruto-this.sAportes-this.retencion).toFixed(2);
    }
    verSueldoNeto(){
       return (this.sBruto-this.sAportes-this.retencion);
    }  
    verSueldoBruto(){
       return this.sBruto;
    }
    verAportes(){
        return this.sAportes;
    }
    verRetencion(){
        return this.retencion;
    }
}