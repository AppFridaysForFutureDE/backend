import * as strikeAccess from "./api/strikes";
import * as ogAccess from "./api/ogs";

// Load og and strike data from website
ogAccess.retrieveOGs();
strikeAccess.retrieveStrikes();
