import React, {useEffect, useState} from "react";
import { useNavigate } from "react-router-dom";
import Call from "./Call";
const InitView = () => {
    let navigate = useNavigate();
    const [userAuthenticated] = useState(false);


    useEffect(() => {
        if (!userAuthenticated) {
            navigate('/login')
        }
    }, [navigate])
    return <>
        {
            userAuthenticated ? <Call/> : <></>
        }
    </>

}

export default InitView
