import { Form, Input, Button, Select } from 'antd'
import AuthContext from '../../../context/AuthContext'
import { useContext, useEffect } from 'react'

const layout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 16,
  },
}
/* eslint-disable no-template-curly-in-string */

const validateMessages = {
  required: '${label} is required!',
}
const AddMailTemplate = (props) => {
  const { loggedInAuthorities, loggedInData } = useContext(AuthContext)
  const [form] = Form.useForm()
  useEffect(() => {
    form.setFieldsValue(
      props.showEditTemplate
        ? {
            networks: props.rowSelected.networks,
            title: props.rowSelected.subject,
            body: props.rowSelected.template,
          }
        : {
            networks: loggedInData.customers.principalNetworks,
            title: '',
            body: '',
          }
    )
  }, [props])

  const onFinish = async (values) => {
    let objMailTemplateAdd = props.showEditTemplate
      ? { ...values, id: props.rowSelected.id }
      : { ...values, id: null }
    form.resetFields()
    props.parentCallAddTemplate(objMailTemplateAdd)
  }
  return (
    <Form
      {...layout}
      name='nest-messages'
      onFinish={onFinish}
      form={form}
      validateMessages={validateMessages}
    >
      <Form.Item
        label='Network'
        name={'networks'}
        rules={[
          {
            required: true,
          },
        ]}
      >
        <Select mode='multiple'>
          {loggedInData.customers.networks.map((item) => {
            return <Select.Option value={item}>{item}</Select.Option>
          })}
        </Select>
      </Form.Item>
      <Form.Item
        name='title'
        label='Subject'
        rules={[
          {
            required: true,
            message: 'Please input your subject!',
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item name={'body'} label='Template'>
        <Input.TextArea rows={6} />
      </Form.Item>

      <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 8 }}>
        <Button type='primary' htmlType='submit' style={{ float: 'right' }}>
          Save
        </Button>
      </Form.Item>
    </Form>
  )
}
export default AddMailTemplate
