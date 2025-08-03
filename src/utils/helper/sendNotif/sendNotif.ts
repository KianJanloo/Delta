/* eslint-disable */

import { sendNotification } from "@/utils/service/api/notifications/sendNotification";

interface ISendNotif {
    userId: number,
    title: string,
    message: string,
    type: string,
    dataNotification: any
}

export const sendNotif = async (props: ISendNotif) => {
 
  const { userId, title, message, type, dataNotification } = props;

  const data = {
    room: `${title} ${userId}`,
    notification: {
      userId: userId,
      title: title,
      message: message,
      type: type,
      data: dataNotification,
    },
  };

  const response = await sendNotification(data);
  return response;
};
