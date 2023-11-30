import { Chart } from "react-google-charts";
import {HeightValueObj} from "@/types/heightValueObj";

const HumidityHeightInside = ({humIndoor}: {humIndoor:HeightValueObj[]}) => {

    let data: any[][] = [["Innen", "Höhe"]];
    const options = {
        title: "Luftfeuchtigkeit Innen über Höhe",
        hAxis: {title: "Luftfeuchtigkeit in RH(%)", minValue: 0, maxValue: 100},
        vAxis: {title: "Höhe in m", minValue: 0},
        pointSize: 5,
        legend: "none",
    };

    for (let i = 0; i < humIndoor.length; i++) {
        let tuple  = [humIndoor[i].value, humIndoor[i].height]
        data.push(tuple)
    }
    return (
        (humIndoor.length === 0 ?
                <h1 className={"text-red-600"}> Keine Daten für Luftfeuchtigkeit im Innenraum vorhanden.</h1> :
                <Chart
                    chartType="LineChart"
                    data={data}
                    height="400px"
                    options={options}
                />
        )
    )
};

export default HumidityHeightInside;
