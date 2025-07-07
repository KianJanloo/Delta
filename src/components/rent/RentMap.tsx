'use client'
import React from "react";
import ReserveMap from "../reserve/map/ReserveMap";
import { motion } from 'framer-motion'

const RentMap = ({ caption, location }: { caption: string, location: { lng: number, lat: number } }) => {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }} className="w-full flex flex-col md:flex-row justify-center gap-6">
      <div className="w-1/2 max-md:hidden h-[324px]">
        <ReserveMap location={location} />
      </div>
      <div className="w-full md:hidden cursor-pointer block h-[324px]">
        <ReserveMap location={location} />
      </div>

      <div className="w-1/2 max-md:w-full">
        <p className="text-secondary-foreground lg:text-lg md:text-md sm:text-sm text-xs text-justify">
          {caption}
        </p>
      </div>
    </motion.div>
  );
};

export default RentMap;
