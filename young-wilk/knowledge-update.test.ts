import { canCheckForKnowledgeUpdates, decideKnowledgeUpdate } from "./knowledge-update";

if (!canCheckForKnowledgeUpdates({ online:true, crisisMode:false, batteryPercent:80 })) throw new Error("Online update should be allowed");
if (canCheckForKnowledgeUpdates({ online:true, crisisMode:true, batteryPercent:80 })) throw new Error("Crisis mode must stay offline");

const decision = decideKnowledgeUpdate(undefined, {
  id:"first-aid-pl",
  domain:"first_aid",
  version:"2026.1",
  publishedAt:"2026-09-22",
  sourceNames:["approved"],
  sourceUrls:["https://example.invalid"],
  sha256:"abc",
  signature:"sig",
  critical:true
}, true, true);
if (decision.action !== "install") throw new Error("Critical verified update should install");
