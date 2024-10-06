import { useEffect, useState } from "react";
import { useAppContext } from "../context/Create_context";
import { IoIosNotifications } from "react-icons/io";
import { supabase } from "../supabaseClient";
import { Card, CardContent } from "./ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
} from "@/components/ui/dropdown-menu";
import { Button } from "./ui/button";

function Notifiction() {
  const [count, setCount] = useState(0);
  const { notifiction } = useAppContext();
  const [open, setOpen] = useState(false);
  const [notifictionId, setNotifictionId] = useState("");
  const [updateData, setUpdateData] = useState(null);

  const handleNotification = async () => {
    console.log("click");

    try {
      if (!open) {
        setOpen(true);
      } else {
        setOpen(false);
      }
      await notifiction.filter((data) => {
        if (data.is_read == false) {
          const id = data.notifiction_id;
          setNotifictionId(id);
        } else {
          setNotifictionId("");
          return;
        }
      });
      const { data, error } = await supabase
        .from("notifiction")
        .update({ is_read: true })
        .eq("notifiction_id", notifictionId)
        .select();
      if (data) {
        setUpdateData(data);
      } else {
        return;
      }
      if (error) {
        console.log(error.message);
        return;
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    const getUserId = () => {
      if (updateData) {
        updateData.filter((newData) => {
          if (newData.is_read === true) {
            setCount(0);
          }
        });
      } else {
        return;
      }
    };
    getUserId();
  }, [updateData, count]);

  useEffect(() => {
    const getUserId = () => {
      if (notifiction) {
        setCount(notifiction.filter((data) => data.is_read === false).length);
        return;
      }
    };
    getUserId();
  }, [notifiction]);

  return (
    <div className="py-2 px-4">
      <div className="flex flex-col items-end justify-center relative mt-2">
        <div className="absolute -mt-8 pl-5">
          {!notifiction ? (
            <div>{""}</div>
          ) : (
            <div className="bg-red-600 text-white px-1.5 rounded-full">
              {count >= 1 ? (
                <div>{count}</div>
              ) : (
                <div className="hidden">{}</div>
              )}
            </div>
          )}
        </div>
        <DropdownMenu className="absolute">
          <Button
            className="cursor-pointer"
            onClick={handleNotification}
            size="icon"
          >
            <IoIosNotifications className="h-4 w-4" />
          </Button>
          {open && 
          <DropdownMenuContent align="end" className="w-64">
            {notifiction.length === 0 ? (
              <div> Empty </div>
            ) : (
              <div>
                {" "}
                {notifiction.map((data, index) => (
                  <div className="" key={index}>
                    <p className="mt-2">{data.activity}</p>
                  </div>
                ))}{" "}
              </div>
            )}
          </DropdownMenuContent>
          }
        </DropdownMenu>
        <div className="absolute mt-28">
          {open && (
            <Card className="w-[300px] bg-blue-950 text-white">
              <CardContent className="flex flex-col items-center mt-3">
                {notifiction.length === 0 ? (
                  <div> Empty </div>
                ) : (
                  <div>
                    {" "}
                    {notifiction.map((data, index) => (
                      <div className="" key={index}>
                        <p className="mt-2">{data.activity}</p>
                      </div>
                    ))}{" "}
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

export default Notifiction;
