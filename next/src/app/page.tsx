'use client'
import Link from 'next/link';
import {Button, Navbar} from 'flowbite-react';
import dynamic from "next/dynamic";

const LeafletMap = dynamic(() => {
    return import("@/components/leaflet-map");
},
    {ssr: false});

const MainPage = () => {
  return (
      <>
          <Navbar></Navbar>
          <LeafletMap></LeafletMap>

      </>
  )
}

export default MainPage;