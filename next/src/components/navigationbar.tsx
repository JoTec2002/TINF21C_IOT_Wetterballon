'use client'
import React from "react";
import { Navbar } from 'flowbite-react';
import BalloonDropDown from "@/components/dropdowns/balloonDropDown";
import FlightDropDown from "@/components/dropdowns/flightDropDown";
import Image from "next/image";


const NavigationBar = () => {

  return (
      <Navbar fluid rounded>
          <Navbar.Brand>
              <Image src="/favicon.ico" width={30} height={30} alt="Wetterballon"/>
              <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">IoT Wetterballon</span>
          </Navbar.Brand>
          <Navbar.Collapse className="mr-10">
              <BalloonDropDown />
              <FlightDropDown />
          </Navbar.Collapse>
      </Navbar>
    /* <Navbar fluid rounded>
      <Navbar.Brand href="http://localhost:3000/">

      </Navbar.Brand>
      <div className="dropdown">
        <button onClick={handleDropdownOpen}>Balloons</button>
        {dropdownOpen ?
          <div className="menu">
           {/*dropdownItems.map((item, index) => (
              <div key={index} className="menu-item">
                <button className="ml-3" onClick={() => openBalloonInterface(item)}>{item.name}</button>
                <div>
                  <button className="ml-3" onClick={() => removeBalloonInterface(item)}>X</button>
                </div>
              </div>
            ))}
            <Dropdown.Divider />
            <div className="menu-item">
              {/*addingBalloon ? (

              <HouseForm onSubmit={addBalloon}>
                 {({ submit }) => (
                   <form onSubmit={(e) => { e.preventDefault(); submit() }}>
                     <Field name="balloonname" initialValue={""}>
                       {({ value, setValue, onBlur }) => (
                         <input
                           value={value}
                           onChange={(e) => setValue(e.currentTarget.value)}
                           onBlur={onBlur}
                           placeholder="name"
                         />
                       )}
                     </Field>
                     <button type="submit">+</button>
                   </form>
                 )}
               </HouseForm>
             ) : (
               <button onClick={setAddingBalloonTrue}>Add Ballon</button>
             )}
            </div>
          </div> : null}
        <Navbar.Toggle />
      </div>
    </Navbar >*/

  );
}

export default NavigationBar;