import React, { useState, useEffect, useContext } from 'react'
import { Button, Divider, Table, Spin, notification, Space, Modal } from 'antd'
import constants from '../../shared/constants'
import AddUserCurrency from './AddUserCurrency'
import AuthContext from '../../../context/AuthContext'

import axios from 'axios'
import { PlusCircleOutlined } from '@ant-design/icons'

let token = localStorage.getItem('token')

const GserSetting = () => {
  const { loggedIn, loggedInModules, loggedInAuthorities, loader } =
    useContext(AuthContext)
  const [showModal, setShowModal] = useState(false)
  const [userCurrencies, setUserCurrencies] = useState([])
  const [loading, setLoading] = useState(true)
  const [currencies, setCurrencies] = useState([])

  /*
  @Get Usercurrencies
  */
  const getUserCurrencies = async () => {
    try {
      const response = await axios({
        method: 'get',
        url: `${constants.gatewayBackEndUrl}/gser/userCurrencies/`,
        headers: {
          'Content-type': 'application/text',
          Authorization: token,
        },
      })
      setUserCurrencies(response.data)
      setLoading(false)
    } catch (error) {
      notification['error']({
        message: `Error while getting list of user currencies, please contact support team: support@roam-smart.com`,
        duration: 5,
      })
    }
  }
  // add new list of user currencies
  const updateUserCurrencies = async () => {
    try {
      const response = await axios({
        method: 'post',
        url: `${constants.gatewayBackEndUrl}/gser/userCurrencies/`,
        data: userCurrencies.map((usecurrency) => {
          return { id: usecurrency.id }
        }),
        headers: {
          //'Content-type': 'application/text',
          Authorization: token,
        },
      })
      response.status !== 200 &&
        notification['error']({
          message: `Your request can't be treated, please contact support team: support@roam-smart.com`,
          duration: 5,
        })
      setShowModal(false)
      setLoading(false)
      response.status === 200 &&
        notification['success']({
          message: `User currencies Updated succesfully `,
          duration: 5,
        })
    } catch (error) {
      notification['error']({
        message: `Error while Update list of user currencies, please contact support team: support@roam-smart.com`,
        duration: 5,
      })
    }
  }
  /*@Get currencies
   */

  const getCurrencies = async () => {
    try {
      const response = await axios({
        method: 'get',
        url: `${constants.gatewayBackEndUrl}/public/currency/`,
        headers: {
          'Content-type': 'application/text',
          Authorization: token,
        },
      })
      setCurrencies(response.data)
    } catch (error) {
      notification['error']({
        message: `Error while getting list of currencies, please contact support team: support@roam-smart.com`,
        duration: 5,
      })
    }
  }
  const handelCancel = () => {
    setShowModal(false)
  }
  const newListCurrencies = (value) => {
    const newvalue = currencies.filter((curr) => value.includes(curr.code))
    setUserCurrencies(newvalue)
  }

  const listFilterCurrencyy = (dataIndex) => {
    setShowModal(true)
  }

  useEffect(() => {
    getUserCurrencies()
    getCurrencies()
  }, [])

  /* colums of table */
  let columns = [
    {
      title: 'currency code',
      dataIndex: 'code',
      key: 'currencyCode',
      width: '40%',
    },
    {
      title: 'currency label',
      dataIndex: 'label',
      key: 'currencyLabel',
      width: '40%',
    },
  ]

  return (
    <>
      <Divider orientation='left'> Gser currency</Divider>
      <div className={'row float-right'}>
        {loggedInAuthorities.includes('ROLE_GSER_WRITE') && (
          <Button
            variant='outline-warning'
            style={{ marginRight: 10 }}
            size='sm'
            className={'custom-button'}
            onClick={() => {
              listFilterCurrencyy('currency')
            }}
          >
            <PlusCircleOutlined
              style={{ marginRight: 5, verticalAlign: 'baseline' }}
            />
            Add/Edit currency
          </Button>
        )}
      </div>
      <br /> <br />
      <Modal
        title='Add/Edit currency'
        visible={showModal}
        onCancel={handelCancel}
        onOk={updateUserCurrencies}
      >
        <AddUserCurrency
          listCurrencies={currencies}
          listUserCurrencies={userCurrencies}
          newListCurrencies={newListCurrencies}
        />
      </Modal>
      <Table
        columns={columns}
        rowKey={(record) => record.key}
        dataSource={userCurrencies}
        loading={{
          indicator: (
            <div>
              <Spin tip='Loading...' />
            </div>
          ),
          spinning: loading,
        }}
      />
    </>
  )
}

export default GserSetting
