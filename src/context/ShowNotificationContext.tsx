import { createContext, useContext } from 'react';
import Constants from '../assets/utils/Constants';

export interface ShowNotificationContextProvider {
  objectNotification: { show: boolean; message: string; type: string };
  setObjectNotification: any;
}

export const SHOW_NOTIFICATION_CONTEXT_DEFAULT_VALUE = {
  objectNotification: { show: false, message: '', type: Constants.SUCCESS },
  setObjectNotification: () => {},
};

export const ShowNotificationContext = createContext<ShowNotificationContextProvider>(SHOW_NOTIFICATION_CONTEXT_DEFAULT_VALUE);

export const useShowNotification = () => {
  return useContext(ShowNotificationContext);
};
