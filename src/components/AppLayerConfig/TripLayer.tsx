import React, { useEffect } from 'react';
import type { ITripLayer, ITripLayerConfig } from '../../typings';
import LayerTypeSelect from './components/LayerTypeSelect';
import { Form } from 'antd';
import useCommonHook from './components/commonHook';
import FieldSelect from '../FieldSelect';
import ColorWrapper from './components/ColorWrapper';
import RangeWrapper from './components/RangeWrapper';
import LayerBlend from './components/LayerBlend';
import LayerOpacity from './components/LayerOpacity';
import { FORM_LAYOUT, GEO_JSON_TOOLTIP } from './common';

interface IProps {
  layer: ITripLayer;
  onChange: (newLayer: ITripLayer) => void;
}

const TripLayer = ({ layer, onChange }: IProps) => {
  const [form] = Form.useForm<ITripLayerConfig>();
  const { targetDatasetFields, onFormChange } = useCommonHook(layer, onChange);

  useEffect(() => {
    form.setFieldsValue(layer.config);
  }, [layer.config]);

  return (
    <Form
      {...FORM_LAYOUT}
      labelAlign="left"
      form={form}
      onValuesChange={onFormChange}
    >
      <Form.Item label="基础" colon={false} className="titleFormItem" />

      <LayerTypeSelect layer={layer} onChange={onChange} />

      <Form.Item label="Geojson" name="geoField" tooltip={GEO_JSON_TOOLTIP}>
        <FieldSelect fields={targetDatasetFields} />
      </Form.Item>

      <ColorWrapper
        label="颜色"
        field="color"
        form={form}
        fields={targetDatasetFields}
        range
      />

      <RangeWrapper
        label="线宽"
        field="lineWidth"
        form={form}
        fields={targetDatasetFields}
      />

      <LayerOpacity />

      <LayerBlend />
    </Form>
  );
};

export default TripLayer;