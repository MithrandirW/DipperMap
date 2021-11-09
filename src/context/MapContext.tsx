import React, { createContext, useEffect, useState } from 'react';
import {
  LOCAL_STORAGE_KEY,
  IMapType,
  MAP_THEME_LIST,
  MAP_TYPES,
} from '../constants';

export interface IProps {
  mapTheme: string;
  setMapTheme: (value: string) => void;
  mapType: IMapType;
  setMapType: (value: IMapType) => void;
}

// @ts-ignore
export const MapModelContext = createContext<IProps>();

const { Provider, Consumer } = MapModelContext;

export { Consumer };

const MapContext: React.FC = ({ children }) => {
  const [mapTheme, setMapTheme] = useState(
    localStorage.getItem(LOCAL_STORAGE_KEY.MAP_THEME) ??
      MAP_THEME_LIST[0].value,
  );
  const [mapType, setMapType] = useState<IMapType>(
    (localStorage.getItem(LOCAL_STORAGE_KEY.MAP_TYPE) ??
      MAP_TYPES[0].value) as IMapType,
  );

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY.MAP_THEME, mapTheme);
  }, [mapTheme]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY.MAP_TYPE, mapType);
  }, [mapType]);

  return (
    <Provider value={{ mapTheme, setMapTheme, mapType, setMapType }}>
      {children}
    </Provider>
  );
};

export default MapContext;