/**
 * This script creates a white labeled tenant and invites users and moderators.
 * Usage:
 *  npm install
 *  npm run create-white-labeled-tenant
 */

import axios, {AxiosResponse} from 'axios';

// ******** BEGIN - FILL THIS OUT ******** //

const PARENT_TENANT_ID = 'PUT YOUR TENANT ID HERE';
const PARENT_TENANT_API_KEY = 'PUT YOUR API KEY HERE';

// This is used in the moderator invite email. For example "<from name> is inviting you to tenant <tenant name".
const MODERATOR_INVITE_FROM_NAME = 'PUT A NAME HERE';

const NEW_TENANT_NAME = 'PICK A NAME FOR THE NEW TENANT';
const NEW_TENANT_EMAIL = 'DEFINE AN EMAIL FOR THE NEW TENANT';
const NEW_TENANT_DOMAIN = 'change-me.com';

const USERS_TO_CREATE = [
    ['some-admin-username', 'some-admin-user-email@fctest.com']
];

const MODERATORS_TO_INVITE = [
    ['some-moderator-username', 'someemail@fctest.com'],
    ['some-other-moderator-username', 'someotheremail@fctest.com'],
];

// ******** END - FILL THIS OUT ******** //

const HOST = 'https://fastcomments.com';

function assertResponseSuccess(response: AxiosResponse) {
    if (response.data.reason) {
        throw response.data.reason;
    }
    if (response.data.code) {
        throw response.data.code;
    }
}

(async function main() {
    // STEP 1. - Create a tenant.
    const createTenantResponse = await axios.post(`${HOST}/api/v1/tenants?API_KEY=${PARENT_TENANT_API_KEY}&tenantId=${PARENT_TENANT_ID}`, {
        name: NEW_TENANT_NAME,
        email: NEW_TENANT_EMAIL,
        domainConfiguration: [
            {
                domain: NEW_TENANT_DOMAIN
            }
        ],
        billingHandledExternally: true
    });
    assertResponseSuccess(createTenantResponse);
    const newTenant = createTenantResponse.data.tenant;
    console.log('Created tenant', newTenant.name, newTenant.id);

    // STEP 2. - Create a package for the tenant. This defines their limits, etc.
    const createPackageResponse = await axios.post(`${HOST}/api/v1/tenant-packages?API_KEY=${PARENT_TENANT_API_KEY}&tenantId=${newTenant.id}`, {
        name: 'Default Package',
        tenantId: newTenant.id,
        monthlyCostUSD: null, // this example uses flex pricing
        yearlyCostUSD: null, // this example uses flex pricing
        maxMonthlyPageLoads: 50_000,
        maxMonthlyAPICredits: 50_000,
        maxMonthlyComments: 50_000,
        maxConcurrentUsers: 50_000,
        maxTenantUsers: 10,
        maxSSOUsers: 50_000,
        maxModerators: 100,
        maxDomains: 3,
        hasWhiteLabeling: false,
        hasDebranding: true,
        forWhoText: 'For Everyone',
        featureTaglines: ['Some Tag', 'Some Other Tag'],
        hasFlexPricing: true,
        // if hasFlexPricing is true, you must specify the below:
        flexPageLoadCostCents: 100,
        flexPageLoadUnit: 100_000, // this means, for every 100000 page loads, we charge 100 cents USD
        flexCommentCostCents: 100,
        flexCommentUnit: 100_000,
        flexSSOUserCostCents: 100,
        flexSSOUserUnit: 1_000,
        flexAPICreditCostCents: 100,
        flexAPICreditUnit: 50_000,
        flexModeratorCostCents: 500,
        flexModeratorUnit: 1,
        flexAdminCostCents: 1_000,
        flexAdminUnit: 1,
        flexDomainCostCents: 1_000,
        flexDomainUnit: 1,
        flexMinimumCostCents: 99,
    });
    assertResponseSuccess(createPackageResponse);
    const newPackage = createPackageResponse.data.tenantPackage;
    console.log('Created package', newPackage.name, newPackage.id);

    // STEP 3. - Set the newly created package as the active one.
    const addPackageToTenantResponse = await axios.patch(`${HOST}/api/v1/tenants/${newTenant.id}?API_KEY=${PARENT_TENANT_API_KEY}&tenantId=${newTenant.id}`, {
        packageId: newPackage.id
    });
    assertResponseSuccess(addPackageToTenantResponse);
    console.log('Added package to tenant.');

    // STEP 4. - Create our users and send them login links to make their life easier.
    for (const user of USERS_TO_CREATE) {
        const [username, email] = user;
        const tenantUserCreateResponse = await axios.post(`${HOST}/api/v1/tenant-users?API_KEY=${PARENT_TENANT_API_KEY}&tenantId=${newTenant.id}`, {
            username,
            email,
            isHelpRequestAdmin: true,
            isAccountOwner: true,
            isAdminAdmin: true,
            isBillingAdmin: true,
            isAnalyticsAdmin: true,
            isCustomizationAdmin: true,
            isManageDataAdmin: true,
            isCommentModeratorAdmin: true,
            isAPIAdmin: true,
        });
        assertResponseSuccess(tenantUserCreateResponse);
        const newTenantUser = tenantUserCreateResponse.data.tenantUser;
        console.log('Created new tenant user', newTenantUser.username, newTenantUser.id);

        const sendLoginLinkResponse = await axios.post(`${HOST}/api/v1/tenant-users/${newTenantUser.id}/send-login-link?API_KEY=${PARENT_TENANT_API_KEY}&tenantId=${newTenant.id}`, null);
        assertResponseSuccess(sendLoginLinkResponse);
        console.log('Sent login link to new tenant user', newTenantUser.username, newTenantUser.id);
    }

    // STEP 5. - Create and invite our moderators.
    for (const moderator of MODERATORS_TO_INVITE) {
        const [name, email] = moderator;
        const createModeratorResponse = await axios.post(`${HOST}/api/v1/moderators?API_KEY=${PARENT_TENANT_API_KEY}&tenantId=${newTenant.id}`, {
            name,
            email,
        });
        assertResponseSuccess(createModeratorResponse);
        const newModerator = createModeratorResponse.data.moderator;
        console.log('Created new moderator', newModerator.name, newModerator.id);

        const inviteResponse = await axios.post(`${HOST}/api/v1/moderators/${newModerator.id}/send-invite?API_KEY=${PARENT_TENANT_API_KEY}&tenantId=${newTenant.id}&fromName=${encodeURIComponent(MODERATOR_INVITE_FROM_NAME)}`);
        assertResponseSuccess(inviteResponse);
        console.log('Sent new moderator an invite via email', newModerator.name, newModerator.id);
    }
    console.log('Done!');
    process.exit(0);
})();
