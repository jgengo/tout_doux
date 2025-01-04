"use client";

import { useState } from "react";
import { Navbar } from "@/components/navbar";
import { CalendarView } from "@/components/calendar-view";

export default function Page() {
  const [startDate, setStartDate] = useState(new Date());

  return (
    <>
      <Navbar currentDate={startDate} onDateChange={setStartDate} />
      <CalendarView startDate={startDate} />
    </>
  );
}
