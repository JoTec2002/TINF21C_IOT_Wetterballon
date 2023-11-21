import { Chart } from "react-google-charts";
import {ValueObj} from "@/types/valueObj";
import {parseClockTime} from "@/helpers/DateToString";

const TempTime = ({tempIndoor, tempOutdoor}: {tempIndoor:ValueObj[], tempOutdoor:ValueObj[]}) => {

    let data: any[][] = [["Time", "Temp_Außen", "Temp_Innen"]];
    const options = {
        title: "Temperatur über Zeit",
        vAxis: {title: "Temperatur in °C", minValue: 0},
    };

    for (let i = 0; i < tempIndoor.length; i++) {
        let tuple  = [parseClockTime(new Date(tempIndoor[i].time)), tempIndoor[i].value, tempOutdoor[i].value]
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

export default TempTime;
