import React from "react";

export const STATUS_COLORS = {
    DANGER: 'danger',
    SUCCESS: 'success',
    WARNING: 'warning',
    INFO: 'info',
    PURPLE: 'purple',
    PINK: 'pink',
    SECONDARY: 'secondary'
};

export const StatusField = (props) => {
    const className = "badge rounded-pill p-2 " + (props.className ? props.className: '');

    let bg = '';
    switch(props.color){
        case STATUS_COLORS.DANGER:
            bg='bg-soft-danger';
            break;
        case STATUS_COLORS.SUCCESS:
            bg='bg-soft-success';
            break;
        case STATUS_COLORS.WARNING:
            bg='bg-soft-warning';
            break;
        case STATUS_COLORS.INFO:
            bg='bg-soft-info';
            break;
        case STATUS_COLORS.PURPLE:
            bg='bg-soft-purple';
            break;
        case STATUS_COLORS.PINK:
            bg='bg-soft-pink';
            break;
        case STATUS_COLORS.SECONDARY:
            bg='bg-soft-secondary';
            break;
        default:
            bg='bg-light';
    }

    return <span className={`${className} ${bg}`}>{props.children}</span>
}
