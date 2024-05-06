import PropTypes from "prop-types"
import React, {useEffect, useState} from "react"
import {Collapse} from "reactstrap"
import {Link, withRouter} from "react-router-dom"
import classname from "classnames"

//i18n
import {withTranslation} from "react-i18next"

import {connect} from "react-redux"
import {PERMISSIONS} from "../../helpers/security_rol";
import HasPermissions from "../HasPermissions";
import OutsideClickHandler from "../OutsideClickHandler";
import {toggleLeftmenu} from "../../store/layout/actions";
import {showMessage} from "../MessageToast/ShowToastMessages";
import {_encodePhone} from "../../common/utils";

const Navbar = props => {

    const [copying, setCopying] = useState(false)
    const [system, setsystem] = useState(false)
    const [extra, setextra] = useState(false)
    const [extra2, setextra2] = useState(false)
    const [auth, setauth] = useState(false)
    const [utility, setutility] = useState(false)
    const [isOpen, setIsOpen] = useState(props.leftMenu);
    const [user, setUser] = useState(props.user);

    useEffect(() => {
        props.toggleLeftmenu(isOpen)
    }, [isOpen]);

    useEffect(() => {
        var matchingMenuItem = null
        var ul = document.getElementById("navigation")
        var items = ul.getElementsByTagName("a")
        for (var i = 0; i < items.length; ++i) {
            if (props.location.pathname === items[i].pathname) {
                matchingMenuItem = items[i]
                break
            }
        }
        if (matchingMenuItem) {
            activateParentDropdown(matchingMenuItem)
        }
    });

    useEffect(() => {
        if(props.leftMenu) {
            setIsOpen(props.leftMenu);
        }
    }, [props.leftMenu]);

    function renderWhatsappSubmenu(){
        const subItems = parseWhatsapps();

        return <div className={classname("dropdown-menu", {show: extra2})}>
            {subItems && subItems.map(item =>
                <li className="nav-item">
                    <Link to={'#'} onClick={() => copyToClipboard(_encodePhone(item.value))} className="dropdown-item">
                        <i className="uil-mobile-android-alt me-2"></i>
                        <span className="badge badge-info bg-success">{item.key}</span> - {item.value}
                    </Link>
                </li>
            )}
        </div>
    }

    function parseWhatsapps(){
        try {
            const whatsapps = user.whatsapps.split(',');
            return whatsapps.map((item,index) => {
                //render alias
                let phoneAlias = item;
                let phone = item;


                const aliasAndPhone = item.split(':');
                if(aliasAndPhone){
                    phoneAlias = aliasAndPhone[0];

                    if(phone.indexOf("+57") === -1){
                        phone = "+57" + phone;
                    }

                    phone = aliasAndPhone[1];
                }
                return {value: phone, key: phoneAlias}
            });
        }catch(e){
           return  [];
        }
    }

    const copyToClipboard = (wsNumberEncoded) => {
        console.log('numberEncoded: ', wsNumberEncoded);
        try {
            setCopying(true)
            var textField = document.createElement('textarea')
            textField.value = `${process.env.REACT_APP_CATALOGO_URL}/${wsNumberEncoded}`;
            document.body.appendChild(textField)
            textField.select();
            document.execCommand("copy");
            textField.remove();
            setTimeout(() => {
                showMessage.success('Su link ha sido copiado.');
                setCopying(false);
            }, 1300);
        }catch(e){
            showMessage.success('Su link no pudo ser copiado.');
        }
    }

    function renderMenuNoAccess(name, to, className){
        return <li className="nav-item">
            <Link className="nav-link disabled" to={to}>
                <i className={className}></i>
                {" "}{props.t(name)}
            </Link>
        </li>
    }

    function activateParentDropdown(item) {
        item.classList.add("active")
        const parent = item.parentElement
        if (parent) {
            parent.classList.add("active") // li
            const parent2 = parent.parentElement
            parent2.classList.add("active") // li
            const parent3 = parent2.parentElement
            if (parent3) {
                parent3.classList.add("active") // li
                const parent4 = parent3.parentElement
                if (parent4) {
                    parent4.classList.add("active") // li
                    const parent5 = parent4.parentElement
                    if (parent5) {
                        parent5.classList.add("active") // li
                        const parent6 = parent5.parentElement
                        if (parent6) {
                            parent6.classList.add("active") // li
                        }
                    }
                }
            }
        }
        return false
    }

    return (
        <React.Fragment>
            <div className="container-fluid">
                <div className="topnav">
                    <nav
                        className="navbar navbar-light navbar-expand-lg topnav-menu"
                        id="navigation"
                    >
                        <OutsideClickHandler
                            onOutsideClick={(e) => {
                                setIsOpen(false);
                            }}
                        >
                        <Collapse
                            isOpen={isOpen}
                            className="navbar-collapse"
                            id="topnav-menu-content"
                        >
                            <ul className="navbar-nav">
                                <li className="nav-item">
                                    <Link className="nav-link" to="/dashboard">
                                        <i className="uil-home-alt me-2"></i>
                                        {" "}{props.t("Dashboard")}
                                    </Link>
                                </li>
                                 <li className="nav-item dropdown">
                                        <Link className="nav-link dropdown-toggle arrow-none" to="extra" onClick={e => {
                                            e.preventDefault()
                                            setextra2(!extra2);
                                        }}>
                                            <i className="uil-cog me-2"></i>{props.t("Whatsapps")} <div className="arrow-down"></div>
                                        </Link>
                                        {renderWhatsappSubmenu()}
                                    </li>

                                <HasPermissions permission={PERMISSIONS.PRODUCT_SHOW} renderNoAccess={() => renderMenuNoAccess("Productos", "/products", "uil-box me-2")}>
                                    <li className="nav-item">
                                        <Link className="nav-link" to="/products">
                                            <i className="uil-box me-2"></i>
                                            {" "} {props.t("Productos")}
                                        </Link>
                                    </li>
                                </HasPermissions>

                                <HasPermissions permission={PERMISSIONS.CATEGORY_SHOW}>
                                    <li className="nav-item">
                                        <Link className="nav-link" to="/categories" renderNoAccess={() => renderMenuNoAccess("Categorias", "/categories", "uil-box me-2")}>
                                            <i className="uil-box me-2"></i>
                                            {" "}{props.t("Categorias")}
                                        </Link>
                                    </li>
                                </HasPermissions>

                                <HasPermissions permission={PERMISSIONS.CUSTOMER_SHOW} renderNoAccess={() => renderMenuNoAccess("Cliente", "/customers", "uil-users-alt me-2")}>
                                    <li className="nav-item">
                                        <Link className="nav-link" to="/customers">
                                            <i className="uil-users-alt me-2"></i>
                                            {" "}{props.t("Clientes")}
                                        </Link>
                                    </li>
                                </HasPermissions>

                                <HasPermissions permission={PERMISSIONS.ORDER_SHOW} renderNoAccess={() => renderMenuNoAccess("Pedidos", "/orders", "uil-shopping-cart-alt me-2")}>
                                    <li className="nav-item">
                                        <Link className="nav-link" to="/orders">
                                            <i className="uil-shopping-cart-alt me-2"></i>
                                            {" "}{props.t("Pedidos")}
                                        </Link>
                                    </li>
                                </HasPermissions>

                                <HasPermissions permissions={[PERMISSIONS.OFFICE_SHOW, PERMISSIONS.BILL_SHOW, PERMISSIONS.POSTSALE_SHOW, PERMISSIONS.PAYMENT_SHOW]} renderNoAccess={() => renderMenuNoAccess("Servicios", "/extra", "uil-cog me-2")}>
                                    <li className="nav-item dropdown">
                                        <Link className="nav-link dropdown-toggle arrow-none" to="extra" onClick={e => {
                                            e.preventDefault()
                                            setextra(!extra);
                                        }}>
                                            <i className="uil-cog me-2"></i>{props.t("Servicios")}
                                            <div className="arrow-down"></div>
                                        </Link>
                                        <div className={classname("dropdown-menu", {show: extra})}>
                                            <HasPermissions permission={PERMISSIONS.OFFICE_SHOW}>
                                                <li className="nav-item">
                                                    <Link to="/offices" className="dropdown-item">
                                                        <i className="uil-truck me-2"></i>
                                                        {props.t("Despachos")}
                                                    </Link>
                                                </li>
                                            </HasPermissions>
                                            <HasPermissions permission={PERMISSIONS.BILL_SHOW}>
                                                <li className="nav-item">
                                                    <Link to="/bills" className="dropdown-item">
                                                        <i className="uil-bill me-2"></i>
                                                        {props.t("Facturación")}
                                                    </Link>
                                                </li>
                                            </HasPermissions>
                                            <HasPermissions permission={PERMISSIONS.POSTSALE_SHOW}>
                                                <li className="nav-item">
                                                    <Link to="/postSales" className="dropdown-item">
                                                        <i className="uil-shopping-cart-alt me-2"></i>
                                                        {props.t("Post Venta")}
                                                    </Link>
                                                </li>
                                            </HasPermissions>
                                            <HasPermissions permission={PERMISSIONS.PAYMENT_SHOW}>
                                                <li className="nav-item">
                                                    <Link to="/payments" className="dropdown-item">
                                                        <i className="uil-money-bill me-2"></i>
                                                        {props.t("Pagos")}
                                                    </Link>
                                                </li>
                                            </HasPermissions>
                                            <HasPermissions permission={PERMISSIONS.DELIVERY_LOCALITY_LIST}>
                                                <li className="nav-item">
                                                    <Link to="/deliveryLocalities" className="dropdown-item">
                                                        <i className="uil-map me-2"></i>
                                                        {props.t("Localidades")}
                                                    </Link>
                                                </li>
                                            </HasPermissions>
                                            <HasPermissions permission={PERMISSIONS.WALLET_LIST}>
                                                <li className="nav-item">
                                                    <Link className="nav-link" to="/wallets">
                                                        <i className="uil-graph-bar me-2"></i>
                                                        {" "}{props.t("Billetera")}
                                                    </Link>
                                                </li>
                                            </HasPermissions>
                                            <HasPermissions permission={PERMISSIONS.ITEMS_LIST}>
                                                <li className="nav-item">
                                                    <Link className="nav-link" to="/items">
                                                        <i className="uil-briefcase me-2"></i>
                                                        {" "}{props.t("Items")}
                                                    </Link>
                                                </li>
                                            </HasPermissions>
                                            <HasPermissions permission={PERMISSIONS.VCARD_MANAGE}>
                                                <li className="nav-item">
                                                    <Link className="nav-link" to="/vCard">
                                                        <i className="uil uil-phone me-2"></i>
                                                        {" "}{props.t("VCard")}
                                                    </Link>
                                                </li>
                                            </HasPermissions>
                                        </div>
                                    </li>
                                </HasPermissions>

                                <HasPermissions permission={PERMISSIONS.REPORT_SHOW}>
                                    <li className="nav-item">
                                        <Link className="nav-link" to="/reports">
                                            <i className="uil-graph-bar me-2"></i>
                                            {" "}{props.t("Reportes")}
                                        </Link>
                                    </li>
                                </HasPermissions>

                                <HasPermissions permissions={[PERMISSIONS.SECURITY_SHOW, PERMISSIONS.USER_SHOW, PERMISSIONS.LOCALITY_SHOW, PERMISSIONS.TEMPLATE_SHOW, PERMISSIONS.RESOLUTION_SHOW, PERMISSIONS.CONFIG_SHOW]} renderNoAccess={() => renderMenuNoAccess("Sistema", "/system", "uil-cog me-2")}>
                                    <li className="nav-item dropdown">
                                        <Link className="nav-link dropdown-toggle arrow-none" to="system" onClick={e => {
                                            e.preventDefault()
                                            setsystem(!system);
                                        }}>
                                            <i className="uil-cog me-2"></i>
                                            {props.t("Sistema")}
                                            <div className="arrow-down"></div>
                                        </Link>
                                        <div className={classname("dropdown-menu", {show: system})}>
                                            <HasPermissions permissions={[PERMISSIONS.SECURITY_SHOW, PERMISSIONS.USER_SHOW]}>
                                                <div className="dropdown">
                                                    <Link to="/auth" className="dropdown-item dropdown-toggle arrow-none" onClick={e => {
                                                        e.preventDefault();
                                                        setauth(!auth);
                                                    }}>
                                                        {props.t("Autenticación")}{" "}
                                                        <div className="arrow-down"></div>
                                                    </Link>
                                                    <div className={classname("dropdown-menu", {show: auth})}>
                                                        <HasPermissions permission={PERMISSIONS.USER_SHOW}>
                                                            <Link to="/users" className="dropdown-item">
                                                                {props.t("Usuarios")}
                                                            </Link>
                                                        </HasPermissions>
                                                        <HasPermissions permission={PERMISSIONS.SECURITY_SHOW}>
                                                            <Link to="/Security" className="dropdown-item">
                                                                {props.t("Seguridad")}
                                                            </Link>
                                                        </HasPermissions>
                                                    </div>
                                                </div>
                                            </HasPermissions>
                                            <HasPermissions permission={PERMISSIONS.LOCALITY_SHOW}>
                                                <div className="dropdown">
                                                    <Link className="dropdown-item dropdown-toggle arrow-none" to="/utility" onClick={e => {
                                                        e.preventDefault();
                                                        setutility(!utility)
                                                    }}>
                                                        {props.t("Localidades")}
                                                        <div className="arrow-down"></div>
                                                    </Link>
                                                    <div className={classname("dropdown-menu", {show: utility})}>
                                                        <Link to="/states" className="dropdown-item">
                                                            {props.t("Estados")}
                                                        </Link>
                                                        <Link to="/municipalities" className="dropdown-item">
                                                            {props.t("Municipios")}
                                                        </Link>
                                                    </div>
                                                </div>
                                            </HasPermissions>
                                            <HasPermissions permission={PERMISSIONS.TEMPLATE_SHOW}>
                                                <li className="nav-item">
                                                    <Link to="/templates" className="dropdown-item">
                                                        {props.t("Plantillas")}
                                                    </Link>
                                                </li>
                                            </HasPermissions>
                                            <HasPermissions permission={PERMISSIONS.RESOLUTION_SHOW}>
                                                <li className="nav-item">
                                                    <Link to="/billConfigs" className="dropdown-item">
                                                        {props.t("Conf. Resoluciones")}
                                                    </Link>
                                                </li>
                                            </HasPermissions>
                                            <HasPermissions permission={PERMISSIONS.CONFIG_SHOW}>
                                                <li className="nav-item">
                                                    <Link to="/configs" className="dropdown-item">
                                                        {props.t("Configuraciones")}
                                                    </Link>
                                                </li>
                                            </HasPermissions>
                                        </div>
                                    </li>
                                </HasPermissions>

                            </ul>
                        </Collapse>
                        </OutsideClickHandler>
                    </nav>
                </div>
            </div>
        </React.Fragment>
    )
}

Navbar.propTypes = {
    leftMenu: PropTypes.any,
    location: PropTypes.any,
    menuOpen: PropTypes.any,
    openLeftMenuCallBack: PropTypes.any,
    t: PropTypes.any,
}

const mapStateToProps = state => {
    const {leftMenu} = state.Layout
    const {user} = state.Login
    return {leftMenu, user}
}

export default withRouter(
    connect(mapStateToProps, {
        toggleLeftmenu
    })(withTranslation()(Navbar))
)
