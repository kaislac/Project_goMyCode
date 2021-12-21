import React, { useContext, useEffect } from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import { Collapse, List } from 'antd'
import { Link, useLocation, NavLink } from 'react-router-dom'
import RouterSettings from './routerSettings'
import AuthContext from '../../context/AuthContext'
const Settings = () => {
  const { Panel } = Collapse

  const [activeKey, setActiveKey] = React.useState(`1`)
  const location = useLocation()
  const { loggedInAuthorities } = useContext(AuthContext)
  useEffect(() => {
    //console.log(location)
    // if (location.pathname==="/settings/projet"){
    //     setActiveKey("2");
    //
    // }
  }, [location])
  //rendering
  return (
    <Container fluid>
      <Row>
        <Col md={'2'} style={{ position: 'fixed' }}>
          <Collapse
            accordion
            activeKey={activeKey}
            onChange={(key) => {
              if (key === activeKey) {
                setActiveKey('0')
              } else {
                setActiveKey(key)
              }
            }}
          >
            {loggedInAuthorities.includes('ROLE_SETTINGS_GENERAL_READ') && (
              <Panel header='General' key='1'>
                <List itemLayout='horizontal' size='small'>
                  {/*<List.Item>*/}
                  {/*  <List.Item.Meta*/}
                  {/*    title={*/}
                  {/*      <Link to='/settings/general#relations'>Relations </Link>*/}
                  {/*    }*/}
                  {/*  />*/}
                  {/*</List.Item>*/}
                  {/*<List.Item>*/}
                  {/*  <List.Item.Meta*/}
                  {/*    title={*/}
                  {/*      <Link to='/settings/general#services'>*/}
                  {/*        Roaming services{' '}*/}
                  {/*      </Link>*/}
                  {/*    }*/}
                  {/*  />*/}
                  {/*</List.Item>*/}
                  <List.Item>
                    <List.Item.Meta
                      title={
                        <NavLink
                          activeClassName='is-active'
                          to='/settings/general#regions'
                        >
                          Regions
                        </NavLink>
                      }
                    />
                  </List.Item>
                  <List.Item>
                    <List.Item.Meta
                      title={
                        <NavLink
                          activeClassName='is-active'
                          to='/settings/general#zones'
                        >
                          Zones
                        </NavLink>
                      }
                    />
                  </List.Item>
                  <List.Item>
                    <List.Item.Meta
                      title={
                        <NavLink
                          activeClassName='is-active'
                          to='/settings/general#operator'
                        >
                          Operator Group
                        </NavLink>
                      }
                    />
                  </List.Item>
                  <List.Item>
                    <List.Item.Meta
                      title={
                        <NavLink
                          activeClassName='is-active'
                          to='/settings/general#ipx-routing'
                        >
                          IPX Routing
                        </NavLink>
                      }
                    />
                  </List.Item>
                </List>
              </Panel>
            )}
            {loggedInAuthorities.includes('ROLE_SETTINGS_PROJECT_READ') && (
              <Panel header='Project' key='2'>
                <List itemLayout='horizontal' size='small'>
                  <List.Item style={{ color: 'blue' }}>
                    <List.Item.Meta
                      ///style={{color:"blue"}}
                      title={
                        <NavLink
                          activeClassName='is-active'
                          to='/settings/projet'
                        >
                          Project Template{' '}
                        </NavLink>
                      }
                    />
                  </List.Item>
                  {/*<List.Item>*/}
                  {/*    <List.Item.Meta title={<a href="">Target</a>}/>*/}
                  {/*</List.Item>*/}
                  {/*<List.Item>*/}
                  {/*    <List.Item.Meta title={<a href="">Project Type</a>}/>*/}
                  {/*</List.Item>*/}
                  {/*<List.Item>*/}
                  {/*    <List.Item.Meta title={<a href="">Color code</a>}/>*/}
                  {/*</List.Item>*/}
                </List>
              </Panel>
            )}

            {loggedInAuthorities.includes('ROLE_SETTINGS_SIM_CARD_READ') && (
              <Panel header='Sim Card' key='3'>
                <List itemLayout='horizontal' size='small'>
                  <List.Item>
                    <List.Item.Meta
                      title={
                        <NavLink
                          activeClassName='is-active'
                          to='/settings/simCard'
                        >
                          Sim card location{' '}
                        </NavLink>
                      }
                    />
                  </List.Item>
                </List>
              </Panel>
            )}

            {loggedInAuthorities.includes(
              'ROLE_SETTINGS_CR_CONFIGURATION_READ'
            ) &&
              (loggedInAuthorities.includes('ROLE_TASKS_IOT_READ_DOWNLOAD') ||
                loggedInAuthorities.includes(
                  'ROLE_TASKS_OPDATA_READ_DOWNLOAD'
                ) ||
                loggedInAuthorities.includes('ROLE_SETTINGS_PROJECT_READ')) && (
                <Panel header='Raex' key='4'>
                  <List itemLayout='horizontal' size='small'>
                    <List.Item>
                      <List.Item.Meta
                        title={
                          <NavLink
                            activeClassName='is-active'
                            to='/settings/raexTasks'
                          >
                            Raex Tasks{' '}
                          </NavLink>
                        }
                      />
                    </List.Item>
                  </List>
                </Panel>
              )}
            {(loggedInAuthorities.includes('ROLE_TASKS_IR_READ_DOWNLOAD') ||
              loggedInAuthorities.includes('ROLE_TASKS_IOT_READ_DOWNLOAD') ||
              loggedInAuthorities.includes('ROLE_TASKS_OPDATA_READ_DOWNLOAD') ||
              loggedInAuthorities.includes('ROLE_SETTINGS_PROJECT_READ')) && (
              <Panel header='Notifications' key='6'>
                <List itemLayout='horizontal' size='small'>
                  {loggedInAuthorities.includes(
                    'ROLE_SETTINGS_PROJECT_READ'
                  ) && (
                    <List.Item>
                      <List.Item.Meta
                        title={
                          <NavLink
                            activeClassName='is-active'
                            to='/settings/notification/project'
                          >
                            Project{' '}
                          </NavLink>
                        }
                      />
                    </List.Item>
                  )}
                  {(loggedInAuthorities.includes(
                    'ROLE_TASKS_IR_READ_DOWNLOAD'
                  ) ||
                    loggedInAuthorities.includes(
                      'ROLE_TASKS_IOT_READ_DOWNLOAD'
                    ) ||
                    loggedInAuthorities.includes(
                      'ROLE_TASKS_OPDATA_READ_DOWNLOAD'
                    )) && (
                    <List.Item>
                      <List.Item.Meta
                        title={
                          <NavLink
                            activeClassName='is-active'
                            to='/settings/notification/tasks'
                          >
                            Tasks{' '}
                          </NavLink>
                        }
                      />
                    </List.Item>
                  )}
                  <List.Item>
                    <List.Item.Meta
                      title={
                        <NavLink
                          activeClassName='is-active'
                          to='/settings/notification/documentCollection'
                        >
                          Document Collection{' '}
                        </NavLink>
                      }
                    />
                  </List.Item>
                  {(loggedInAuthorities.includes(
                    'ROLE_TASKS_IR_READ_DOWNLOAD'
                  ) ||
                    loggedInAuthorities.includes(
                      'ROLE_TASKS_IOT_READ_DOWNLOAD'
                    ) ||
                    loggedInAuthorities.includes(
                      'ROLE_TASKS_OPDATA_READ_DOWNLOAD'
                    )) && (
                    <List.Item>
                      <List.Item.Meta
                        title={
                          <NavLink
                            activeClassName='is-active'
                            to='/settings/notification/taskPerformance'
                          >
                            Tasks Performance Report{' '}
                          </NavLink>
                        }
                      />
                    </List.Item>
                  )}
                </List>
              </Panel>
            )}
            {loggedInAuthorities.includes('ROLE_SETTINGS_AUDIT_READ') && (
              <Panel header='Audit' key='7'>
                <List itemLayout='horizontal' size='small'>
                  <List.Item>
                    <List.Item.Meta
                      title={
                        <NavLink
                          to='/settings/audit/nodeTypes'
                          activeClassName='is-active'
                        >
                          Node Types{' '}
                        </NavLink>
                      }
                    />
                  </List.Item>
                  <List.Item>
                    <List.Item.Meta
                      title={
                        <NavLink
                          to='/settings/audit/nodeNames'
                          activeClassName='is-active'
                        >
                          Node Names{' '}
                        </NavLink>
                      }
                    />
                  </List.Item>
                  <List.Item>
                    <List.Item.Meta
                      title={
                        <NavLink
                          to='/settings/audit/auditCases'
                          activeClassName='is-active'
                        >
                          Audit Cases
                        </NavLink>
                      }
                    />
                  </List.Item>
                </List>
              </Panel>
            )}
            {(loggedInAuthorities.includes('ROLE_TASKS_IR_READ_DOWNLOAD') ||
              loggedInAuthorities.includes('ROLE_TASKS_IOT_READ_DOWNLOAD') ||
              loggedInAuthorities.includes('ROLE_TASKS_OPDATA_READ_DOWNLOAD') ||
              loggedInAuthorities.includes('ROLE_SETTINGS_PROJECT_READ')) && (
              <Panel header='Team' key='8'>
                <List itemLayout='horizontal' size='small'>
                  <List.Item>
                    <List.Item.Meta
                      title={
                        <NavLink
                          to='/settings/team'
                          activeClassName='is-active'
                        >
                          Team
                        </NavLink>
                      }
                    />
                  </List.Item>
                </List>
              </Panel>
            )}
            {loggedInAuthorities.includes('ROLE_GSER_READ') && (
              <Panel header='Gser' key='9'>
                <List itemLayout='horizontal' size='small'>
                  <List.Item>
                    <List.Item.Meta
                      title={
                        <NavLink
                          to='/settings/GserSetting'
                          activeClassName='is-active'
                        >
                          Gser
                        </NavLink>
                      }
                    />
                  </List.Item>
                </List>
              </Panel>
            )}
            {(loggedInAuthorities.includes('ROLE_SETTINGS_PROJECT_READ') ||
              loggedInAuthorities.includes('ROLE_TADIG_READ')) && (
              <Panel header='Signature' key='10'>
                <List itemLayout='horizontal' size='small'>
                  <List.Item>
                    <List.Item.Meta
                      title={
                        <NavLink
                          to='/settings/signature'
                          activeClassName='is-active'
                        >
                          Signature
                        </NavLink>
                      }
                    />
                  </List.Item>
                </List>
              </Panel>
            )}
            {loggedInAuthorities.includes('ROLE_SETTINGS_PROJECT_READ') && (
              <Panel header='Email' key='11'>
                <List itemLayout='horizontal' size='small'>
                  <List.Item>
                    <List.Item.Meta
                      title={
                        <NavLink
                          to='/settings/email/interface'
                          activeClassName='is-active'
                        >
                          Interface
                        </NavLink>
                      }
                    />
                  </List.Item>
                  <List.Item>
                    <List.Item.Meta
                      title={
                        <NavLink
                          to='/settings/email/mailsender'
                          activeClassName='is-active'
                        >
                          Mail Sender
                        </NavLink>
                      }
                    />
                  </List.Item>
                  <List.Item>
                    <List.Item.Meta
                      title={
                        <NavLink
                          to='/settings/email/mailtemplate'
                          activeClassName='is-active'
                        >
                          Mail Template
                        </NavLink>
                      }
                    />
                  </List.Item>
                  <List.Item>
                    <List.Item.Meta
                      title={
                        <NavLink
                          to='/settings/email/distributionmail'
                          activeClassName='is-active'
                        >
                          Distribution Mail
                        </NavLink>
                      }
                    />
                  </List.Item>
                </List>
              </Panel>
            )}
          </Collapse>
        </Col>
        <Col md={'10'} style={{ left: '17%' }}>
          <RouterSettings />
        </Col>
      </Row>
      <br /> <br />
    </Container>
  )
}
export default Settings
