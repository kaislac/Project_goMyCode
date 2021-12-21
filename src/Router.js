import React, { useContext } from 'react'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import { Loader } from './components/shared/Loader'
import Login from './components/auth/Login'
import Coverage from './components/coverage/Coverage'
import ProjectEntry from './components/project/ProjectEntry'
import Document from './components/document/Document'
import SimCard from './components/simcard/SimCard'
import NavigationBar from './components/layout/NavigationBar'
import AuthContext from './context/AuthContext'
import Audit from './components/audit/Audit'
import Tadig from './components/tadig/Tadig'
import Deals from './components/deals/Deals'
import Rollop from './components/rollop/Rollop'
import Dashboard from './components/dashboard/Dashboard'
import Settings from './components/settings/settings'
import { Container } from 'react-bootstrap'
import Tasks from './components/tasks/Tasks'
import Reporting from './components/reporting/reporting'
import Footer from './components/shared/Footer'
import ResetPassword from './components/auth/ResetPassword'
import Gser from './components/gser/Gser'
import Irms from './components/irms/Irms'

const Router = () => {
  const { loggedIn, loggedInModules, loggedInAuthorities, loader } =
    useContext(AuthContext)

  return (
    <BrowserRouter>
      {loggedIn && <NavigationBar />}

      <Container fluid style={{ paddingTop: 65 }}>
        <Switch>
          {loggedIn === true ? (
            <Route exact path='/'>
              <Dashboard />
            </Route>
          ) : (
            <Route exact path='/'>
              <Login />
            </Route>
          )}

          {loggedIn === false && (
            <>
              <Route path='/login'>
                <Login />
              </Route>
              <Route path={'/resetPassword/:key'}>
                <ResetPassword />
              </Route>
            </>
          )}

          {loggedIn === true && (
            <>
              {loader && <Loader />}

              <Route path='/dashboard'>
                <Dashboard />
              </Route>

              {loggedInModules && loggedInModules.includes('Coverage') && (
                <Route path='/coverage'>
                  <Coverage />
                </Route>
              )}

              {loggedInModules && loggedInModules.includes('Project') && (
                <Route path='/projects'>
                  <ProjectEntry />
                </Route>
              )}

              {loggedInModules && loggedInModules.includes('TASKS') && (
                <Route path='/tasks'>
                  <Tasks />
                </Route>
              )}

              {true && (
                <Route path='/documents'>
                  <Document />
                </Route>
              )}

              {loggedInModules && loggedInModules.includes('SIMCard') && (
                <Route path='/simcards'>
                  <SimCard />
                </Route>
              )}

              {loggedInModules && loggedInModules.includes('Audits') && (
                <Route path='/audit'>
                  <Audit />
                </Route>
              )}

              {loggedInModules && loggedInModules.includes('GSER') && (
                <Route path='/gser'>
                  <Gser />
                </Route>
              )}

              {loggedInModules && loggedInModules.includes('TADIG') && (
                <Route path='/tadig'>
                  <Tadig />
                </Route>
              )}

              {loggedInModules && loggedInModules.includes('Deals') && (
                <Route path='/deals'>
                  <Deals />
                </Route>
              )}
              {loggedInModules && loggedInModules.includes('Settings') && (
                <Route path='/settings'>
                  <Settings />
                </Route>
              )}
              {loggedInModules &&
                (loggedInModules.includes('IREG') ||
                  loggedInModules.includes('Iot') ||
                  loggedInModules.includes('OPDATA')) && (
                  <Route path='/reporting'>
                    <Reporting />
                  </Route>
                )}
              {loggedInModules && loggedInModules.includes('RollOp') && (
                <Route path='/rollop'>
                  <Rollop />
                </Route>
              )}

              {loggedInModules && loggedInModules.includes('Market share') && (
                <Route path='/irms'>
                  <Irms />
                </Route>
              )}
            </>
          )}
        </Switch>
      </Container>
      {loggedIn === true && <Footer />}
    </BrowserRouter>
  )
}

export default Router
