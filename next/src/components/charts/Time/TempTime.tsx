import { Chart } from "react-google-charts";
import {ValueObj} from "@/types/valueObj";
import {parseClockTime} from "@/helpers/DateToString";

const TempTime = ({tempIndoor, tempOutdoor}: {tempIndoor:ValueObj[], tempOutdoor:ValueObj[]}) => {

    let data: any[][] = [["Zeit", "Innen", "Außen"]];
    const options = {
        title: "Temperatur über Zeit",
        vAxis: {title: "Temperatur in °C", minValue: 0},
        pointSize: 5
    };

    let array = tempIndoor.length > tempOutdoor.length ? tempIndoor : tempOutdoor;
    let tuple: any[];
    for (let i = 0; i < array.length; i++) {

        if (tempIndoor[i] == undefined) {
            tuple  = [parseClockTime(new Date(array[i].time)), NaN, tempOutdoor[i].value]
        }
        else if (tempOutdoor[i] == undefined) {
            tuple  = [parseClockTime(new Date(array[i].time)), tempIndoor[i].value, NaN]
        }
        else {
            tuple  = [parseClockTime(new Date(array[i].time)), tempIndoor[i].value, tempOutdoor[i].value]
        }

        data.push(tuple)
    }
    return (
        (array.length === 0 ?
                <h1 className={"text-red-600"}> Keine Daten für Temperatur vorhanden.</h1> :
        <Chart
            chartType="LineChart"
            data={data}
            height="200px"
            options={options}
        />
        )
    )
};

export default TempTime;
