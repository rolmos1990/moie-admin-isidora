import React from "react"
import {Fade, Tooltip} from "@material-ui/core";
import {withStyles} from '@material-ui/core/styles';

const CustomHtmlTooltip = withStyles((theme) => ({
    tooltip: {
        backgroundColor: 'transparent',
        color: 'rgba(0, 0, 0, 0.87)',
        width: 220,
        fontSize: theme.typography.pxToRem(12),
        border: '0px solid #dadde9',
    },
}))(Tooltip)

export const HtmlTooltip = props => {
    return (
        <CustomHtmlTooltip
            TransitionComponent={Fade}
            TransitionProps={{timeout: 600}}
            placement={props.placement || "top-end"}
            title={props.title}>
            {props.children}
        </CustomHtmlTooltip>
    )
}
