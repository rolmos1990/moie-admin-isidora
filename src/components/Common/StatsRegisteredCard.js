import React, {useEffect, useState} from "react"
import PropTypes from "prop-types";
import WidgetCard4 from "./WidgetCard4";

const StatsRegisteredCard = (props) => {
    const {getData, getDataToday, title} = props;
    const [reportData, setReportData] = useState(null);

    useEffect(() => {
        if (getData) {
            setReportData({today: getDataToday, lastWeek: getData});
        }
    }, [getData]);


    return (
        <React.Fragment>
            <WidgetCard4 title={title} reportData={reportData}/>
        </React.Fragment>
    );
}

export default StatsRegisteredCard;

StatsRegisteredCard.propTypes = {
    getData: PropTypes.func.isRequired,
    getDataToday: PropTypes.func,
    title: PropTypes.string.isRequired,
    history: PropTypes.object
}
