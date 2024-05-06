import {BOOLEAN_STRING} from "./constants";
import moment from "moment";
import {baseImagePath, baseImagePathNew} from "../helpers/api_helper";
import {showMessage} from "../components/MessageToast/ShowToastMessages";
import userImage from "../assets/images/users/user.png"
import {saveAs} from 'file-saver';

export const BOOLEAN_STRING_OPTIONS = [
    {label: '-', value: null},
    {label: BOOLEAN_STRING.YES, value: true},
    {label: BOOLEAN_STRING.NO, value: false}
];

export const YES_NO_OPTIONS = [
    {label: '-', value: null},
    {label: 'Si', value: true},
    {label: 'No', value: false}
    ];

export const STATUS_OPTIONS = [
    {label: '-', value: null},
    {label: "Activo", value: true},
    {label: "Inactive", value: false}
];

export const PAYMENT_OPTIONS = [
    {label: '-', value: null},
    {label: "Pendiente", value: 0},
    {label: "Conciliado", value: 1},
    {label: "Anulado", value: 2}
];

export const DATE_FORMAT = {
    FULL_DATE: 'FULL_DATE',
    ONLY_DATE: 'ONLY_DATE',
    ONLY_TIME: 'ONLY_TIME',
    DD_MM_YYYY: 'DD_MM_YYYY'
};

export const isValidOption = (options, option) => {
    return options.filter(o => o.value !== null).map(o => o.value).includes(option);
};

export const isValidObject = (object) => {
    return undefined !== object && null !== object;
};

export const isValidString = (str) => {
    return isValidObject(str) && "" !== str;
};

export const priceFormat = (amount = 0, currency = "", decimalWithCommas = true) => {

    if (amount === 0 || amount === "" || amount === undefined) {
        return "0.00";
    }

    let amountRender = (parseFloat(amount).toFixed(2));
    if (decimalWithCommas) {
        amountRender = numberWithCommas(amountRender);
        if(currency && currency != ""){
            amountRender = `${currency} ${amountRender}`;
        } else {
            amountRender = `${amountRender}`;
        }
    }
    return amountRender;
}

const numberWithCommas =(x) =>{
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export const formatDate =(date, type = DATE_FORMAT.FULL_DATE) =>{
    try {
        switch (type) {
            case DATE_FORMAT.FULL_DATE:
                return moment(date, moment.ISO_8601).format('DD-MM-YYYY HH:mm:ss');
            case DATE_FORMAT.ONLY_DATE:
                return moment(date, moment.ISO_8601).format('YYYY-MM-DD');
            case DATE_FORMAT.DD_MM_YYYY:
                return moment(date, moment.ISO_8601).format('DD-MM-YYYY');
            case DATE_FORMAT.ONLY_TIME:
                return moment(date, moment.ISO_8601).format('HH:mm:ss');
            default:
                return moment(date, moment.ISO_8601).format('DD-MM-YYYY HH:mm:ss');
        }
    }catch (e){
        console.log(e)
    }
    return moment(date, moment.ISO_8601).format('DD-MM-YYYY HH:mm:ss');
}

export const formatDateToServerEndOfDay =(date) => {
    try {
        return moment(date).endOf('day').format("YYYY-MM-DD[T]HH:mm:ss");
    }catch (e){
        console.log(e)
    }
    return "";
}

export const formatDateToServerStartOfDay =(date) => {
    try {
        return moment(date).startOf('day').format("YYYY-MM-DD[T]HH:mm:ss");
    }catch (e){
        console.log(e)
    }
    return "";
}

export const formatDateToServer =(date) =>{
    try {
        return moment(date).format("YYYY-MM-DD[T]HH:mm:ss");
    }catch (e){
        console.log(e)
    }
    return "";
}
export const getMoment =() =>{
    try {
        return moment();
    }catch (e){
        console.log(e)
    }
    return "";
}

export const getImageByGroup = (productImage, group) => {
    try{
        const _image = productImage.filter(item => item.group === group);
        return _image[0];
    }
    catch(e){
        return null;
    }
}

export const getImageByQuality = (imgData, quality) => {
    if(!imgData) return null;

    const path = imgData.path && imgData.path.includes('uploads') ? baseImagePathNew : baseImagePath;

    let result = imgData.path;
    if (!imgData.thumbs) {
        return `${path}${result}`;
    }
    try {
        if (imgData.thumbs) {
            let thumbs = imgData.thumbs;
            if (imgData.thumbs.startsWith && imgData.thumbs.startsWith('{')) {
                thumbs = JSON.parse(imgData.thumbs);
            }
            if (thumbs[quality]) {
                result = thumbs[quality];
            }
        }
    } catch (e) {
        console.error('Error: ' + imgData.thumbs, e);
    }
    return `${path}${result}?${getMoment().unix()}`;
}
export const getImagePath = (photoPath) => {
    if (!photoPath) return userImage;
    const basePath = photoPath.includes('uploads') ? baseImagePathNew : baseImagePath;
    return `${basePath}${photoPath}`;
}
export const getBaseCategoryPath = (photoPath) => {
    const basePath = baseImagePathNew + "uploads/categories/";
    return `${basePath}${photoPath}`;
}

export const getErrorMessage = (error) => {
    if (!error) {
        return "Se ha producido un error";
    }
    if (!error.response || !error.response.data || !error.response.data.error) {
        return error.message || "Se ha producido un error";
    }
    return error.response.data.error;
};
export const parseJson = (data) => {
    let result = null;
    try {
        return JSON.parse(data)
    } catch (e) {
        console.error('parseJson', e);
    }
    return result;
}

export const buildNumericOptions = (qty, sk=1, start=0) => {
    const valueList = [];
    for (let i = start; i <= qty;) {
        valueList.push({label: i, value: i});
        i+= sk;
    }
    return valueList;
}

//REF: https://komsciguy.com/js/a-better-way-to-copy-text-to-clipboard-in-javascript/
export const  copyToClipboard =(text)=> {
    const listener = function(ev) {
        ev.preventDefault();
        ev.clipboardData.setData('text/plain', text);
        showMessage.success("Copiado");
    };
    document.addEventListener('copy', listener);
    document.execCommand('copy');
    document.removeEventListener('copy', listener);
}

export async function downloadFile(fileB64, name) {
    try {

        const blob = b64toBlob(fileB64);
        saveAs(blob, name + ".pdf");
    }catch(e){
    }
}

export const printPartOfPage=(htmlToPrint) => {
    const iframeId = new Date().getTime();
    let pri
    if (document.getElementById(iframeId)) {
        pri = document.getElementById(iframeId).contentWindow
    } else {
        const iframe = document.createElement('iframe')
        iframe.setAttribute('title', iframeId)
        iframe.setAttribute('id', iframeId)
        iframe.setAttribute('style', 'height: 0px; width: 0px; position: absolute;')
        document.body.appendChild(iframe)
        pri = iframe.contentWindow
    }
    pri.document.open()
    pri.document.write(htmlToPrint)
    pri.document.close()
    pri.focus()
    pri.print()
}

export const threeDots = (text, length) => {
    if (text.trim().length > length) {
        return text.trim().substr(0, length).trim() + "...";
    }
    return text;
}
export const sortArray = (a,b, asc) => {
    if(a === b){
        return 0;
    }
    if(asc){
        return a.id < b.id ? -1:1
    }
    return a.id > b.id ? 1:-1
}

export const b64toBlob = (b64Data, contentType='', sliceSize=512) => {
    const byteCharacters = atob(b64Data);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
        const slice = byteCharacters.slice(offset, offset + sliceSize);

        const byteNumbers = new Array(slice.length);
        for (let i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
        }

        const byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
    }

    const blob = new Blob(byteArrays, {type: contentType});
    return blob;
}

export const sortList = (data, fieldName) => {
    return (data || []).sort((a, b) => a[fieldName] === b[fieldName] ? 0 : (a[fieldName] > b[fieldName]) ? 1 : -1)
};


export const productPriceWithDiscount = (product) => {
    let discount = 0;
    if(product) {
        if (product.discount > 0) {
            discount = (product.price * product.discount) / 100;
        } else if (product.category && product.category.discountPercent > 0) {
            discount = (product.price * product.category.discountPercent) / 100;
        }
        return priceFormat(product.price - discount);
    } else {
        return 0;
    }
}

export const trim = (_str) => {
    if(!_str){
       return _str;
    }
    _str = _str.trim();
    _str = _str.replace(/\s+/g, '').trim();
    return _str;
}

//trim double spaces
export const __trim = (_str) => {
    try {
        if (!_str) {
            return _str;
        }
        _str = _str.trim().replace(/\s+/g, " ");
        return _str;
    }catch(e){
        return _str;
    }
}

//sort alphanumeric
export const sortAlphanumeric = (arr,key) => {
    try {
        const sorted = arr.sort((a, b) => {
            return a[key].localeCompare(b[key], undefined, {
                numeric: true,
                sensitivity: 'base'
            })
        })
        return sorted;
    }catch(e){
        return arr;
    }
};

export const _encodePhone = (_string) => {
    const encoded = btoa(_string);
    return encoded;
}

export const hiddenPhone = (phone) => {

    if (!phone || phone.length <= 3) {
        return ""; // Devolver cadena vacía si no hay valor
    }

    // Obtener los últimos cuatro dígitos
    return '** ** ** ' + phone.slice(-4);
}
