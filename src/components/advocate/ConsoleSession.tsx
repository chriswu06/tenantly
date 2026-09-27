"use client";

import { createContext, useContext, type ReactNode } from "react";

/** The signed-in advocate, as the console chrome needs it. Set once by the console layout. */
export type ConsoleSession = {
  fullName: string;
  firstName: string;
  initials: string;
  organization: string;
  isAdmin: boolean;
  /** Count on the sidebar's Cases link. */
  caseCount: number;
};

const ConsoleSessionContext = createContext<ConsoleSession | null>(null);

export function ConsoleSessionProvider({ value, children }: { value: ConsoleSession; children: ReactNode }) {
  return <ConsoleSessionContext.Provider value={value}>{children}</ConsoleSessionContext.Provider>;
}

export function useConsoleSession(): ConsoleSession {
  const session = useContext(ConsoleSessionContext);
  if (!session) throw new Error("useConsoleSession must be used inside the advocate console layout");
  return session;
}

/** The advocate's organization name, for use inside Server Components. */
export function OrganizationName() {
  return <>{useConsoleSession().organization}</>;
}
