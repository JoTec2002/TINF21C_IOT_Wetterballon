import { Chart } from "react-google-charts";
import {HeightValueObj} from "@/types/heightValueObj";

const TempHeight = ({tempIndoor, tempOutdoor}: {tempIndoor:HeightValueObj[], tempOutdoor:HeightValueObj[]}) => {

    let data: any[][] = [["Zeit", "Innen", "Außen"]];
    const options = {
        title: "Temperatur über Höhe",
        vAxis: {title: "Temperatur in °C", minValue: 0},
        hAxis: {title: "Höhe in m", minValue: 0},
        pointSize: 5
    };

    for (let i = 0; i < tempIndoor.length; i++) {
        let tuple  = [tempIndoor[i].height, tempIndoor[i].value, tempOutdoor[i].value]
        data.push(tuple)
    }
    return (
        (tempIndoor.length === 0 ?
                <h1 className={"text-red-600"}> Keine Luftfeuchtigkeit Daten vorhanden.</h1> :
                <Chart
                    chartType="LineChart"
                    data={data}
                    height="200px"
                    options={options}
                />
        )
    )
};

export default TempHeight;
