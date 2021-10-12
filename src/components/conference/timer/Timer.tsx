import React, { FC, useState, useCallback, useEffect } from 'react';
import '../../../assets/css/Timer.scss';
import StatsService from '../../../services/StatsService';
import { formatHHMMSS } from '../../../services/GeneralService';
import useInterval from './useInterval';
import Constants from '../../../assets/utils/Constants';

const statsService = new StatsService();

interface Props {
  roomName: string;
}

const Timer: FC<Props> = (props: Props) => {
  const [startTimestamp, setStartTimestamp] = useState(Date.now());
  const [isLive, setIsLive] = useState(false);
  const [now, setNow] = useState(Date.now());

  useInterval(
    () => {
      setNow(Date.now());
    },
    isLive ? Constants.TIMER.GET_TIME_INTERVAL : null
  );

  useInterval(() => {
    getStartTime();
  }, Constants.TIMER.GET_STATS_INTERVAL);

  const getStartTime = useCallback(async () => {
    try {
      const response = await statsService.getStreamStatistics(props.roomName);
      setStartTimestamp(response.data[0].startTime);
      setIsLive(true);
    } catch {
      setStartTimestamp(now);
      setIsLive(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.roomName]);

  useEffect(() => {
    getStartTime();
  }, [getStartTime]);

  return (
    <div className={`timer ${!isLive ? 'hidden' : ''}`} id="timer">
      <div>Session {formatHHMMSS(now - startTimestamp)}</div>
    </div>
  );
};

export default Timer;
