import { Chart } from "react-google-charts";
import {Gpsdata} from "@/types/gpsdata";




const HeightChart = ({locations}: { locations:Gpsdata[] }) => {
    const data = {

    };
    const options = {
        chart: {
            title: "Höhe über Zeit",
        },
    };
    return (
        <Chart
            chartType="Line"
            data={[
                ["Time", "Height"],
                [locations[0].time, locations[0].altitude],
                [locations[1].time, locations[1].altitude],
                [locations[2].time, locations[2].altitude],
                [locations[3].time, locations[3].altitude]
            ]}
            width="100%"
            height="400px"
            options={options}
            legendToggle
        />
    )
};

export default HeightChart;
