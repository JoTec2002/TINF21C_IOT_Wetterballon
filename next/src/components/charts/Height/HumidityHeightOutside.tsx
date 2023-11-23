import { Chart } from "react-google-charts";
import {HeightValueObj} from "@/types/heightValueObj";

const HumidityHeightOutside = ({humOutdoor}: {humOutdoor:HeightValueObj[]}) => {

    let data: any[][] = [["Innen", "Höhe"]];
    const options = {
        title: "Luftfeuchtigkeit Außen über Höhe",
        hAxis: {title: "Luftfeuchtigkeit in RH(%)", minValue: 0, maxValue: 100},
        vAxis: {title: "Höhe in m", minValue: 0},
        pointSize: 5,
        legend: "none",
    };

    for (let i = 0; i < humOutdoor.length; i++) {
        let tuple  = [humOutdoor[i].value, humOutdoor[i].height]
        data.push(tuple)
    }
    return (
        (humOutdoor.length === 0 ?
                <h1 className={"text-red-600"}> Keine Daten für Luftfeuchtigkeit vorhanden.</h1> :
                <Chart
                    chartType="LineChart"
                    data={data}
                    height="400px"
                    options={options}
                />
        )
    )
};

export default HumidityHeightOutside;
