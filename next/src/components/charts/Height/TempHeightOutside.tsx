import { Chart } from "react-google-charts";
import {HeightValueObj} from "@/types/heightValueObj";

const TempHeightOutside = ({tempOutdoor}: {tempOutdoor:HeightValueObj[]}) => {

    let data: any[][] = [["Temperatur", "Höhe"]];
    const options = {
        title: "Außentemperatur über Höhe",
        hAxis: {title: "Temperatur in °C", minValue: -20, maxValue: 40},
        vAxis: {title: "Höhe in m", minValue: 0},
        pointSize: 5,
        legend: "none",
    };

    for (let i = 0; i < tempOutdoor.length; i++) {
        let tuple  = [tempOutdoor[i].value, tempOutdoor[i].height]
        data.push(tuple)
    }
    return (
        (tempOutdoor.length === 0 ?
                <h1 className={"text-red-600"}> Keine Daten für Temperatur vorhanden.</h1> :
                <Chart
                    chartType="ScatterChart"
                    data={data}
                    height="400px"
                    options={options}
                />
        )
    )
};

export default TempHeightOutside;
