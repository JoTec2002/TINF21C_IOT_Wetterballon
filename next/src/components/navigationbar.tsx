import React, { useState } from "react";
import { Form as HouseForm, Field } from "houseform";

import { Avatar, Dropdown, Navbar } from 'flowbite-react';

const Navigationbar = () => {

  const [dropdownItems, setDropdownItems] = useState<string[]>([]);
  const [addingBalloon, setAddingBalloon] = useState(false);

  const setAddingBalloonTrue = () => {
    setAddingBalloon(true);
  };

  const addBalloon = (data: any) => {
    if (data.balloonname.trim() !== '') {
      setDropdownItems(prevItems => [...prevItems, data.balloonname]);
    }
    setAddingBalloon(false);
  };

  const openBalloonInterface = (balloon: String) => {
    console.log(`Öffne Balloon-Interface für ${balloon}`);
  };

  const removeBalloonInterface = (balloon: String) => {
    const updatedItems = dropdownItems.filter(item => item !== balloon);
    setDropdownItems(updatedItems);
  }

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
          dismissOnClick={false}
        >
          {dropdownItems.map((item, index) => (
            <Dropdown.Item as="div" onClick={() => openBalloonInterface(item)} key={index}>
              {item}
              <div><button className="ml-3" onClick={() => removeBalloonInterface(item)}>X</button></div>
            </Dropdown.Item>
          ))}
          <Dropdown.Divider />
          <Dropdown.Item as="div">
            {addingBalloon ? (
              <HouseForm onSubmit={addBalloon}>
                {({ submit }) => (
                  <form onSubmit={submit}>
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
          </Dropdown.Item>
        </Dropdown>
        <Navbar.Toggle />
      </div>
    </Navbar>

  );
}

export default Navigationbar;