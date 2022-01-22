export default class validadors {
    constructor (){
        this.numeros = "0123456789.";
        this.letras = "abcdefghijklmnñopqrstuvwxyzABCDEFGHIJKLMNÑOPQRSTUVWXYZ ,:;+-*/!#$%&/()=?¡*¨][_{}|°¬<>¿'´";
        this.error = [true,false,false,false];//required,no,no,no
    }
    reset(){
        this.error[0]= true;
        this.error[1]= false;
        this.error[2]= false;
        this.error[3]= false;
    }
    texto(id){//sin uso por ahora - VALIDA QUE EL TEXTO INGRESADO SEAN LETRAS SIN NUMEROS
        if(id != null){
        let palabra = document.getElementById(id).value
        for(let i=0; i<palabra.length; i++){
            if (this.numeros.indexOf(palabra.charAt(i),0)!=-1){
                this.marcarError(id);
                return true;
                }
            }
        this.desmarcarError(id);
        return false;
        }
    }
    numero(id){//VALIDA QUE EL STRING INGRESADO SEAN NUMEROS
        if(id != null){
        let palabra = document.getElementById(id).value
        let contador=0;
        for(let i=0; i<palabra.length; i++){
            if (this.numeros.indexOf(palabra.charAt(i),0)!=-1){
                contador++;
                }
        }
        if(contador===palabra.length){
            this.desmarcarError(id);
            return false;
        }
        else{
            this.marcarError(id);
            return true;
        }

        }
    }
    marcarError(id){//MARCA UN ERROR EN CADA UNA DE LOS INPUTS
        switch(id){
            case 'sueldoBruto':
                this.error[0] = true;
            break;
            case 'credito':
                this.error[1] = true;
            break;
            case 'alquiler':
                this.error[2] = true;
            break;
            case 'domestica':
                this.error[3] = true;
            break;
        }
    }
    desmarcarError(id){ //DESMARCA EL ERROR EN CADA UNA DE LOS INPUTS
        switch(id){
            case 'sueldoBruto':
                this.error[0] = false;
            break;
            case 'credito':
                this.error[1] = false;
            break;
            case 'alquiler':
                this.error[2] = false;
            break;
            case 'domestica':
                this.error[3] = false;
            break;
        }
    }
    verId(pos){ //DEVUELVE EL ID DE CADA POSICION DEL ARRAY
        switch(pos){
            case 0:
                return "sueldoBruto";
            break;
            case 1:
                return "credito";
            break;
            case 2:
                return "alquiler";
            break;
            case 3:
                return "domestica";
            break;
        }
    }
}