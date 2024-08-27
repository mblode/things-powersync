import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";
import { useEffect, useState } from "react";

export const useToken = () => {
  const supabase = createClient();
  const [user, setUser] = useState<null | User>(null);

  useEffect(() => {
    const getData = async () => {
      const { data, error } = await supabase.auth.getUser();
      setUser(data?.user);
    };

    getData();
  }, [supabase.auth]);

  return { user };
};
