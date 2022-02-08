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
        ]
    });
    assertResponseSuccess(createTenantResponse);
    const newTenant = createTenantResponse.data.tenant;

    // STEP 2. - Create a package for the tenant. This defines their limits, etc.
    const createPackageResponse = await axios.post(`${HOST}/api/v1/tenant-packages?API_KEY=${PARENT_TENANT_API_KEY}&tenantId=${newTenant.id}`, {
        name: 'Default Package',
        tenantId: newTenant.id,
        monthlyCostUSD: 5,
        yearlyCostUSD: 50,
        maxMonthlyPageLoads: 1000,
        maxMonthlyAPICredits: 1000,
        maxMonthlyComments: 1000,
        maxConcurrentUsers: 1000,
        maxTenantUsers: 10,
        maxSSOUsers: 1000,
        maxModerators: 500,
        maxDomains: 1000,
        hasWhiteLabeling: false,
        hasDebranding: false,
        forWhoText: 'For Everyone',
        featureTaglines: ['Some Tag', 'Some Other Tag'],
        hasFlexPricing: false,
    });
    assertResponseSuccess(createPackageResponse);
    const newPackage = createPackageResponse.data.tenantPackage;

    // STEP 3. - Set the newly created package as the active one.
    const addPackageToTenantResponse = await axios.patch(`${HOST}/api/v1/tenants/${newTenant.id}?API_KEY=${PARENT_TENANT_API_KEY}&tenantId=${newTenant.id}`, {
        packageId: newPackage.id
    });
    assertResponseSuccess(addPackageToTenantResponse);

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

        const sendLoginLinkResponse = await axios.post(`${HOST}/api/v1/tenant-users/${newTenantUser.id}/send-login-link?API_KEY=${PARENT_TENANT_API_KEY}&tenantId=${newTenant.id}`, null);
        assertResponseSuccess(sendLoginLinkResponse);
    }

    // STEP 5. - Create and invite our moderators.
    for (const moderator of MODERATORS_TO_INVITE) {
        const [name, email] = moderator;
        const createModeratorResponse = await axios.post(`${HOST}/api/v1/moderators?API_KEY=${PARENT_TENANT_API_KEY}&tenantId=${PARENT_TENANT_ID}`, {
            name,
            email,
        });
        assertResponseSuccess(createModeratorResponse);

        const inviteResponse = await axios.post(`${HOST}/api/v1/moderators/${createModeratorResponse.data.moderator.id}/send-invite?API_KEY=${PARENT_TENANT_ID}&tenantId=${newTenant.id}&fromName=${MODERATOR_INVITE_FROM_NAME}`);
        assertResponseSuccess(inviteResponse);
    }
})();
