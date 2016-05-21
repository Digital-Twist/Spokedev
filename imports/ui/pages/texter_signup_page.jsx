import React from 'react'
import Paper from 'material-ui/Paper'
import { FlowRouter } from 'meteor/kadira:flow-router'
import { List, ListItem } from 'material-ui/List'
import AppBar from 'material-ui/AppBar'
import { Meteor } from 'meteor/meteor'
import { Organizations } from '../../api/organizations/organizations.js'
import { createContainer } from 'meteor/react-meteor-data'
import { TexterSignup } from '../components/texter_signup'

const Page = ({ organization, loading, user }) => (
  <div>
    { loading ? 'Loading' : <TexterSignup user={user} organization={organization} />}
  </div>
)

export default createContainer(({ organizationId }) => {
  const handle = Meteor.subscribe('organization', organizationId)
  return {
    organization: Organizations.findOne({ _id: organizationId }),
    user: Meteor.user(),
    loading: !handle.ready()
  }
}, Page)
