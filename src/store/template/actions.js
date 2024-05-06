import {
    GET_TEMPLATES,
    GET_TEMPLATES_SUCCESS,
    GET_TEMPLATES_FAILED,
    GET_TEMPLATE,
    GET_TEMPLATE_SUCCESS,
    GET_TEMPLATE_FAILED,
    REGISTER_TEMPLATE,
    REGISTER_TEMPLATE_SUCCESS,
    REGISTER_TEMPLATE_FAILED,
    UPDATE_TEMPLATE,
    UPDATE_TEMPLATE_SUCCESS,
    UPDATE_TEMPLATE_FAILED,
    RESET_TEMPLATE,
    GET_TEMPLATE_CATALOG_FAILED,
    GET_TEMPLATE_CATALOG_SUCCESS,
    GET_TEMPLATE_CATALOG
} from "./actionTypes";

export const resetTemplate = () => ({
    type: RESET_TEMPLATE,
})

export const getTemplates = (conditional, limit, offset) => ({
    type: GET_TEMPLATES,
    conditional: conditional,
    limit: limit,
    offset: offset
})

export const getTemplatesSuccess = (data, meta) => ({
    type: GET_TEMPLATES_SUCCESS,
    meta: meta,
    payload: data,
})

export const getTemplatesFailed = error => ({
    type: GET_TEMPLATES_FAILED,
    payload: error,
})

export const getTemplate = id => ({
    type: GET_TEMPLATE,
    id
})

export const getTemplateSuccess = data => ({
    type: GET_TEMPLATE_SUCCESS,
    payload: data,
})

export const getTemplateFailed = error => ({
    type: GET_TEMPLATE_FAILED,
    payload: error,
})

export const registersTemplate = (data, history) => {
    return {
        type: REGISTER_TEMPLATE,
        payload: { data, history },
    }
}

export const registerTemplateSuccess = data => {
    return {
        type: REGISTER_TEMPLATE_SUCCESS,
        payload: data,
    }
}


export const registerTemplateFailed = data => {
    return {
        type: REGISTER_TEMPLATE_FAILED,
        payload: data,
    }
}

export const updateTemplate = (id, data, history) => {
    return {
        type: UPDATE_TEMPLATE,
        payload: { id, data, history },
    }
}
export const updateTemplateSuccess = data => {
    return {
        type: UPDATE_TEMPLATE_SUCCESS,
        payload: data,
    }
}
export const updateTemplateFail = error => {
    return {
        type: UPDATE_TEMPLATE_FAILED,
        payload: error,
    }
}

export const getTemplatesCatalog = (conditional, limit, offset) => ({
    type: GET_TEMPLATE_CATALOG,
    conditional: conditional,
    limit: limit,
    offset: offset
})

export const getTemplatesCatalogSuccess = (data, meta) => ({
    type: GET_TEMPLATE_CATALOG_SUCCESS,
    meta: meta,
    payload: data,
})

export const getTemplatesCatalogFailed = error => ({
    type: GET_TEMPLATE_CATALOG_FAILED,
    payload: error,
})
