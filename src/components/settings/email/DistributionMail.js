import React from 'react'
import {
  Divider,
  Button,
  Table,
  Space,
  Input,
  notification,
  Spin,
  Modal,
} from 'antd'
import {
  PlusCircleOutlined,
  DeleteOutlined,
  EditOutlined,
  SearchOutlined,
} from '@ant-design/icons'
import { useState, useContext, useRef, useEffect } from 'react'
import AuthContext from '../../../context/AuthContext'
import Highlighter from 'react-highlight-words'
import axios from 'axios'
import constants from '../../shared/constants'
import AddDistributionMail from './AddDistributionMail'
import Swal from 'sweetalert2'

const DistributionMail = () => {
  let token = localStorage.getItem('token')
  const { loggedInAuthorities, loggedInData } = useContext(AuthContext)
  const [showAddDistribution, setShowAddDistribution] = useState(false)
  const [showEditDistribution, setShowEditDistribution] = useState(false)
  const [searchText, setSearchText] = useState('')
  const [searchedColumn, setSearchedColumn] = useState('')
  const [mailDistributions, setMailDistributions] = useState([])
  const [loading, setLoading] = useState(false)
  const [rowSelected, setRowSelected] = useState({})
  const searchInput = useRef(null)
  const handelCancel = () => {
    setShowAddDistribution(false)
    setShowEditDistribution(false)
  }
  /* edit Distribution mail */
  const onEditDistributionMail = (row) => {
    setRowSelected(row)
    setShowEditDistribution(true)
  }
  /* delete item from Distribution Mail */
  const deleteMailDistributionId = async (row) => {
    const response = await axios({
      method: 'delete',
      url: `${constants.gatewayBackEndUrl}/project/remove-distribution-mails/${row.id}/`,
      headers: {
        'Content-type': 'application/json',
        Authorization: token,
      },
    })
    return response.data
  }
  const onDeleteMailDistribution = (row) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You want to delete this Distribution Mail?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#d9d9d9',
      confirmButtonText: 'Yes!',
    }).then((resut) => {
      if (resut.isConfirmed) {
        deleteMailDistributionId(row)
          .then((response) => {
            notification['success']({
              message: 'Distribution deleted Successfully',
              duration: 3,
            })
            getListMailDistribution()
          })
          .catch((e) => console.log(e))
      }
    })
  }
  /* get list Disitribution mail */
  const parseDataMailDistribution = (response) => {
    let dataSource = []
    response.status === 200 &&
      response.data.forEach((item, index) => {
        let dataSourceObj = {
          id: item.id !== null ? item.id : index,
          key: index,
          networks: item.networks,
          name: item.name,
          emails: item.emails,
        }
        dataSource.push(dataSourceObj)
      })
    return dataSource
  }
  const getListMailDistribution = async () => {
    try {
      setLoading(true)
      const response = await axios({
        method: 'post',
        url: `${constants.gatewayBackEndUrl}/project/load-distribution-mails/`,

        data: loggedInData.customers.networks,
        headers: {
          'Content-type': 'application/json',
          Authorization: token,
        },
      })
      setMailDistributions(() => parseDataMailDistribution(response))
      setLoading(false)
    } catch (error) {
      notification['error']({
        message: `Error while getting list of Mail Template, please contact support team: support@roam-smart.com`,
        duration: 5,
      })
    }
  }
  useEffect(() => {
    getListMailDistribution()
  }, [])
  /*
    @ Set emails Distribution filter with highlighter
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
  /* Add & edit Distribution */
  const parentCallAddDistribution = async (objDistributionAdd) => {
    try {
      const response = await axios({
        method: 'post',
        url: `${constants.gatewayBackEndUrl}/project/save-distribution-mails/`,
        data: objDistributionAdd,
        headers: {
          'Content-type': 'application/json',
          //'access-control-allow-origin': '*',
          Authorization: token,
        },
      })

      if (response.status !== undefined && response.status === 200) {
        notification['success']({
          message: `Distribution Mail has been successfully Created`,
          duration: 5,
        })
      } else {
        notification['error']({
          message: `Error while create Distribution Mail, please contact support team: support@roam-smart.com`,
          duration: 5,
        })
      }
    } catch (error) {
      notification['error']({
        message: `Error while create Distribution Mail, please contact support team: support@roam-smart.com`,
        duration: 5,
      })
    }
    setShowAddDistribution(false)
    setShowEditDistribution(false)
    getListMailDistribution()
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
      title: 'Name',
      dataIndex: 'name',
      key: 'Name',
      width: '25%',
      ...getColumnSearchProps('name'),
    },
    {
      title: 'Emails',
      dataIndex: 'emails',
      key: 'Emails',
      width: '50%',
      ...getColumnSearchProps('emails'),
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
                onEditDistributionMail(row)
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
              onDeleteMailDistribution(row)
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
      <Divider orientation='left'> Distribution Mail </Divider>
      <div className={'row float-right'}>
        {loggedInAuthorities.includes('ROLE_SETTINGS_PROJECT_WRITE') && (
          <Button
            variant='outline-warning'
            style={{ marginRight: 15 }}
            size='sm'
            className={'custom-button'}
            onClick={() => setShowAddDistribution(true)}
          >
            <PlusCircleOutlined
              style={{ marginRight: 5, verticalAlign: 'baseline' }}
            />
            Add Distribution Mail
          </Button>
        )}
      </div>
      <br />
      <br />
      <Table
        columns={columns}
        rowKey={(record) => record.key}
        dataSource={mailDistributions}
        //onChange={onChange}
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
        title={
          showEditDistribution ? 'Edit Mail Template' : 'Create Mail Template'
        }
        visible={showAddDistribution || showEditDistribution}
        onCancel={handelCancel}
        okButtonProps={{ style: { display: 'none' } }}
        cancelButtonProps={{ style: { display: 'none' } }}
      >
        <AddDistributionMail
          parentCallAddDistribution={parentCallAddDistribution}
          showEditDistribution={showEditDistribution}
          rowSelected={rowSelected}
        />
      </Modal>
    </>
  )
}

export default DistributionMail
