import React from "react";

import { Avatar, Dropdown, Navbar } from 'flowbite-react';

const Navigationbar = () => {
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
              <Dropdown.Item>Ballon 1</Dropdown.Item>
              <Dropdown.Item>Ballon 2</Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Item>Add Ballon</Dropdown.Item>
            </Dropdown>
            <Navbar.Toggle />
          </div>
        </Navbar>
      );
}

export default Navigationbar;