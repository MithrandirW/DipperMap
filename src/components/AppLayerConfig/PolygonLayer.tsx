import React, { useEffect } from 'react';
import { Form } from 'antd';
import type { IPolygonLayer, IPolygonLayerConfig } from '../../typings';
import useCommonHook from './components/commonHook';
import LayerTypeSelect from './components/LayerTypeSelect';
import FieldSelect from '../FieldSelect';
import ColorWrapper from './components/ColorWrapper';
import RangeWrapper from './components/RangeWrapper';
import LayerBlend from './components/LayerBlend';
import LayerOpacity from './components/LayerOpacity';
import { FORM_LAYOUT, GEO_JSON_TOOLTIP } from './common';

interface IProps {
  layer: IPolygonLayer;
  onChange: (newLayer: IPolygonLayer) => void;
}

const PolygonLayer = ({ layer, onChange }: IProps) => {
  const [form] = Form.useForm<IPolygonLayerConfig>();
  const { targetDatasetFields, onFormChange } = useCommonHook(layer, onChange);

  useEffect(() => {
    form.setFieldsValue(layer.config);
  }, [form, layer.config]);

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
        label="填充颜色"
        field="fillColor"
        form={form}
        fields={targetDatasetFields}
      />

      <ColorWrapper
        label="边框颜色"
        field="borderColor"
        form={form}
        fields={targetDatasetFields}
      />

      <RangeWrapper
        label="边框宽度"
        field="borderWidth"
        form={form}
        fields={targetDatasetFields}
      />

      <LayerOpacity />

      <LayerBlend />
    </Form>
  );
};
export default PolygonLayer;