import DataLoader from "dataloader";

// Import models in order that creates referenced tables before foreign keys
import User from "./user";
import PendingMessagePart from "./pending-message-part";
import Organization from "./organization";
import Campaign from "./campaign";
import Assignment from "./assignment";
import CampaignContact from "./campaign-contact";
import InteractionStep from "./interaction-step";
import QuestionResponse from "./question-response";
import OptOut from "./opt-out";
import JobRequest from "./job-request";
import Invite from "./invite";
import { LinkDomain, UnhealthyLinkDomain } from "./link-domain";
import CannedResponse from "./canned-response";
import UserOrganization from "./user-organization";
import UserCell from "./user-cell";
import Message from "./message";
import ZipCode from "./zip-code";
import Log from "./log";

import thinky from "./thinky";
import datawarehouse from "./datawarehouse";

import { cacheableData } from "./cacheable_queries";

function createLoader(model, opts) {
  const idKey = (opts && opts.idKey) || "id";
  const cacheObj = opts && opts.cacheObj;
  return new DataLoader(async keys => {
    if (cacheObj && cacheObj.load) {
      return keys.map(async key => await cacheObj.load(key));
    }
    const docs = await model.getAll(...keys, { index: idKey });
    return keys.map(key =>
      docs.find(doc => doc[idKey].toString() === key.toString())
    );
  });
}

// This is in dependency order, so tables are after their dependencies
const tableList = [
  "organization", // good candidate?
  "user", // good candidate
  "campaign", // good candidate
  "assignment",
  // the rest are alphabetical
  "campaign_contact", // ?good candidate (or by cell)
  "canned_response", // good candidate
  "interaction_step",
  "invite",
  "job_request",
  "log",
  "message",
  "opt_out", // good candidate
  "pending_message_part",
  "question_response",
  "user_cell",
  "user_organization",
  "zip_code", // good candidate (or by contact)?
  "link_domain",
  "unhealthy_link_domain"
];

function dropTables() {
  return thinky.dropTables(tableList);
}

const createLoaders = () => ({
  assignment: createLoader(Assignment),
  campaign: createLoader(Campaign, { cacheObj: cacheableData.campaign }),
  invite: createLoader(Invite),
  organization: createLoader(Organization, {
    cacheObj: cacheableData.organization
  }),
  user: createLoader(User),
  interactionStep: createLoader(InteractionStep),
  campaignContact: createLoader(CampaignContact),
  zipCode: createLoader(ZipCode, { idKey: "zip" }),
  log: createLoader(Log),
  cannedResponse: createLoader(CannedResponse),
  jobRequest: createLoader(JobRequest),
  message: createLoader(Message),
  optOut: createLoader(OptOut),
  pendingMessagePart: createLoader(PendingMessagePart),
  questionResponse: createLoader(QuestionResponse),
  userCell: createLoader(UserCell),
  userOrganization: createLoader(UserOrganization),
  linkDomain: createLoader(LinkDomain),
  unhealthyLinkDomain: createLoader(UnhealthyLinkDomain)
});

const r = thinky.r;

export {
  createLoaders,
  r,
  cacheableData,
  dropTables,
  datawarehouse,
  Assignment,
  Campaign,
  CampaignContact,
  InteractionStep,
  Invite,
  JobRequest,
  Message,
  OptOut,
  Organization,
  PendingMessagePart,
  CannedResponse,
  QuestionResponse,
  UserCell,
  UserOrganization,
  User,
  ZipCode,
  Log,
  LinkDomain,
  UnhealthyLinkDomain
};
