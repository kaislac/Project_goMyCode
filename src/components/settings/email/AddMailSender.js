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

const AddMailSender = (props) => {
  const { loggedInData } = useContext(AuthContext)

  const [form] = Form.useForm()
  useEffect(() => {
    form.setFieldsValue(
      props.showEditSender
        ? {
            networks: props.rowSelected.networks,
            email: props.rowSelected.email,
            description: props.rowSelected.description,
          }
        : {
            networks: loggedInData.customers.principalNetworks,
            email: '',
            description: '',
          }
    )
  }, [props])

  const onFinish = async (values) => {
    let objMailSenderAdd = props.showEditSender
      ? { ...values, sender: true, id: props.rowSelected.id }
      : { ...values, sender: true, id: null }
    form.resetFields()
    props.parentCallAddSender(objMailSenderAdd)
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
export default AddMailSender
