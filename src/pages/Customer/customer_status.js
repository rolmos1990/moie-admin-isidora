import React from "react";

export const CUSTOMER_STATUS = {
    ACTIVE: true,
    INACTIVE: false
};

export const ConverterCustomerStatus = (status) => {
    switch(status) {
        case CUSTOMER_STATUS.ACTIVE:
            return 'Si';
            break;
        default:
            return 'No';
    }
}
