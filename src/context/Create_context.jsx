/* eslint-disable react/prop-types */
import { useState, useEffect, useContext, createContext } from "react";
import { supabase } from "../supabaseClient";

const AppContext = createContext({});

const AppContextProvider = ({ children }) => {
  const [notifiction, setNotifiction] = useState([]);

  const handleNotification = (payload) => {
    setNotifiction((pre) => [...pre, payload.new]);
  };

  const getAllNotificationIsFalse = async()=>{
    const getNotification = await supabase.from("notifiction").select("*").range(0, 10)
    await setNotifiction(getNotification.data)
  }

  useEffect(() => {
    const getData = () => {
      getAllNotificationIsFalse()
      supabase
        .channel("db_change")
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "notifiction",
          },
          (payload) => {
            handleNotification(payload);
          }
        )
        .subscribe();
    };
    getData();
    return () => {
      supabase.channel("db_change").unsubscribe();
    };
  }, []);


  return (
    <AppContext.Provider
      value={{
        notifiction,
        setNotifiction
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

const useAppContext = () => useContext(AppContext);
// eslint-disable-next-line react-refresh/only-export-components
export { AppContext as default, AppContextProvider, useAppContext };
