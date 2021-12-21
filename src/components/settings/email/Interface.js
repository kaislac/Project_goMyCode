import React, { useState, useContext, useEffect, useRef } from 'react'
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
import {
  PlusCircleOutlined,
  DeleteOutlined,
  EditOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  SearchOutlined,
} from '@ant-design/icons'
import Swal from 'sweetalert2'
import axios from 'axios'
import constants from '../../shared/constants'
import AuthContext from '../../../context/AuthContext'
import AddInterface from './AddInterface'
import Highlighter from 'react-highlight-words'
let token = localStorage.getItem('token')

const Interface = () => {
  const searchInput = useRef(null)
  const [interfaces, setInterfaces] = useState([])
  const [loading, setLoading] = useState(false)
  const [showAddInterface, setShowAddInterface] = useState(false)
  const [showEditInterface, setShowEditInterface] = useState(false)
  const [rowSelected, setRowSelected] = useState({})
  const [searchText, setSearchText] = useState('')
  const [searchedColumn, setSearchedColumn] = useState('')
  const { loggedInAuthorities, loggedInData } = useContext(AuthContext)
  const handelCancel = () => {
    setShowAddInterface(false)
    setShowEditInterface(false)
  }

  function onChange(pagination, filters, sorter, extra) {
    //console.log('params', extra.currentDataSource)
    //setResponsibles(extra.currentDataSource)
  }

  /*
  @Get List of interfaces
  */
  const parseDataInterfaces = (response) => {
    let dataSource = []
    response.status === 200 &&
      response.data.forEach((item, index) => {
        let dataSourceObj = {
          id: item.id !== null ? item.id : index,
          key: index,
          networks: item.networks.map((network) => network.tadigCode),
          email: item.email,
          description: item.description,
          launchReportNotification: item.launchReportNotification ? (
            <CheckCircleOutlined style={{ color: 'green' }} value={'true'} />
          ) : (
            <CloseCircleOutlined style={{ color: 'red' }} value={'false'} />
          ),
          externalNotification: item.externalNotification ? (
            <CheckCircleOutlined style={{ color: 'green' }} value={'true'} />
          ) : (
            <CloseCircleOutlined style={{ color: 'red' }} value={'false'} />
          ),
        }
        dataSource.push(dataSourceObj)
      })
    return dataSource
  }

  const getListInsterfaces = async () => {
    try {
      setLoading(true)
      const response = await axios({
        method: 'post',
        url: `${constants.gatewayBackEndUrl}/project/mail-interfaces/`,

        data: loggedInData.customers.networks,
        headers: {
          'Content-type': 'application/json',
          Authorization: token,
        },
      })
      setInterfaces(() => parseDataInterfaces(response))
      setLoading(false)
    } catch (error) {
      notification['error']({
        message: `Error while getting list of mail interfaces, please contact support team: support@roam-smart.com`,
        duration: 5,
      })
    }
  }
  useEffect(() => {
    getListInsterfaces()
  }, [])
  /* Add and edit interface */

  const parentCallAddInterface = async (objInterfaceAdd) => {
    try {
      const response = await axios({
        method: 'post',
        url: `${constants.gatewayBackEndUrl}/project/mail-interfaces/save/`,
        data: objInterfaceAdd,
        headers: {
          'Content-type': 'application/json',
          //'access-control-allow-origin': '*',
          Authorization: token,
        },
      })

      if (response.status !== undefined && response.status === 200) {
        notification['success']({
          message: `Interface has been successfully created`,
          duration: 5,
        })
      } else {
        notification['error']({
          message: `Error while create Interface, please contact support team: support@roam-smart.com`,
          duration: 5,
        })
      }
    } catch (error) {
      notification['error']({
        message: `Error while create Interface, please contact support team: support@roam-smart.com`,
        duration: 5,
      })
    }
    setShowAddInterface(false)
    setShowEditInterface(false)
    getListInsterfaces()
  }

  /* delete item from interface */
  const deleteInterfaceId = async (row) => {
    const response = await axios({
      method: 'delete',
      url: `${constants.gatewayBackEndUrl}/project/mail-interfaces/${row.id}/`,
      headers: {
        'Content-type': 'application/json',
        Authorization: token,
      },
    })
    return response.data
  }
  const onDeleteInterface = (row) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You want to delete this Interface?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#d9d9d9',
      confirmButtonText: 'Yes!',
    }).then((resut) => {
      if (resut.isConfirmed) {
        deleteInterfaceId(row)
          .then((response) => {
            notification['success']({
              message: 'Interface deleted Successfully',
              duration: 3,
            })
            getListInsterfaces()
          })
          .catch((e) => console.log(e))
      }
    })
  }

  /*edit Interface */

  const onEditInterface = async (row) => {
    await setRowSelected(row)
    setShowEditInterface(true)
  }
  /*
    @ Set email filter with highlighter
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
      title: 'Interface',
      dataIndex: 'email',
      key: 'Interface',
      width: '25%',
      ...getColumnSearchProps('email'),
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'Description',
      width: '35%',
    },
    {
      title: 'Launch Report Notification',
      dataIndex: 'launchReportNotification',
      key: 'Launch Report Notification',
      width: '10%',
      filters: [
        {
          text: 'YES',
          value: true,
        },
        {
          text: 'NO',
          value: false,
        },
      ],
      onFilter: (value, record) =>
        record.launchReportNotification.props.value.indexOf(value) !== -1,
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
                onEditInterface(row)
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
              onDeleteInterface(row)
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
  /*if (loggedInAuthorities.includes('ROLE_PROJECT_MULTIPLE_NETWORK'))*/ {
    columns.push({
      title: 'External Notification',
      dataIndex: 'externalNotification',
      key: 'External Notification',
      width: '10%',
      filters: [
        {
          text: 'YES',
          value: true,
        },
        {
          text: 'NO',
          value: false,
        },
      ],
      onFilter: (value, record) =>
        record.externalNotification.props.value.indexOf(value) !== -1,
    })
  }
  return (
    <>
      <Divider orientation='left'> Interface </Divider>
      <div className={'row float-right'}>
        {loggedInAuthorities.includes('ROLE_SETTINGS_PROJECT_WRITE') && (
          <Button
            variant='outline-warning'
            style={{ marginRight: 15 }}
            size='sm'
            className={'custom-button'}
            onClick={() => setShowAddInterface(true)}
          >
            <PlusCircleOutlined
              style={{ marginRight: 5, verticalAlign: 'baseline' }}
            />
            Add Interface
          </Button>
        )}
      </div>
      <br />
      <br />
      <Table
        columns={columns}
        rowKey={(record) => record.key}
        dataSource={interfaces}
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
        title={showEditInterface ? 'Edit Interface' : 'Add Interface'}
        visible={showAddInterface || showEditInterface}
        onCancel={handelCancel}
        okButtonProps={{ style: { display: 'none' } }}
        cancelButtonProps={{ style: { display: 'none' } }}
      >
        <AddInterface
          parentCallAddInterface={parentCallAddInterface}
          showEditInterface={showEditInterface}
          rowSelected={rowSelected}
        />
      </Modal>
    </>
  )
}

export default Interface
