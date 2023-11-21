import { Chart } from "react-google-charts";
import {Gpsdata} from "@/types/gpsdata";
import {parseClockTime} from "@/helpers/DateToString";
import {ValueObj} from "@/types/valueObj";

const PressureTime = ({pressures}: { pressures:ValueObj[] }) => {

    let data: any[][] = [["Time", "Height"]];
    const options = {
        title: "Luftdruck über Zeit",
        vAxis:  {title: "Luftdruck in hPa", minValue: 0},
    };

    for (let i = 0; i < pressures.length; i++) {
        let tuple  = [parseClockTime(new Date(pressures[i].time)), pressures[i].value]
        data.push(tuple)
    }
    return (
        <Chart
            chartType="LineChart"
            data={data}
            height="200px"
            options={options}
        />
    )
};

export default PressureTime;
