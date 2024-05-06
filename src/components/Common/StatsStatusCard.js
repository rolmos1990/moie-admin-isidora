import React, {useEffect, useState} from "react"
import PropTypes from "prop-types";
import WidgetCard1 from "./WidgetCard1";

const StatsStatusCard = (props) => {
    const {getData, title} = props;
    const [statusGroup, setStatusGroup] = useState(null);

    useEffect(() => {
        if (getData) {
            getData().then(data => setStatusGroup(data));
        }
    }, [getData]);

    return (
        <React.Fragment>
            <WidgetCard1 title={title} statusGroup={statusGroup}/>
        </React.Fragment>
    );
}

export default StatsStatusCard;

StatsStatusCard.propTypes = {
    getData: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired,
    history: PropTypes.object
}