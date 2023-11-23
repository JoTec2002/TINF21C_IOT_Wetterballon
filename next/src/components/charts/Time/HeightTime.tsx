import { Chart } from "react-google-charts";
import {Gpsdata} from "@/types/gpsdata";
import {parseClockTime} from "@/helpers/DateToString";

const HeightTime = ({locations}: { locations:Gpsdata[] }) => {

    let data: any[][] = [["Zeit", "Höhe"]];
    const options = {
        title: "Höhe über Zeit",
        vAxis:  {title: "Höhe in m", minValue: 0},
        pointSize: 5
    };

    for (let i = 0; i < locations.length; i++) {
        let tuple  = [parseClockTime(new Date(locations[i].time)), locations[i].altitude]
        data.push(tuple)
    }
    return (
        (locations.length === 0 ?
                <h1 className={"text-red-600"}> Keine Daten für GPS vorhanden.</h1> :
        <Chart
            chartType="LineChart"
            data={data}
            height="200px"
            options={options}
        />
        )
    )
};

export default HeightTime;
