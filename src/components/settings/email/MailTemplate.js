import React, { useContext, useState, useEffect, useRef } from 'react'
import {
  Divider,
  Button,
  Table,
  notification,
  Spin,
  Input,
  Space,
  Modal,
} from 'antd'
import {
  PlusCircleOutlined,
  DeleteOutlined,
  EditOutlined,
  SearchOutlined,
} from '@ant-design/icons'
import AuthContext from '../../../context/AuthContext'
import axios from 'axios'
import constants from '../../shared/constants'
import Highlighter from 'react-highlight-words'
import AddMailTemplate from './AddMailTemplate'
import Swal from 'sweetalert2'

const MailTemplate = () => {
  let token = localStorage.getItem('token')
  const { loggedInAuthorities, loggedInData } = useContext(AuthContext)
  const [loading, setLoading] = useState(false)
  const [rowSelected, setRowSelected] = useState({})
  const [mailTemplates, setMailTemplates] = useState([])
  const [searchText, setSearchText] = useState('')
  const [searchedColumn, setSearchedColumn] = useState('')
  const [showEditTemplate, setShowEditTemplate] = useState(false)
  const [showAddTemplate, setShowAddTemplate] = useState(false)
  const searchInput = useRef(null)
  const handelCancel = () => {
    setShowAddTemplate(false)
    setShowEditTemplate(false)
  }
  /* edit mail Template*/
  const onEditMailTemplate = (row) => {
    setRowSelected(row)
    setShowEditTemplate(true)
  }
  /*
    @ Set email template filter with highlighter
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
  /* Add & edit mail Template */
  const parentCallAddTemplate = async (objMailSenderAdd) => {
    try {
      const response = await axios({
        method: 'post',
        url: `${constants.gatewayBackEndUrl}/project/mail-templates/edit`,
        data: objMailSenderAdd,
        headers: {
          'Content-type': 'application/json',
          //'access-control-allow-origin': '*',
          Authorization: token,
        },
      })

      if (response.status !== undefined && response.status === 200) {
        notification['success']({
          message: `Mail Template has been successfully Created`,
          duration: 5,
        })
      } else {
        notification['error']({
          message: `Error while create Mail template, please contact support team: support@roam-smart.com`,
          duration: 5,
        })
      }
    } catch (error) {
      notification['error']({
        message: `Error while create Mail template, please contact support team: support@roam-smart.com`,
        duration: 5,
      })
    }
    setShowAddTemplate(false)
    setShowEditTemplate(false)
    getListMailTemplate()
  }
  /* delete item from Mail Template */
  const deleteMailTemplateId = async (row) => {
    const response = await axios({
      method: 'delete',
      url: `${constants.gatewayBackEndUrl}/project/mail-templates/${row.id}/`,
      headers: {
        'Content-type': 'application/json',
        Authorization: token,
      },
    })
    return response.data
  }
  const onDeleteMailTemplate = (row) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You want to delete this Template?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#d9d9d9',
      confirmButtonText: 'Yes!',
    }).then((resut) => {
      if (resut.isConfirmed) {
        deleteMailTemplateId(row)
          .then((response) => {
            notification['success']({
              message: 'Template deleted Successfully',
              duration: 3,
            })
            getListMailTemplate()
          })
          .catch((e) => console.log(e))
      }
    })
  }

  /* get list mailtemplate */
  const parseDataMailTemplate = (response) => {
    let dataSource = []
    response.status === 200 &&
      response.data.forEach((item, index) => {
        let dataSourceObj = {
          id: item.id !== null ? item.id : index,
          key: index,
          networks: item.networks.map((network) => network.tadigCode),
          subject: item.title,
          template: item.body,
        }
        dataSource.push(dataSourceObj)
      })
    return dataSource
  }
  const getListMailTemplate = async () => {
    try {
      const response = await axios({
        method: 'post',
        url: `${constants.gatewayBackEndUrl}/project/mail-templates/`,

        data: loggedInData.customers.networks,
        headers: {
          'Content-type': 'application/json',
          Authorization: token,
        },
      })
      setMailTemplates(() => parseDataMailTemplate(response))
      setLoading(false)
    } catch (error) {
      notification['error']({
        message: `Error while getting list of Mail Template, please contact support team: support@roam-smart.com`,
        duration: 5,
      })
    }
  }
  useEffect(() => {
    getListMailTemplate()
  }, [])

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
      title: 'Subject',
      dataIndex: 'subject',
      key: 'Subject',
      width: '25%',
      ...getColumnSearchProps('subject'),
    },
    {
      title: 'Template',
      dataIndex: 'template',
      key: 'template',
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
                onEditMailTemplate(row)
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
              onDeleteMailTemplate(row)
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
      <Divider orientation='left'> Mail Template </Divider>
      <div className={'row float-right'}>
        {loggedInAuthorities.includes('ROLE_SETTINGS_PROJECT_WRITE') && (
          <Button
            variant='outline-warning'
            style={{ marginRight: 15 }}
            size='sm'
            className={'custom-button'}
            onClick={() => setShowAddTemplate(true)}
          >
            <PlusCircleOutlined
              style={{ marginRight: 5, verticalAlign: 'baseline' }}
            />
            Add Template Mail
          </Button>
        )}
      </div>
      <br />
      <br />
      <Table
        columns={columns}
        rowKey={(record) => record.key}
        dataSource={mailTemplates}
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
        title={showEditTemplate ? 'Edit Mail Template' : 'Create Mail Template'}
        visible={showAddTemplate || showEditTemplate}
        onCancel={handelCancel}
        okButtonProps={{ style: { display: 'none' } }}
        cancelButtonProps={{ style: { display: 'none' } }}
      >
        <AddMailTemplate
          parentCallAddTemplate={parentCallAddTemplate}
          showEditTemplate={showEditTemplate}
          rowSelected={rowSelected}
        />
      </Modal>
    </>
  )
}

export default MailTemplate
