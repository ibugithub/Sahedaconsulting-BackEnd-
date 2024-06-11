import { ObjectId } from "mongodb";
import { Proposals } from "../models/ProposalsModel";

export const isAlreadyApplied = async (freelancerId: ObjectId, serviceId: ObjectId) => {
  const proposal = await Proposals.findOne({
    'freelancer': freelancerId,
    'service': serviceId
  });
  console.log('the proposal is ', proposal)
  if (proposal) {
    return true;
  }
  return false;
}