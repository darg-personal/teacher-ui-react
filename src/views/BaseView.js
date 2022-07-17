import React from "react";
import { Outlet } from "react-router-dom";
const BaseView =  () => {
   return <div className={'app-container'}>
      <Outlet/>
   </div>

}

export default BaseView
