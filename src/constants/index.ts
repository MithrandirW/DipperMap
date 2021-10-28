import type {
  ILineLayerLineType,
  IOption,
  IDatasetFieldType,
  IHexLayerConfig,
  ILayerType,
  ILineLayerConfig,
  IPointLayerConfig,
  IPolygonLayerConfig,
  ITripLayerConfig,
} from '../typings';

export const DEFAULT_COLOR = '#1890ff';

export const MAP_THEME_LIST: IOption[] = [
  {
    label: '幻影黑',
    value: 'dark',
  },
  {
    label: '标准',
    value: 'normal',
  },
  {
    label: '月光银',
    value: 'light',
  },
  {
    label: '远山黛',
    value: 'whitesmoke',
  },
  {
    label: '草色青',
    value: 'fresh',
  },
  {
    label: '雅士灰',
    value: 'grey',
  },
  {
    label: '涂鸦',
    value: 'graffiti',
  },
  {
    label: '马卡龙',
    value: 'macaron',
  },
  {
    label: '靛青蓝',
    value: 'blue',
  },
  {
    label: '极夜蓝',
    value: 'darkblue',
  },
  {
    label: '酱籽',
    value: 'wine',
  },
];

export const LOCAL_STORAGE_KEY = {
  MAP_THEME: 'MAP_THEME',
};

export const DATASET_FIELD_TYPE_COLOR: Record<IDatasetFieldType, string> = {
  string: 'green',
  number: 'gold',
  boolean: 'blue',
};

export const LAYER_TYPE_LIST: IOption<ILayerType>[] = [
  {
    label: '点(Point)',
    value: 'point',
  },
  {
    label: '线(Line)',
    value: 'line',
  },
  {
    label: '路径(Trip)',
    value: 'trip',
  },
  {
    label: '多边形(Polygon)',
    value: 'polygon',
  },
  {
    label: '六边形(Hex)',
    value: 'hex',
  },
];

export const LINE_TYPE_LIST: IOption<ILineLayerLineType>[] = [
  {
    label: '直线',
    value: 'straight',
  },
  {
    label: '曲线',
    value: 'arc',
  },
];

export const DEFAULT_POINT_LAYER_CONFIG: IPointLayerConfig = {
  lngField: null,
  latField: null,
  fillColor: {
    value: DEFAULT_COLOR,
    enable: true,
  },
  borderColor: {
    value: DEFAULT_COLOR,
  },
  radius: {
    value: 10,
    rangeValue: [1, 100],
    field: null,
  },
};

export const DEFAULT_LINE_LAYER_CONFIG: ILineLayerConfig = {
  startLngField: null,
  startLatField: null,
  endLngField: null,
  endLatField: null,
  lineType: 'straight',
  lineWidth: {
    value: 1,
    rangeValue: [1, 10],
    field: null,
  },
  color: {
    value: [DEFAULT_COLOR, DEFAULT_COLOR],
  },
};

export const DEFAULT_TRIP_LAYER_CONFIG: ITripLayerConfig = {
  geoField: null,
  color: {
    value: [DEFAULT_COLOR, DEFAULT_COLOR],
    field: null,
  },
  lineWidth: {
    value: 1,
    rangeValue: [1, 10],
    field: null,
  },
};

export const DEFAULT_POLYGON_LAYER_CONFIG: IPolygonLayerConfig = {
  geoField: null,
  fillColor: {
    value: DEFAULT_COLOR,
    field: null,
  },
  borderColor: {
    value: DEFAULT_COLOR,
    field: null,
  },
  borderWidth: {
    value: 1,
    rangeValue: [1, 10],
    field: null,
  },
};

export const DEFAULT_HEX_LAYER_CONFIG: IHexLayerConfig = {
  hexId: null,
  fillColor: {
    value: DEFAULT_COLOR,
    field: null,
  },
};
