import React, { useState, useContext, useEffect, useRef } from 'react'
import AuthContext from '../../../context/AuthContext'
import {
  Button,
  Divider,
  Table,
  Spin,
  notification,
  Modal,
  Input,
  Space,
} from 'antd'
import Swal from 'sweetalert2'
import Highlighter from 'react-highlight-words'

import {
  PlusCircleOutlined,
  DeleteOutlined,
  EditOutlined,
  SearchOutlined,
} from '@ant-design/icons'
import axios from 'axios'
import constants from '../../shared/constants'
import AddMailSender from './AddMailSender'
let token = localStorage.getItem('token')
const MailSender = () => {
  const { loggedInAuthorities, loggedInData } = useContext(AuthContext)
  const [loading, setLoading] = useState(false)
  const [mailSenders, setMailSenders] = useState([])
  const [showEditSender, setShowEditSender] = useState(false)
  const [showAddSender, setShowAddSender] = useState(false)
  const [rowSelected, setRowSelected] = useState({})
  const [searchText, setSearchText] = useState('')
  const [searchedColumn, setSearchedColumn] = useState('')
  const searchInput = useRef(null)

  function onChange(pagination, filters, sorter, extra) {}
  const handelCancel = () => {
    setShowAddSender(false)
    setShowEditSender(false)
  }

  /* Add & edit mail sender */
  const parentCallAddSender = async (objMailSenderAdd) => {
    try {
      const response = await axios({
        method: 'post',
        url: `${constants.gatewayBackEndUrl}/project/mail-senders/save`,
        data: objMailSenderAdd,
        headers: {
          'Content-type': 'application/json',
          //'access-control-allow-origin': '*',
          Authorization: token,
        },
      })

      if (response.status !== undefined && response.status === 200) {
        notification['success']({
          message: `Sender Mail has been successfully Created`,
          duration: 5,
        })
      } else {
        notification['error']({
          message: `Error while create Sender Mail, please contact support team: support@roam-smart.com`,
          duration: 5,
        })
      }
    } catch (error) {
      notification['error']({
        message: `Error while create Sender Mail, please contact support team: support@roam-smart.com`,
        duration: 5,
      })
    }
    setShowAddSender(false)
    setShowEditSender(false)
    getListMailSenders()
  }

  /* delete item from Mail Sender */
  const deleteMailSenderId = async (row) => {
    const response = await axios({
      method: 'delete',
      url: `${constants.gatewayBackEndUrl}/project/mail-senders/${row.id}/`,
      headers: {
        'Content-type': 'application/json',
        Authorization: token,
      },
    })
    return response.data
  }
  const onDeleteMailSender = (row) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You want to delete this Mail sender?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#d9d9d9',
      confirmButtonText: 'Yes!',
    }).then((resut) => {
      if (resut.isConfirmed) {
        deleteMailSenderId(row)
          .then((response) => {
            notification['success']({
              message: 'Mail sender deleted Successfully',
              duration: 3,
            })
            getListMailSenders()
          })
          .catch((e) => console.log(e))
      }
    })
  }
  /* get list mailsenders */
  const parseDataMailSenders = (response) => {
    let dataSource = []
    response.status === 200 &&
      response.data.forEach((item, index) => {
        let dataSourceObj = {
          id: item.id !== null ? item.id : index,
          key: index,
          networks: item.networks.map((network) => network.tadigCode),
          email: item.email,
          description: item.description,
        }
        dataSource.push(dataSourceObj)
      })
    return dataSource
  }
  const getListMailSenders = async () => {
    try {
      setLoading(true)
      const response = await axios({
        method: 'post',
        url: `${constants.gatewayBackEndUrl}/project/mail-senders/`,

        data: loggedInData.customers.networks,
        headers: {
          'Content-type': 'application/json',
          Authorization: token,
        },
      })
      setMailSenders(() => parseDataMailSenders(response))
      setLoading(false)
    } catch (error) {
      notification['error']({
        message: `Error while getting list Mail Senders, please contact support team: support@roam-smart.com`,
        duration: 5,
      })
    }
  }
  useEffect(() => {
    getListMailSenders()
  }, [])
  /* edit sender mail */
  const onEditMailSender = (row) => {
    setRowSelected(row)
    setShowEditSender(true)
  }
  /*
    @ Set email sender filter with highlighter
    */

  function getColumnSearchProps(dataIndex) {
    return {
      filterDropdown: ({
        setSelectedKeys,
        selectedKeys,
        confirm,
        clearFilters,
      }) => (
        <div style={{ padding: 8 }}>
          <Input
            ref={searchInput}
            placeholder={`Search ${dataIndex}`}
            value={selectedKeys[0]}
            onChange={(e) =>
              setSelectedKeys(e.target.value ? [e.target.value] : [])
            }
            onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
            style={{ width: 188, marginBottom: 8, display: 'block' }}
          />
          <Space>
            <Button
              type='primary'
              onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
              icon={<SearchOutlined />}
              size='small'
              style={{ width: 90 }}
            >
              Search
            </Button>
            <Button
              onClick={() => handleReset(clearFilters)}
              size='small'
              style={{ width: 90 }}
            >
              Reset
            </Button>
          </Space>
        </div>
      ),
      filterIcon: (filtered) => (
        <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
      ),
      onFilter: (value, record) =>
        record[dataIndex]
          .toString()
          .toLowerCase()
          .includes(value.toLowerCase()),
      onFilterDropdownVisibleChange: (visible) => {
        if (visible) {
          // setTimeout(() => this.searchInput.select());
        }
      },
      render: (text) =>
        searchedColumn === dataIndex ? (
          <Highlighter
            highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
            searchWords={[searchText]}
            autoEscape
            textToHighlight={text.toString()}
          />
        ) : (
          text
        ),
    }
  }

  function handleSearch(selectedKeys, confirm, dataIndex) {
    confirm()
    setSearchText(selectedKeys[0])
    setSearchedColumn(dataIndex)
  }

  function handleReset(clearFilters) {
    clearFilters()
    setSearchText('')
  }

  /* colums of table */
  let columns = [
    {
      title: 'Networks',
      dataIndex: 'networks',
      key: 'Networks',
      width: '10%',
      filters: loggedInData.customers.networks.map((element) => {
        return {
          text: element,
          value: element,
        }
      }),
      defaultFilteredValue: loggedInData.customers.principalNetworks,
      onFilter: (value, record) => record.networks.indexOf(value) === 0,
    },
    {
      title: 'Sender',
      dataIndex: 'email',
      key: 'Sender',
      width: '25%',
      ...getColumnSearchProps('email'),
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'Description',
      width: '50%',
    },
  ]
  if (loggedInAuthorities.includes('ROLE_SETTINGS_PROJECT_WRITE')) {
    columns.unshift({
      title: 'Actions',
      dataIndex: 'actions',
      key: 'actions',
      render: (record, row, i) => (
        <>
          {
            <Button
              onClick={() => {
                onEditMailSender(row)
              }}
              style={{ marginRight: 10 }}
              size='sm'
              className={'icon-button'}
              icon={<EditOutlined style={{ verticalAlign: 'text-top' }} />}
              title={'Edit'}
            ></Button>
          }
          <Button
            onClick={() => {
              onDeleteMailSender(row)
            }}
            style={{ marginRight: 10 }}
            size='sm'
            className={'icon-button'}
            icon={<DeleteOutlined style={{ verticalAlign: 'text-top' }} />}
            title={'Delete'}
          ></Button>
        </>
      ),
    })
  }
  return (
    <>
      <Divider orientation='left'> Mail Sender </Divider>
      <div className={'row float-right'}>
        {loggedInAuthorities.includes('ROLE_SETTINGS_PROJECT_WRITE') && (
          <Button
            variant='outline-warning'
            style={{ marginRight: 15 }}
            size='sm'
            className={'custom-button'}
            onClick={() => setShowAddSender(true)}
          >
            <PlusCircleOutlined
              style={{ marginRight: 5, verticalAlign: 'baseline' }}
            />
            Add Sender Mail
          </Button>
        )}
      </div>
      <br />
      <br />
      <Table
        columns={columns}
        rowKey={(record) => record.key}
        dataSource={mailSenders}
        onChange={onChange}
        loading={{
          indicator: (
            <div>
              <Spin tip='Loading...' />
            </div>
          ),
          spinning: loading,
        }}
      />
      <Modal
        title={showEditSender ? 'Edit Sender Mail' : 'Create Sender Mail'}
        visible={showAddSender || showEditSender}
        onCancel={handelCancel}
        okButtonProps={{ style: { display: 'none' } }}
        cancelButtonProps={{ style: { display: 'none' } }}
      >
        <AddMailSender
          parentCallAddSender={parentCallAddSender}
          showEditSender={showEditSender}
          rowSelected={rowSelected}
        />
      </Modal>
    </>
  )
}

export default MailSender
