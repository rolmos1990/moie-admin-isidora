import React from "react"
import PropTypes from "prop-types";
import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts";

const HighChartsWrapper = ({options}) => {

    return (
        <>
            <HighchartsReact
                allowChartUpdate={true}
                immutable={false}
                updateArgs={[true, true, true]}
                highcharts={Highcharts}
                containerProps={{className: 'chartContainer'}}
                options={options}
            />
        </>
    );
}

HighChartsWrapper.propTypes = {
    options: PropTypes.object.isRequired
}

export default HighChartsWrapper;
