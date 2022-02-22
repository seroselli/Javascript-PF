import { AceptacionController , AceptacionView , ErrorComponent} from "./controller.js";

export  const app = new AceptacionController (new AceptacionView());

export  const routes = [
    {path: '/'     , action:'general'},
    {path:'/terminos'    , action:'terminos'},
    {path:'/modificaciones'    , action:'modificaciones'}
];



export const parseLocation = () => location.hash.slice(1).toLowerCase() || '/';

export const findActionbyPath = (path,routes) => routes.find( ruta => ruta.path == path || undefined);

export const router = () => {
    const path = parseLocation();
    const {action='error'} = findActionbyPath(path , routes) || {};
    switch(action){
        case 'general':
            app.general("#app");
        break;
        case 'terminos':
            app.terminos("#app");
        break;
        case 'modificaciones':
            app.modificaciones("#app");
        break;
        default:
            ErrorComponent("#app");
            break;
    }
}


$(window).on('load',()=>{
    router();
})

$(window).on("hashchange",()=>{
    router();
})
