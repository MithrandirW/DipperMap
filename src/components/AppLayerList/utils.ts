import type {
  IHexLayer,
  ILayer,
  ILayerDoubleColor,
  ILayerFieldColor,
  ILayerSingleColor,
  ILineLayer,
  IPointLayer,
  IPolygonLayer,
  ITripLayer,
  ILayerRange,
  IHeatLayer,
  PropsType,
  IDataset,
} from '../../typings';
import { featureCollection, lineString, point, polygon } from '@turf/turf';
import type { ISourceOptions } from '@antv/l7-react/es/component/LayerAttribute';
import type { ILayerProps } from '@antv/l7-react/lib/component/LayerAttribute';
import { h3ToGeoBoundary } from 'h3-js';
import { cloneDeep, merge } from 'lodash';
import { message } from 'antd';
import { COLOR, POINT_TO_SQUARE_LIMIT } from '../../constants';
import bundle from '../../utils/lineBundle';
import { FIELD_COLOR_MAP, POINT_TO_SQUARE_LIMIT } from '../../constants';

export const getPointList: (coordinates: string) => number[][] = (
  coordinates,
) => {
  return coordinates
    .split(';')
    .map((item) => item.split(',').map((item1) => +item1));
};

export const transformSource: (
  layer: ILayer,
  data: any[],
  dataset?: IDataset | null,
) => ISourceOptions = (layer, data, dataset) => {
  const { type } = layer;

  if (dataset?.geoJson?.enable) {
    return {
      data: featureCollection(dataset?.geoJson?.map[type] ?? []),
    };
  }

  const source: ISourceOptions = {
    data: featureCollection([]),
  };

  try {
    if (['point', 'heat'].includes(type)) {
      const {
        config: { lngField, latField },
      } = layer as IPointLayer;

      if (lngField && latField) {
        source.data = featureCollection(
          data.map((item: any) =>
            point([+item[lngField], +item[latField]], item),
          ),
        );
      }
    }

    if (type === 'line') {
      const {
        config: {
          startLngField,
          startLatField,
          endLngField,
          endLatField,
          enableEdgeBundling,
          edgeBundling,
        },
      } = layer as ILineLayer;

      if (startLngField && startLatField && endLngField && endLatField) {
        if (!enableEdgeBundling) {
          source.data = featureCollection(
            data.map((item) =>
              lineString(
                [
                  [+item[startLngField], +item[startLatField]],
                  [+item[endLngField], +item[endLatField]],
                ],
                item,
              ),
            ),
          );
        } else {
          const { compatibility } = edgeBundling || {
            compatibility: 0.6,
          };

          const bundling = bundle(
            data.map((item) => ({
              start: [item[startLngField], item[startLatField]],
              end: [item[endLngField], item[endLatField]],
            })),
            compatibility,
          );

          const fc = featureCollection(
            bundling.map((coords, index) => lineString(coords, data[index])),
          );

          source.data = fc;
        }
      }
    }

    if (type === 'polygon') {
      const {
        config: { geoField },
      } = layer as IPolygonLayer;

      if (geoField) {
        source.data = featureCollection(
          data.map((item) => {
            return polygon([getPointList(item[geoField])], item);
          }),
        );
      }
    }

    if (type === 'trip') {
      const {
        config: { geoField },
      } = layer as ITripLayer;

      if (geoField) {
        source.data = featureCollection(
          data.map((item) => lineString(getPointList(item[geoField]), item)),
        );
      }
    }

    if (type === 'hex') {
      const {
        config: { hexId },
      } = layer as IHexLayer;

      if (hexId) {
        source.data = featureCollection(
          data.map((item) => {
            const pointList = h3ToGeoBoundary(item[hexId]).map((item) =>
              item.reverse(),
            );
            pointList.push(pointList[0]);
            return polygon([pointList], item);
          }),
        );
      }
    }
  } catch (e) {
    console.error(e);
    message.error('数据解析有误');
  }
  return source;
};

const getCommonLayerProps: (layer: ILayer) => Partial<ILayerProps> = (
  layer,
) => {
  return {
    options: {
      visible: layer.visible,
      blend: layer.config.blendType,
      zIndex: layer.zIndex,
      opacity: layer.config.opacity / 100 ?? 1,
    },
    active: {
      option: {
        color: 'yellow',
      },
    },
    shape: {
      values: 'fill',
    },
  };
};

export const setColorProps = (
  props: Partial<ILayerProps>,
  colorConfig: ILayerSingleColor | ILayerDoubleColor | ILayerFieldColor,
) => {
  if (colorConfig.enable === false) {
    return;
  }
  if (colorConfig.field) {
    const { field, colorIndex, colorType } = colorConfig;
    Object.assign(props, {
      color: { field, values: FIELD_COLOR_MAP[colorType][colorIndex] },
      scale: {
        values: {
          [field]: {
            type: 'quantile',
          },
        },
      },
    });
  } else if (Array.isArray((colorConfig as ILayerDoubleColor).value)) {
    const [targetColor, sourceColor] = (colorConfig as ILayerDoubleColor).value;
    props.style = Object.assign(props.style || {}, {
      targetColor,
      sourceColor,
    });
  } else {
    Object.assign(props, {
      color: {
        values: (colorConfig as ILayerSingleColor).value,
      },
    });
  }
};

export const setSizeProps = (
  props: Partial<ILayerProps>,
  sizeConfig: ILayerRange,
) => {
  const { value, rangeValue, field } = sizeConfig;
  Object.assign(props, {
    size: { field: field ?? undefined, values: field ? rangeValue : value },
  });
};

export const transformProps: (
  layer: ILayer,
  dataLength: number,
) => PropsType[] = (layer, dataLength) => {
  const props: Partial<PropsType> = {
    ...getCommonLayerProps(layer),
  };

  if (layer.type === 'heat') {
    const { config } = layer as IHeatLayer;
    const { fillColor, ranges, intensity, radius, shape, magField } = config;
    let positions: number[] = [];

    const { colorType, colorIndex } = fillColor;
    const colors = FIELD_COLOR_MAP[colorType][colorIndex] || [];
    if (colors && colors.length) {
      // 区间长度
      const sectionLen = ranges[1] - ranges[0] / colors.length;
      positions = colors.map((_, i) => ranges[0] + i * sectionLen);
    }

    merge(props, {
      size: {
        field: magField,
        value: [0, 1],
      },
      shape: {
        values: shape,
      },
      style: {
        intensity,
        radius,
        rampColors: {
          colors: colors || [],
          positions,
        },
      },
    });
  }

  if (layer.type === 'polygon') {
    const { config } = layer as IPolygonLayer;
    const {
      fillColor,
      borderColor,
      borderWidth,
      intense,
      intenseField,
      shape,
    } = config;
    setColorProps(props, fillColor);

    if (shape === 'extrude' && intenseField) {
      props.shape = {
        values: 'extrude',
      };
      props.size = {
        field: intenseField,
        values: (num) => intense * num,
      };
      return [props];
    } else {
      props.shape = {
        values: 'fill',
      };

      // 当为3D但未选择高度字段时，只展示fill
      if (shape === 'extrude') {
        return [props];
      }
      const borderProps = {
        ...cloneDeep(props),
        shape: {
          values: 'line',
        },
        active: {
          option: false,
        },
      };
      setColorProps(borderProps, borderColor);
      setSizeProps(borderProps, borderWidth);
      return [props, borderProps];
    }
  }

  if (layer.type === 'point') {
    const { config } = layer as IPointLayer;
    const { fillColor, borderColor, radius, shape, opacity, size, magField } =
      config;
    setColorProps(props, fillColor);

    if (shape) {
      if (shape === 'cylinder' && magField) {
        props.shape = {
          values: 'cylinder',
        };
        props.size = {
          field: magField,
          values: (num) => {
            return [radius.value, radius.value, num * size];
          },
        };
      } else {
        props.shape = {
          values: 'circle',
        };
        setSizeProps(props, radius);
      }
    } else if (dataLength > POINT_TO_SQUARE_LIMIT) {
      props.shape = {
        values: 'square',
      };
      props.size = {
        values: 1,
      };
    } else {
      props.shape = {
        values: 'circle',
      };
      setSizeProps(props, radius);
    }
    merge(props, {
      style: {
        stroke: borderColor.enable ? borderColor.value : undefined,
        strokeWidth: borderColor.enable ? 1 : 0,
        opacity: opacity / 100 ?? 1,
      },
    });
  }
  if (layer.type === 'line') {
    const { config } = layer as ILineLayer;
    const { lineType, color, lineWidth, opacity } = config;
    Object.assign(props, {
      shape: {
        values: lineType ?? 'line',
      },
      style: {
        segmentNumber: 15,
        opacity: opacity / 100 ?? 1,
      },
    });
    setColorProps(props, color);
    setSizeProps(props, lineWidth);
  }
  if (layer.type === 'trip') {
    const { config } = layer as ITripLayer;
    const { color, lineWidth } = config;
    setColorProps(props, color);
    setSizeProps(props, lineWidth);
    props.shape = {
      values: 'line',
    };
  }
  if (layer.type === 'hex') {
    const { config } = layer as IHexLayer;
    const { fillColor } = config;
    setColorProps(props, fillColor);
  }

  return [props];
};
