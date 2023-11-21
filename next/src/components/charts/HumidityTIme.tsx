import { Chart } from "react-google-charts";
import {ValueObj} from "@/types/valueObj";
import {parseClockTime} from "@/helpers/DateToString";

const HumidityTime = ({humIndoor, humOutdoor}: {humIndoor:ValueObj[], humOutdoor:ValueObj[]}) => {

    let data: any[][] = [["Time", "Temp_Außen", "Temp_Innen"]];
    const options = {
        title: "Luftfeuchtigkeit über Zeit",
        vAxis: {title: "Luftfeuchtigkeit in g/m^3", minValue: 0},
    };

    for (let i = 0; i < humIndoor.length; i++) {
        let tuple  = [parseClockTime(new Date(humIndoor[i].time)), humIndoor[i].value, humOutdoor[i].value]
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

export default HumidityTime;
