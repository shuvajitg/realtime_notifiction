import { useEffect, useState } from "react";
import { useAppContext } from "../context/Create_context";
import { IoIosNotifications } from "react-icons/io";
import { supabase } from "../supabaseClient";

function Notifiction() {
  const [count, setCount] = useState(0);
  const { notifiction } = useAppContext();
  const [open, setOpen] = useState(false);
  const [notifictionId, setNotifictionId] = useState("");
  const [updateData, setUpdateData] = useState(null);

  const handleNotification = async () => {
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
        <IoIosNotifications
          onClick={handleNotification}
          className="text-4xl cursor-pointer"
        />
        <div className="absolute mt-28">
          {open && (
            <div className="h-auto w-auto bg-blue-950 p-3 text-white">
              {notifiction.length === 0 ? (
                <div> Empty </div>
              ) : (
                <div>
                  {" "}
                  {notifiction.map((data, index) => (
                    <div key={index}>
                      <p>{data.activity}</p>
                    </div>
                  ))}{" "}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Notifiction;
