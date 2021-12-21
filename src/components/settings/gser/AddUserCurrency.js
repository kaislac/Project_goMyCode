import { Select } from 'antd'

const AddUserCurrency = (props) => {
  const { Option } = Select

  const children = []
  props.listCurrencies.forEach((item, index) => {
    children.push(
      <Option key={index} value={item.code}>
        {item.code}
      </Option>
    )
  })

  function handleChange(value) {
    props.newListCurrencies(value)
  }

  return (
    <>
      <Select
        mode='multiple'
        //size={size}
        placeholder='Please select'
        defaultValue={props.listUserCurrencies.map((item) => item.code)}
        onChange={handleChange}
        style={{ width: '100%' }}
      >
        {children}
      </Select>
    </>
  )
}
export default AddUserCurrency
