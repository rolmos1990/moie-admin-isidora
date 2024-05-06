// Login Method
import {del, file, get, post, put} from "./api_helper";
import * as url from "./url_helper";

const postLogin = data => post(url.POST_LOGIN, data);

const validateAccessLogin = data => post(url.VALIDATE_ACCESS, data);

const registerCustomer = data => post(url.CUSTOMER, data);

const updateCustomer = (id, data) => put(`${url.CUSTOMER}/${id}`, data);

//customers
const fetchCustomersApi = data => get(url.CUSTOMER, {}, data);
const fetchCustomer = data => get((data && data.id) ? `${url.CUSTOMER}/${data.id}` : url.CUSTOMER, data);
const deleteCustomerApi = (id) => del(`${url.CUSTOMER}/${id}`);
const fetchCustomerRegisteredsApi = () => get(`${url.CUSTOMER}/stats/registereds`, {});
const fetchCustomerOrderFinishedApi = (data) => post(`${url.CUSTOMER}/get/salesFinished`, data);

//products
const fetchProductsApi = params => get(url.PRODUCT, {}, params);
const fetchProductApi = data => get((data && data.id) ? `${url.PRODUCT}/${data.id}` : url.PRODUCT, data);
const registerProductApi = data => post(url.PRODUCT, data);
const updateProductApi = (id, data) => put(`${url.PRODUCT}/${id}`, data);
const reorderProductApi = (id, data) => post(`${url.PRODUCT}/${id}/reorder`, data);
const fetchInventoryProductsApi = params => get(`${url.PRODUCT}/get/products/withAvailabilities`, {}, params);

//const deleteProductApi = (id) => del(`${url.DELETE_PRODUCT}/${id}`);
const updateProductSizeListApi = (productId, data) => post(`${url.PRODUCT}/${productId}/changeSize`, data);
const getProductsPendingApi = (productId) => get(`${url.PRODUCT}/${productId}/productPendings`, {}, {});

//Categories
const fetchCategoriesApi = data => get(url.CATEGORY, {}, data);
const fetchCategoryApi = (id) => get(`${url.CATEGORY}/${id}`,{});
const registerCategoryApi = data => post(url.CATEGORY, data);
const updateCategoryApi = (id, data) => put(`${url.CATEGORY}/${id}`, data);
const catalogBatchPrintRequestApi = (data) => get(`${url.CATEGORY}/batch/printRequest`,{}, data);
const resetOrderCategoryApi = (id) => get(`${url.CATEGORY}/resetOrder/${id}`,{});
const getPiecesUnpublishedApi = (id) => get(`${url.CATEGORY}/piecesunpublished/${id}`,{});

//Users
const fetchUsersApi = data => get(url.USER, {}, data);
const fetchUserApi = (id) => get(`${url.USER}/${id}`,{});
const registerUserApi = data => post(url.USER, data);
const updateUserApi = (id, data) => put(`${url.USER}/${id}`, data);
const changePasswordApi = (data) => post(`${url.USER}/changePassword`, data);
const changeProfilePictureApi = (data) => post(`${url.USER}/changeProfilePicture`, data);

//Sizes template
const fetchSizesApi = data => get(url.SIZE, {}, data);
const fetchSizeApi = (id) => get(`${url.SIZE}/${id}`,{});
const registerSizeApi = data => post(url.SIZE, data);
const updateSizeApi = (id, data) => put(`${url.SIZE}/${id}`, data);

//Product Sizes
const fetchProductSizesApi = data => get(url.PRODUCT_SIZE, {}, data);
const fetchProductSizeApi = (id) => get(`${url.PRODUCT_SIZE}/${id}`,{});
const registerProductSizeApi = data => post(url.PRODUCT_SIZE, data);
const updateProductSizeApi = (id, data) => put(`${url.PRODUCT_SIZE}/${id}`, data);

//Comments
const fetchCommentsApi = data => get(url.COMMENT, {}, data);
const fetchCommentApi = (id) => get(`${url.COMMENT}/${id}`,{});
const registerCommentApi = (idRelated, data) => post(`${url.COMMENT}/${idRelated}`, data);
const updateCommentApi = (id, data) => put(`${url.COMMENT}/${id}`, data);
const deleteCommentApi = (id) => del(`${url.COMMENT}/${id}`);


//Product images
const fetchProductImagesApi = data => get(url.PRODUCT_IMAGES, {}, data);
const fetchProductImageApi = (productId) => get(`${url.PRODUCT_IMAGES}/${productId}`,{});
const registerProductImageApi = data => post(url.PRODUCT_IMAGES, data);
const updateProductImageApi = (productId, data) => put(`${url.PRODUCT_IMAGES}/${productId}`, data);
const deleteProductImageApi = (productId, number) => del(`${url.PRODUCT_IMAGES}/deleteImage/${productId}/${number}`);

//FieldOptions
const fetchFieldOptionsApi = data => get(url.FIELD_OPTIONS, {}, data);
const fetchFieldOptionApi = (id) => get(`${url.FIELD_OPTIONS}/${id}`,{});
const registerFieldOptionApi = data => post(url.FIELD_OPTIONS, data);
const updateFieldOptionApi = (id, data) => put(`${url.FIELD_OPTIONS}/${id}`, data);
const deleteFieldOptionApi = (id, data) => del(`${url.FIELD_OPTIONS}/${id}`, data);

//Delivery locality
const fetchDeliveryLocalitiesApi = data => get(url.DELIVERY_LOCALITY, {}, data);
const fetchDeliveryLocalityApi = (id) => get(`${url.DELIVERY_LOCALITY}/${id}`,{});
const registerDeliveryLocalityApi = data => post(url.DELIVERY_LOCALITY, data);
const updateDeliveryLocalityApi = (id, data) => put(`${url.DELIVERY_LOCALITY}/${id}`, data);

//locations
const fetchStatesApi = data => get(url.STATES, {}, data);
const fetchStateApi = (id) => get(`${url.STATES}/${id}`,{});
const registerStateApi = data => post(url.STATES, data);
const updateStateApi = (id, data) => put(`${url.STATES}/${id}`, data);
const deleteStateApi = (id) => del(`${url.STATES}/${id}`);

//orders
const fetchOrdersApi = data => get(url.ORDERS, {}, data);
const fetchOrderApi = (id) => get(`${url.ORDERS}/${id}`,{});
const registerOrderApi = data => post(url.ORDERS, data);
const nextStatusOrderApi = data => post(`${url.ORDERS}/nextStatus`, data);
const canceledStatusOrderApi = data => post(`${url.ORDERS}/canceledStatus`, data);
const printOrderApi = id => get(`${url.ORDERS}/${id}/print`, {}, {});
const orderHistoric = (id) => get(`${url.ORDERS}/${id}/historic`, {});
const resumeOrderApi = id => get(`${url.ORDERS}/${id}/boardResume`, {}, {});
const updateOrderApi = (id, data) => put(`${url.ORDERS}/${id}`, data);
const updateOrderProductsApi = (id, data) => put(`${url.ORDERS}/${id}/update/inventary`, data);
const deleteOrderApi = (id) => del(`${url.ORDERS}/${id}`);
const batchPrintRequestApi = (data) => get(`${url.ORDERS}/batch/printRequest`, {}, data);
const conciliationRequestApi = (data) => post(`${url.ORDERS}/conciliation`, data);
const confirmConciliationRequestApi = (data) => post(`${url.ORDERS}/ConfirmConciliation`, data);
const postSaleGenerateReportApi = (data) => post(`${url.ORDERS}/generate/report`, data, {});
const syncOrderDelivery = (id, data) => post(`${url.ORDERS}/${id}/sync/orderDelivery`, data);
const refreshStatusDelivery = (id) => get(`${url.ORDERS}/${id}/refresh/orderDelivery`, {});
const refreshAllStatusDelivery = () => get(`${url.ORDERS}/refresh/all/orderDelivery`, {});
const increasePhotoCounterApi = (id) => get(`${url.ORDERS}/${id}/counters/increasePhoto`, {});
const fetchOrderStatusStatsProductsApi = params => get(`${url.ORDERS}/orderStats/get/byStatus`, {}, params);

//offices
const fetchOfficesApi = params => get(url.OFFICES, {}, params);
const fetchOfficeApi = data => get((data && data.id) ? `${url.OFFICES}/${data.id}` : url.OFFICES, data);
const registerOfficeApi = data => post(url.OFFICES, data);
const updateOfficeApi = (id, data) => put(`${url.OFFICES}/${id}`, data);
const deleteOfficeApi = (id) => del(`${url.OFFICES}/${id}`);
const confirmOfficeApi = (id) => post(`${url.OFFICES}/${id}/confirm`);
const addOrderOfficeApi = (id, data, params) => post(`${url.OFFICES}/${id}/addOrder`, data, {params: params});
const deleteOrderOfficeApi = (id, data, params) => post(`${url.OFFICES}/${id}/deleteOrder`, data, {params: params});
const importFileApi = data => post(`${url.OFFICES}/importFile`, data);
const printOfficeReportApi = id => get(`${url.OFFICES}/batch/printRequest/${id}`, {});

//bills
const fetchBillsApi = params => get(url.BILLS, {}, params);
const fetchBillApi = data => get((data && data.id) ? `${url.BILLS}/${data.id}` : url.BILLS, data);
const registerBillApi = data => post(url.BILLS, data);
const updateBillApi = (id, data) => put(`${url.BILLS}/${id}`, data);
const deleteBillApi = (id) => del(`${url.BILLS}/${id}`);
const confirmBillApi = (id) => post(`${url.BILLS}/${id}/confirm`);
const addOrderBillApi = (id, data, params) => post(`${url.BILLS}/${id}/addOrder`, data, {params: params});
const createCreditNoteApi = (id, data) => post(`${url.BILLS}/CreditMemo/${id}`, data, {});
const generateReportApi = (data) => post(`${url.BILLS}/generateReport`, data, {});
const sendInvoiceApi = (id, data) => post(`${url.BILLS}/sendInvoice/${id}`, data, {});

//bills Config
const fetchBillConfigsApi = params => get(url.BILL_CONFIGS, {}, params);
const fetchBillConfigApi = data => get((data && data.id) ? `${url.BILL_CONFIGS}/${data.id}` : url.BILL_CONFIGS, data);
const registerBillConfigApi = data => post(url.BILL_CONFIGS, data);
const updateBillConfigApi = (id, data) => put(`${url.BILL_CONFIGS}/${id}`, data);
const deleteBillConfigApi = (id) => del(`${url.BILL_CONFIGS}/${id}`);

//REPORTS
const billReportApi = (data) => get(`${url.BILLS}/gen/billReport`, {header: 'content-type: application/pdf'}, data);
const postSaleReportApi = (data) => get(`${url.ORDERS}/gen/postSaleReport`, {header: 'content-type: application/pdf'}, data);
const conciliationReportApi = (data) => get(`${url.ORDERS}/gen/conciliationReport`, {header: 'content-type: application/pdf'}, data);
const officeReportApi = (data) => get(`${url.OFFICES}/gen/officeReport`, {header: 'content-type: application/vnd.ms-excel'}, data);
const officePdfApi = (id, data = {}) => get(`${url.OFFICES}/gen/officePdfReport/${id}`, {}, data);
const fileOfficeTemplate = (filename, id) => file(filename, `${url.OFFICES}/${id}/getTemplate`, {header: 'content-type: application/vnd.ms-excel'});
const statsApi = (path, data = {}) => get(`${path}`, {}, data);
const statsDashboardApi = (id) => get(`${url.STATS_DASHBOARD}/estadistica/dashboard`, {});

//templates
const fetchTemplatesApi = data => get(url.TEMPLATES, {}, data);
const fetchTemplateApi = (id) => get(`${url.TEMPLATES}/${id}`, {});
const registerTemplateApi = data => post(url.TEMPLATES, data);
const updateTemplateApi = (id, data) => put(`${url.TEMPLATES}/${id}`, data);

//templates catalogs
const fetchTemplatesCatalogsApi = data => get(url.TEMPLATES_CATALOG, {}, data);

//wallet
const fetchWalletsApi = data => get(url.WALLETS, {}, data);
const fetchWalletApi = (id) => get(`${url.WALLETS}/${id}`, {});
const registerWalletApi = data => post(url.WALLETS, data);
const updateWalletApi = (id, data) => put(`${url.WALLETS}/${id}`, data);
const addAttachmentWalletApi = (id, data) => post(`${url.WALLETS}/${id}/addAttachment`, data);
const walletStatsApi = () => get(`${url.WALLETS}/reports/stats`);

//items
const fetchItemsApi = data => get(url.ITEMS, {}, data);
const fetchItemApi = (id) => get(`${url.ITEMS}/${id}`, {});
const registerItemApi = data => post(url.ITEMS, data);
const updateItemApi = (id, data) => put(`${url.ITEMS}/${id}`, data);
const fetchEventsApi = data => get(`${url.ITEMS}/get/events`, {}, data);


//payments
const fetchPaymentsApi = data => get(url.PAYMENTS, {}, data);
const fetchPaymentApi = (id) => get(`${url.PAYMENTS}/${id}`, {});
const registerPaymentApi = data => post(url.PAYMENTS, data);
const updatePaymentApi = (id, data) => put(`${url.PAYMENTS}/${id}`, data);
const applyPaymentPaymentApi = (paymentId, data) => post(`${url.PAYMENTS}/applyPayment/${paymentId}`, data);
const deletePaymentApi = (id) => del(`${url.PAYMENTS}/${id}/delete`);
const generateLinkPaymentApi = (orderId) => get(`${url.PAYMENTS}/gateway/generate/payu/${orderId}`, {});



const fetchDeliveryMethodsApi = () => get(`${url.DELIVERY_METHODS}`, {});
const fetchDeliveryQuoteApi = (data) => post(`${url.DELIVERY_METHODS}/quote`, data);

const fetchMunicipalitiesApi = data => get(url.MUNICIPALITIES, {}, data);
const fetchMunicipalityApi = (id) => get(`${url.MUNICIPALITIES}/${id}`, {});
const registerMunicipalityApi = data => post(url.MUNICIPALITIES, data);
const updateMunicipalityApi = (id, data) => put(`${url.MUNICIPALITIES}/${id}`, data);
const deleteMunicipalityApi = (id) => del(`${url.MUNICIPALITIES}/${id}`);

const fetchDataApi = (urlStr, data) => get(urlStr, {}, data);
const registerDataApi = (urlStr, data) => post(urlStr, data);
const postApi = (urlStr, data) => post(urlStr, data);
const updateDataApi = (urlStr, id, data) => put(`${urlStr}/${id}`, data);
const deleteDataApi = (urlStr, id) => del(`${urlStr}/${id}`);
const deleteallDataApi = (urlStr) => del(`${urlStr}`);

const syncCatalog = () => get(`${url.PRODUCT_IMAGES}/updateCatalogVersion/sync`, {});

const registerVCardApi = data => post(`${url.VCARD}/createVCard`, data);

const fileVCardContacts = (filename) => file(filename, `${url.VCARD}/g/generateVCard`, {header: 'content-type: text/x-vcard'});

const customerReportApi = (params) => get(`${url.CUSTOMER}/gen/customerReport`, {header: 'content-type: application/pdf'}, params);

export {
    fetchDataApi,
    registerDataApi,
    updateDataApi,
    postApi,
    deleteDataApi,
    deleteallDataApi,

    postLogin,
    validateAccessLogin,
    registerCustomer,
    updateCustomer,
    fetchCustomer,
    fetchCustomersApi,
    deleteCustomerApi,
    fetchCustomerRegisteredsApi,
    fetchCustomerOrderFinishedApi,
    fetchProductsApi,

    fetchStatesApi,
    fetchStateApi,
    updateStateApi,
    registerStateApi,
    deleteStateApi,

    fetchMunicipalitiesApi,
    fetchMunicipalityApi,
    updateMunicipalityApi,
    registerMunicipalityApi,
    deleteMunicipalityApi,

    fetchProductApi,
    registerProductApi,
    updateProductApi,
    reorderProductApi,

    fetchCategoriesApi,
    fetchCategoryApi,
    registerCategoryApi,
    updateCategoryApi,
    catalogBatchPrintRequestApi,
    resetOrderCategoryApi,
    getPiecesUnpublishedApi,
    conciliationRequestApi,
    confirmConciliationRequestApi,
    postSaleGenerateReportApi,
    syncOrderDelivery,
    refreshStatusDelivery,
    refreshAllStatusDelivery,

    fetchSizesApi,
    fetchSizeApi,
    registerSizeApi,
    updateSizeApi,

    fetchProductSizesApi,
    fetchProductSizeApi,
    registerProductSizeApi,
    updateProductSizeApi,
    updateProductSizeListApi,

    getProductsPendingApi,
    nextStatusOrderApi,
    canceledStatusOrderApi,

    fetchProductImagesApi,
    fetchProductImageApi,
    registerProductImageApi,
    updateProductImageApi,
    deleteProductImageApi,

    fetchDeliveryLocalitiesApi,
    fetchDeliveryLocalityApi,
    registerDeliveryLocalityApi,
    updateDeliveryLocalityApi,

    fetchFieldOptionsApi,
    fetchFieldOptionApi,
    registerFieldOptionApi,
    updateFieldOptionApi,
    deleteFieldOptionApi,

    fetchOrdersApi,
    fetchOrderApi,
    registerOrderApi,
    updateOrderApi,
    updateOrderProductsApi,
    deleteOrderApi,
    batchPrintRequestApi,

    fetchTemplatesApi,
    fetchTemplateApi,
    registerTemplateApi,
    updateTemplateApi,

    fetchTemplatesCatalogsApi,

    fetchWalletsApi,
    fetchWalletApi,
    registerWalletApi,
    updateWalletApi,
    addAttachmentWalletApi,
    walletStatsApi,

    fetchItemsApi,
    fetchItemApi,
    registerItemApi,
    updateItemApi,
    fetchEventsApi,

    fetchDeliveryMethodsApi,
    fetchDeliveryQuoteApi,

    printOrderApi,
    orderHistoric,
    resumeOrderApi,
    increasePhotoCounterApi,

    fetchCommentsApi,
    fetchCommentApi,
    registerCommentApi,
    updateCommentApi,
    deleteCommentApi,

    fetchUsersApi,
    fetchUserApi,
    registerUserApi,
    updateUserApi,
    changePasswordApi,
    changeProfilePictureApi,

    fetchOfficesApi,
    fetchOfficeApi,
    registerOfficeApi,
    updateOfficeApi,
    deleteOfficeApi,
    confirmOfficeApi,
    addOrderOfficeApi,
    deleteOrderOfficeApi,
    importFileApi,
    printOfficeReportApi,

    fetchBillsApi,
    fetchBillApi,
    registerBillApi,
    updateBillApi,
    deleteBillApi,
    confirmBillApi,
    addOrderBillApi,
    createCreditNoteApi,
    sendInvoiceApi,
    generateReportApi,

    fileOfficeTemplate,

    billReportApi,
    postSaleReportApi,
    conciliationReportApi,
    officeReportApi,
    officePdfApi,
    statsApi,
    statsDashboardApi,

    fetchPaymentsApi,
    fetchPaymentApi,
    registerPaymentApi,
    applyPaymentPaymentApi,
    updatePaymentApi,
    deletePaymentApi,
    generateLinkPaymentApi,

    fetchBillConfigsApi,
    fetchBillConfigApi,
    registerBillConfigApi,
    updateBillConfigApi,
    deleteBillConfigApi,

    syncCatalog,
    fetchInventoryProductsApi,
    fetchOrderStatusStatsProductsApi,

    registerVCardApi,

    fileVCardContacts,

    customerReportApi
}
