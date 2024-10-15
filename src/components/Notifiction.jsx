import { useEffect, useState } from "react";
import { useAppContext } from "../context/Create_context";
import { supabase } from "../supabaseClient";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "./ui/button";
import { Bell } from "lucide-react";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { format } from "date-fns";

function Notifiction() {
  const [count, setCount] = useState(0);
  const { notifiction } = useAppContext();
  const [notifictionId, setNotifictionId] = useState("");
  const [updateData, setUpdateData] = useState(null);

  const handleNotification = async () => {
    try {
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
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon" className="relative">
              <Bell className="h-4 w-4" />
              {count > 0 && (
                <div className="absolute -top-2 -right-2 px-2 py-1 text-xs bg-red-600 rounded-full text-white">{count}</div>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel>Notifications</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <ScrollArea className="h-[300px]">
              {notifiction.length > 0 ? (
                notifiction.map((notification, index) => (
                  <DropdownMenuItem
                    key={index}
                    className="flex flex-col items-start p-4"
                  >
                    <div className="flex justify-between w-full">
                      <span className="font-medium text-xs line-clamp-3">
                        {notification.activity}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="bg-slate-100 hover:bg-slate-50"
                        onClick={handleNotification}
                      >
                        {
                          notification.is_read === false? (
                            "Mark as read"
                          ) : (
                            "Undo"
                          )
                        }
                      </Button>
                    </div>
                    <span className="text-sm text-gray-500 dark:text-gray-400 mt-2 ml-5">
                      {format(notification.created_at, "MMM d, yyyy HH:mm")}
                    </span>
                  </DropdownMenuItem>
                ))
              ) : (
                <div className="p-4 text-center text-sm text-gray-500 dark:text-gray-400">
                  No new notifications
                </div>
              )}
            </ScrollArea>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}

export default Notifiction;
