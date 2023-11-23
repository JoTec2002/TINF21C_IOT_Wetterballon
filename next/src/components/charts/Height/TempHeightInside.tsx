import { Chart } from "react-google-charts";
import {HeightValueObj} from "@/types/heightValueObj";

const TempHeightInside = ({tempIndoor}: {tempIndoor:HeightValueObj[]}) => {

    let data: any[][] = [["Temperatur", "Höhe"]];
    const options = {
        title: "Innentemperatur über Höhe",
        hAxis: {title: "Temperatur in °C", minValue: -20, maxValue: 40},
        vAxis: {title: "Höhe in m", minValue: 0},
        pointSize: 5,
        legend: "none",
    };

    for (let i = 0; i < tempIndoor.length; i++) {
        let tuple  = [tempIndoor[i].value, tempIndoor[i].height]
        data.push(tuple)
    }
    return (
        (tempIndoor.length === 0 ?
                <h1 className={"text-red-600"}> Keine Temperatur Daten vorhanden.</h1> :
                <Chart
                    chartType="ScatterChart"
                    data={data}
                    height="400px"
                    options={options}

                />
        )
    )
};

export default TempHeightInside;
