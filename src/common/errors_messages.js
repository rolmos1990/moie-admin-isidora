import {getErrorMessage} from "./utils";

/** Mostrar mensajes de errores */
const OfficeMessage = 'Despacho:';

export const getModuleMessage = (error) => {
    if(error.includes(OfficeMessage)){
        return error;
    }

    return "No se ha podido completar la acción";
}

export const getErrorModuleMessage = (error) => {
    return getModuleMessage(getErrorMessage(error));
}
