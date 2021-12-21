import React from 'react'
import General from './general/general'
import { Switch, Route, Redirect } from 'react-router-dom'
import ProjectTemplate from './project/ProjectTemplate'
import SimCardLocation from './simCard/SimCardLocation'

import Team from './team/Team'

import Project from './notifications/project/Project'
import Tasks from './notifications/tasks/Tasks'
import TaskPerformance from './notifications/taskPerformance/TaskPerformance'
import DocumentCollection from './notifications/documentCollection/DocumentCollection'

import NodeTypes from './audit/NodeTypes/NodesTypes'
import NodeNames from './audit/NodeNames/NodesNames'
import AuditCases from './audit/AuditCases/AuditCases'
import GserSetting from './gser/GserSetting'
import Signature from './signature/Signature'

import RaexTasks from './raex/RaexTasks'
import Interface from './email/Interface'
import MailSender from './email/MailSender'
import MailTemplate from './email/MailTemplate'
import DistributionMail from './email/DistributionMail'

const RouterSettings = () => {
  return (
    <Switch>
      <Redirect exact from='/settings' to='/settings/general' />
      <Route exact path='/settings/general'>
        <General />
      </Route>
      <Route exact path='/settings/projet'>
        <ProjectTemplate />
      </Route>
      <Route exact path='/settings/simCard'>
        <SimCardLocation />
      </Route>

      <Route exact path='/settings/team'>
        <Team />
      </Route>

      <Route exact path='/settings/raexTasks'>
        <RaexTasks />
      </Route>
      <Route exact path='/settings/notification/project'>
        <Project />
      </Route>
      <Route exact path='/settings/notification/tasks'>
        <Tasks />
      </Route>
      <Route exact path='/settings/notification/documentCollection'>
        <DocumentCollection />
      </Route>
      <Route exact path='/settings/notification/taskPerformance'>
        <TaskPerformance />
      </Route>
      <Route exact path='/settings/audit/nodeTypes'>
        <NodeTypes />
      </Route>
      <Route exact path='/settings/audit/nodeNames'>
        <NodeNames />
      </Route>
      <Route exact path='/settings/audit/auditCases'>
        <AuditCases />
      </Route>
      <Route exact path='/settings/GserSetting'>
        <GserSetting />
      </Route>
      <Route exact path='/settings/signature'>
        <Signature />
      </Route>
      <Route exact path='/settings/email/interface'>
        <Interface />
      </Route>
      <Route exact path='/settings/email/mailsender'>
        <MailSender />
      </Route>
      <Route exact path='/settings/email/mailtemplate'>
        <MailTemplate />
      </Route>
      <Route exact path='/settings/email/distributionmail'>
        <DistributionMail />
      </Route>
    </Switch>
  )
}
export default RouterSettings
