import React, {
  useRef,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'
import axios from 'axios'
import constants from '../shared/constants'
import '../shared/shared.css'
import AuthContext from '../../context/AuthContext'
import {
  createAndDownloadBlobFile,
  base64ToArrayBuffer,
} from '../shared/downloadDocument'
import {
  Button,
  Card,
  notification,
  Select,
  Space,
  Spin,
  Table,
  Tooltip,
  Upload,
} from 'antd'
import {
  ClearOutlined,
  ExportOutlined,
  FilterOutlined,
  CalendarOutlined,
  SearchOutlined,
} from '@ant-design/icons'
import DropdownFilter from '../shared/DropdownFilter'
import SearchBoxFilter from '../shared/SearchBoxFilter'
import RangePickerFilter from '../shared/RangePickerFilter'
import moment from 'moment'

const Gser = () => {
  const token = localStorage.getItem('token')
  const [currencies, setCurrencies] = useState([])
  const [userCurrencies, setUserCurrencies] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [pageSize, setPageSize] = useState(constants.pagination)
  const [pageSort, setPageSort] = useState(
    localStorage.getItem('gserSort')
      ? localStorage.getItem('gserSort')
      : undefined
  )
  const [totalRecords, setTotalRecords] = useState(0)
  const [dataGser, setDataGser] = useState([])
  const [filter, setFilter] = useState({})
  const [filterObject, setFilterObject] = useState(
    JSON.parse(localStorage.getItem('gserFilter'))
  )
  const indicatorRef = useRef()
  const dateRef = useRef()
  const currencyRef = useRef()
  const sourceRef = useRef()

  const parseGserData = (data) => {
    let result = []
    //Antd table need a key property to show the data correctly
    let key = 0
    data.data.result.forEach((item) => {
      let obj = {}
      obj.key = key
      obj.indicator = item.indicator
      obj.source = item.source
      obj.peggedRate = item.peggedRate
      obj.peggedDate = item.peggedDate
      obj.applicableCallDate = item.commonFields.applicableCallDate
      obj.currency = item.currency
      result.push(obj)
      key++
    })
    return result
  }
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
      getGser(currentPage, pageSize, pageSort, response.data)
    } catch (error) {
      notification['error']({
        message: `Error while getting list of user currencies, please contact support team: support@roam-smart.com`,
        duration: 5,
      })
    }
  }

  /*
    @ Save filterObject in localStorage
    */
  useEffect(() => {
    localStorage.setItem('gserFilter', JSON.stringify(filterObject))
  }, [filterObject])
  /*
    @save Sort in localStorage
    */

  useEffect(() => {
    if (pageSort !== undefined) localStorage.setItem('gserSort', pageSort)
    else localStorage.removeItem('gserSort')
  }, [pageSort])

  //sort
  const handleTableChange = (pagination, filters, sorter) => {
    if (sorter.order === undefined) {
      setPageSort(undefined)
      localStorage.removeItem('gserSort')
    } else {
      localStorage.setItem(
        'gserSort',
        sorter.field + ',' + (sorter.order === 'ascend' ? 'asc' : 'desc')
      )
      setPageSort(
        sorter.field + ',' + (sorter.order === 'ascend' ? 'asc' : 'desc')
      )
    }
  }
  /*
    @Implement Default sort method
    */

  const defaultSorterColumn = (dataIndex) => {
    let defaultSort = null
    if (localStorage.getItem('gserSort')) {
      const gserSortObject = localStorage.getItem('gserSort')
      const gserColumnValue = gserSortObject.split(',')
      const gserColumn = gserColumnValue[0]
      const gserValue = gserColumnValue[1]
      if (gserColumn === dataIndex) {
        if (gserValue == 'asc') {
          defaultSort = 'ascend'
        } else {
          defaultSort = 'descend'
        }
      }
    }
    return {
      defaultSortOrder: defaultSort,
    }
  }

  //pagination
  const handlePagination = (page) => {
    setCurrentPage(page)
    setLoading(true)
  }

  const handleSizePagination = (currentPage, pageSize) => {
    setCurrentPage(currentPage)
    setPageSize(pageSize)
    setLoading(true)
  }

  const handleShowTotal = (totalRecords) => {
    let records = `Total Records: ${totalRecords}`
    return records
  }

  /*
@ Set Gser filter function
*/

  const { Option } = Select

  const getFilteredIndicator = (values) => {
    const result = []
    values.forEach((item, index) => {
      result.push(
        <Option key={index} value={item}>
          {item}
        </Option>
      )
    })
    return result
  }

  const getFilteredCurrency = (values) => {
    const result = []
    values.forEach((item, index) => {
      result.push(
        <Option key={index} value={item.code}>
          {item.code}
        </Option>
      )
    })
    return result
  }

  // Filter Action indicator

  let indicatorFilterOptions = getFilteredIndicator([
    'New',
    'Changed',
    'Unchanged',
  ])

  const showIndicatorFilters = (checkedFilters) => {
    let newFilterObject = { ...filterObject }
    newFilterObject.indicator = checkedFilters
    setFilterObject(newFilterObject)
  }

  const listFilterIndicator = (dataIndex) => {
    return {
      filterDropdown: ({
        setSelectedKeys,
        selectedKeys,
        confirm,
        clearFilters,
      }) => (
        <>
          <DropdownFilter
            filterItems={
              indicatorFilterOptions &&
              indicatorFilterOptions.map((el) => el.props.value)
            }
            setSelectedKeys={setSelectedKeys}
            selectedKeys={selectedKeys}
            confirm={confirm}
            clearFilters={clearFilters}
            showFilters={showIndicatorFilters}
            ref={indicatorRef}
            checkedList={
              filterObject && filterObject.indicator
                ? filterObject.indicator
                : []
            }
          />
        </>
      ),
    }
  }

  // Filter Currency
  /*
  @Get currencies
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

  let currencyFilterOptions = getFilteredCurrency(currencies)
  const showCurrencyFilters = (checkedFilters) => {
    let newFilterObject = { ...filterObject }
    newFilterObject.currency = checkedFilters
    setFilterObject(newFilterObject)
  }

  const listFilterCurrency = (dataIndex) => {
    return {
      filterDropdown: ({
        setSelectedKeys,
        selectedKeys,
        confirm,
        clearFilters,
      }) => (
        <>
          <DropdownFilter
            filterItems={
              currencyFilterOptions &&
              currencyFilterOptions.map((el) => el.props.value)
            }
            setSelectedKeys={setSelectedKeys}
            selectedKeys={selectedKeys}
            confirm={confirm}
            clearFilters={clearFilters}
            showFilters={showCurrencyFilters}
            ref={currencyRef}
            checkedList={
              filterObject && filterObject.currency ? filterObject.currency : []
            }
          />
        </>
      ),
    }
  }
  // Filter source
  const handleSourceFiltering = (value) => {
    let sourceObj = { ...filterObject }
    let arr = []
    if (value !== undefined && value !== '') arr.push(value)
    sourceObj['source'] = arr
    setFilterObject(sourceObj)
  }

  const getSearchSourceInput = (searchText, searchedColumn) => {
    if (searchedColumn !== '') handleSourceFiltering(searchText)
  }

  const getFilterSource = (dataIndex) => {
    return {
      filterDropdown: ({
        setSelectedKeys,
        selectedKeys,
        confirm,
        clearFilters,
      }) => (
        <>
          <SearchBoxFilter
            setSelectedKeys={setSelectedKeys}
            selectedKeys={selectedKeys}
            confirm={confirm}
            dataIndex={dataIndex}
            clearFilters={clearFilters}
            getSearchInput={getSearchSourceInput}
            ref={sourceRef}
            defaultSearchValue={
              filterObject &&
              filterObject.source &&
              filterObject.source.length > 0
                ? filterObject.source[0]
                : ''
            }
          />
        </>
      ),
    }
  }
  /* filter call date */
  const handleCallDateFiltering = (value) => {
    if (value) {
      const startDate = moment(value[0]).format().split('T')[0]
      const endDate = moment(value[1]).format().split('T')[0]
      let dateObj = { ...filterObject }
      dateObj['applicableCallDate'] = [`${startDate}/${endDate}`]
      setFilterObject(dateObj)
      let filteredDate = { ...filter }
      filteredDate['applicableCallDate'] = [`${startDate}/${endDate}`]
      setFilter(filteredDate)
    } else {
      let dateObj = { ...filterObject }
      dateObj['applicableCallDate'] = []
      setFilterObject(dateObj)
    }
  }
  const getSearchDate = (searchText, searchedColumn) => {
    searchedColumn == 'applicableCallDate' &&
      handleCallDateFiltering(searchText)
  }

  const getFilterCallDate = (dataIndex) => {
    return {
      filterDropdown: ({
        setSelectedKeys,
        selectedKeys,
        confirm,
        clearFilters,
      }) => (
        <>
          <RangePickerFilter
            setSelectedKeys={setSelectedKeys}
            selectedKeys={selectedKeys}
            confirm={confirm}
            dataIndex={dataIndex}
            clearFilters={clearFilters}
            getSearchDate={getSearchDate}
            ref={dateRef}
          />
        </>
      ),
    }
  }

  /*
    @ gser columns
    */

  let gserColumns = [
    {
      title: 'Action Indicator',
      dataIndex: 'indicator',
      key: 'actionindicator',
      width: 100,
      sorter: true,
      ...listFilterIndicator('indicator'),
      ...defaultSorterColumn('indicator'),
      filterIcon: (filtered) => (
        <Tooltip
          placement='bottom'
          title={
            filterObject &&
            filterObject.indicator &&
            filterObject.indicator.join(', ')
          }
        >
          <FilterOutlined
            style={{
              color:
                filterObject &&
                filterObject.indicator &&
                filterObject.indicator.length > 0
                  ? '#fec632'
                  : '#bfbfbf',
            }}
          />
        </Tooltip>
      ),
    },
    {
      title: 'Source',
      dataIndex: 'source',
      key: 'source',
      width: 100,
      sorter: true,
      ...getFilterSource('source'),
      ...defaultSorterColumn('source'),
      filterIcon: (filtered) => (
        <Tooltip
          placement='bottom'
          title={
            filterObject &&
            filterObject.source &&
            filterObject.source.join(', ')
          }
        >
          <SearchOutlined
            style={{
              color:
                filterObject &&
                filterObject.source &&
                filterObject.source.length > 0 &&
                filterObject.source[0] !== ''
                  ? '#fec632'
                  : '#bfbfbf',
            }}
          />
        </Tooltip>
      ),
    },
    {
      title: 'Currency',
      dataIndex: 'currency',
      key: 'currency',
      width: 100,
      sorter: true,
      ...listFilterCurrency('currency'),
      ...defaultSorterColumn('currency'),
      filterIcon: (filtered) => (
        <Tooltip
          placement='bottom'
          title={
            filterObject &&
            filterObject.courrency &&
            filterObject.currency.join(', ')
          }
        >
          <FilterOutlined
            style={{
              color:
                filterObject &&
                filterObject.currency &&
                filterObject.currency.length > 0
                  ? '#fec632'
                  : '#bfbfbf',
            }}
          />
        </Tooltip>
      ),
    },
    {
      title: 'Pegged Rate',
      dataIndex: 'peggedRate',
      key: 'peggedrate',
      width: 100,
      sorter: true,
      ...defaultSorterColumn('peggedRate'),
    },
    {
      title: 'Date Pegged',
      dataIndex: 'peggedDate',
      key: 'datepegged',
      width: 100,
      sorter: true,
      ...defaultSorterColumn('peggedDate'),
    },
    {
      title: 'Call date',
      dataIndex: 'applicableCallDate',
      key: 'calldate',
      width: 100,
      sorter: true,
      ...getFilterCallDate('applicableCallDate'),
      ...defaultSorterColumn('applicableCallDate'),
      filterIcon: (filtered) => (
        <Tooltip
          placement='bottom'
          title={
            filterObject &&
            filterObject.applicableCallDate &&
            filterObject.applicableCallDate.join(', ')
          }
        >
          <CalendarOutlined
            style={{
              color:
                filterObject &&
                filterObject.applicableCallDate &&
                filterObject.applicableCallDate.length > 0
                  ? '#fec632'
                  : '#bfbfbf',
            }}
          />
        </Tooltip>
      ),
    },
  ]

  //get data gser
  const getGser = useCallback(
    async (currentPage, pageSize, pageSort, userCurrencies) => {
      try {
        let dataObj = { ...filterObject }
        const sort = pageSort !== undefined ? '&sort=' + pageSort : ''
        const response = await axios({
          method: 'post',
          url: `${
            constants.gatewayBackEndUrl
          }/exchange-rate/rates/search/?page=${
            currentPage - 1
          }&size=${pageSize}${sort}`,
          data: {
            currency: userCurrencies.map((usecurrency) => usecurrency.code),
            ...dataObj,
          },
          headers: {
            'Content-type': 'application/json',
            Authorization: token,
          },
        })
        setDataGser(() => parseGserData(response))
        let records = 'X-Total-Count'
        setTotalRecords(response.data[records])
        setLoading(false)

        response.status !== 200 &&
          notification['error']({
            message: `Your request can't be treated, please contact support team: support@roam-smart.com`,
            duration: 5,
          })
      } catch (error) {
        notification['error']({
          message: `Error while getting Gser, please contact your support team`,
          duration: 5,
        })
      }
    },
    [filterObject, pageSize, pageSort]
  )
  useEffect(() => {
    getUserCurrencies()
    getCurrencies()
  }, [])

  useEffect(() => {
    getGser(currentPage, pageSize, pageSort, userCurrencies)
  }, [filterObject, currentPage, pageSize, pageSort])

  /* clearFilter */
  const handleClearAllFilter = async () => {
    if (indicatorRef.current) {
      await indicatorRef.current.reset()
    }
    if (dateRef.current) {
      await dateRef.current.reset()
    }
    if (currencyRef.current) {
      await currencyRef.current.reset()
    }
    if (sourceRef.current) {
      await sourceRef.current.reset()
    }
    let newFilterObject = []
    setFilterObject(newFilterObject)
  }
  /*
    @Export All
    */

  const exportAllRecords = async () => {
    try {
      let dataObj = { ...filterObject }
      setLoading(true)
      const response = await axios({
        method: 'post',
        url: `${constants.gatewayBackEndUrl}/exchange-rate/rates/export/`,
        data: {
          currency: userCurrencies.map((usecurrency) => usecurrency.code),
          ...dataObj,
        },
        headers: {
          'Content-type': 'application/json',
          Authorization: token,
        },
      })
      if (response.status !== undefined && response.status === 200) {
        if (response.data !== '') {
          setLoading(false)
          const arrayBuffer = base64ToArrayBuffer(response.data.content)
          createAndDownloadBlobFile(
            arrayBuffer,
            response.data.title.split('.')[0],
            'xls'
          )
          notification['success']({
            message: `Excel Report has been successfully exported`,
            duration: 5,
          })
        } else {
          notification['error']({
            message: `Error while exporting excel report, please contact support team: support@roam-smart.com`,
            duration: 5,
          })
        }
      }
    } catch {
      notification['error']({
        message: `Error while exporting excel report, please contact support team: support@roam-smart.com`,
        duration: 5,
      })
    }
  }

  // Rendering
  return (
    <>
      <Card
        type='inner'
        title={<strong>Gser</strong>}
        headStyle={{
          height: '20px',
        }}
        extra={
          <Space>
            <Button
              size='small'
              type='default'
              style={{
                color: 'black',
                boxShadow: '1.5px 1.5px gray',
                backgroundColor: '#fec632',
                borderRadius: '3px',
              }}
              onClick={() => handleClearAllFilter()}
            >
              <ClearOutlined />
              Clear filter
            </Button>
            <Button
              size='small'
              type='default'
              style={{
                color: 'black',
                boxShadow: '1.5px 1.5px gray',
                backgroundColor: '#fec632',
                borderRadius: '3px',
              }}
              onClick={() => exportAllRecords()}
            >
              <ExportOutlined />
              Export
            </Button>
          </Space>
        }
      />

      <Space>
        <Table
          size='small'
          columns={gserColumns}
          rowKey={(record) => record.key}
          dataSource={dataGser}
          scroll={{ y: '25rem' }}
          pagination={{
            total: totalRecords,
            position: ['topRight'],
            size: 'medium',
            current: currentPage,
            onChange: (page) => handlePagination(page),
            onShowSizeChange: (currentPage, size) =>
              handleSizePagination(currentPage, size),
            defaultPageSize: constants.pagination,
            showSizeChanger: true,
            pageSizeOptions: ['50', '100', '1000'],
            showTotal: () => handleShowTotal(totalRecords),
          }}
          onChange={(pagination, filters, sorter) =>
            handleTableChange(pagination, filters, sorter)
          }
          loading={{
            indicator: (
              <div>
                <Spin tip='Loading...' />
              </div>
            ),
            spinning: loading,
          }}
        />
      </Space>
    </>
  )
}

export default Gser
