import React, { Component } from 'react'
import { Card, CardTitle, CardText, CardActions } from 'material-ui/Card'
import Paper from 'material-ui/Paper'
import Divider from 'material-ui/Divider'

import IconMenu from 'material-ui/IconMenu'
import IconButton from 'material-ui/IconButton/IconButton'
import DescriptionIcon from 'material-ui/svg-icons/action/description'

import MenuItem from 'material-ui/MenuItem'

import RaisedButton from 'material-ui/RaisedButton'

import { Toolbar, ToolbarGroup } from 'material-ui/Toolbar'
import { MessagesList } from './messages_list'
import { updateSurveyResponse } from '../../api/campaign_contacts/methods'
import { sendMessage } from '../../api/messages/methods'
import { applyScript } from '../helpers/script_helpers'
import { Survey } from './survey'
import { MessageField } from './message_field'
import { ResponseDropdown } from './response_dropdown'
const styles = {
  card: {
    width: 500,
    margin: '20px auto'
  },
  heading: {
    padding: 20
  }
}

export class Texter extends Component {
  constructor(props) {
    super(props)

    this.handleSendMessage = this.handleSendMessage.bind(this)
    this.handleSurveyChange = this.handleSurveyChange.bind(this)
  }

  defaultScript(contact) {
    if (contact.messages.length > 0) {
      return ''
    }
    const { assignment, surveys } = this.props

    return applyScript(contact.survey().script, contact)
  }

  handleSendMessage(event) {
    event.preventDefault()
    const input = this.refs.input
    const { contact, assignment } = this.props
    if (input.getValue().trim()) {
      sendMessage.call({
        campaignId: assignment.campaignId,
        contactNumber: contact.number,
        userNumber: "18053959604",
        text: input.getValue(),
      }, (error) => {
        if (error) {
            alert(error)
        } else {
          input.value = ''
          // this.goToNextContact()
        }
      })
    }
  }

  handleSurveyChange(event) {
    const { contact } = this.props
    const campaignSurveyId = event.target.value
    updateSurveyResponse.call({
      campaignSurveyId,
      campaignContactId: contact._id
    })
  }

  render() {
    const { assignment, messages, contact } = this.props
    const campaign = assignment.campaign()

    return (
        <div>
          <Card style={styles.card}>
            <CardTitle title={contact.name} subtitle={contact.number} />
            <CardTitle title={campaign.title} subtitle={campaign.description} />
            <MessagesList messages={messages} />
            <Divider />
            <Survey question={contact.survey().question}
              answers={contact.survey().children().fetch()}
              onSurveyChange={this.handleSurveyChange} />
            <ResponseDropdown />
            <MessageField ref="input" script={this.defaultScript(contact)} />
            <Toolbar>
              <ToolbarGroup firstChild>
                <IconMenu
                  iconButtonElement={<IconButton><DescriptionIcon /></IconButton>}>
                  <MenuItem primaryText="Insert scripts" />
                </IconMenu>
              </ToolbarGroup>
              <ToolbarGroup>
                <RaisedButton
                  onClick={this.handleSendMessage}
                  label="Send"
                  primary
                />
              </ToolbarGroup>
            </Toolbar>
          </Card>
        </div>
    )
  }
}
