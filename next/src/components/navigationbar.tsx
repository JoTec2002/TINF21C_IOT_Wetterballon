import React, { useState } from "react";

import { Avatar, Dropdown, Navbar } from 'flowbite-react';

const Navigationbar = () => {

  const [dropdownItems, setDropdownItems] = useState<string[]>([]);

  const addDropdownItem = () => {
    const newItem = "Balloon " + (dropdownItems.length + 1);
    setDropdownItems(prevItems => [...prevItems, newItem]);
  };
  
  const openBalloonInterface = (balloonName: String) => {
    console.log(`Öffne Balloon-Interface für ${balloonName}`);
  };

  const deleteBalloonInterface = (balloonName: String) => {
    console.log(`Lösche Balloon-Interface für ${balloonName}`);
  };

    return (
        <Navbar fluid rounded>
          <Navbar.Brand href="http://localhost:3000/">
            <img src="/favicon.ico" className="mr-3 h-6 sm:h-9" alt="Balloon Logo" />
            <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">IoT Wetterballon</span>
          </Navbar.Brand>
          <div className="flex md:order-2">
            <Dropdown
              arrowIcon={false}
              inline
              label={"Ballons"}
            >
            <ul>
              {dropdownItems.map((item, index) => (
                <li key={index}>
                  <Dropdown.Item>
                    <button className="ml-1" onClick={() => openBalloonInterface(item)}>{item}</button>
                    <button className="ml-3" onClick={() => deleteBalloonInterface(item)}>X</button>
                  </Dropdown.Item>
                </li>
              ))}
            </ul>
              <Dropdown.Divider />
              <Dropdown.Item><button onClick={addDropdownItem}>Add Ballon</button></Dropdown.Item>
            </Dropdown>
            <Navbar.Toggle />
          </div>
        </Navbar>
      );
}

export default Navigationbar;