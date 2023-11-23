import { Chart } from "react-google-charts";
import {HeightValueObj} from "@/types/heightValueObj";

const HumidityHeight = ({humIndoor, humOutdoor}: {humIndoor:HeightValueObj[], humOutdoor:HeightValueObj[]}) => {

    let data: any[][] = [["Innen", "Außen", "Höhe"]];
    const options = {
        title: "Luftfeuchtigkeit über Höhe",
        hAxis: {title: "Luftfeuchtigkeit in g/m^3", minValue: 0},
        vAxis: {title: "Höhe in m", minValue: 0},
        pointSize: 5,
        series: {
            0: { targetAxisIndex: 0 },
            1: { targetAxisIndex: 0 },
        }
    };

    for (let i = 0; i < humIndoor.length; i++) {
        let tuple  = [humIndoor[i].height, humIndoor[i].value, humOutdoor[i].value]
        data.push(tuple)
    }
    return (
        (humIndoor.length === 0 ?
                <h1 className={"text-red-600"}> Keine Luftfeuchtigkeit Daten vorhanden.</h1> :
                <Chart
                    chartType="ScatterChart"
                    data={data}
                    height="200px"
                    options={options}
                />
        )
    )
};

export default HumidityHeight;
