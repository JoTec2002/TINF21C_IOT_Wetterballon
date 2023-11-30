import { Chart } from "react-google-charts";
import {ValueObj} from "@/types/valueObj";
import {parseClockTime} from "@/helpers/DateToString";

const HumidityTime = ({humIndoor, humOutdoor}: {humIndoor:ValueObj[], humOutdoor:ValueObj[]}) => {

    let data: any[][] = [["Zeit", "Innen", "Außen"]];
    const options = {
        title: "Luftfeuchtigkeit über Zeit",
        vAxis: {title: "Luftfeuchtigkeit in RH(%)", minValue: 0},
        pointSize: 5
    };

    let array = humIndoor.length > humOutdoor.length ? humIndoor : humOutdoor;
    let tuple: any[];
    for (let i = 0; i < array.length; i++) {
        if (humIndoor[i] == undefined) {
            tuple  = [parseClockTime(new Date(array[i].time)), NaN, humOutdoor[i].value]
        }
        else if (humOutdoor[i] == undefined) {
            tuple  = [parseClockTime(new Date(array[i].time)), humIndoor[i].value, NaN]
        }
        else {
            tuple  = [parseClockTime(new Date(array[i].time)), humIndoor[i].value, humOutdoor[i].value]
        }
        data.push(tuple)
    }

    return (
        (array.length === 0 ?
                <h1 className={"text-red-600"}> Keine Daten für Luftfeuchtigkeit vorhanden.</h1> :
        <Chart
            chartType="LineChart"
            data={data}
            height="200px"
            options={options}
        />
        )
    )
};

export default HumidityTime;
