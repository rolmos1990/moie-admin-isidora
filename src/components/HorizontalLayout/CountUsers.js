import React, {useEffect, useState} from "react"
import {countUsersOrders} from "../../helpers/service";
import {connect} from "react-redux";
import {counterUsers, setCounterRegisterOrders} from "../../store/user/actions";

const CountUsers = ({registerOrderActive, onSetCounterRegisterOrders, onGetCounterUsers}) => {

    const [currentTimeout, setCurrentTimeout] = useState(null)

    useEffect(() => {

        if(registerOrderActive === false){
            onGetCounterUsers();
            if (currentTimeout) clearInterval(currentTimeout);
            let newTimeout = setInterval(() => {
                onGetCounterUsers();
            }, 70000);
            //
            setCurrentTimeout(newTimeout);
        }

        onSetCounterRegisterOrders(true, null);
    }, [])

    return (
        <React.Fragment>
        </React.Fragment>
    )
}

const mapStateToProps = state => {
    const {registerOrderActive} = state.User
    return {registerOrderActive}
}
const mapDispatchToProps = dispatch => ({
    countUsersOrders,
    onSetCounterRegisterOrders: (register, time) => dispatch(setCounterRegisterOrders(register, time)),
    onGetCounterUsers: () => dispatch(counterUsers()),
})

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(CountUsers)

