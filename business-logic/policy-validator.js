const UserRepository = require('../repositories/user-repository');
const PolicyRepository = require('../repositories/policy-repository');
const blockchainSelector = require('./blockchain-selector');
const costCalculator = require('./cost-calculator');
const constants = require('../constants');
const util = require('../util');

module.exports.validatePolicy = async (userPolicies, policyToValidate, user) => {
    const {DEFAULT, DAILY, WEEKLY, MONTHLY, YEARLY} = constants.intervals;
    const otherPolicies = userPolicies.filter(policy => !policy._id.equals(policyToValidate._id));
    util.sortPoliciesByPriority(otherPolicies);

    // Only a single default policy is allowed
    if (policyToValidate.interval === DEFAULT) {
        const otherDefaultPolicies = otherPolicies.filter(policy => policy.interval === DEFAULT);
        if (otherDefaultPolicies && otherDefaultPolicies.length > 0) {
            const conflictError = new Error("Policy conflict detected: A default Policy for this user already exists");
            conflictError.statusCode = 400;
            throw conflictError
        }
    }

    // Daily threshold policies need to have lower max cost than weekly, monthly and yearly
    if (policyToValidate.interval === DAILY) {
        const policiesToCompareTo = otherPolicies.filter(policy => policy.interval !== DEFAULT && policy.interval !== DAILY);
        if (policiesToCompareTo && policiesToCompareTo.length > 0) {
            const policiesWithInvalidLowerCostThreshold = policiesToCompareTo.filter(policy => policy.cost < policyToValidate.cost);
            if (policiesWithInvalidLowerCostThreshold && policiesWithInvalidLowerCostThreshold.length > 0) {
                const conflictError = new Error(`Policy conflict detected: A policy with interval ${policiesWithInvalidLowerCostThreshold[0].interval} has a lower cost threshold`);
                conflictError.statusCode = 400;
                throw conflictError
            }

        }
    }

   /* // Weekly threshold policies need to have lower max cost than monthly and yearly and higher than daily
    if (policyToValidate.interval === WEEKLY) {
        const policiesToCompareTo = otherPolicies.filter(policy => policy.interval !== DEFAULT && policy.interval !== WEEKLY);
        if (policiesToCompareTo && policiesToCompareTo.length > 0) {
            const policiesWithInvalidLowerCostThreshold = policiesToCompareTo.filter(policy =>  policy.cost < policyToValidate.cost);
            const policiesWithInvalidHigherCostThreshold = policiesToCompareTo.filter(policy => policy.interval === conspolicy.cost < policyToValidate.cost);
            if (policiesWithInvalidHigherCostThreshold && policiesWithInvalidHigherCostThreshold.length > 0) {
                const conflictError = new Error(`Policy conflict detected: A policy with interval ${policiesWithInvalidHigherCostThreshold[0].interval} has a lower cost threshold`);
                conflictError.statusCode = 400;
                throw conflictError
            }

        }
    }*/


};