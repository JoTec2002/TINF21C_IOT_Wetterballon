import React, { useState } from "react";
import { Form as HouseForm, Field } from "houseform";
import { Avatar, Dropdown, Navbar } from 'flowbite-react';
import { Balloon } from './balloon'

const Navigationbar = () => {

  const { generateApiKey } = require('generate-api-key');

  const [dropdownItems, setDropdownItems] = useState<Balloon[]>([]);
  const [addingBalloon, setAddingBalloon] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const setAddingBalloonTrue = () => {
    setAddingBalloon(true);
  };

  const addBalloon = (data: any) => {
    if (data.balloonname.trim() !== '') {
      var newBalloon = new Balloon(data.balloonname, generateApiKey());
      setDropdownItems(prevItems => [...prevItems, newBalloon]);
    }
    setAddingBalloon(false);
  };

  const openBalloonInterface = (balloon: Balloon) => {
    //need to wait for map to be finished
    console.log(`Öffne Balloon-Interface für ${balloon.name}`);
  };

  const removeBalloonInterface = (balloon: Balloon) => {
    //this has to be adapted to not only delete the balloon from the interface, but also to delete it from the database
    const updatedItems = dropdownItems.filter(item => item !== balloon);
    setDropdownItems(updatedItems);
  }

  const handleDropdownOpen = () => {
    if (dropdownOpen) {
      setAddingBalloon(false);
    }
    setDropdownOpen(!dropdownOpen);
  };

  return (
    <Navbar fluid rounded>
      <Navbar.Brand href="http://localhost:3000/">
        <img src="/favicon.ico" className="mr-3 h-6 sm:h-9" alt="Balloon Logo" />
        <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">IoT Wetterballon</span>
      </Navbar.Brand>
      <div className="dropdown">
        <button onClick={handleDropdownOpen}>Balloons</button>
        {dropdownOpen ?
          <div className="menu">
            {dropdownItems.map((item, index) => (
              <div key={index} className="menu-item">
                <button className="ml-3" onClick={() => openBalloonInterface(item)}>{item.name}</button>
                <div>
                  <button className="ml-3" onClick={() => removeBalloonInterface(item)}>X</button>
                </div>
              </div>
            ))}
            <Dropdown.Divider />
            <div className="menu-item">
              {addingBalloon ? (
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
    </Navbar >

  );
}

export default Navigationbar;