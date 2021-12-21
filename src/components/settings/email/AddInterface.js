import { Form, Input, Button, Select, Checkbox } from 'antd'
import { UploadOutlined } from '@ant-design/icons'
import AuthContext from '../../../context/AuthContext'
import { useContext, useState } from 'react'
import { useEffect } from 'react'

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
/* eslint-enable no-template-curly-in-string */

const AddInterface = (props) => {
  let token = localStorage.getItem('token')
  const { loggedInData } = useContext(AuthContext)

  const [form] = Form.useForm()

  useEffect(() => {
    form.setFieldsValue(
      props.showEditInterface
        ? {
            networks: props.rowSelected.networks,
            email: props.rowSelected.email,
            externalNotification:
              props.rowSelected.externalNotification.props.value == 'true'
                ? true
                : false,
            launchReport:
              props.rowSelected.launchReportNotification.props.value == 'true'
                ? true
                : false,
            description: props.rowSelected.description,
          }
        : {
            networks: loggedInData.customers.principalNetworks,
            email: '',
            externalNotification: false,
            launchReport: false,
            description: '',
          }
    )
  }, [props])

  const onFinish = async (values) => {
    let objInterfaceAdd = props.showEditInterface
      ? { ...values, sender: false, id: props.rowSelected.id }
      : { ...values, sender: false, id: null }
    form.resetFields()
    props.parentCallAddInterface(objInterfaceAdd)
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
        name='email'
        label='E-mail'
        rules={[
          {
            type: 'email',
            message: 'The input is not valid E-mail!',
          },
          {
            required: true,
            message: 'Please input your E-mail!',
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name={'launchReport'}
        label='Launch Report Notification'
        valuePropName='checked'
      >
        <Checkbox />
      </Form.Item>
      <Form.Item
        name={'externalNotification'}
        label='External Notification'
        valuePropName='checked'
      >
        <Checkbox />
      </Form.Item>
      <Form.Item name={'description'} label='Description'>
        <Input.TextArea />
      </Form.Item>

      <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 8 }}>
        <Button type='primary' htmlType='submit' style={{ float: 'right' }}>
          Save
        </Button>
      </Form.Item>
    </Form>
  )
}
export default AddInterface
