import { Form, Input, Button, Select, Space } from 'antd'
import AuthContext from '../../../context/AuthContext'
import { useContext, useEffect } from 'react'
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons'

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
const AddDistributionMail = (props) => {
  const { loggedInData } = useContext(AuthContext)

  const [form] = Form.useForm()

  useEffect(() => {
    form.setFieldsValue(
      props.showEditDistribution
        ? {
            networks: props.rowSelected.networks,
            name: props.rowSelected.name,
            emails: props.rowSelected.emails.map((elt) => {
              return {
                email: elt,
              }
            }),
          }
        : {
            networks: loggedInData.customers.principalNetworks,
            name: '',
            emails: [],
          }
    )
  }, [props])

  const onFinish = async (values) => {
    const { emails } = values
    let objDistributionAdd = props.showEditDistribution
      ? {
          ...values,
          emails: emails.map((email) => email.email),
          id: props.rowSelected.id,
        }
      : { ...values, emails: emails.map((email) => email.email), id: null }
    form.resetFields()
    props.parentCallAddDistribution(objDistributionAdd)
    console.log({ ...values, emails: emails.map((email) => email.email) })
    console.log(objDistributionAdd)
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
        name='name'
        label='Name'
        rules={[
          {
            required: true,
            message: 'Please input your name!',
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.List name='emails'>
        {(fields, { add, remove }) => (
          <>
            {fields.map(({ key, name, fieldKey, ...restField }) => (
              <Space
                key={key}
                style={{ display: 'flex', marginBottom: 8 }}
                align='baseline'
              >
                <Form.Item
                  {...restField}
                  name={[name, 'email']}
                  fieldKey={[fieldKey, 'email']}
                  rules={[
                    {
                      type: 'email',
                      message: 'The input is not valid E-mail!',
                    },
                    { required: true, message: 'Missing Email' },
                  ]}
                >
                  <Input placeholder='user@roamsmart.com' />
                </Form.Item>

                <MinusCircleOutlined onClick={() => remove(name)} />
              </Space>
            ))}
            <Form.Item>
              <Button
                onClick={() => add()}
                size='sm'
                type='primary'
                block
                className={'custom-button'}
                icon={<PlusOutlined />}
              >
                Add field
              </Button>
            </Form.Item>
          </>
        )}
      </Form.List>
      <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 8 }}>
        <Button type='primary' htmlType='submit' style={{ float: 'right' }}>
          Save
        </Button>
      </Form.Item>
    </Form>
  )
}
export default AddDistributionMail
