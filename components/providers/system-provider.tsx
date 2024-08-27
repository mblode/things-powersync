"use client";

import { PowerSyncContext } from "@powersync/react";
import { PowerSyncDatabase } from "@powersync/web";
import Logger from "js-logger";
import React, { Suspense } from "react";
import { SupabaseConnector } from "@/lib/powersync/supabase-connector";
import { AppSchema } from "@/lib/powersync/app-schema";

// eslint-disable-next-line react-hooks/rules-of-hooks
Logger.useDefaults();
Logger.setLevel(Logger.DEBUG);

export const db = new PowerSyncDatabase({
  database: { dbFilename: "powersync2.db" },
  schema: AppSchema,
  flags: {
    disableSSRWarning: true,
  },
});

const connector = new SupabaseConnector();

db.connect(connector);

export const SystemProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <Suspense>
      <PowerSyncContext.Provider value={db}>
        {children}
      </PowerSyncContext.Provider>
    </Suspense>
  );
};

export default SystemProvider;
