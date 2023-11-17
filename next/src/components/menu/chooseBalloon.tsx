'use Client';
import {getBalloons} from "@/api/balloon";
import {Balloon} from "@/types/ballon";
import {useEffect, useState} from "react";
import {Alert} from "flowbite-react";
import {useGlobalContext} from "@/components/globalProvider";
import {number} from "prop-types";


export const ChooseBalloon = () => {
    return (
        <Alert color="info">
            <span className="font-medium">Bitte wählen Sie einen Ballon aus!</span>
        </Alert>
    )
}

export default ChooseBalloon;