"use client";

import { useConsoleSession } from "./ConsoleSession";
import { greetingFor } from "./display";

/** The mobile app bar already has the page's <h1>, so this greeting has none. */
export function OverviewGreeting() {
  const { firstName, organization } = useConsoleSession();
  const { greeting, date } = greetingFor();
  const text = `${greeting}, ${firstName}`;
  return (
    <div className="flex flex-col gap-0.5 lg:gap-1">
      <p suppressHydrationWarning className="text-20 leading-[1.25] font-semibold text-text-primary lg:hidden">
        {text}
      </p>
      <h1 suppressHydrationWarning className="hidden text-24 font-semibold text-text-primary lg:block">
        {text}
      </h1>
      <p suppressHydrationWarning className="text-13 leading-[1.4] text-text-secondary lg:text-14">
        <span className="hidden lg:inline">{organization} · </span>
        {date}
      </p>
    </div>
  );
}
