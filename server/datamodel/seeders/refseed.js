'use strict'

const Promise = require('bluebird')
const uuid = require('uuid/v4')
const _ = require('lodash')
const casual = require('casual')
const {times, sample, range} = require('lodash')

const status = ['Under Review', 'In Negotiation', 'Out for Signature', 'Executed']
const ids = range(1, 20) // assuming there are 20 users in the db
const subtypeIds = range(1, 8) // assuming there are 8 subtypes in the db
const subtypes = ['Non-disclosure Agreement', 'ISA', 'Staffing Agreement', 'Controlled Document', 'SW Agreement', 'Master Service Agreement', 'Statement of Work', 'Terms and Conditions']
const objects = [{
  email: {
    body: {
      text: 'body'
    },
    subject: 'This is a subject',
    messageId: 'msg1',
    threadId: 'thread1',
    senderEmail: 'joe@example.com'
  }
},
{
  update: {
    status: {
      old: {
        requestDate: '2018-01-08T20:08:37.878Z',
        requiredDate: '2018-01-08T20:08:37.878Z',
        createdAt: '2018-01-08T20:08:37.878Z',
        updatedAt: '2018-01-08T20:08:37.878Z',
        id: 'a0335de5-688c-486f-874c-33458f856329',
        driveFolderId: 'Magni omnis',
        status: 'Executed',
        workflowStep: 'next',
        assignedNextStep: 'seed',
        vendor: [
          'Botsford Group'
        ],
        type: 'new',
        subtype: 'subtype',
        parentId: '123',
        renewalNotificationDays: 1,
        title: 'Officiis optio voluptatem',
        assignedUserId: 3,
        requestorId: 9,
        changeOwnerId: 16
      },
      new: {
        id: 'a0335de5-688c-486f-874c-33458f856329',
        driveFolderId: 'Magni omnis',
        status: 'In Negotiation',
        workflowStep: 'next',
        assignedNextStep: 'seed',
        vendor: [
          'Botsford Group'
        ],
        assignedUserId: 20,
        type: 'new',
        subtype: 'subtype',
        requestorId: 20,
        requestDate: '2018-01-09T19:00:00.000Z',
        requiredDate: '2018-01-08T20:08:37.878Z',
        renewalNotificationDays: 1,
        changeOwnerId: 20,
        title: 'SOMETHING ELSE',
        parentId: '123',
        createdAt: '2018-01-08T20:08:37.878Z',
        updatedAt: '2018-01-08T20:43:19.405Z'
      },
      changed: [
        'status',
        'requestDate',
        'title',
        'assignedUserId',
        'requestorId',
        'changeOwnerId'
      ]
    }
  }
},
{
  create: {
    parentId: '123'
  }
},
{
  update: {
    status: {
      old: {
        approvalDateTime: '2018-01-15T17:31:44.410Z',
        createdAt: '2018-01-15T17:31:44.410Z',
        updatedAt: '2018-01-15T17:31:44.410Z',
        id: 14,
        approvalStatus: 'pending',
        notify: true,
        type: 'Counter Party',
        amount: 12993.33,
        changeRequestId: '8d6ddb38-b735-475d-913f-96ea49f07301',
        personId: 5
      },
      new: {
        id: 14,
        approvalStatus: 'pending',
        approvalDateTime: '2018-01-03T19:45:30.401Z',
        changeRequestId: '8d6ddb38-b735-475d-913f-96ea49f07301',
        personId: 1,
        notify: true,
        type: 'Counter Party',
        amount: 12993.33,
        createdAt: '2018-01-15T17:31:44.410Z',
        updatedAt: '2018-01-15T18:15:35.223Z'
      },
      changed: [
        'approvalDateTime',
        'personId'
      ]
    }
  }
},
{},
{
  approvalDateTime: '2018-01-15T17:31:44.407Z',
  createdAt: '2018-01-15T17:31:44.407Z',
  updatedAt: '2018-01-15T17:31:44.407Z',
  id: 1,
  approvalStatus: 'pending',
  notify: true,
  type: 'Counter Party',
  amount: 12993.33,
  changeRequestId: 'd78fd82b-c8de-4218-baaf-05e169669546',
  personId: 17
},
{
  type: 'Revisions',
  note: 'I am the captain now'
}
]

let changeRequestIds = [] // hold change request ids that are created

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Use bluebird's reduce to run each promise in series
    return Promise.reduce([
      await queryInterface.bulkInsert('ChangeRequests', generateChangeRequests(50)),
      ...times(10, () => {
        queryInterface.bulkInsert('PartyStatuses', generatePartyStatuses(3, sample(changeRequestIds)))
      }),
      ...times(10, () => {
        return queryInterface.bulkInsert('ChangeActivities', generateChangeActivities(3, sample(changeRequestIds)))
      }),
      await queryInterface.bulkInsert('ChangeSubTypes', getChangeSubTypes()),
      await queryInterface.bulkInsert('Labels', generateLabels(20)),
      await queryInterface.bulkInsert('LabelChangeRequests', generateLabelChangeRequests(50)),
      await queryInterface.bulkInsert('LabelChangeRequestComments', generateLabelChangeRequestComments(100))
    ], () => {})
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('ChangeRequests', {assignedNextStep: 'seed'})
  }
}

/**
 * This function assumes the `person` seed has been run first
 * @param {int} number - of CCR to generate
 */
const generateChangeRequests = (number) => {
  return times(number, () => {
    let date = new Date().toISOString()
    let id = uuid()
    // collect change request IDs needed for party status
    changeRequestIds.push(id)
    return {
      id,
      status: sample(status),
      workflowStep: 'next',
      assignedNextStep: 'seed',
      vendor: [casual.company_name],
      type: 'Contract',
      subtype: sample(subtypes),
      requestorId: sample(ids),
      changeOwnerId: sample(ids),
      effectiveDate: date,
      requestDate: date,
      requiredDate: date,
      title: casual.title,
      amount: 12993.33,
      renewalNotificationDays: 1,
      expirationDate: date,
      createdAt: date,
      updatedAt: date
    }
  })
}

/**
 * Generate Party Statuses
 * This function assumes the `person` seed has been run first
 * @param {int} number of status to generate
 * @param {string} uuid id of change request
 */
const generatePartyStatuses = (number, uuid) => {
  return times(number, () => {
    let date = new Date().toISOString()
    return {
      approvalStatus: sample([ 'approved', 'denied', 'pending' ]),
      approvalDateTime: date,
      changeRequestId: uuid,
      personId: sample(ids),
      notify: true,
      type: 'Counter Party',
      amount: 12993.33,
      createdAt: date,
      updatedAt: date
    }
  })
}

/**
 * Generate Change Activities
 * This function assumes the `person` seed has been run first
 * @param {int} number of status to generate
 * @param {string} uuid id of change request
 */
const generateChangeActivities = (number, uuid) => {
  const types = [
    'email.added',
    'changeRequest.modified',
    'changeRequest.created',
    'party.modified',
    'party.added',
    'party.removed',
    'note.added',
    'document.updated',
    'docusign.added',
    'label.added',
    'label.removed'
  ]
  let rand = _.random(0, 6)
  let type = types[rand]
  let object = JSON.stringify(objects[rand])

  return times(number, () => {
    let date = new Date().toISOString()
    return {
      changeRequestId: uuid,
      actorPersonId: sample(ids),
      description: casual.short_description,
      published: date,
      object,
      type,
      createdAt: date,
      updatedAt: date
    }
  })
}

const getChangeSubTypes = () => {
  let baseObj = {
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    changeType: 'Contract',
    active: true
  }
  return [
    {
      ...baseObj,
      changeSubType: 'Non-disclosure Agreement',
      subTypeShortName: 'NDA'
    },
    {
      ...baseObj,
      changeSubType: 'ISA',
      subTypeShortName: 'ISA'
    },
    {
      ...baseObj,
      changeSubType: 'Staffing Agreement',
      subTypeShortName: 'SA'
    },
    {
      ...baseObj,
      changeSubType: 'Controlled Document',
      subTypeShortName: 'CD'
    },
    {
      ...baseObj,
      changeSubType: 'SW Agreement',
      subTypeShortName: 'SWA'
    },
    {
      ...baseObj,
      changeSubType: 'Master Service Agreement',
      subTypeShortName: 'MSA'
    },
    {
      ...baseObj,
      changeSubType: 'Statement of Work',
      subTypeShortName: 'SOW'
    },
    {
      ...baseObj,
      changeSubType: 'Terms and Conditions',
      subTypeShortName: 'T&C'
    }
  ]
}

const generateLabels = (number) => {
  return times(number, () => {
    let date = new Date().toISOString()
    let name = casual.word
    let description = casual.short_description
    return {
      name,
      description,
      subTypeId: sample(subtypeIds),
      createdAt: date,
      updatedAt: date,
      active: true
    }
  })
}

const generateLabelChangeRequests = (number) => {
  return times(number, () => {
    let date = new Date().toISOString()
    return {
      changeRequestId: sample(changeRequestIds),
      labelId: sample(ids),
      createdAt: date,
      updatedAt: date
    }
  })
}

const generateLabelChangeRequestComments = (number) => {
  return times(number, () => {
    let date = new Date().toISOString()
    return {
      text: casual.short_description,
      authorId: sample(ids),
      labelChangeRequestId: sample(ids),
      createdAt: date,
      updatedAt: date
    }
  })
}