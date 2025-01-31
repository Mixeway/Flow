--changeset siewer:initial_dummy_data_for_UT_testing

--
-- PostgreSQL database dump
--

-- Dumped from database version 16.4 (Debian 16.4-1.pgdg120+1)
-- Dumped by pg_dump version 16.4 (Debian 16.4-1.pgdg120+1)


--
-- Data for Name: team; Type: TABLE DATA; Schema: public; Owner: flow_user
--
DELETE FROM public.databasechangeloglock WHERE id = 1;



INSERT INTO public.team VALUES (1, 'Team A', 'empty');
INSERT INTO public.team VALUES (2, 'Team B', 'empty');
INSERT INTO public.team VALUES (3, 'Team C', 'empty');

--
-- Data for Name: coderepo_branch; Type: TABLE DATA; Schema: public; Owner: flow_user
--
ALTER TABLE public.coderepo_branch DISABLE TRIGGER ALL;

INSERT INTO public.coderepo_branch VALUES (1, 'master', 1);
INSERT INTO public.coderepo_branch VALUES (2, 'master', 2);
INSERT INTO public.coderepo_branch VALUES (3, 'master', 3);
INSERT INTO public.coderepo_branch VALUES (4, 'master', 4);
INSERT INTO public.coderepo_branch VALUES (5, 'master', 5);
INSERT INTO public.coderepo_branch VALUES (6, 'main', 6);


--
-- Data for Name: coderepo; Type: TABLE DATA; Schema: public; Owner: flow_user
--

INSERT INTO public.coderepo VALUES (1, 'dbmixer', 'https://gitlab.com/mixingsecurity/dbmixer', 'accessToken123', 1, '2024-08-22 21:27:55.855227', NULL, 'SUCCESS', 'SUCCESS', 'WARNING', 'SUCCESS', 14890229, 1, '27029abd-97b8-4c73-9e14-62a53bf4bc94');
INSERT INTO public.coderepo VALUES (3, 'fortifymixer', 'https://gitlab.com/mixingsecurity/fortifymixer', 'accessToken123', 2, '2024-08-22 21:29:18.843262', NULL, 'SUCCESS', 'NOT_PERFORMED', 'SUCCESS', 'SUCCESS', 12254063, 3, '25a758a6-5edb-49e9-a6e4-cb1f62fab35f');
INSERT INTO public.coderepo VALUES (5, 'openvasmixer', 'https://gitlab.com/mixingsecurity/openvasmixer', 'accessToken123', 3, '2024-08-22 21:30:02.362371', NULL, 'SUCCESS', 'NOT_PERFORMED', 'SUCCESS', 'SUCCESS', 12412545, 5, 'b270dd41-fa92-4828-aa28-7c910d7483db');
INSERT INTO public.coderepo VALUES (4, 'frontmixer', 'https://gitlab.com/mixingsecurity/frontmixer', 'accessToken123', 3, '2024-08-22 21:29:41.01597', NULL, 'SUCCESS', 'NOT_PERFORMED', 'WARNING', 'WARNING', 14493750, 4, '08334b43-4afe-4b7e-a925-2f721fef673f');
INSERT INTO public.coderepo VALUES (2, 'mixer', 'https://gitlab.com/mixingsecurity/mixer', 'accessToken123', 1, '2024-08-22 21:28:53.404622', NULL, 'DANGER', 'NOT_PERFORMED', 'WARNING', 'DANGER', 11989175, 2, 'a081f133-21c3-4cc4-914b-1708428a5377');
INSERT INTO public.coderepo VALUES (6, 'tbo-workshop', 'https://gitlab.com/siewer/tbo-workshop', 'accessToken123', 1, '2024-08-22 21:31:02.167359', NULL, 'SUCCESS', 'NOT_PERFORMED', 'WARNING', 'SUCCESS', 53185820, 6, '2b66436e-36a6-45d3-91a5-317168471e52');

ALTER TABLE public.coderepo_branch ENABLE TRIGGER ALL;

--
-- Data for Name: app_data_type; Type: TABLE DATA; Schema: public; Owner: flow_user
--

INSERT INTO public.app_data_type VALUES (1, 'Authenticating', 'Passwords', 3);
INSERT INTO public.app_data_type VALUES (2, 'Identification', 'Username', 3);
INSERT INTO public.app_data_type VALUES (3, 'Authenticating', 'Passwords', 5);
INSERT INTO public.app_data_type VALUES (4, 'Identification', 'Username', 5);
INSERT INTO public.app_data_type VALUES (5, 'Identification', 'Fullname', 4);
INSERT INTO public.app_data_type VALUES (6, 'Demographic', 'Geographic', 4);
INSERT INTO public.app_data_type VALUES (7, 'Identification', 'Image', 4);
INSERT INTO public.app_data_type VALUES (8, 'Authenticating', 'Passwords', 4);
INSERT INTO public.app_data_type VALUES (9, 'Contact', 'Telephone Number', 4);
INSERT INTO public.app_data_type VALUES (10, 'Identification', 'Username', 4);
INSERT INTO public.app_data_type VALUES (11, 'Identification', 'Fullname', 2);
INSERT INTO public.app_data_type VALUES (12, 'Public Life', 'Interactions', 2);
INSERT INTO public.app_data_type VALUES (13, 'Authenticating', 'Passwords', 2);
INSERT INTO public.app_data_type VALUES (14, 'Contact', 'Telephone Number', 2);
INSERT INTO public.app_data_type VALUES (15, 'Identification', 'Username', 2);
INSERT INTO public.app_data_type VALUES (16, 'Computer Device', 'Browser Fingerprint', 6);
INSERT INTO public.app_data_type VALUES (17, 'Financial Accounts', 'Credit Card Number', 6);
INSERT INTO public.app_data_type VALUES (18, 'Demographic', 'Geographic', 6);
INSERT INTO public.app_data_type VALUES (19, 'Medical and Health', 'Health Records', 6);
INSERT INTO public.app_data_type VALUES (20, 'Public Life', 'Interactions', 6);
INSERT INTO public.app_data_type VALUES (21, 'Medical and Health', 'Personal health history', 6);
INSERT INTO public.app_data_type VALUES (22, 'Contact', 'Physical Address', 6);
INSERT INTO public.app_data_type VALUES (23, 'Contact', 'Telephone Number', 6);
INSERT INTO public.app_data_type VALUES (24, 'Transactional', 'Transactions', 6);
INSERT INTO public.app_data_type VALUES (25, 'Communication', 'Voice Mail', 6);


--
-- Data for Name: app_data_type_category_groups; Type: TABLE DATA; Schema: public; Owner: flow_user
--

INSERT INTO public.app_data_type_category_groups VALUES (1, 'PII');
INSERT INTO public.app_data_type_category_groups VALUES (1, 'Personal Data');
INSERT INTO public.app_data_type_category_groups VALUES (2, 'PII');
INSERT INTO public.app_data_type_category_groups VALUES (2, 'Personal Data');
INSERT INTO public.app_data_type_category_groups VALUES (3, 'PII');
INSERT INTO public.app_data_type_category_groups VALUES (3, 'Personal Data');
INSERT INTO public.app_data_type_category_groups VALUES (4, 'PII');
INSERT INTO public.app_data_type_category_groups VALUES (4, 'Personal Data');
INSERT INTO public.app_data_type_category_groups VALUES (5, 'PII');
INSERT INTO public.app_data_type_category_groups VALUES (5, 'Personal Data');
INSERT INTO public.app_data_type_category_groups VALUES (6, 'PII');
INSERT INTO public.app_data_type_category_groups VALUES (6, 'Personal Data');
INSERT INTO public.app_data_type_category_groups VALUES (7, 'PII');
INSERT INTO public.app_data_type_category_groups VALUES (7, 'Personal Data');
INSERT INTO public.app_data_type_category_groups VALUES (8, 'PII');
INSERT INTO public.app_data_type_category_groups VALUES (8, 'Personal Data');
INSERT INTO public.app_data_type_category_groups VALUES (9, 'PII');
INSERT INTO public.app_data_type_category_groups VALUES (9, 'Personal Data');
INSERT INTO public.app_data_type_category_groups VALUES (10, 'PII');
INSERT INTO public.app_data_type_category_groups VALUES (10, 'Personal Data');
INSERT INTO public.app_data_type_category_groups VALUES (11, 'PII');
INSERT INTO public.app_data_type_category_groups VALUES (11, 'Personal Data');
INSERT INTO public.app_data_type_category_groups VALUES (12, 'PII');
INSERT INTO public.app_data_type_category_groups VALUES (12, 'Personal Data');
INSERT INTO public.app_data_type_category_groups VALUES (13, 'PII');
INSERT INTO public.app_data_type_category_groups VALUES (13, 'Personal Data');
INSERT INTO public.app_data_type_category_groups VALUES (14, 'PII');
INSERT INTO public.app_data_type_category_groups VALUES (14, 'Personal Data');
INSERT INTO public.app_data_type_category_groups VALUES (15, 'PII');
INSERT INTO public.app_data_type_category_groups VALUES (15, 'Personal Data');
INSERT INTO public.app_data_type_category_groups VALUES (16, 'Personal Data');
INSERT INTO public.app_data_type_category_groups VALUES (17, 'PII');
INSERT INTO public.app_data_type_category_groups VALUES (17, 'Personal Data');
INSERT INTO public.app_data_type_category_groups VALUES (18, 'PII');
INSERT INTO public.app_data_type_category_groups VALUES (18, 'Personal Data');
INSERT INTO public.app_data_type_category_groups VALUES (19, 'Personal Data (Sensitive)');
INSERT INTO public.app_data_type_category_groups VALUES (20, 'PII');
INSERT INTO public.app_data_type_category_groups VALUES (20, 'Personal Data');
INSERT INTO public.app_data_type_category_groups VALUES (21, 'Personal Data (Sensitive)');
INSERT INTO public.app_data_type_category_groups VALUES (22, 'PII');
INSERT INTO public.app_data_type_category_groups VALUES (22, 'Personal Data');
INSERT INTO public.app_data_type_category_groups VALUES (23, 'PII');
INSERT INTO public.app_data_type_category_groups VALUES (23, 'Personal Data');
INSERT INTO public.app_data_type_category_groups VALUES (24, 'PII');
INSERT INTO public.app_data_type_category_groups VALUES (24, 'Personal Data');
INSERT INTO public.app_data_type_category_groups VALUES (25, 'PII');
INSERT INTO public.app_data_type_category_groups VALUES (25, 'Personal Data');


--
-- Data for Name: app_data_type_location; Type: TABLE DATA; Schema: public; Owner: flow_user
--

INSERT INTO public.app_data_type_location VALUES (1, 'setPassword', 'src/main/java/pl/orange/bst/fortifymixer/pojo/CreateScanRequest.java');
INSERT INTO public.app_data_type_location VALUES (1, 'password', 'src/main/java/pl/orange/bst/fortifymixer/pojo/CreateScanRequest.java');
INSERT INTO public.app_data_type_location VALUES (1, 'getPassword', 'src/main/java/pl/orange/bst/fortifymixer/pojo/CreateScanRequest.java');
INSERT INTO public.app_data_type_location VALUES (2, 'setUsername', 'src/main/java/pl/orange/bst/fortifymixer/pojo/CreateScanRequest.java');
INSERT INTO public.app_data_type_location VALUES (2, 'username', 'src/main/java/pl/orange/bst/fortifymixer/pojo/CreateScanRequest.java');
INSERT INTO public.app_data_type_location VALUES (2, 'getUsername', 'src/main/java/pl/orange/bst/fortifymixer/pojo/CreateScanRequest.java');
INSERT INTO public.app_data_type_location VALUES (3, 'setPassword', 'src/main/java/pl/orange/bst/mixer/openvas/pojo/User.java');
INSERT INTO public.app_data_type_location VALUES (3, 'password', 'src/main/java/pl/orange/bst/mixer/openvas/pojo/User.java');
INSERT INTO public.app_data_type_location VALUES (3, 'getPassword', 'src/main/java/pl/orange/bst/mixer/openvas/pojo/User.java');
INSERT INTO public.app_data_type_location VALUES (4, 'setUsername', 'src/main/java/pl/orange/bst/mixer/openvas/pojo/User.java');
INSERT INTO public.app_data_type_location VALUES (4, 'username', 'src/main/java/pl/orange/bst/mixer/openvas/pojo/User.java');
INSERT INTO public.app_data_type_location VALUES (4, 'getUsername', 'src/main/java/pl/orange/bst/mixer/openvas/pojo/User.java');
INSERT INTO public.app_data_type_location VALUES (5, 'name', 'src/app/@core/data/users.ts');
INSERT INTO public.app_data_type_location VALUES (6, 'PROJECT_DETAILS_LOCATION', 'src/app/@core/constants/ProjectConstants.ts');
INSERT INTO public.app_data_type_location VALUES (7, 'picture', 'src/app/@core/data/users.ts');
INSERT INTO public.app_data_type_location VALUES (8, 'ADMIN_SMTP_PASSWORD', 'src/app/@core/constants/AdminConstants.ts');
INSERT INTO public.app_data_type_location VALUES (8, 'ADMIN_FORM_USER_PASSWORD', 'src/app/@core/constants/AdminConstants.ts');
INSERT INTO public.app_data_type_location VALUES (8, 'passwordAuth', 'src/app/@core/Model/Settings.ts');
INSERT INTO public.app_data_type_location VALUES (8, 'LOGIN_FORM_PASSWORD', 'src/app/@core/constants/LoginConstants.ts');
INSERT INTO public.app_data_type_location VALUES (8, 'PROJECT_JIRA_PASSWORD', 'src/app/@core/constants/ProjectConstants.ts');
INSERT INTO public.app_data_type_location VALUES (8, 'password', 'src/app/@core/Model/BugTracker.ts');
INSERT INTO public.app_data_type_location VALUES (8, 'authUsingPassword', 'src/app/auth/login/login.component.ts');
INSERT INTO public.app_data_type_location VALUES (8, 'passwordAuthForm', 'src/app/auth/login/login.component.ts');
INSERT INTO public.app_data_type_location VALUES (8, 'smtpPassword', 'src/app/@core/Model/Settings.ts');
INSERT INTO public.app_data_type_location VALUES (8, 'PROJECT_IAAS_PASSWORD', 'src/app/@core/constants/ProjectConstants.ts');
INSERT INTO public.app_data_type_location VALUES (8, 'ADMIN_AUTHENTICATION_PASSWORD', 'src/app/@core/constants/AdminConstants.ts');
INSERT INTO public.app_data_type_location VALUES (8, 'ADMIN_FORM_SCANNER_PASSWORD', 'src/app/@core/constants/AdminConstants.ts');
INSERT INTO public.app_data_type_location VALUES (8, 'ADMIN_FORM_RFW_PASSWORD', 'src/app/@core/constants/AdminConstants.ts');
INSERT INTO public.app_data_type_location VALUES (8, 'ADMIN_FORM_USER_PASSWORD_AUTH', 'src/app/@core/constants/AdminConstants.ts');
INSERT INTO public.app_data_type_location VALUES (8, 'ADMIN_FORM_PROXY_PASSWORD', 'src/app/@core/constants/AdminConstants.ts');
INSERT INTO public.app_data_type_location VALUES (9, 'PROJECT_CONTACTLIST_TITLE', 'src/app/@core/constants/ProjectConstants.ts');
INSERT INTO public.app_data_type_location VALUES (9, 'PROJECT_CONTACTLIST_BUTTON', 'src/app/@core/constants/ProjectConstants.ts');
INSERT INTO public.app_data_type_location VALUES (9, 'PROJECT_CONTACTLIST_ADDRESSES', 'src/app/@core/constants/ProjectConstants.ts');
INSERT INTO public.app_data_type_location VALUES (10, 'ADMIN_FORM_RFW_USERNAME', 'src/app/@core/constants/AdminConstants.ts');
INSERT INTO public.app_data_type_location VALUES (10, 'smtpUsername', 'src/app/@core/Model/Settings.ts');
INSERT INTO public.app_data_type_location VALUES (10, 'PROJECT_IAAS_USERNAME', 'src/app/@core/constants/ProjectConstants.ts');
INSERT INTO public.app_data_type_location VALUES (10, 'ADMIN_FORM_USER_NAME', 'src/app/@core/constants/AdminConstants.ts');
INSERT INTO public.app_data_type_location VALUES (10, 'ADMIN_SMTP_USERNAME', 'src/app/@core/constants/AdminConstants.ts');
INSERT INTO public.app_data_type_location VALUES (10, 'ADMIN_FORM_SCANNER_USERNAME', 'src/app/@core/constants/AdminConstants.ts');
INSERT INTO public.app_data_type_location VALUES (10, 'PROJECT_JIRA_USERNAME', 'src/app/@core/constants/ProjectConstants.ts');
INSERT INTO public.app_data_type_location VALUES (10, 'ADMIN_USERTABLE_USERNAME', 'src/app/@core/constants/AdminConstants.ts');
INSERT INTO public.app_data_type_location VALUES (10, 'getUserName', 'src/app/@theme/components/header/header.component.ts');
INSERT INTO public.app_data_type_location VALUES (10, 'ADMIN_FORM_PROXY_USERNAME', 'src/app/@core/constants/AdminConstants.ts');
INSERT INTO public.app_data_type_location VALUES (10, 'username', 'src/app/@core/Model/BugTracker.ts');
INSERT INTO public.app_data_type_location VALUES (11, 'setName', 'src/main/java/io/mixeway/rest/dashboard/model/SessionOwner.java');
INSERT INTO public.app_data_type_location VALUES (11, 'getName', 'src/main/java/io/mixeway/rest/dashboard/model/SessionOwner.java');
INSERT INTO public.app_data_type_location VALUES (11, 'name', 'src/main/java/io/mixeway/rest/dashboard/model/SessionOwner.java');
INSERT INTO public.app_data_type_location VALUES (12, 'buildJsonPostAuth', 'src/main/java/io/mixeway/plugins/servicediscovery/openstack/apiclient/OpenStackApiClient.java');
INSERT INTO public.app_data_type_location VALUES (13, 'setPassword', 'src/main/java/io/mixeway/rest/project/model/IaasApiPutModel.java');
INSERT INTO public.app_data_type_location VALUES (13, 'userPassword', 'src/main/java/io/mixeway/rest/model/UserModel.java');
INSERT INTO public.app_data_type_location VALUES (13, 'keyStorePassword', 'src/main/java/io/mixeway/plugins/infrastructurescan/openvas/apiclient/OpenVasApiClient.java');
INSERT INTO public.app_data_type_location VALUES (13, 'passwordAuth', 'src/main/java/io/mixeway/rest/model/UserModel.java');
INSERT INTO public.app_data_type_location VALUES (13, 'repoPassword', 'src/main/java/io/mixeway/plugins/codescan/model/CodeScanRequestModel.java');
INSERT INTO public.app_data_type_location VALUES (13, 'getUserPassword', 'src/main/java/io/mixeway/rest/model/UserModel.java');
INSERT INTO public.app_data_type_location VALUES (13, 'setRepoPassword', 'src/main/java/io/mixeway/plugins/codescan/model/CodeScanRequestModel.java');
INSERT INTO public.app_data_type_location VALUES (13, 'getRfwPassword', 'src/main/java/io/mixeway/rest/model/RfwModel.java');
INSERT INTO public.app_data_type_location VALUES (13, 'getPasswordAuth', 'src/main/java/io/mixeway/rest/model/UserModel.java');
INSERT INTO public.app_data_type_location VALUES (13, 'rfwPassword', 'src/main/java/io/mixeway/rest/model/RfwModel.java');
INSERT INTO public.app_data_type_location VALUES (13, 'trustStorePassword', 'src/main/java/io/mixeway/plugins/infrastructurescan/openvas/apiclient/OpenVasApiClient.java');
INSERT INTO public.app_data_type_location VALUES (13, 'password', 'src/main/java/io/mixeway/rest/project/model/IaasApiPutModel.java');
INSERT INTO public.app_data_type_location VALUES (13, 'getPassword', 'src/main/java/io/mixeway/rest/project/model/IaasApiPutModel.java');
INSERT INTO public.app_data_type_location VALUES (13, 'setRfwPassword', 'src/main/java/io/mixeway/rest/model/RfwModel.java');
INSERT INTO public.app_data_type_location VALUES (13, 'setSmtpPassword', 'src/main/java/io/mixeway/rest/admin/model/SmtpSettingsModel.java');
INSERT INTO public.app_data_type_location VALUES (13, 'setUserPassword', 'src/main/java/io/mixeway/rest/model/UserModel.java');
INSERT INTO public.app_data_type_location VALUES (13, 'smtpPassword', 'src/main/java/io/mixeway/rest/admin/model/SmtpSettingsModel.java');
INSERT INTO public.app_data_type_location VALUES (13, 'getRepoPassword', 'src/main/java/io/mixeway/plugins/codescan/model/CodeScanRequestModel.java');
INSERT INTO public.app_data_type_location VALUES (13, 'setPasswordAuth', 'src/main/java/io/mixeway/rest/model/UserModel.java');
INSERT INTO public.app_data_type_location VALUES (13, 'getSmtpPassword', 'src/main/java/io/mixeway/rest/admin/model/SmtpSettingsModel.java');
INSERT INTO public.app_data_type_location VALUES (13, 'bCryptPasswordEncoder', 'src/main/java/io/mixeway/rest/admin/service/AdminUserRestService.java');
INSERT INTO public.app_data_type_location VALUES (14, 'contactList', 'src/main/java/io/mixeway/rest/model/ContactListPutModel.java');
INSERT INTO public.app_data_type_location VALUES (14, 'getContactList', 'src/main/java/io/mixeway/rest/model/ContactListPutModel.java');
INSERT INTO public.app_data_type_location VALUES (14, 'setContactList', 'src/main/java/io/mixeway/rest/model/ContactListPutModel.java');
INSERT INTO public.app_data_type_location VALUES (15, 'getUserUsername', 'src/main/java/io/mixeway/rest/model/UserModel.java');
INSERT INTO public.app_data_type_location VALUES (15, 'userUsername', 'src/main/java/io/mixeway/rest/model/UserModel.java');
INSERT INTO public.app_data_type_location VALUES (15, 'setUsername', 'src/main/java/io/mixeway/rest/project/model/IaasApiPutModel.java');
INSERT INTO public.app_data_type_location VALUES (15, 'getRepoUsername', 'src/main/java/io/mixeway/plugins/codescan/model/CodeScanRequestModel.java');
INSERT INTO public.app_data_type_location VALUES (15, 'smtpUsername', 'src/main/java/io/mixeway/rest/admin/model/SmtpSettingsModel.java');
INSERT INTO public.app_data_type_location VALUES (15, 'getRfwUsername', 'src/main/java/io/mixeway/rest/model/RfwModel.java');
INSERT INTO public.app_data_type_location VALUES (15, 'setRepoUsername', 'src/main/java/io/mixeway/plugins/codescan/model/CodeScanRequestModel.java');
INSERT INTO public.app_data_type_location VALUES (15, 'setSmtpUsername', 'src/main/java/io/mixeway/rest/admin/model/SmtpSettingsModel.java');
INSERT INTO public.app_data_type_location VALUES (15, 'getUsername', 'src/main/java/io/mixeway/rest/project/model/IaasApiPutModel.java');
INSERT INTO public.app_data_type_location VALUES (15, 'repoUsername', 'src/main/java/io/mixeway/plugins/codescan/model/CodeScanRequestModel.java');
INSERT INTO public.app_data_type_location VALUES (15, 'getUsernameFromToken', 'src/main/java/io/mixeway/rest/utils/JwtUtils.java');
INSERT INTO public.app_data_type_location VALUES (15, 'rfwUsername', 'src/main/java/io/mixeway/rest/model/RfwModel.java');
INSERT INTO public.app_data_type_location VALUES (15, 'loadUserByUsername', 'src/main/java/io/mixeway/rest/utils/JwtUserDetailsService.java');
INSERT INTO public.app_data_type_location VALUES (15, 'getSmtpUsername', 'src/main/java/io/mixeway/rest/admin/model/SmtpSettingsModel.java');
INSERT INTO public.app_data_type_location VALUES (15, 'setUserUsername', 'src/main/java/io/mixeway/rest/model/UserModel.java');
INSERT INTO public.app_data_type_location VALUES (15, 'setRfwUsername', 'src/main/java/io/mixeway/rest/model/RfwModel.java');
INSERT INTO public.app_data_type_location VALUES (15, 'username', 'src/main/resources/db/changelog/db.changelog-master.sql');
INSERT INTO public.app_data_type_location VALUES (16, '"fingerprint"', 'Java/spring-thymeleaf-crud-example/src/main/resources/static/vendors/fontawesome/js/solid.js');
INSERT INTO public.app_data_type_location VALUES (17, '"credit-card"', 'Java/spring-thymeleaf-crud-example/src/main/resources/static/vendors/fontawesome/js/solid.js');
INSERT INTO public.app_data_type_location VALUES (18, '"location-arrow"', 'Java/spring-thymeleaf-crud-example/src/main/resources/static/vendors/fontawesome/js/solid.js');
INSERT INTO public.app_data_type_location VALUES (18, '"search-location"', 'Java/spring-thymeleaf-crud-example/src/main/resources/static/vendors/fontawesome/js/solid.js');
INSERT INTO public.app_data_type_location VALUES (19, '"procedures"', 'Java/spring-thymeleaf-crud-example/src/main/resources/static/vendors/fontawesome/js/solid.js');
INSERT INTO public.app_data_type_location VALUES (19, '"allergies"', 'Java/spring-thymeleaf-crud-example/src/main/resources/static/vendors/fontawesome/js/solid.js');
INSERT INTO public.app_data_type_location VALUES (20, '"reply"', 'Java/spring-thymeleaf-crud-example/src/main/resources/static/vendors/fontawesome/js/solid.js');
INSERT INTO public.app_data_type_location VALUES (20, '"reply-all"', 'Java/spring-thymeleaf-crud-example/src/main/resources/static/vendors/fontawesome/js/solid.js');
INSERT INTO public.app_data_type_location VALUES (21, '"disease"', 'Java/spring-thymeleaf-crud-example/src/main/resources/static/vendors/fontawesome/js/solid.js');
INSERT INTO public.app_data_type_location VALUES (22, '"address-card"', 'Java/spring-thymeleaf-crud-example/src/main/resources/static/vendors/fontawesome/js/solid.js');
INSERT INTO public.app_data_type_location VALUES (22, '"address-book"', 'Java/spring-thymeleaf-crud-example/src/main/resources/static/vendors/fontawesome/js/solid.js');
INSERT INTO public.app_data_type_location VALUES (22, '"street-view"', 'Java/spring-thymeleaf-crud-example/src/main/resources/static/vendors/fontawesome/js/solid.js');
INSERT INTO public.app_data_type_location VALUES (22, '"city"', 'Java/spring-thymeleaf-crud-example/src/main/resources/static/vendors/fontawesome/js/solid.js');
INSERT INTO public.app_data_type_location VALUES (23, '"mobile"', 'Java/spring-thymeleaf-crud-example/src/main/resources/static/vendors/fontawesome/js/solid.js');
INSERT INTO public.app_data_type_location VALUES (23, '"blender-phone"', 'Java/spring-thymeleaf-crud-example/src/main/resources/static/vendors/fontawesome/js/solid.js');
INSERT INTO public.app_data_type_location VALUES (23, '"mobile-alt"', 'Java/spring-thymeleaf-crud-example/src/main/resources/static/vendors/fontawesome/js/solid.js');
INSERT INTO public.app_data_type_location VALUES (23, '"phone-alt"', 'Java/spring-thymeleaf-crud-example/src/main/resources/static/vendors/fontawesome/js/solid.js');
INSERT INTO public.app_data_type_location VALUES (23, '"phone-slash"', 'Java/spring-thymeleaf-crud-example/src/main/resources/static/vendors/fontawesome/js/solid.js');
INSERT INTO public.app_data_type_location VALUES (23, '"phone"', 'Java/spring-thymeleaf-crud-example/src/main/resources/static/vendors/fontawesome/js/solid.js');
INSERT INTO public.app_data_type_location VALUES (23, '"phone-volume"', 'Java/spring-thymeleaf-crud-example/src/main/resources/static/vendors/fontawesome/js/solid.js');
INSERT INTO public.app_data_type_location VALUES (23, '"phone-square"', 'Java/spring-thymeleaf-crud-example/src/main/resources/static/vendors/fontawesome/js/solid.js');
INSERT INTO public.app_data_type_location VALUES (23, '"phone-square-alt"', 'Java/spring-thymeleaf-crud-example/src/main/resources/static/vendors/fontawesome/js/solid.js');
INSERT INTO public.app_data_type_location VALUES (24, '"file-invoice"', 'Java/spring-thymeleaf-crud-example/src/main/resources/static/vendors/fontawesome/js/solid.js');
INSERT INTO public.app_data_type_location VALUES (24, '"sort-amount-down"', 'Java/spring-thymeleaf-crud-example/src/main/resources/static/vendors/fontawesome/js/solid.js');
INSERT INTO public.app_data_type_location VALUES (24, '"file-invoice-dollar"', 'Java/spring-thymeleaf-crud-example/src/main/resources/static/vendors/fontawesome/js/solid.js');
INSERT INTO public.app_data_type_location VALUES (24, '"sort-amount-up"', 'Java/spring-thymeleaf-crud-example/src/main/resources/static/vendors/fontawesome/js/solid.js');
INSERT INTO public.app_data_type_location VALUES (24, '"sort-amount-down-alt"', 'Java/spring-thymeleaf-crud-example/src/main/resources/static/vendors/fontawesome/js/solid.js');
INSERT INTO public.app_data_type_location VALUES (24, '"receipt"', 'Java/spring-thymeleaf-crud-example/src/main/resources/static/vendors/fontawesome/js/solid.js');
INSERT INTO public.app_data_type_location VALUES (24, '"sort-amount-up-alt"', 'Java/spring-thymeleaf-crud-example/src/main/resources/static/vendors/fontawesome/js/solid.js');
INSERT INTO public.app_data_type_location VALUES (25, '"voicemail"', 'Java/spring-thymeleaf-crud-example/src/main/resources/static/vendors/fontawesome/js/solid.js');


--
-- Data for Name: code_repo_finding_stats; Type: TABLE DATA; Schema: public; Owner: flow_user
--

INSERT INTO public.code_repo_finding_stats VALUES (8, 1, '2024-08-01 10:10:10', 19, 14, 19, 17, 18, 6, 11, 12, 4, 13, 17, 11, 11, 5, 16, 8, 8, 8, 6, 15);
INSERT INTO public.code_repo_finding_stats VALUES (9, 1, '2024-08-02 10:10:10', 11, 12, 15, 11, 17, 7, 4, 8, 10, 14, 3, 7, 14, 2, 9, 9, 18, 9, 12, 8);
INSERT INTO public.code_repo_finding_stats VALUES (10, 1, '2024-08-03 10:10:10', 6, 4, 1, 16, 19, 7, 11, 6, 18, 0, 8, 2, 9, 4, 3, 15, 18, 5, 4, 14);
INSERT INTO public.code_repo_finding_stats VALUES (11, 1, '2024-08-04 10:10:10', 10, 2, 4, 17, 20, 11, 15, 2, 10, 18, 7, 15, 6, 19, 19, 12, 12, 17, 6, 14);
INSERT INTO public.code_repo_finding_stats VALUES (12, 1, '2024-08-05 10:10:10', 19, 19, 7, 18, 12, 14, 7, 19, 0, 19, 13, 19, 15, 11, 6, 16, 3, 7, 4, 17);
INSERT INTO public.code_repo_finding_stats VALUES (13, 1, '2024-08-06 10:10:10', 15, 5, 19, 7, 18, 3, 9, 16, 9, 0, 3, 17, 15, 8, 19, 8, 0, 16, 20, 13);
INSERT INTO public.code_repo_finding_stats VALUES (14, 1, '2024-08-07 10:10:10', 6, 17, 15, 13, 9, 18, 8, 8, 12, 2, 2, 4, 19, 17, 11, 14, 8, 11, 10, 3);
INSERT INTO public.code_repo_finding_stats VALUES (15, 1, '2024-08-08 10:10:10', 8, 8, 7, 3, 6, 15, 10, 1, 13, 8, 18, 16, 6, 14, 7, 13, 18, 11, 6, 4);
INSERT INTO public.code_repo_finding_stats VALUES (16, 1, '2024-08-09 10:10:10', 9, 10, 3, 9, 19, 10, 16, 10, 12, 20, 11, 1, 10, 0, 4, 4, 1, 4, 2, 0);
INSERT INTO public.code_repo_finding_stats VALUES (17, 1, '2024-08-10 10:10:10', 0, 15, 18, 11, 4, 11, 16, 5, 11, 18, 0, 17, 9, 15, 19, 11, 13, 6, 2, 9);
INSERT INTO public.code_repo_finding_stats VALUES (18, 2, '2024-08-01 10:10:10', 17, 17, 6, 9, 13, 9, 3, 4, 20, 10, 10, 16, 14, 20, 2, 14, 3, 15, 9, 16);
INSERT INTO public.code_repo_finding_stats VALUES (19, 2, '2024-08-02 10:10:10', 14, 5, 11, 14, 16, 12, 0, 14, 17, 19, 8, 14, 20, 13, 10, 3, 8, 20, 1, 0);
INSERT INTO public.code_repo_finding_stats VALUES (20, 2, '2024-08-03 10:10:10', 17, 2, 18, 9, 13, 11, 8, 4, 20, 6, 0, 19, 0, 20, 13, 20, 10, 8, 17, 9);
INSERT INTO public.code_repo_finding_stats VALUES (21, 2, '2024-08-04 10:10:10', 16, 2, 11, 20, 7, 15, 7, 19, 16, 16, 4, 5, 18, 12, 10, 0, 13, 5, 19, 6);
INSERT INTO public.code_repo_finding_stats VALUES (22, 2, '2024-08-05 10:10:10', 9, 13, 20, 3, 0, 7, 13, 8, 10, 12, 17, 13, 5, 6, 4, 14, 1, 2, 12, 18);
INSERT INTO public.code_repo_finding_stats VALUES (23, 2, '2024-08-06 10:10:10', 19, 4, 10, 12, 17, 15, 1, 0, 13, 1, 7, 7, 8, 20, 8, 14, 9, 10, 11, 11);
INSERT INTO public.code_repo_finding_stats VALUES (24, 2, '2024-08-07 10:10:10', 16, 15, 15, 14, 18, 3, 19, 17, 15, 6, 18, 8, 20, 20, 9, 3, 4, 7, 12, 13);
INSERT INTO public.code_repo_finding_stats VALUES (25, 2, '2024-08-08 10:10:10', 1, 0, 2, 4, 5, 20, 11, 13, 1, 9, 17, 17, 6, 17, 7, 17, 17, 17, 10, 5);
INSERT INTO public.code_repo_finding_stats VALUES (26, 2, '2024-08-09 10:10:10', 3, 1, 11, 18, 5, 4, 13, 12, 2, 15, 0, 3, 2, 10, 10, 4, 0, 17, 10, 3);
INSERT INTO public.code_repo_finding_stats VALUES (27, 2, '2024-08-10 10:10:10', 11, 13, 14, 14, 10, 5, 17, 5, 2, 3, 6, 12, 11, 14, 2, 11, 19, 17, 13, 3);
INSERT INTO public.code_repo_finding_stats VALUES (28, 3, '2024-08-01 10:10:10', 4, 6, 9, 3, 11, 3, 10, 19, 17, 5, 20, 5, 9, 5, 18, 5, 6, 14, 16, 17);
INSERT INTO public.code_repo_finding_stats VALUES (29, 3, '2024-08-02 10:10:10', 9, 10, 5, 3, 9, 1, 0, 7, 12, 17, 0, 7, 7, 7, 11, 9, 5, 5, 12, 1);
INSERT INTO public.code_repo_finding_stats VALUES (30, 3, '2024-08-03 10:10:10', 15, 8, 11, 2, 17, 12, 16, 3, 2, 15, 2, 9, 20, 15, 18, 8, 9, 16, 20, 1);
INSERT INTO public.code_repo_finding_stats VALUES (31, 3, '2024-08-04 10:10:10', 0, 13, 16, 20, 1, 3, 19, 19, 3, 9, 6, 11, 0, 10, 8, 20, 4, 16, 2, 2);
INSERT INTO public.code_repo_finding_stats VALUES (32, 3, '2024-08-05 10:10:10', 0, 7, 1, 3, 20, 2, 13, 9, 16, 8, 14, 8, 13, 4, 3, 0, 11, 11, 14, 15);
INSERT INTO public.code_repo_finding_stats VALUES (33, 3, '2024-08-06 10:10:10', 11, 14, 9, 5, 5, 20, 20, 13, 17, 3, 19, 18, 17, 9, 1, 0, 19, 5, 4, 12);
INSERT INTO public.code_repo_finding_stats VALUES (34, 3, '2024-08-07 10:10:10', 18, 7, 5, 10, 14, 10, 11, 16, 17, 4, 16, 15, 18, 17, 12, 4, 10, 6, 12, 2);
INSERT INTO public.code_repo_finding_stats VALUES (35, 3, '2024-08-08 10:10:10', 18, 13, 8, 16, 3, 1, 11, 1, 8, 6, 19, 14, 12, 4, 3, 9, 5, 3, 17, 10);
INSERT INTO public.code_repo_finding_stats VALUES (36, 3, '2024-08-09 10:10:10', 10, 18, 19, 9, 7, 10, 7, 15, 5, 11, 16, 18, 18, 6, 15, 9, 7, 17, 2, 12);
INSERT INTO public.code_repo_finding_stats VALUES (37, 3, '2024-08-10 10:10:10', 16, 6, 5, 1, 13, 11, 0, 18, 0, 17, 14, 15, 19, 4, 8, 8, 11, 14, 15, 19);
INSERT INTO public.code_repo_finding_stats VALUES (38, 4, '2024-08-01 10:10:10', 6, 0, 5, 18, 13, 16, 17, 19, 0, 12, 10, 1, 18, 5, 11, 19, 19, 6, 14, 18);
INSERT INTO public.code_repo_finding_stats VALUES (39, 4, '2024-08-02 10:10:10', 13, 14, 13, 3, 7, 16, 19, 8, 15, 14, 15, 14, 7, 14, 13, 11, 0, 18, 9, 7);
INSERT INTO public.code_repo_finding_stats VALUES (40, 4, '2024-08-03 10:10:10', 20, 16, 19, 7, 4, 4, 19, 15, 5, 8, 10, 6, 14, 18, 1, 14, 3, 9, 3, 13);
INSERT INTO public.code_repo_finding_stats VALUES (41, 4, '2024-08-04 10:10:10', 15, 5, 10, 6, 8, 14, 4, 11, 10, 18, 3, 20, 18, 2, 6, 15, 7, 15, 8, 5);
INSERT INTO public.code_repo_finding_stats VALUES (42, 4, '2024-08-05 10:10:10', 18, 17, 13, 3, 10, 4, 19, 18, 1, 15, 5, 0, 2, 7, 0, 6, 18, 16, 16, 7);
INSERT INTO public.code_repo_finding_stats VALUES (43, 4, '2024-08-06 10:10:10', 12, 18, 6, 10, 18, 19, 14, 19, 3, 0, 3, 2, 2, 17, 20, 11, 4, 13, 17, 5);
INSERT INTO public.code_repo_finding_stats VALUES (44, 4, '2024-08-07 10:10:10', 1, 5, 12, 2, 20, 10, 3, 1, 17, 0, 5, 2, 9, 7, 13, 13, 7, 15, 15, 7);
INSERT INTO public.code_repo_finding_stats VALUES (45, 4, '2024-08-08 10:10:10', 17, 8, 15, 18, 1, 3, 12, 12, 2, 20, 20, 5, 2, 8, 13, 1, 11, 18, 4, 15);
INSERT INTO public.code_repo_finding_stats VALUES (46, 4, '2024-08-09 10:10:10', 19, 14, 8, 9, 2, 9, 18, 19, 0, 15, 8, 17, 4, 16, 4, 16, 6, 19, 2, 4);
INSERT INTO public.code_repo_finding_stats VALUES (47, 4, '2024-08-10 10:10:10', 1, 13, 15, 11, 20, 19, 16, 2, 14, 16, 5, 1, 5, 2, 8, 1, 7, 9, 20, 2);
INSERT INTO public.code_repo_finding_stats VALUES (48, 5, '2024-08-01 10:10:10', 9, 17, 4, 16, 9, 0, 16, 3, 9, 10, 6, 7, 12, 20, 6, 16, 6, 9, 17, 15);
INSERT INTO public.code_repo_finding_stats VALUES (49, 5, '2024-08-02 10:10:10', 17, 4, 8, 10, 9, 4, 15, 19, 4, 5, 19, 16, 0, 4, 11, 13, 20, 13, 14, 8);
INSERT INTO public.code_repo_finding_stats VALUES (50, 5, '2024-08-03 10:10:10', 12, 4, 3, 5, 3, 15, 4, 6, 17, 0, 9, 2, 7, 14, 14, 6, 9, 1, 7, 0);
INSERT INTO public.code_repo_finding_stats VALUES (51, 5, '2024-08-04 10:10:10', 5, 4, 12, 11, 3, 4, 17, 14, 16, 12, 12, 20, 18, 13, 13, 2, 4, 3, 19, 9);
INSERT INTO public.code_repo_finding_stats VALUES (52, 5, '2024-08-05 10:10:10', 3, 13, 4, 6, 16, 12, 0, 4, 4, 15, 20, 11, 6, 12, 16, 11, 1, 19, 11, 18);
INSERT INTO public.code_repo_finding_stats VALUES (53, 5, '2024-08-06 10:10:10', 7, 16, 8, 19, 3, 15, 19, 6, 13, 20, 10, 12, 9, 20, 7, 13, 11, 13, 4, 6);
INSERT INTO public.code_repo_finding_stats VALUES (54, 5, '2024-08-07 10:10:10', 14, 19, 19, 7, 4, 10, 15, 11, 5, 13, 3, 19, 4, 2, 17, 6, 8, 14, 1, 20);
INSERT INTO public.code_repo_finding_stats VALUES (55, 5, '2024-08-08 10:10:10', 17, 15, 9, 2, 3, 12, 9, 17, 8, 0, 14, 4, 10, 6, 13, 5, 8, 5, 1, 5);
INSERT INTO public.code_repo_finding_stats VALUES (56, 5, '2024-08-09 10:10:10', 14, 13, 8, 5, 18, 12, 19, 13, 13, 14, 1, 9, 5, 10, 9, 16, 0, 12, 19, 8);
INSERT INTO public.code_repo_finding_stats VALUES (57, 5, '2024-08-10 10:10:10', 10, 12, 20, 12, 5, 18, 16, 1, 1, 7, 10, 3, 2, 9, 13, 9, 1, 13, 14, 2);
INSERT INTO public.code_repo_finding_stats VALUES (58, 6, '2024-08-01 10:10:10', 18, 2, 11, 9, 12, 18, 5, 6, 16, 1, 17, 0, 13, 18, 16, 17, 0, 18, 9, 7);
INSERT INTO public.code_repo_finding_stats VALUES (59, 6, '2024-08-02 10:10:10', 20, 6, 19, 14, 4, 4, 12, 1, 12, 3, 4, 7, 13, 9, 12, 14, 12, 6, 4, 16);
INSERT INTO public.code_repo_finding_stats VALUES (60, 6, '2024-08-03 10:10:10', 17, 19, 7, 2, 7, 9, 11, 17, 18, 17, 11, 16, 8, 18, 17, 16, 4, 14, 1, 19);
INSERT INTO public.code_repo_finding_stats VALUES (61, 6, '2024-08-04 10:10:10', 4, 5, 1, 0, 6, 12, 5, 5, 20, 11, 4, 20, 8, 18, 2, 6, 7, 6, 19, 4);
INSERT INTO public.code_repo_finding_stats VALUES (62, 6, '2024-08-05 10:10:10', 12, 8, 0, 17, 15, 18, 19, 2, 14, 12, 15, 12, 20, 11, 6, 9, 0, 16, 7, 18);
INSERT INTO public.code_repo_finding_stats VALUES (63, 6, '2024-08-06 10:10:10', 16, 5, 4, 7, 20, 4, 3, 0, 12, 18, 12, 4, 15, 13, 12, 0, 7, 8, 14, 20);
INSERT INTO public.code_repo_finding_stats VALUES (64, 6, '2024-08-07 10:10:10', 15, 6, 4, 14, 12, 9, 1, 9, 11, 11, 4, 18, 1, 3, 7, 11, 14, 12, 11, 15);
INSERT INTO public.code_repo_finding_stats VALUES (65, 6, '2024-08-08 10:10:10', 4, 19, 0, 8, 19, 18, 12, 18, 7, 10, 2, 5, 16, 11, 1, 2, 4, 2, 18, 8);
INSERT INTO public.code_repo_finding_stats VALUES (66, 6, '2024-08-09 10:10:10', 14, 5, 7, 19, 17, 7, 16, 12, 10, 8, 2, 17, 7, 11, 10, 0, 0, 7, 18, 11);
INSERT INTO public.code_repo_finding_stats VALUES (67, 6, '2024-08-10 10:10:10', 18, 3, 6, 10, 4, 12, 14, 11, 0, 11, 8, 0, 13, 17, 15, 8, 14, 11, 13, 11);
INSERT INTO public.code_repo_finding_stats VALUES (68, 1, '2024-08-11 10:10:10', 16, 8, 15, 5, 3, 7, 9, 8, 17, 10, 14, 18, 17, 13, 16, 7, 14, 15, 3, 1);
INSERT INTO public.code_repo_finding_stats VALUES (69, 1, '2024-08-12 10:10:10', 11, 17, 1, 15, 0, 12, 18, 10, 18, 3, 4, 18, 8, 0, 1, 20, 19, 7, 10, 16);
INSERT INTO public.code_repo_finding_stats VALUES (70, 1, '2024-08-13 10:10:10', 20, 20, 0, 11, 12, 13, 11, 4, 8, 10, 15, 6, 18, 3, 2, 17, 15, 0, 17, 12);
INSERT INTO public.code_repo_finding_stats VALUES (71, 1, '2024-08-14 10:10:10', 0, 6, 13, 4, 17, 14, 7, 16, 15, 2, 5, 20, 18, 13, 10, 17, 6, 11, 13, 17);
INSERT INTO public.code_repo_finding_stats VALUES (72, 1, '2024-08-15 10:10:10', 5, 2, 14, 4, 4, 9, 10, 5, 18, 4, 10, 10, 17, 15, 8, 6, 0, 1, 6, 18);
INSERT INTO public.code_repo_finding_stats VALUES (73, 1, '2024-08-16 10:10:10', 11, 1, 6, 11, 4, 20, 16, 0, 10, 12, 2, 0, 3, 13, 2, 10, 7, 0, 16, 5);
INSERT INTO public.code_repo_finding_stats VALUES (74, 1, '2024-08-17 10:10:10', 18, 2, 6, 18, 11, 13, 2, 13, 15, 18, 14, 9, 5, 5, 3, 4, 19, 3, 14, 6);
INSERT INTO public.code_repo_finding_stats VALUES (75, 1, '2024-08-18 10:10:10', 5, 7, 6, 10, 1, 14, 11, 7, 6, 1, 17, 1, 7, 11, 17, 2, 10, 6, 9, 0);
INSERT INTO public.code_repo_finding_stats VALUES (76, 1, '2024-08-19 10:10:10', 1, 19, 18, 14, 20, 14, 13, 1, 2, 8, 11, 19, 15, 13, 0, 5, 18, 14, 12, 5);
INSERT INTO public.code_repo_finding_stats VALUES (77, 1, '2024-08-20 10:10:10', 20, 7, 7, 20, 20, 2, 10, 1, 2, 19, 11, 16, 7, 7, 7, 19, 4, 6, 16, 1);
INSERT INTO public.code_repo_finding_stats VALUES (78, 1, '2024-08-21 10:10:10', 20, 7, 16, 20, 18, 12, 6, 11, 17, 19, 17, 1, 17, 10, 8, 9, 11, 17, 2, 0);
INSERT INTO public.code_repo_finding_stats VALUES (79, 1, '2024-08-22 10:10:10', 13, 15, 16, 7, 19, 13, 1, 4, 18, 13, 14, 14, 10, 19, 15, 5, 3, 9, 10, 16);
INSERT INTO public.code_repo_finding_stats VALUES (80, 2, '2024-08-11 10:10:10', 11, 0, 17, 0, 20, 16, 9, 9, 14, 15, 16, 1, 3, 17, 11, 20, 7, 13, 2, 10);
INSERT INTO public.code_repo_finding_stats VALUES (81, 2, '2024-08-12 10:10:10', 2, 18, 18, 13, 5, 1, 18, 5, 0, 8, 16, 18, 2, 11, 20, 9, 17, 20, 0, 13);
INSERT INTO public.code_repo_finding_stats VALUES (82, 2, '2024-08-13 10:10:10', 20, 8, 5, 6, 7, 5, 1, 14, 15, 3, 19, 10, 1, 18, 2, 1, 8, 10, 5, 9);
INSERT INTO public.code_repo_finding_stats VALUES (83, 2, '2024-08-14 10:10:10', 3, 12, 11, 12, 16, 18, 4, 16, 11, 3, 19, 6, 0, 5, 9, 14, 18, 20, 6, 20);
INSERT INTO public.code_repo_finding_stats VALUES (84, 2, '2024-08-15 10:10:10', 11, 14, 5, 0, 3, 17, 3, 0, 9, 0, 2, 1, 20, 15, 19, 10, 18, 10, 13, 20);
INSERT INTO public.code_repo_finding_stats VALUES (85, 2, '2024-08-16 10:10:10', 12, 18, 1, 0, 1, 20, 13, 2, 11, 16, 16, 19, 1, 15, 19, 2, 17, 4, 11, 8);
INSERT INTO public.code_repo_finding_stats VALUES (86, 2, '2024-08-17 10:10:10', 0, 3, 0, 16, 9, 12, 2, 5, 3, 17, 1, 5, 14, 12, 19, 1, 0, 8, 10, 9);
INSERT INTO public.code_repo_finding_stats VALUES (87, 2, '2024-08-18 10:10:10', 9, 19, 6, 13, 16, 0, 17, 3, 9, 2, 4, 11, 4, 10, 8, 11, 0, 5, 14, 14);
INSERT INTO public.code_repo_finding_stats VALUES (88, 2, '2024-08-19 10:10:10', 3, 19, 9, 15, 3, 13, 9, 5, 6, 13, 17, 0, 0, 3, 8, 16, 3, 13, 8, 6);
INSERT INTO public.code_repo_finding_stats VALUES (89, 2, '2024-08-20 10:10:10', 11, 1, 8, 16, 16, 14, 14, 13, 1, 8, 13, 18, 2, 11, 7, 0, 7, 7, 3, 12);
INSERT INTO public.code_repo_finding_stats VALUES (90, 2, '2024-08-21 10:10:10', 6, 14, 7, 8, 3, 5, 12, 6, 6, 20, 4, 2, 10, 6, 0, 16, 16, 11, 3, 10);
INSERT INTO public.code_repo_finding_stats VALUES (91, 2, '2024-08-22 10:10:10', 9, 6, 18, 6, 12, 7, 20, 8, 7, 18, 10, 6, 14, 3, 19, 9, 19, 18, 6, 20);
INSERT INTO public.code_repo_finding_stats VALUES (92, 3, '2024-08-11 10:10:10', 2, 14, 19, 6, 11, 20, 11, 7, 3, 10, 7, 9, 17, 10, 3, 6, 4, 14, 15, 2);
INSERT INTO public.code_repo_finding_stats VALUES (93, 3, '2024-08-12 10:10:10', 20, 18, 5, 13, 12, 18, 5, 6, 14, 13, 11, 7, 19, 17, 13, 17, 9, 0, 6, 1);
INSERT INTO public.code_repo_finding_stats VALUES (94, 3, '2024-08-13 10:10:10', 9, 14, 20, 1, 10, 1, 20, 6, 5, 15, 18, 2, 16, 13, 12, 10, 10, 7, 4, 5);
INSERT INTO public.code_repo_finding_stats VALUES (95, 3, '2024-08-14 10:10:10', 15, 8, 1, 18, 20, 5, 8, 13, 12, 18, 2, 15, 17, 7, 12, 16, 6, 15, 8, 16);
INSERT INTO public.code_repo_finding_stats VALUES (96, 3, '2024-08-15 10:10:10', 14, 5, 20, 7, 2, 3, 5, 0, 14, 18, 16, 17, 12, 17, 10, 16, 0, 5, 16, 5);
INSERT INTO public.code_repo_finding_stats VALUES (97, 3, '2024-08-16 10:10:10', 17, 18, 16, 12, 0, 4, 6, 14, 14, 20, 6, 18, 12, 14, 1, 2, 10, 8, 2, 9);
INSERT INTO public.code_repo_finding_stats VALUES (98, 3, '2024-08-17 10:10:10', 7, 13, 15, 0, 12, 17, 15, 19, 4, 0, 15, 3, 11, 18, 10, 16, 3, 4, 5, 20);
INSERT INTO public.code_repo_finding_stats VALUES (99, 3, '2024-08-18 10:10:10', 9, 18, 12, 12, 2, 7, 3, 9, 4, 17, 2, 0, 6, 15, 3, 11, 7, 12, 13, 1);
INSERT INTO public.code_repo_finding_stats VALUES (100, 3, '2024-08-19 10:10:10', 13, 15, 8, 5, 12, 2, 18, 12, 14, 13, 10, 0, 19, 19, 17, 5, 16, 20, 5, 20);
INSERT INTO public.code_repo_finding_stats VALUES (101, 3, '2024-08-20 10:10:10', 1, 13, 11, 16, 6, 15, 1, 4, 2, 11, 20, 6, 18, 1, 5, 8, 4, 18, 10, 0);
INSERT INTO public.code_repo_finding_stats VALUES (102, 3, '2024-08-21 10:10:10', 5, 3, 11, 19, 17, 3, 11, 1, 16, 1, 13, 7, 8, 7, 1, 8, 17, 1, 4, 4);
INSERT INTO public.code_repo_finding_stats VALUES (103, 3, '2024-08-22 10:10:10', 11, 16, 8, 6, 0, 16, 15, 5, 19, 11, 4, 2, 13, 5, 12, 3, 19, 5, 19, 2);
INSERT INTO public.code_repo_finding_stats VALUES (104, 4, '2024-08-11 10:10:10', 20, 11, 0, 6, 6, 20, 7, 14, 4, 5, 0, 16, 13, 1, 11, 10, 16, 16, 3, 5);
INSERT INTO public.code_repo_finding_stats VALUES (105, 4, '2024-08-12 10:10:10', 20, 19, 2, 13, 15, 9, 15, 13, 3, 20, 3, 1, 13, 14, 12, 17, 6, 20, 15, 11);
INSERT INTO public.code_repo_finding_stats VALUES (106, 4, '2024-08-13 10:10:10', 18, 14, 4, 7, 10, 18, 12, 9, 9, 18, 5, 14, 5, 11, 6, 8, 17, 8, 1, 6);
INSERT INTO public.code_repo_finding_stats VALUES (107, 4, '2024-08-14 10:10:10', 2, 19, 2, 9, 4, 17, 10, 16, 2, 19, 2, 11, 12, 3, 11, 4, 5, 7, 11, 17);
INSERT INTO public.code_repo_finding_stats VALUES (108, 4, '2024-08-15 10:10:10', 8, 9, 6, 12, 4, 8, 1, 7, 18, 11, 17, 3, 9, 2, 2, 19, 5, 1, 5, 5);
INSERT INTO public.code_repo_finding_stats VALUES (109, 4, '2024-08-16 10:10:10', 14, 18, 14, 1, 15, 3, 7, 17, 1, 18, 0, 7, 20, 17, 2, 18, 20, 1, 6, 7);
INSERT INTO public.code_repo_finding_stats VALUES (110, 4, '2024-08-17 10:10:10', 20, 6, 0, 4, 8, 17, 13, 14, 13, 14, 4, 13, 8, 3, 17, 16, 18, 9, 7, 1);
INSERT INTO public.code_repo_finding_stats VALUES (111, 4, '2024-08-18 10:10:10', 14, 15, 2, 18, 2, 11, 0, 20, 15, 16, 8, 2, 9, 12, 14, 19, 11, 18, 13, 19);
INSERT INTO public.code_repo_finding_stats VALUES (112, 4, '2024-08-19 10:10:10', 8, 10, 3, 5, 9, 4, 19, 13, 1, 16, 0, 15, 13, 16, 2, 5, 9, 7, 1, 18);
INSERT INTO public.code_repo_finding_stats VALUES (113, 4, '2024-08-20 10:10:10', 6, 15, 7, 14, 18, 2, 17, 13, 7, 8, 7, 19, 16, 8, 17, 4, 19, 12, 10, 17);
INSERT INTO public.code_repo_finding_stats VALUES (114, 4, '2024-08-21 10:10:10', 0, 19, 13, 5, 10, 11, 19, 8, 12, 5, 12, 0, 3, 4, 4, 9, 3, 11, 7, 9);
INSERT INTO public.code_repo_finding_stats VALUES (115, 4, '2024-08-22 10:10:10', 17, 13, 14, 12, 8, 2, 17, 1, 15, 15, 1, 3, 10, 6, 10, 9, 1, 12, 18, 15);
INSERT INTO public.code_repo_finding_stats VALUES (116, 5, '2024-08-11 10:10:10', 17, 3, 18, 13, 5, 8, 4, 4, 17, 16, 5, 6, 17, 11, 15, 16, 2, 4, 8, 6);
INSERT INTO public.code_repo_finding_stats VALUES (117, 5, '2024-08-12 10:10:10', 18, 2, 18, 7, 10, 13, 5, 10, 17, 15, 10, 7, 1, 11, 4, 1, 2, 12, 2, 2);
INSERT INTO public.code_repo_finding_stats VALUES (118, 5, '2024-08-13 10:10:10', 10, 8, 6, 1, 5, 14, 9, 10, 8, 6, 17, 13, 14, 12, 19, 15, 20, 4, 8, 11);
INSERT INTO public.code_repo_finding_stats VALUES (119, 5, '2024-08-14 10:10:10', 15, 16, 8, 16, 7, 18, 15, 14, 3, 16, 6, 18, 7, 18, 2, 18, 4, 10, 15, 11);
INSERT INTO public.code_repo_finding_stats VALUES (120, 5, '2024-08-15 10:10:10', 3, 17, 2, 20, 9, 14, 13, 13, 15, 13, 18, 1, 20, 20, 18, 14, 2, 19, 5, 18);
INSERT INTO public.code_repo_finding_stats VALUES (121, 5, '2024-08-16 10:10:10', 9, 9, 18, 17, 11, 11, 14, 6, 6, 9, 10, 7, 20, 0, 2, 19, 18, 5, 19, 8);
INSERT INTO public.code_repo_finding_stats VALUES (122, 5, '2024-08-17 10:10:10', 18, 19, 11, 18, 15, 13, 16, 17, 8, 7, 18, 2, 4, 2, 10, 2, 15, 7, 16, 3);
INSERT INTO public.code_repo_finding_stats VALUES (123, 5, '2024-08-18 10:10:10', 10, 3, 5, 6, 18, 6, 17, 6, 10, 6, 7, 5, 11, 3, 12, 16, 1, 18, 18, 18);
INSERT INTO public.code_repo_finding_stats VALUES (124, 5, '2024-08-19 10:10:10', 6, 7, 12, 18, 12, 16, 12, 6, 8, 12, 2, 18, 11, 6, 0, 18, 3, 4, 2, 11);
INSERT INTO public.code_repo_finding_stats VALUES (125, 5, '2024-08-20 10:10:10', 16, 0, 1, 19, 20, 4, 2, 20, 14, 8, 8, 11, 1, 15, 4, 6, 17, 6, 20, 20);
INSERT INTO public.code_repo_finding_stats VALUES (126, 5, '2024-08-21 10:10:10', 5, 7, 5, 0, 20, 17, 19, 6, 13, 1, 12, 20, 9, 7, 0, 8, 16, 13, 3, 18);
INSERT INTO public.code_repo_finding_stats VALUES (127, 5, '2024-08-22 10:10:10', 7, 12, 16, 19, 10, 3, 1, 14, 13, 0, 1, 10, 11, 6, 16, 8, 8, 2, 15, 6);
INSERT INTO public.code_repo_finding_stats VALUES (128, 6, '2024-08-11 10:10:10', 15, 15, 11, 0, 2, 1, 11, 14, 15, 20, 8, 9, 0, 8, 2, 3, 19, 6, 13, 0);
INSERT INTO public.code_repo_finding_stats VALUES (129, 6, '2024-08-12 10:10:10', 20, 15, 19, 10, 18, 20, 5, 6, 19, 19, 2, 9, 18, 1, 1, 3, 16, 1, 12, 4);
INSERT INTO public.code_repo_finding_stats VALUES (130, 6, '2024-08-13 10:10:10', 12, 9, 2, 9, 10, 15, 17, 1, 4, 5, 15, 0, 19, 19, 16, 18, 18, 19, 14, 17);
INSERT INTO public.code_repo_finding_stats VALUES (131, 6, '2024-08-14 10:10:10', 16, 20, 16, 5, 9, 16, 4, 16, 4, 6, 7, 18, 6, 19, 18, 4, 14, 15, 2, 1);
INSERT INTO public.code_repo_finding_stats VALUES (132, 6, '2024-08-15 10:10:10', 6, 10, 5, 0, 5, 8, 1, 20, 20, 19, 6, 14, 20, 0, 16, 17, 9, 5, 8, 2);
INSERT INTO public.code_repo_finding_stats VALUES (133, 6, '2024-08-16 10:10:10', 9, 9, 14, 11, 0, 5, 10, 0, 4, 16, 20, 17, 7, 10, 4, 4, 17, 2, 17, 11);
INSERT INTO public.code_repo_finding_stats VALUES (134, 6, '2024-08-17 10:10:10', 10, 15, 4, 6, 16, 1, 18, 14, 9, 1, 3, 20, 7, 7, 7, 5, 20, 2, 10, 6);
INSERT INTO public.code_repo_finding_stats VALUES (135, 6, '2024-08-18 10:10:10', 0, 10, 9, 3, 13, 8, 5, 9, 6, 6, 11, 14, 19, 11, 11, 15, 11, 9, 13, 5);
INSERT INTO public.code_repo_finding_stats VALUES (136, 6, '2024-08-19 10:10:10', 16, 11, 0, 18, 0, 1, 10, 9, 20, 4, 5, 10, 6, 20, 3, 13, 15, 18, 11, 4);
INSERT INTO public.code_repo_finding_stats VALUES (137, 6, '2024-08-20 10:10:10', 17, 20, 18, 2, 8, 3, 6, 0, 8, 19, 6, 5, 2, 8, 13, 16, 3, 13, 0, 14);
INSERT INTO public.code_repo_finding_stats VALUES (138, 6, '2024-08-21 10:10:10', 12, 11, 16, 6, 20, 1, 12, 17, 12, 19, 7, 2, 12, 1, 9, 17, 1, 3, 17, 18);
INSERT INTO public.code_repo_finding_stats VALUES (139, 6, '2024-08-22 10:10:10', 5, 18, 16, 16, 15, 14, 2, 17, 12, 2, 11, 16, 3, 11, 11, 5, 5, 13, 14, 10);



--
-- Data for Name: component; Type: TABLE DATA; Schema: public; Owner: flow_user
--



--
-- Data for Name: coderepo_component; Type: TABLE DATA; Schema: public; Owner: flow_user
--



--
-- Data for Name: coderepo_languages; Type: TABLE DATA; Schema: public; Owner: flow_user
--

INSERT INTO public.coderepo_languages VALUES (1, 100, 'Dockerfile');
INSERT INTO public.coderepo_languages VALUES (2, 0, 'Dockerfile');
INSERT INTO public.coderepo_languages VALUES (2, 99, 'Java');
INSERT INTO public.coderepo_languages VALUES (3, 99, 'Java');
INSERT INTO public.coderepo_languages VALUES (3, 0, 'TSQL');
INSERT INTO public.coderepo_languages VALUES (4, 74, 'TypeScript');
INSERT INTO public.coderepo_languages VALUES (4, 0, 'Dockerfile');
INSERT INTO public.coderepo_languages VALUES (4, 4, 'CSS');
INSERT INTO public.coderepo_languages VALUES (4, 0, 'JavaScript');
INSERT INTO public.coderepo_languages VALUES (4, 20, 'HTML');
INSERT INTO public.coderepo_languages VALUES (6, 1, 'Dockerfile');
INSERT INTO public.coderepo_languages VALUES (6, 36, 'Java');
INSERT INTO public.coderepo_languages VALUES (6, 61, 'HTML');


--
-- Data for Name: databasechangelog; Type: TABLE DATA; Schema: public; Owner: flow_user
--

INSERT INTO public.databasechangelog VALUES ('init_db', 'siewer', 'db/changelog/db.changelog-master.sql', '2024-08-22 21:24:34.961432', 1, 'EXECUTED', '9:e424604f0d1beb9d9f516fad2ad7db2a', 'sql', '', NULL, '4.27.0', NULL, NULL, '4361874609');
INSERT INTO public.databasechangelog VALUES ('addteam', 'siewer', 'db/changelog/db.changelog-master.sql', '2024-08-22 21:24:35.014529', 2, 'EXECUTED', '9:f42e38fa43fee4dd4d161452e024d05c', 'sql', '', NULL, '4.27.0', NULL, NULL, '4361874609');
INSERT INTO public.databasechangelog VALUES ('add_active_to_user', 'siewer', 'db/changelog/db.changelog-master.sql', '2024-08-22 21:24:35.046804', 3, 'EXECUTED', '9:26abb6232c663af8878b4f15ee08e813', 'sql', '', NULL, '4.27.0', NULL, NULL, '4361874609');
INSERT INTO public.databasechangelog VALUES ('add_coderepo', 'siewer', 'db/changelog/db.changelog-master.sql', '2024-08-22 21:24:35.115652', 4, 'EXECUTED', '9:db9e9ea786bd175de7addb3473f1c810', 'sql', '', NULL, '4.27.0', NULL, NULL, '4361874609');
INSERT INTO public.databasechangelog VALUES ('add_code_repo_branch', 'siewer', 'db/changelog/db.changelog-master.sql', '2024-08-22 21:24:35.146903', 5, 'EXECUTED', '9:ae86dfd5aae19c3da0703ca0dc7aaf3a', 'sql', '', NULL, '4.27.0', NULL, NULL, '4361874609');
INSERT INTO public.databasechangelog VALUES ('change_branch', 'siewer', 'db/changelog/db.changelog-master.sql', '2024-08-22 21:24:35.18905', 6, 'EXECUTED', '9:fead81a6fbc09dfc4dc8ab6b44a088e9', 'sql', '', NULL, '4.27.0', NULL, NULL, '4361874609');
INSERT INTO public.databasechangelog VALUES ('fix_branch', 'siewer', 'db/changelog/db.changelog-master.sql', '2024-08-22 21:24:35.218775', 7, 'EXECUTED', '9:aacdafb0fd1c5d1cc32f04f5ab6657a0', 'sql', '', NULL, '4.27.0', NULL, NULL, '4361874609');
INSERT INTO public.databasechangelog VALUES ('add_finding_vuln_component', 'siewer', 'db/changelog/db.changelog-master.sql', '2024-08-22 21:24:35.275319', 8, 'EXECUTED', '9:7266e29dcd6d457ff4a1a215c1174016', 'sql', '', NULL, '4.27.0', NULL, NULL, '4361874609');
INSERT INTO public.databasechangelog VALUES ('add_finding_coderepo_link', 'siewer', 'db/changelog/db.changelog-master.sql', '2024-08-22 21:24:35.319862', 9, 'EXECUTED', '9:cac6cbd15752fac5e1a7d0b3e4d50493', 'sql', '', NULL, '4.27.0', NULL, NULL, '4361874609');
INSERT INTO public.databasechangelog VALUES ('add_components', 'siewer', 'db/changelog/db.changelog-master.sql', '2024-08-22 21:24:35.354731', 10, 'EXECUTED', '9:24d0aae7a33d58f48ceefd5425f1f2b6', 'sql', '', NULL, '4.27.0', NULL, NULL, '4361874609');
INSERT INTO public.databasechangelog VALUES ('change_vuln_name', 'siewer', 'db/changelog/db.changelog-master.sql', '2024-08-22 21:24:35.372156', 11, 'EXECUTED', '9:28cc551571edfb28598722c1117d99fa', 'sql', '', NULL, '4.27.0', NULL, NULL, '4361874609');
INSERT INTO public.databasechangelog VALUES ('add_app_data_type', 'siewer', 'db/changelog/db.changelog-master.sql', '2024-08-22 21:24:35.413934', 12, 'EXECUTED', '9:ac2bcf818f543a0d3a336a0d95a5f122', 'sql', '', NULL, '4.27.0', NULL, NULL, '4361874609');
INSERT INTO public.databasechangelog VALUES ('fix', 'siewer', 'db/changelog/db.changelog-master.sql', '2024-08-22 21:24:35.475472', 13, 'EXECUTED', '9:bae9fd7e4068bcf670431f45d88b177b', 'sql', '', NULL, '4.27.0', NULL, NULL, '4361874609');
INSERT INTO public.databasechangelog VALUES ('fix2', 'siewer', 'db/changelog/db.changelog-master.sql', '2024-08-22 21:24:35.527536', 14, 'EXECUTED', '9:e0e875d6517c827c3e61e6090e67e53b', 'sql', '', NULL, '4.27.0', NULL, NULL, '4361874609');
INSERT INTO public.databasechangelog VALUES ('add_finding_stats', 'siewer', 'db/changelog/db.changelog-master.sql', '2024-08-22 21:24:35.55605', 15, 'EXECUTED', '9:e384ad8b7c10449a990ec1474e8e408a', 'sql', '', NULL, '4.27.0', NULL, NULL, '4361874609');
INSERT INTO public.databasechangelog VALUES ('settings', 'siewer', 'db/changelog/db.changelog-master.sql', '2024-08-22 21:24:35.604788', 16, 'EXECUTED', '9:578302c1b6de03e865af11cb6156b761', 'sql', '', NULL, '4.27.0', NULL, NULL, '4361874609');
INSERT INTO public.databasechangelog VALUES ('fix-settings', 'siewer', 'db/changelog/db.changelog-master.sql', '2024-08-22 21:24:35.621077', 17, 'EXECUTED', '9:06198005d1151483b77a79f1ceff8f1b', 'sql', '', NULL, '4.27.0', NULL, NULL, '4361874609');
INSERT INTO public.databasechangelog VALUES ('add_sca_to_coderepo', 'siewer', 'db/changelog/db.changelog-master.sql', '2024-08-22 21:24:35.637385', 18, 'EXECUTED', '9:b516e33220e3ae7708fcebf79318ed27', 'sql', '', NULL, '4.27.0', NULL, NULL, '4361874609');
INSERT INTO public.databasechangelog VALUES ('link_vuln_component', 'siewer', 'db/changelog/db.changelog-master.sql', '2024-08-22 21:24:35.651983', 19, 'EXECUTED', '9:454e8775a9ef0b24964d0b63d9b6f07b', 'sql', '', NULL, '4.27.0', NULL, NULL, '4361874609');
INSERT INTO public.databasechangelog VALUES ('change_component_version', 'siewer', 'db/changelog/db.changelog-master.sql', '2024-08-22 21:24:35.667238', 20, 'EXECUTED', '9:da0bffdf570841e49a07f3ab833f6755', 'sql', '', NULL, '4.27.0', NULL, NULL, '4361874609');
INSERT INTO public.databasechangelog VALUES ('create_scan_info', 'siewer', 'db/changelog/db.changelog-master.sql', '2024-08-22 21:24:35.697166', 21, 'EXECUTED', '9:6c39034c83e03fc199701739252f24af', 'sql', '', NULL, '4.27.0', NULL, NULL, '4361874609');


--
-- Data for Name: databasechangeloglock; Type: TABLE DATA; Schema: public; Owner: flow_user
--

INSERT INTO public.databasechangeloglock VALUES (1, false, NULL, NULL);


--
-- Data for Name: vulnerability; Type: TABLE DATA; Schema: public; Owner: flow_user
--

INSERT INTO public.vulnerability VALUES (1, 'Missing User Instruction', 'A user should be specified in the dockerfile, otherwise the image will run as root', 'https://docs.docker.com/engine/reference/builder/#user', NULL, '2024-08-22 21:29:11.533532', NULL);
INSERT INTO public.vulnerability VALUES (2, 'Healthcheck Instruction Missing', 'Ensure that HEALTHCHECK is being used. The HEALTHCHECK instruction tells Docker how to test a container to check that it is still working', 'https://docs.docker.com/engine/reference/builder/#healthcheck', NULL, '2024-08-22 21:29:11.643737', NULL);
INSERT INTO public.vulnerability VALUES (3, 'Generic API Key', NULL, NULL, NULL, '2024-08-22 21:29:14.690399', NULL);
INSERT INTO public.vulnerability VALUES (4, 'GCP API key', NULL, NULL, NULL, '2024-08-22 21:30:05.671353', NULL);
INSERT INTO public.vulnerability VALUES (5, 'Apt Get Install Pin Version Not Defined', 'When installing a package, its pin version should be defined', 'https://docs.docker.com/develop/develop-images/dockerfile_best-practices/', NULL, '2024-08-22 21:31:51.945053', NULL);
INSERT INTO public.vulnerability VALUES (6, 'Gem Install Without Version', 'Instead of ''gem install '' we should use ''gem install :''', 'https://docs.docker.com/develop/develop-images/dockerfile_best-practices/#run', NULL, '2024-08-22 21:31:52.273277', NULL);
INSERT INTO public.vulnerability VALUES (7, 'NPM Install Command Without Pinned Version', 'Check if packages installed by npm are pinning a specific version.', 'https://docs.docker.com/engine/reference/builder/#run', NULL, '2024-08-22 21:31:52.357414', NULL);
INSERT INTO public.vulnerability VALUES (8, 'Multiple RUN, ADD, COPY, Instructions Listed', 'Multiple commands (RUN, COPY, ADD) should be grouped in order to reduce the number of layers.', 'https://sysdig.com/blog/dockerfile-best-practices/', NULL, '2024-08-22 21:31:52.543359', NULL);
INSERT INTO public.vulnerability VALUES (9, 'APT-GET Not Avoiding Additional Packages', 'Check if any apt-get installs don''t use ''--no-install-recommends'' flag to avoid installing additional packages.', 'https://docs.docker.com/engine/reference/builder/#run', NULL, '2024-08-22 21:31:52.611145', NULL);
INSERT INTO public.vulnerability VALUES (10, 'Apt Get Install Lists Were Not Deleted', 'After using apt-get install, it is needed to delete apt-get lists', 'https://docs.docker.com/develop/develop-images/dockerfile_best-practices/', NULL, '2024-08-22 21:31:52.685637', NULL);
INSERT INTO public.vulnerability VALUES (11, 'Leakage of sensitive information in exception message', '## Description

Leakage of sensitive information in exception messages poses a significant security risk. When an exception message is printed to the default output, it might reveal sensitive details about your application''s technical setup or environment. This could potentially open the door to attacks, such as path traversal. Even more concerning is the possibility of exposing user-specific data, which could lead to serious privacy breaches.

## Remediations

- **Do not** print the full stack trace to the default output. This can inadvertently reveal sensitive information.
  ```java
  System.out.println(e); // unsafe
  ```
- **Do** limit error messages to only include the necessary information for understanding the issue without exposing sensitive data.
  ```java
  System.out.println("An error occurred. Please try again.");
  ```

## References

- [Web Application Security Consortium: Information Leakage](http://projects.webappsec.org/w/page/13246936/Information%20Leakage)', NULL, 'https://docs.bearer.com/reference/rules/java_lang_information_leakage', '2024-08-22 21:32:33.346865', NULL);
INSERT INTO public.vulnerability VALUES (12, 'Passwords And Secrets - Generic Secret', 'Query to find passwords and secrets in infrastructure code.', 'https://docs.kics.io/latest/secrets/', NULL, '2024-08-22 21:33:17.897481', NULL);
INSERT INTO public.vulnerability VALUES (13, 'Passwords And Secrets - Google API Key', 'Query to find passwords and secrets in infrastructure code.', 'https://docs.kics.io/latest/secrets/', NULL, '2024-08-22 21:33:17.950156', NULL);
INSERT INTO public.vulnerability VALUES (14, 'Usage of insufficient random value', '## Description

Using predictable random values compromises your application''s security, particularly if these values serve security-related functions.

## Remediations

- **Do** use a robust library for generating random values to enhance security.
  ```javascript
  const crypto = require(''crypto'');
  crypto.randomBytes(16).toString(''hex'');
  ```', NULL, 'https://docs.bearer.com/reference/rules/javascript_lang_insufficiently_random_values', '2024-08-22 21:34:31.020957', NULL);
INSERT INTO public.vulnerability VALUES (15, 'Leakage of information in logger message', '## Description

Information leakage through logger messages can compromise sensitive data. This vulnerability arises when dynamic data or variables, which may contain sensitive information, are included in log messages.

## Remediations

- **Do not** include sensitive data directly in logger messages. This can lead to the exposure of such data in log files, which might be accessible to unauthorized individuals.
  ```javascript
  logger.info(`Results: ${data}`) // unsafe
  ```
- **Do** use logging levels appropriately to control the verbosity of log output and minimize the risk of leaking sensitive information in production environments.', NULL, 'https://docs.bearer.com/reference/rules/javascript_lang_logger_leak', '2024-08-22 21:34:31.115176', NULL);
INSERT INTO public.vulnerability VALUES (16, 'Usage of hard-coded secret', '## Description

Applications should store secret values securely and not as literal values
in the source code.

## Remediations

✅ Retrieve secrets from a secure location at runtime

## Resources
- [OWASP hardcoded passwords](https://owasp.org/www-community/vulnerabilities/Use_of_hard-coded_password)
- [OWASP secrets management cheat sheet](https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html#21-high-availability)
', NULL, 'https://docs.bearer.com/reference/rules/java_lang_hardcoded_secret', '2024-08-22 21:34:41.837443', NULL);
INSERT INTO public.vulnerability VALUES (17, 'Missing or permissive SSL hostname verifier', '## Description

It is best security practice to always verify the hostname when establishing a SSL/TLS connection. Failure to do so exposes your application to Man-in-the-Middle attacks. This vulnerability arises when the application fails to confirm that the server''s hostname matches the hostname in the server''s SSL certificate.

## Remediations

- **Do not** use `ALLOW_ALL_HOSTNAME_VERIFIER` or any similarly permissive hostname verifiers. These verifiers do not properly check if the server''s hostname matches the SSL certificate, undermining the security of your connection.
  ```java
  HostnameVerifier hostnameVerifier = org.apache.http.conn.ssl.SSLSocketFactory.ALLOW_ALL_HOSTNAME_VERIFIER;
  HttpsURLConnection.setDefaultHostnameVerifier(hostnameVerifier); // unsafe
  ```', NULL, 'https://docs.bearer.com/reference/rules/java_lang_ssl_hostname_verifier', '2024-08-22 21:34:41.885474', NULL);
INSERT INTO public.vulnerability VALUES (18, 'Possible CLRF injection detected', '## Description

CRLF (Carriage Return Line Feed) injection vulnerability occurs when an attacker is able to insert a sequence of line termination characters into a log message. This can lead to forged log entries, compromising the integrity of log files.

## Remediations

- **Do** strip any carriage return and line feed characters from user input data before logging it. This prevents attackers from injecting malicious CRLF sequences.
  ```java
  logger.info(userInput.replaceAll("[\r\n]+", ""));
  ```

## References

- [OWASP CRLF Injection](https://owasp.org/www-community/vulnerabilities/CRLF_Injection)
- [OWASP Logging Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html)', NULL, 'https://docs.bearer.com/reference/rules/java_lang_crlf_injection', '2024-08-22 21:34:41.911029', NULL);
INSERT INTO public.vulnerability VALUES (19, 'Permissive cookie configuration', '## Description

Using overly permissive cookie settings can expose your application to security risks, such as unauthorized access or exploits.

## Remediations

- **Do not** set the cookie''s max age to -1. This persists the cookie until the browser session ends and is a security risk.
  ```java
  Cookie cookie = new Cookie("name", "value");
  cookie.setMaxAge(-1); // unsafe
  ```
- **Do not** set the cookie''s path to "/". This makes the cookie accessible to all paths in the domain. Such permissive cookie exposure is a security risk.
  ```java
  Cookie cookie = new Cookie("name", "value");
  cookie.setPath("/"); // unsafe
  ```
- **Do** set a limited maximum age for cookies to control their lifespan effectively.
  ```java
  Cookie cookie = new Cookie("name", "value");
  cookie.setMaxAge(3000);
  ```
- **Do** restrict the cookie''s path to limit its accessibility to specific parts of your application. This practice enhances security by reducing the cookie''s exposure.
  ```java
  Cookie cookie = new Cookie("name", "value");
  cookie.setPath("/my-cookie-path");
  ```', NULL, 'https://docs.bearer.com/reference/rules/java_lang_permissive_cookie_config', '2024-08-22 21:34:41.926689', NULL);
INSERT INTO public.vulnerability VALUES (20, 'Unsanitized user input in logger message', '## Description

Logging unsanitized user input can lead to log forgery or malicious content injection. This vulnerability arises when user input is directly included in log messages without proper sanitization.

## Remediations

- **Do not** include unsanitized user input in log messages. This can allow attackers to manipulate log files or inject harmful content.
  ```java
  String username = request.getParameter("username");
  log.warn("Username is" + username); // unsafe
  ```
- **Do** sanitize user input before logging it. Ensure that any data derived from user input is cleaned to prevent log injection attacks.
  ```java
  String username = sanitized(request.getParameter("username"));
  log.warn("Username is" + username);
  ```
## References

- [OWASP Log Injection](https://owasp.org/www-community/attacks/Log_Injection)
- [OWASP logging cheat sheet](https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html)', NULL, 'https://docs.bearer.com/reference/rules/java_lang_logger', '2024-08-22 21:34:42.008694', NULL);


--
-- Data for Name: finding; Type: TABLE DATA; Schema: public; Owner: flow_user
--

INSERT INTO public.finding VALUES (1, 1, NULL, 2, 'FROM={{openjdk:8u232-jdk-stretch}} - expected: The ''Dockerfile'' should contain the ''USER'' instruction', 'Dockerfile:1', 'HIGH', 'NEW', NULL, 'IAC', '2024-08-22 21:29:11.758927', '2024-08-22 21:29:11.759032', 2);
INSERT INTO public.finding VALUES (2, 2, NULL, 2, 'FROM={{openjdk:8u232-jdk-stretch}} - expected: Dockerfile should contain instruction ''HEALTHCHECK''', 'Dockerfile:1', 'LOW', 'NEW', NULL, 'IAC', '2024-08-22 21:29:11.775732', '2024-08-22 21:29:11.775851', 2);
INSERT INTO public.finding VALUES (3, 3, NULL, 2, 'Found Secret in file src/main/resources/bootstrap.yml. Full fingerprint: d8599d62f91bb38391cfdefd0cd40f949c28bf09:src/main/resources/bootstrap.yml:generic-api-key:7', 'src/main/resources/bootstrap.yml:7', 'CRITICAL', 'NEW', NULL, 'SECRETS', '2024-08-22 21:29:14.847986', '2024-08-22 21:29:14.848099', 2);
INSERT INTO public.finding VALUES (4, 3, NULL, 2, 'Found Secret in file src/main/resources/application.properties. Full fingerprint: e121ad3bb928895008cde7b8b8b953ea3a927d3c:src/main/resources/application.properties:generic-api-key:38', 'src/main/resources/application.properties:38', 'CRITICAL', 'NEW', NULL, 'SECRETS', '2024-08-22 21:29:14.867754', '2024-08-22 21:29:14.867937', 2);
INSERT INTO public.finding VALUES (5, 4, NULL, 4, 'Found Secret in file src/app/app.module.ts. Full fingerprint: c61e60e05b67e1ee53cb247a166dfbebb829e64c:src/app/app.module.ts:gcp-api-key:41', 'src/app/app.module.ts:41', 'CRITICAL', 'NEW', NULL, 'SECRETS', '2024-08-22 21:30:05.761193', '2024-08-22 21:30:05.761301', 4);
INSERT INTO public.finding VALUES (6, 1, NULL, 1, 'FROM={{postgres:11}} - expected: The ''Dockerfile'' should contain the ''USER'' instruction', 'Dockerfile:1', 'HIGH', 'NEW', NULL, 'IAC', '2024-08-22 21:30:52.024141', '2024-08-22 21:30:52.024257', 1);
INSERT INTO public.finding VALUES (7, 2, NULL, 1, 'FROM={{postgres:11}} - expected: Dockerfile should contain instruction ''HEALTHCHECK''', 'Dockerfile:1', 'LOW', 'NEW', NULL, 'IAC', '2024-08-22 21:30:52.040168', '2024-08-22 21:30:52.040445', 1);
INSERT INTO public.finding VALUES (8, 1, NULL, 6, 'FROM={{phusion/baseimage:0.9.17}} - expected: The ''Dockerfile'' should contain the ''USER'' instruction', 'Java/spring-thymeleaf-crud-example/src/main/resources/static/vendors/jquery-mask/Dockerfile:1', 'HIGH', 'NEW', NULL, 'IAC', '2024-08-22 21:31:52.776084', '2024-08-22 21:31:52.776744', 6);
INSERT INTO public.finding VALUES (9, 1, NULL, 6, 'FROM={{openjdk:11-jdk-slim}} - expected: The ''Dockerfile'' should contain the ''USER'' instruction', 'Java/spring-thymeleaf-crud-example/Dockerfile:16', 'HIGH', 'NEW', NULL, 'IAC', '2024-08-22 21:31:52.786441', '2024-08-22 21:31:52.786534', 6);
INSERT INTO public.finding VALUES (10, 5, NULL, 6, 'FROM={{phusion/baseimage:0.9.17}}.RUN={{echo oracle-java8-installer shared/accepted-oracle-license-v1-1 select true | debconf-set-selections &&   echo "deb http://dl.bintray.com/sbt/debian /" | tee -a /etc/apt/sources.list.d/sbt.list &&   add-apt-repository -y ppa:webupd8team/java &&   apt-get update &&   apt-get install -y oracle-java8-installer git unzip ruby-full &&   rm -rf /var/lib/apt/lists/* &&   rm -rf /var/cache/oracle-jdk8-installer}} - expected: Package ''git'' has version defined', 'Java/spring-thymeleaf-crud-example/src/main/resources/static/vendors/jquery-mask/Dockerfile:7', 'MEDIUM', 'NEW', NULL, 'IAC', '2024-08-22 21:31:52.806107', '2024-08-22 21:31:52.806237', 6);
INSERT INTO public.finding VALUES (11, 5, NULL, 6, 'FROM={{phusion/baseimage:0.9.17}}.RUN={{apt-get install --yes nodejs}} - expected: Package ''nodejs'' has version defined', 'Java/spring-thymeleaf-crud-example/src/main/resources/static/vendors/jquery-mask/Dockerfile:33', 'MEDIUM', 'NEW', NULL, 'IAC', '2024-08-22 21:31:52.817153', '2024-08-22 21:31:52.817232', 6);
INSERT INTO public.finding VALUES (12, 6, NULL, 6, 'FROM={{phusion/baseimage:0.9.17}}.{{RUN gem install bundler pry step-up --no-rdoc --no-ri}} - expected: RUN gem install bundler pry step-up --no-rdoc --no-ri is ''gem install <gem>:<version>''', 'Java/spring-thymeleaf-crud-example/src/main/resources/static/vendors/jquery-mask/Dockerfile:29', 'MEDIUM', 'NEW', NULL, 'IAC', '2024-08-22 21:31:52.838464', '2024-08-22 21:31:52.838562', 6);
INSERT INTO public.finding VALUES (13, 7, NULL, 6, 'FROM={{phusion/baseimage:0.9.17}}.{{RUN npm install -g grunt-cli}} - expected: ''RUN npm install -g grunt-cli'' uses npm install with a pinned version', 'Java/spring-thymeleaf-crud-example/src/main/resources/static/vendors/jquery-mask/Dockerfile:35', 'MEDIUM', 'NEW', NULL, 'IAC', '2024-08-22 21:31:52.850387', '2024-08-22 21:31:52.850479', 6);
INSERT INTO public.finding VALUES (14, 2, NULL, 6, 'FROM={{phusion/baseimage:0.9.17}} - expected: Dockerfile should contain instruction ''HEALTHCHECK''', 'Java/spring-thymeleaf-crud-example/src/main/resources/static/vendors/jquery-mask/Dockerfile:1', 'LOW', 'NEW', NULL, 'IAC', '2024-08-22 21:31:52.867218', '2024-08-22 21:31:52.867319', 6);
INSERT INTO public.finding VALUES (15, 2, NULL, 6, 'FROM={{openjdk:11-jdk-slim}} - expected: Dockerfile should contain instruction ''HEALTHCHECK''', 'Java/spring-thymeleaf-crud-example/Dockerfile:16', 'LOW', 'NEW', NULL, 'IAC', '2024-08-22 21:31:52.879764', '2024-08-22 21:31:52.879853', 6);
INSERT INTO public.finding VALUES (16, 8, NULL, 6, 'FROM={{phusion/baseimage:0.9.17}}.{{RUN mkdir /app}} - expected: There isn´t any RUN instruction that could be grouped', 'Java/spring-thymeleaf-crud-example/src/main/resources/static/vendors/jquery-mask/Dockerfile:19', 'LOW', 'NEW', NULL, 'IAC', '2024-08-22 21:31:52.891518', '2024-08-22 21:31:52.891605', 6);
INSERT INTO public.finding VALUES (17, 9, NULL, 6, 'FROM={{phusion/baseimage:0.9.17}}.{{RUN   echo oracle-java8-installer shared/accepted-oracle-license-v1-1 select true | debconf-set-selections &&   echo "deb http://dl.bintray.com/sbt/debian /" | tee -a /etc/apt/sources.list.d/sbt.list &&   add-apt-repository -y ppa:webupd8team/java &&   apt-get update &&   apt-get install -y oracle-java8-installer git unzip ruby-full &&   rm -rf /var/lib/apt/lists/* &&   rm -rf /var/cache/oracle-jdk8-installer}} - expected: ''RUN   echo oracle-java8-installer shared/accepted-oracle-license-v1-1 select true | debconf-set-selections &&   echo "deb http://dl.bintray.com/sbt/debian /" | tee -a /etc/apt/sources.list.d/sbt.list &&   add-apt-repository -y ppa:webupd8team/java &&   apt-get update &&   apt-get install -y oracle-java8-installer git unzip ruby-full &&   rm -rf /var/lib/apt/lists/* &&   rm -rf /var/cache/oracle-jdk8-installer'' uses ''--no-install-recommends'' flag to avoid installing additional packages', 'Java/spring-thymeleaf-crud-example/src/main/resources/static/vendors/jquery-mask/Dockerfile:7', 'INFO', 'NEW', NULL, 'IAC', '2024-08-22 21:31:52.900146', '2024-08-22 21:31:52.90022', 6);
INSERT INTO public.finding VALUES (18, 9, NULL, 6, 'FROM={{phusion/baseimage:0.9.17}}.{{RUN apt-get install --yes nodejs}} - expected: ''RUN apt-get install --yes nodejs'' uses ''--no-install-recommends'' flag to avoid installing additional packages', 'Java/spring-thymeleaf-crud-example/src/main/resources/static/vendors/jquery-mask/Dockerfile:33', 'INFO', 'NEW', NULL, 'IAC', '2024-08-22 21:31:52.910462', '2024-08-22 21:31:52.910542', 6);
INSERT INTO public.finding VALUES (19, 10, NULL, 6, 'FROM={{phusion/baseimage:0.9.17}}.RUN={{apt-get install --yes nodejs}} - expected: After using apt-get install, the apt-get lists should be deleted', 'Java/spring-thymeleaf-crud-example/src/main/resources/static/vendors/jquery-mask/Dockerfile:33', 'INFO', 'NEW', NULL, 'IAC', '2024-08-22 21:31:52.925125', '2024-08-22 21:31:52.925211', 6);
INSERT INTO public.finding VALUES (20, 11, NULL, 3, 'Code where problem is found:             e.printStackTrace();', '.mvn/wrapper/MavenWrapperDownloader.java:99', 'LOW', 'NEW', NULL, 'SAST', '2024-08-22 21:32:33.69766', '2024-08-22 21:32:33.697802', 3);
INSERT INTO public.finding VALUES (21, 11, NULL, 3, 'Code where problem is found:             ex.printStackTrace();', 'src/main/java/pl/orange/bst/fortifymixer/service/FortifyRestApiService.java:128', 'LOW', 'NEW', NULL, 'SAST', '2024-08-22 21:32:33.7253', '2024-08-22 21:32:33.725823', 3);
INSERT INTO public.finding VALUES (22, 1, NULL, 4, 'FROM={{nginx:alpine}} - expected: The ''Dockerfile'' should contain the ''USER'' instruction', 'Dockerfile:21', 'HIGH', 'NEW', NULL, 'IAC', '2024-08-22 21:33:18.065441', '2024-08-22 21:33:18.06553', 4);
INSERT INTO public.finding VALUES (23, 12, NULL, 4, ' - expected: Hardcoded secret key should not appear in source', 'secrets.json:9', 'HIGH', 'NEW', NULL, 'IAC', '2024-08-22 21:33:18.069236', '2024-08-22 21:33:18.069286', 4);
INSERT INTO public.finding VALUES (24, 13, NULL, 4, ' - expected: Hardcoded secret key should not appear in source', 'secrets.json:8', 'HIGH', 'NEW', NULL, 'IAC', '2024-08-22 21:33:18.076049', '2024-08-22 21:33:18.076099', 4);
INSERT INTO public.finding VALUES (25, 13, NULL, 4, ' - expected: Hardcoded secret key should not appear in source', 'secrets.json:9', 'HIGH', 'NEW', NULL, 'IAC', '2024-08-22 21:33:18.083743', '2024-08-22 21:33:18.083809', 4);
INSERT INTO public.finding VALUES (26, 7, NULL, 4, 'FROM={{node:10.16.3-jessie as builder}}.{{RUN npm i node-sass@latest}} - expected: ''RUN npm i node-sass@latest'' uses npm install with a pinned version', 'Dockerfile:16', 'MEDIUM', 'NEW', NULL, 'IAC', '2024-08-22 21:33:18.08653', '2024-08-22 21:33:18.086592', 4);
INSERT INTO public.finding VALUES (27, 2, NULL, 4, 'FROM={{nginx:alpine}} - expected: Dockerfile should contain instruction ''HEALTHCHECK''', 'Dockerfile:21', 'LOW', 'NEW', NULL, 'IAC', '2024-08-22 21:33:18.093175', '2024-08-22 21:33:18.093236', 4);
INSERT INTO public.finding VALUES (28, 14, NULL, 4, 'Code where problem is found:       botReply.reply.files[0].url = gifsLinks[Math.floor(Math.random() * gifsLinks.length)];', 'src/app/pages/extra-components/chat/chat.service.ts:27', 'LOW', 'NEW', NULL, 'SAST', '2024-08-22 21:34:31.15169', '2024-08-22 21:34:31.151773', 4);
INSERT INTO public.finding VALUES (29, 14, NULL, 4, 'Code where problem is found:       botReply.reply.files[0].url = imageLinks[Math.floor(Math.random() * imageLinks.length)];', 'src/app/pages/extra-components/chat/chat.service.ts:31', 'LOW', 'NEW', NULL, 'SAST', '2024-08-22 21:34:31.171873', '2024-08-22 21:34:31.172096', 4);
INSERT INTO public.finding VALUES (30, 14, NULL, 4, 'Code where problem is found:       botReply.reply.files[1].url = gifsLinks[Math.floor(Math.random() * gifsLinks.length)];', 'src/app/pages/extra-components/chat/chat.service.ts:35', 'LOW', 'NEW', NULL, 'SAST', '2024-08-22 21:34:31.184599', '2024-08-22 21:34:31.184681', 4);
INSERT INTO public.finding VALUES (31, 14, NULL, 4, 'Code where problem is found:       botReply.reply.files[2].url = imageLinks[Math.floor(Math.random() * imageLinks.length)];', 'src/app/pages/extra-components/chat/chat.service.ts:36', 'LOW', 'NEW', NULL, 'SAST', '2024-08-22 21:34:31.196398', '2024-08-22 21:34:31.196468', 4);
INSERT INTO public.finding VALUES (32, 14, NULL, 4, 'Code where problem is found:     botReply.reply.text = botReply.answerArray[Math.floor(Math.random() * botReply.answerArray.length)];', 'src/app/pages/extra-components/chat/chat.service.ts:39', 'LOW', 'NEW', NULL, 'SAST', '2024-08-22 21:34:31.204247', '2024-08-22 21:34:31.204322', 4);
INSERT INTO public.finding VALUES (33, 15, NULL, 4, 'Code where problem is found:   .catch(err => console.error(err));', 'src/main.ts:17', 'LOW', 'NEW', NULL, 'SAST', '2024-08-22 21:34:31.214121', '2024-08-22 21:34:31.21419', 4);
INSERT INTO public.finding VALUES (34, 16, NULL, 2, 'Code where problem is found: 	public static final String NESSUS_PLUGINDESCRIPTION = "plugindescription";', 'src/main/java/io/mixeway/config/Constants.java:164', 'CRITICAL', 'NEW', NULL, 'SAST', '2024-08-22 21:34:42.049653', '2024-08-22 21:34:42.049741', 2);
INSERT INTO public.finding VALUES (35, 16, NULL, 2, 'Code where problem is found: 	public static final String NEXPOSE_SITE_DESCRIPTION = "Automaticly generated site from MixingSecurity";', 'src/main/java/io/mixeway/config/Constants.java:184', 'CRITICAL', 'NEW', NULL, 'SAST', '2024-08-22 21:34:42.053502', '2024-08-22 21:34:42.053566', 2);
INSERT INTO public.finding VALUES (36, 17, NULL, 2, 'Code where problem is found:         sslContext.init(null, tms, new SecureRandom());', 'src/main/java/io/mixeway/pojo/SecureRestTemplate.java:87', 'HIGH', 'NEW', NULL, 'SAST', '2024-08-22 21:34:42.057366', '2024-08-22 21:34:42.057467', 2);
INSERT INTO public.finding VALUES (37, 18, NULL, 2, 'Code where problem is found:             logger.debug("JWT Token does not look like token "+ request.getRequestURI());', 'src/main/java/io/mixeway/rest/utils/JwtRequestFilter.java:58', 'MEDIUM', 'NEW', NULL, 'SAST', '2024-08-22 21:34:42.060774', '2024-08-22 21:34:42.060831', 2);
INSERT INTO public.finding VALUES (38, 19, NULL, 2, 'Code where problem is found:         role.setPath("/");', 'src/main/java/io/mixeway/rest/auth/service/AuthService.java:60', 'MEDIUM', 'NEW', NULL, 'SAST', '2024-08-22 21:34:42.064699', '2024-08-22 21:34:42.0648', 2);
INSERT INTO public.finding VALUES (39, 19, NULL, 2, 'Code where problem is found:         jwt.setPath("/");', 'src/main/java/io/mixeway/rest/auth/service/AuthService.java:63', 'MEDIUM', 'NEW', NULL, 'SAST', '2024-08-22 21:34:42.069191', '2024-08-22 21:34:42.069271', 2);
INSERT INTO public.finding VALUES (40, 19, NULL, 2, 'Code where problem is found:                     role.setPath("/");', 'src/main/java/io/mixeway/rest/auth/service/AuthService.java:90', 'MEDIUM', 'NEW', NULL, 'SAST', '2024-08-22 21:34:42.07338', '2024-08-22 21:34:42.073453', 2);
INSERT INTO public.finding VALUES (41, 19, NULL, 2, 'Code where problem is found:                     jwt.setPath("/");', 'src/main/java/io/mixeway/rest/auth/service/AuthService.java:93', 'MEDIUM', 'NEW', NULL, 'SAST', '2024-08-22 21:34:42.076565', '2024-08-22 21:34:42.076636', 2);
INSERT INTO public.finding VALUES (42, 11, NULL, 2, 'Code where problem is found:                     e.printStackTrace(new PrintStream(System.out));', 'src/main/java/io/mixeway/plugins/infrastructurescan/service/NetworkScanService.java:257', 'LOW', 'NEW', NULL, 'SAST', '2024-08-22 21:34:42.080918', '2024-08-22 21:34:42.081001', 2);
INSERT INTO public.finding VALUES (43, 11, NULL, 2, 'Code where problem is found:             e.printStackTrace();', 'src/main/java/io/mixeway/pojo/ScanHelper.java:175', 'LOW', 'NEW', NULL, 'SAST', '2024-08-22 21:34:42.083858', '2024-08-22 21:34:42.083925', 2);
INSERT INTO public.finding VALUES (44, 11, NULL, 2, 'Code where problem is found:             e.printStackTrace();', 'src/main/java/io/mixeway/rest/admin/service/AdminScannerRestService.java:73', 'LOW', 'NEW', NULL, 'SAST', '2024-08-22 21:34:42.08899', '2024-08-22 21:34:42.089063', 2);
INSERT INTO public.finding VALUES (45, 11, NULL, 2, 'Code where problem is found:             e.printStackTrace();', 'src/main/java/io/mixeway/rest/admin/service/AdminScannerRestService.java:103', 'LOW', 'NEW', NULL, 'SAST', '2024-08-22 21:34:42.092905', '2024-08-22 21:34:42.092998', 2);
INSERT INTO public.finding VALUES (46, 20, NULL, 2, 'Code where problem is found:             logger.debug("JWT Token does not look like token "+ request.getRequestURI());', 'src/main/java/io/mixeway/rest/utils/JwtRequestFilter.java:58', 'LOW', 'NEW', NULL, 'SAST', '2024-08-22 21:34:42.097816', '2024-08-22 21:34:42.097897', 2);
INSERT INTO public.finding VALUES (47, 15, NULL, 2, 'Code where problem is found: 		log.info("Creating json auth message for project: "+api.getTenantId());', 'src/main/java/io/mixeway/plugins/servicediscovery/openstack/apiclient/OpenStackApiClient.java:65', 'LOW', 'NEW', NULL, 'SAST', '2024-08-22 21:34:42.10151', '2024-08-22 21:34:42.101582', 2);
INSERT INTO public.finding VALUES (48, 15, NULL, 2, 'Code where problem is found:             logger.debug("JWT Token does not look like token "+ request.getRequestURI());', 'src/main/java/io/mixeway/rest/utils/JwtRequestFilter.java:58', 'LOW', 'NEW', NULL, 'SAST', '2024-08-22 21:34:42.106888', '2024-08-22 21:34:42.107004', 2);


--
-- Data for Name: scan_info; Type: TABLE DATA; Schema: public; Owner: flow_user
--

INSERT INTO public.scan_info VALUES (1, 1, 1, '96345a45d7fec29be66d5725dbaa651a7aa46dc5', '2024-08-22 21:30:52.861856', 'SUCCESS', 'SUCCESS', 'WARNING', 'SUCCESS', 0, 0, 0, 0, 1, 0, 0, 0);
INSERT INTO public.scan_info VALUES (2, 3, 3, '6da4ce6e2a5ff3d7ce2913e37a878ea22d8b17bc', '2024-08-22 21:32:34.77271', 'NOT_PERFORMED', 'SUCCESS', 'SUCCESS', 'SUCCESS', 0, 0, 0, 0, 0, 0, 0, 0);
INSERT INTO public.scan_info VALUES (3, 5, 5, 'c9b352f969ca79db0d4c804f815f3469d15f9e26', '2024-08-22 21:33:21.091533', 'NOT_PERFORMED', 'SUCCESS', 'SUCCESS', 'SUCCESS', 0, 0, 0, 0, 0, 0, 0, 0);
INSERT INTO public.scan_info VALUES (4, 4, 4, 'a4d6ecff5732c96f061b16d1c4c442106fd0940a', '2024-08-22 21:34:31.742132', 'NOT_PERFORMED', 'SUCCESS', 'WARNING', 'WARNING', 0, 0, 0, 0, 4, 0, 1, 1);
INSERT INTO public.scan_info VALUES (5, 2, 2, 'a8cc09f9452e47fd6b2071d853529d568eb1f9a1', '2024-08-22 21:34:42.347865', 'NOT_PERFORMED', 'DANGER', 'WARNING', 'DANGER', 0, 0, 3, 2, 1, 0, 2, 2);
INSERT INTO public.scan_info VALUES (6, 6, 6, '4fb9f47dfa66947b20d7b83c0666b27d1e233539', '2024-08-22 21:46:33.469057', 'NOT_PERFORMED', 'SUCCESS', 'WARNING', 'SUCCESS', 0, 0, 0, 0, 2, 0, 0, 0);



--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: flow_user
--

INSERT INTO public.users VALUES (2, '$2a$10$KtoPDiXK0qnn5kqcn1phK..ogkzljZmkwJU686o60jH8b6rT6xDNO', 'user', NULL, true, true);
INSERT INTO public.users VALUES (3, '$2a$10$LQuErsbpMCVb/3D2LoU9/epUKpXzUuqUJlexVVODcU1Mz2nDnB8xy', 'manager', NULL, true, true);


--
-- Data for Name: users_roles; Type: TABLE DATA; Schema: public; Owner: flow_user
--

INSERT INTO public.users_roles VALUES (2, 1);
INSERT INTO public.users_roles VALUES (3, 3);
INSERT INTO public.users_roles VALUES (3, 1);


--
-- Data for Name: users_teams; Type: TABLE DATA; Schema: public; Owner: flow_user
--


INSERT INTO public.users_teams (user_info_id, team_id) VALUES (1, 1);
INSERT INTO public.users_teams (user_info_id, team_id) VALUES (2, 1);
INSERT INTO public.users_teams (user_info_id, team_id) VALUES (1, 2);
INSERT INTO public.users_teams (user_info_id, team_id) VALUES (3, 2);
INSERT INTO public.users_teams (user_info_id, team_id) VALUES (1, 3);
INSERT INTO public.users_teams (user_info_id, team_id) VALUES (3, 3);
INSERT INTO public.users_teams (user_info_id, team_id) VALUES (2, 3);


--
-- Data for Name: vulnerability_component; Type: TABLE DATA; Schema: public; Owner: flow_user
--



--
-- Name: app_data_type_id_seq; Type: SEQUENCE SET; Schema: public; Owner: flow_user
--

SELECT pg_catalog.setval('public.app_data_type_id_seq', 25, true);


--
-- Name: code_repo_finding_stats_id_seq; Type: SEQUENCE SET; Schema: public; Owner: flow_user
--

SELECT pg_catalog.setval('public.code_repo_finding_stats_id_seq', 139, true);


--
-- Name: coderepo_branch_id_seq; Type: SEQUENCE SET; Schema: public; Owner: flow_user
--

SELECT pg_catalog.setval('public.coderepo_branch_id_seq', 6, true);


--
-- Name: coderepo_id_seq; Type: SEQUENCE SET; Schema: public; Owner: flow_user
--

SELECT pg_catalog.setval('public.coderepo_id_seq', 6, true);


--
-- Name: component_id_seq; Type: SEQUENCE SET; Schema: public; Owner: flow_user
--

SELECT pg_catalog.setval('public.component_id_seq', 1, false);


--
-- Name: finding_id_seq; Type: SEQUENCE SET; Schema: public; Owner: flow_user
--

SELECT pg_catalog.setval('public.finding_id_seq', 48, true);


--
-- Name: roles_id_seq; Type: SEQUENCE SET; Schema: public; Owner: flow_user
--

SELECT pg_catalog.setval('public.roles_id_seq', 3, true);


--
-- Name: scan_info_id_seq; Type: SEQUENCE SET; Schema: public; Owner: flow_user
--

SELECT pg_catalog.setval('public.scan_info_id_seq', 6, true);


--
-- Name: settings_id_seq; Type: SEQUENCE SET; Schema: public; Owner: flow_user
--

SELECT pg_catalog.setval('public.settings_id_seq', 1, true);


--
-- Name: team_id_seq; Type: SEQUENCE SET; Schema: public; Owner: flow_user
--

SELECT pg_catalog.setval('public.team_id_seq', 3, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: flow_user
--

SELECT pg_catalog.setval('public.users_id_seq', 3, true);


--
-- Name: vulnerability_id_seq; Type: SEQUENCE SET; Schema: public; Owner: flow_user
--

SELECT pg_catalog.setval('public.vulnerability_id_seq', 20, true);


--
-- PostgreSQL database dump complete
--
INSERT INTO users (username, password, active, reset_password)
VALUES
    ('team_user', '$2a$10$test', true, false),
    ('unauthorized_user', '$2a$10$test', true, false);

