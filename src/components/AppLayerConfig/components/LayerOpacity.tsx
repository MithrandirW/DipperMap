import React from 'react';
import { Form, Slider } from 'antd';

interface IProps {
  value?: number;
  onChange?: (newBlend: number) => void;
}

const LayerOpacity: React.FC<IProps> = ({ value, onChange }) => {
  return (
    <Form.Item
      label="透明度"
      name="opacity"
      labelCol={{ span: 24 }}
      wrapperCol={{ span: 24 }}
      className="titleFormItem"
    >
      <Slider value={value} min={1} max={100} onAfterChange={onChange} />
    </Form.Item>
  );
};

export default LayerOpacity;