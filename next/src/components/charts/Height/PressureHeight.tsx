import { Chart } from "react-google-charts";
import {HeightValueObj} from "@/types/heightValueObj";

const PressureHeight = ({measures}: {measures:HeightValueObj[]}) => {
    let data: any[][] = [["Luftdruck", "Höhe"]];
    const options = {
        title: "Luftdruck über Höhe",
        hAxis: {title: "Luftdruck in hPa", minValue: 0, maxValue: 500},
        vAxis: {title: "Höhe in m", minValue: 0},
        pointSize: 5
    };
    for (let i = 0; i < measures.length; i++) {
        let tuple  = [measures[i].value, measures[i].height]
        data.push(tuple)
    }
    return (
        (measures.length === 0 ?
                <h1 className={"text-red-600"}> Keine Luftdruck Daten vorhanden.</h1> :
                <Chart
                    chartType="LineChart"
                    data={data}
                    height="200px"
                    options={options}
                />
        )
    )
};

export default PressureHeight;
