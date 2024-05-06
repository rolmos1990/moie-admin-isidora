import React, {Component, useEffect, useState} from "react"
import {connect} from "react-redux";
import {priceFormat} from "../../common/utils";
import FlipMove from 'react-flip-move';
import userImage from "../../assets/images/users/user.png"
import {baseImagePathNew} from "../../helpers/api_helper";

class ListItem extends Component {
    render() {
        const listClass = `list-item card`;
        const style = {zIndex: 100 - this.props.index, float: 'left', margin: '0 2px'};
        const user = this.props.user;

        const _alias = user.name ? user.name.split(' ')[0] : '';

        return (
            <li id={this.props.key} className={listClass} style={style}>
                <div style={{display: 'flex', alignItems: 'center', margin: '0 5px'}}>
                    <img src={user.image} className="rounded-circle header-profile-user" alt="user-pic"/>
                    <div className="flex-1">
                        <small className="mt-0 mb-1">{user.hasCrown && <i className={"mdi mdi-crown mr-1 text-warning"}> </i>}{_alias} </small>
                        <br/>
                        <small><small className="m-0">Pedidos: <b>{user.sales}</b></small></small>
                    </div>
                </div>
            </li>
        );
    }
};

const FooterUsers = ({data, user, countUsers}) => {

    const [users, setUsers] = useState([])

    useEffect(() => {
        getData();
    }, [countUsers])

    const findData = () => {
        let resp = countUsers;

/*        resp.data = [
            {totalAmount: 1800, origen: 6, user: {id: 1, name: 'Ramon', image: null}},
            {totalAmount: 2000, origen: 5, user: {id: 3, name: 'Andres', image: null}},
            {totalAmount: 3000, origen: 6, user: {id: 4, name: 'Michael', image: null}},
            {totalAmount: 3200, origen: 6, user: {id: 8, name: 'Michael2', image: null}},
            {totalAmount: 1500, origen: 11, user: {id: 5, name: 'Jose2', image: null}},
            {totalAmount: 1800, origen: 4, user: {id: 7, name: 'Mario', image: null}},
            {totalAmount: 1800, origen: 9, user: {id: 9, name: 'Mario2', image: null}},
            {totalAmount: 1800, origen: 10, user: {id: 10, name: 'Mario3', image: null}},
            {totalAmount: 1800, origen: 10, user: {id: 11, name: 'Mario4', image: null}},
            {totalAmount: 1800, origen: 13, user: {id: 12, name: 'Mario4', image: null}},
        ];*/

        if (resp && resp.data && resp.data.length > 0) {
            let u = [];
            resp.data.filter(o => o.user && o.user.id).forEach((o, i) => u.push({
                id: o.user.id,
                name: o.user.name,
                sales: o.origen,
                amountNumber: parseFloat(o.totalAmount),
                amount: priceFormat(o.totalAmount),
                image: o.user.photo ? baseImagePathNew + o.user.photo : userImage
            }));

            const limit = 10;



            u = u.sort(function (a, b) {
                if(a.sales === b.sales)
                {
                    return (a.amountNumber < b.amountNumber) ? 1 : (a.amountNumber > b.amountNumber) ? -1 : 0;
                }
                else
                {
                    return (a.sales < b.sales) ? 1 : 0;
                }
            });



            //u = u.sort((a, b) => a.sales === b.sales ? 0 : (a.sales > b.sales) ? 1 : -1);

            if (u.length > limit) {
                u.splice(limit);
            }

            u = u.sort(function (a, b) {
                if(a.sales === b.sales)
                {
                    return (a.amountNumber < b.amountNumber) ? -1 : (a.amountNumber > b.amountNumber) ? 1 : 0;
                }
                else
                {
                    return (a.sales < b.sales) ? -1 : 1;
                }
            });

            if (u.length > 0) {
                let user = u[u.length - 1];
                user.hasCrown = true;
            }

            setUsers(u);
        }
    }

    const getData = () => {
        if (!user || !user.id) {
            return;
        }
        findData();
    }

    const render = () => {
        return users.map((user, i) => (
            <ListItem
                key={user.id}
                index={i}
                user={user}
            />
        ))
    }

    return (
        <React.Fragment>
            <FlipMove
                staggerDurationBy="30"
                duration={500}
                enterAnimation={"accordionHorizontal"}
                leaveAnimation='accordionHorizontal'
                typeName="ul"
            >
                {render()}
            </FlipMove>
        </React.Fragment>
    )
}

const mapStateToProps = state => {
    const {user} = state.Login
    const {countUsers} = state.User
    return {user, countUsers}
}
const mapDispatchToProps = dispatch => ({
})

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(FooterUsers)

