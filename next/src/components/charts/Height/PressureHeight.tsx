import { Chart } from "react-google-charts";
import {Gpsdata} from "@/types/gpsdata";
import {ValueObj} from "@/types/valueObj";

const PressureHeight = ({heightData, pressures}: {heightData: Gpsdata[], pressures:ValueObj[]}) => {
    console.log(heightData)
    let data: any[][] = [["Höhe", "Luftdruck"]];
    const options = {
        title: "Luftdruck über Höhe",
        vAxis: {title: "Luftdruck in hPa", minValue: 0},
        hAxis: {title: "Höhe in m", minValue: 0}
    };
    if (heightData == undefined)
        return (<h1 className={"text-red-600"}> Keine Höhe Daten vorhanden.</h1>)

    for (let i = 0; i < pressures.length; i++) {
        let tuple  = [heightData[i].altitude, pressures[i].value]
        data.push(tuple)
    }
    return (
        (pressures.length === 0 ?
                <h1 className={"text-red-600"}> Keine Luftdruck Daten vorhanden.</h1> :
                <Chart
                    chartType="ScatterChart"
                    data={data}
                    height="200px"
                    options={options}
                />
        )
    )
};

export default PressureHeight;
