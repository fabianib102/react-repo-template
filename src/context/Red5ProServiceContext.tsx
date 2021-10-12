import React, { createContext, useContext, FC, useState } from 'react';
import { IRed5ProService } from '../assets/utils/Interfaces';
import Red5ProService from '../services/Red5ProService';
import { useShowNotification } from './ShowNotificationContext';

export interface Red5ProServiceContextProvider {
  red5ProService?: IRed5ProService;
}

interface Props {
  children: React.ReactNode;
}

const Red5ProServiceContext = createContext<{ red5ProService: Red5ProService } | undefined>(undefined);

const Provider: FC<Props> = (props: Props) => {
  const { setObjectNotification } = useShowNotification();
  const [red5ProService] = useState<Red5ProService>(new Red5ProService(setObjectNotification));
  const value = { red5ProService };
  return <Red5ProServiceContext.Provider value={value}>{props.children}</Red5ProServiceContext.Provider>;
};

const useRed5Pro = () => {
  const context = useContext(Red5ProServiceContext);
  if (context === undefined) {
    throw new Error('useRed5Pro must be used within an Red5ProContext.Provider');
  }
  return context;
};

const Red5ProContext = { Provider, useRed5Pro };

export default Red5ProContext;
