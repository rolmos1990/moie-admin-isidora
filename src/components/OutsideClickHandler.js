import React, { createRef } from "react";

class OutsideClickHandler extends React.Component {
    wrapperRef = createRef();

    static defaultProps = {
        onOutsideClick: () => {}
    };

    componentDidMount() {
        document.addEventListener("mousedown", this.handleClickOutside);
    }

    componentWillUnmount() {
        document.removeEventListener("mousedown", this.handleClickOutside);
    }

    handleClickOutside = (event) => {
        if (
            this.wrapperRef.current &&
            !this.wrapperRef.current.contains(event.target)
        ) {
            //Parametros de configuracion
            const _mainClassForClose = "main-content";
            const menuTopBar = "navbar-header";
            let _parent = event.target;
            let _decrement = 10;
            let _open = true;

            //search and close process
            while((_parent.parentElement && _decrement > 0) && _open){
                const _className = _parent.className;
                if(_className == _mainClassForClose || _className == menuTopBar){
                    this.props.onOutsideClick();
                    _open = false;
                }
                _parent = _parent.parentElement;
                _decrement --;
            }
        }
    };

    render() {
        const { children } = this.props;

        return <div ref={this.wrapperRef}>{children}</div>;
    }
}

export default OutsideClickHandler;
