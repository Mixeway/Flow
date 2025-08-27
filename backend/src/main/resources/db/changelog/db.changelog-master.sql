--liquibase formatted sql

--changeset siewer:init_db
-- Create tables
CREATE TABLE users (
                       id serial PRIMARY KEY,
                       password text,
                       username text,
                       api_key text,
                       reset_password boolean
);

CREATE TABLE roles (
                       id serial PRIMARY KEY,
                       name text
);

CREATE TABLE users_roles (
                             user_info_id int REFERENCES users(id),
                             roles_id int REFERENCES roles(id)
);

-- Create roles
INSERT INTO roles (name) VALUES ('USER');
INSERT INTO roles (name) VALUES ('ADMIN');
INSERT INTO roles (name) VALUES ('TEAM_MANAGER');

-- Create user
INSERT INTO users (username, password, api_key, reset_password)
VALUES ('admin', '$2a$12$XJjJYh1oVX33kPiS/JShlebp8WjRSl4.FsW9R5hBWt2IWzAtpCyQi', null, true);

-- Insert into users_roles table to assign all roles to the user
INSERT INTO users_roles (user_info_id, roles_id)
SELECT u.id, r.id
FROM users u, roles r
WHERE u.username = 'admin' AND r.name = 'USER';

INSERT INTO users_roles (user_info_id, roles_id)
SELECT u.id, r.id
FROM users u, roles r
WHERE u.username = 'admin' AND r.name = 'ADMIN';

INSERT INTO users_roles (user_info_id, roles_id)
SELECT u.id, r.id
FROM users u, roles r
WHERE u.username = 'admin' AND r.name = 'TEAM_MANAGER';


--changeset siewer:addteam
create table team (
    id serial primary key,
    name text,
    remote_identifier text
);

CREATE TABLE users_teams (
    user_info_id int REFERENCES users(id),
    team_id int REFERENCES team(id)
);

--changeset siewer:add_active_to_user

alter table users add column active boolean;
update users set active = true;

--changeset siewer:add_coderepo
CREATE TABLE coderepo (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL CHECK (name ~ '^[a-zA-Z0-9-]+$'),
    repourl VARCHAR(255) NOT NULL CHECK (repourl ~ '^https?://.+$'),
    access_token VARCHAR(255) NOT NULL,
    team_id BIGINT NOT NULL REFERENCES team(ID),
    inserted_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    languages JSONB,
    sast_scan VARCHAR(20) NOT NULL DEFAULT 'NOT_PERFORMED',
    sca_scan VARCHAR(20) NOT NULL DEFAULT 'NOT_PERFORMED',
    iac_scan VARCHAR(20) NOT NULL DEFAULT 'NOT_PERFORMED',
    secrets_scan VARCHAR(20) NOT NULL DEFAULT 'NOT_PERFORMED'
);


--changeset siewer:add_code_repo_branch
CREATE TABLE coderepo_branch (
    id SERIAL PRIMARY KEY,
    name VARCHAR(60) NOT NULL
);

ALTER TABLE coderepo
    ADD COLUMN default_branch_id BIGINT NOT NULL, ADD CONSTRAINT fk_default_branch
    FOREIGN KEY (default_branch_id) REFERENCES coderepo_branch(id);

ALTER TABLE coderepo add column remote_id BIGINT NOT NULL;

--changeset siewer:change_branch
ALTER TABLE coderepo_branch
    ADD COLUMN coderepo_id BIGINT NOT NULL;
ALTER TABLE coderepo_branch
    ADD CONSTRAINT fk_coderepo
        FOREIGN KEY (coderepo_id) REFERENCES coderepo(id);


alter table coderepo drop column default_branch_id;
ALTER TABLE coderepo
    ADD COLUMN default_branch_id BIGINT NOT NULL,
ADD CONSTRAINT fk_default_branch FOREIGN KEY (default_branch_id) REFERENCES coderepo_branch(id);

--changeset siewer:fix_branch

alter table coderepo drop column default_branch_id;
ALTER TABLE coderepo
    ADD COLUMN default_branch_id BIGINT,
ADD CONSTRAINT fk_default_branch FOREIGN KEY (default_branch_id) REFERENCES coderepo_branch(id);

--changeset siewer:add_finding_vuln_component
CREATE TABLE component (
                           id SERIAL PRIMARY KEY,
                           groupid VARCHAR(160),
                           name VARCHAR(160) NOT NULL,
                           version VARCHAR(120) NOT NULL,
                           inserted_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE vulnerability (
                               id SERIAL PRIMARY KEY,
                               name VARCHAR(60) NOT NULL UNIQUE,
                               description TEXT,
                               ref TEXT,
                               recommendation TEXT,
                               inserted_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE finding (
                         id SERIAL PRIMARY KEY,
                         vulnerability_id INTEGER NOT NULL,
                         component_id INTEGER,
                         coderepo_branch_id INTEGER NOT NULL,
                         explanation TEXT,
                         location VARCHAR(200) NOT NULL,
                         severity VARCHAR(20) NOT NULL,
                         status VARCHAR(20) NOT NULL DEFAULT 'NEW',
                         suppressed_reason VARCHAR(20),
                         source VARCHAR(20) NOT NULL,
                         inserted_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                         updated_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                         FOREIGN KEY (vulnerability_id) REFERENCES vulnerability (id),
                         FOREIGN KEY (component_id) REFERENCES component (id),
                         FOREIGN KEY (coderepo_branch_id) REFERENCES coderepo_branch (id),
                         CHECK (status <> 'SUPRESSED' OR suppressed_reason IS NOT NULL),
                         CHECK (status = 'SUPRESSED' OR suppressed_reason IS NULL)
);

--changeset siewer:add_finding_coderepo_link
ALTER TABLE finding ADD COLUMN coderepo_id BIGINT NOT NULL;

ALTER TABLE finding ADD CONSTRAINT fk_coderepo FOREIGN KEY (coderepo_id) REFERENCES coderepo(id);

--changeset siewer:add_components
ALTER TABLE component ADD COLUMN origin VARCHAR(30);

CREATE TABLE vulnerability_component (
    vulnerability_id BIGINT NOT NULL,
    component_id BIGINT NOT NULL,
    PRIMARY KEY (vulnerability_id, component_id),
    FOREIGN KEY (vulnerability_id) REFERENCES vulnerability(id),
    FOREIGN KEY (component_id) REFERENCES component(id)
);

CREATE TABLE coderepo_component (
    coderepo_id BIGINT NOT NULL,
    component_id BIGINT NOT NULL,
    PRIMARY KEY (coderepo_id, component_id),
    FOREIGN KEY (coderepo_id) REFERENCES coderepo(id),
    FOREIGN KEY (component_id) REFERENCES component(id)
);


--changeset siewer:change_vuln_name
ALTER TABLE vulnerability ALTER COLUMN name TYPE VARCHAR(200);

--changeset siewer:add_app_data_type
CREATE TABLE app_data_type (
    id SERIAL PRIMARY KEY,
    category_name VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    category_groups JSONB NOT NULL,
    location JSONB NOT NULL,
    coderepo_id INTEGER REFERENCES coderepo(id)
);

CREATE TABLE app_data_type_category_groups (
    app_data_type_id INTEGER REFERENCES app_data_type(id),
    category_group VARCHAR(255),
    PRIMARY KEY (app_data_type_id, category_group)
);

CREATE TABLE app_data_type_location (
    app_data_type_id INTEGER REFERENCES app_data_type(id),
    key VARCHAR(255),
    value VARCHAR(255),
    PRIMARY KEY (app_data_type_id, key)
);

--changeset siewer:fix
drop table app_data_type_category_groups;
drop table app_data_type_location;
drop table app_data_type;

CREATE TABLE app_data_type (
                               id SERIAL PRIMARY KEY,
                               category_name VARCHAR(255) NOT NULL,
                               name VARCHAR(255) NOT NULL,
                               location JSONB NOT NULL,
                               coderepo_id INTEGER REFERENCES coderepo(id)
);

CREATE TABLE app_data_type_category_groups (
                                               app_data_type_id INTEGER REFERENCES app_data_type(id),
                                               category_group VARCHAR(255),
                                               PRIMARY KEY (app_data_type_id, category_group)
);

CREATE TABLE app_data_type_location (
                                        app_data_type_id INTEGER REFERENCES app_data_type(id),
                                        key VARCHAR(255),
                                        value VARCHAR(255),
                                        PRIMARY KEY (app_data_type_id, key)
);

--changeset siewer:fix2
drop table app_data_type_category_groups;
drop table app_data_type_location;
drop table app_data_type;

CREATE TABLE app_data_type (
                               id SERIAL PRIMARY KEY,
                               category_name VARCHAR(255) NOT NULL,
                               name VARCHAR(255) NOT NULL,
                               coderepo_id INTEGER REFERENCES coderepo(id)
);

CREATE TABLE app_data_type_category_groups (
                                               app_data_type_id INTEGER REFERENCES app_data_type(id),
                                               category_group VARCHAR(255),
                                               PRIMARY KEY (app_data_type_id, category_group)
);

CREATE TABLE app_data_type_location (
                                        app_data_type_id INTEGER REFERENCES app_data_type(id),
                                        key VARCHAR(255),
                                        value VARCHAR(255),
                                        PRIMARY KEY (app_data_type_id, key)
);

--changeset siewer:add_finding_stats
CREATE TABLE code_repo_finding_stats (
                                         id SERIAL PRIMARY KEY,
                                         coderepo_id INTEGER NOT NULL,
                                         date_inserted TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                                         sast_critical INTEGER NOT NULL,
                                         sast_high INTEGER NOT NULL,
                                         sast_medium INTEGER NOT NULL,
                                         sast_rest INTEGER NOT NULL,
                                         sca_critical INTEGER NOT NULL,
                                         sca_high INTEGER NOT NULL,
                                         sca_medium INTEGER NOT NULL,
                                         sca_rest INTEGER NOT NULL,
                                         iac_critical INTEGER NOT NULL,
                                         iac_high INTEGER NOT NULL,
                                         iac_medium INTEGER NOT NULL,
                                         iac_rest INTEGER NOT NULL,
                                         secrets_critical INTEGER NOT NULL,
                                         secrets_high INTEGER NOT NULL,
                                         secrets_medium INTEGER NOT NULL,
                                         secrets_rest INTEGER NOT NULL,
                                         opened_findings INTEGER NOT NULL,
                                         removed_findings INTEGER NOT NULL,
                                         reviewed_findings INTEGER NOT NULL,
                                         average_fix_time INTEGER NOT NULL,
                                         FOREIGN KEY (coderepo_id) REFERENCES coderepo(id)
);
--changeset siewer:settings
DROP TABLE IF EXISTS settings;
CREATE TABLE settings (
                          id SERIAL PRIMARY KEY,
                          auth_type_user_pass BOOLEAN NOT NULL DEFAULT FALSE,
                          auth_type_oauth BOOLEAN NOT NULL DEFAULT FALSE,
                          oauth_app_name VARCHAR(255),
                          oauth_secret VARCHAR(255),
                          oauth_issuer_url VARCHAR(255),
                          sca_mode_embeded BOOLEAN NOT NULL DEFAULT FALSE,
                          sca_mode_external BOOLEAN NOT NULL DEFAULT FALSE,
                          sca_api_url VARCHAR(255),
                          sca_api_key VARCHAR(255),
                          smtp_hostname VARCHAR(255),
                          smtp_port INT,
                          smtp_username VARCHAR(255),
                          smtp_password VARCHAR(255),
                          smtp_tls BOOLEAN NOT NULL DEFAULT FALSE,
                          smtp_starttls BOOLEAN NOT NULL DEFAULT FALSE,
                          enable_smtp BOOLEAN NOT NULL DEFAULT FALSE
);
INSERT INTO settings (auth_type_user_pass, auth_type_oauth, sca_mode_embeded, sca_mode_external, smtp_tls, smtp_starttls, enable_smtp)
VALUES (FALSE, FALSE, true, FALSE, FALSE, FALSE, FALSE);
--changeset siewer:fix-settings
update settings set smtp_port=0;
--changeset siewer:add_sca_to_coderepo
alter table coderepo add column sca_uuid text;
--changeset siewer:link_vuln_component
alter table vulnerability add column severity VARCHAR(20);
--changeset siewer:change_component_version
alter table component alter column version TYPE VARCHAR(100);
--changeset siewer:create_scan_info
CREATE TABLE scan_info (
                           id SERIAL PRIMARY KEY,
                           coderepo_id BIGINT NOT NULL,
                           coderepo_branch_id BIGINT NOT NULL,
                           commit_id VARCHAR(40) NOT NULL,
                           inserted_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                           sca_scan_status VARCHAR(20) NOT NULL,
                           sast_scan_status VARCHAR(20) NOT NULL,
                           iac_scan_status VARCHAR(20) NOT NULL,
                           secrets_scan_status VARCHAR(20) NOT NULL,
                           sca_high INT NOT NULL,
                           sca_critical INT NOT NULL,
                           sast_high INT NOT NULL,
                           sast_critical INT NOT NULL,
                           iac_high INT NOT NULL,
                           iac_critical INT NOT NULL,
                           secrets_high INT NOT NULL,
                           secrets_critical INT NOT NULL,
                           CONSTRAINT fk_coderepo FOREIGN KEY (coderepo_id) REFERENCES coderepo(id),
                           CONSTRAINT fk_coderepo_branch FOREIGN KEY (coderepo_branch_id) REFERENCES coderepo_branch(id)
);
--changeset siewer:fixes
ALTER TABLE vulnerability ALTER COLUMN name TYPE VARCHAR(200);
alter table coderepo_branch alter column name TYPE VARCHAR(200);

--changeset siewer:constraints
alter table coderepo drop constraint if exists coderepo_name_check;

--changeset siewer:if_not_exists
ALTER TABLE coderepo ADD COLUMN IF NOT EXISTS type text;

--changeset siewer:change_type
ALTER TABLE finding ALTER COLUMN location TYPE TEXT;

--changeset siewer:threat-intel
ALTER TABLE vulnerability
    ADD COLUMN epss DECIMAL(15,10),
    ADD COLUMN epss_percentile DECIMAL(15,10),
    ADD COLUMN vector VARCHAR(255),
    ADD COLUMN updated_date TIMESTAMP;

--changeset siewer:threat-intel2
ALTER TABLE vulnerability ADD COLUMN IF NOT EXISTS exploit_exists BOOLEAN;
update vulnerability set exploit_exists=false;

--changeset siewer:supress-rule
CREATE TABLE suppress_rule (
                               id SERIAL PRIMARY KEY,
                               owner_id BIGINT NOT NULL,
                               scope VARCHAR(10) NOT NULL CHECK (scope IN ('GLOBAL', 'TEAM', 'PROJECT')),
                               vulnerability_id BIGINT NOT NULL,
                               team_id BIGINT,
                               coderepo_id BIGINT,
                               created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
                               FOREIGN KEY (owner_id) REFERENCES users(ID),
                               FOREIGN KEY (vulnerability_id) REFERENCES vulnerability(ID),
                               FOREIGN KEY (team_id) REFERENCES team(ID),
                               FOREIGN KEY (coderepo_id) REFERENCES coderepo(ID)
);

CREATE INDEX idx_suppress_rule_owner ON suppress_rule(owner_id);
CREATE INDEX idx_suppress_rule_vulnerability ON suppress_rule(vulnerability_id);
CREATE INDEX idx_suppress_rule_team ON suppress_rule(team_id);
CREATE INDEX idx_suppress_rule_coderepo ON suppress_rule(coderepo_id);

--changeset siewer:item-view
CREATE VIEW combined_items_view AS
SELECT
    c.id AS coderepo_id,
    v.name AS name,
    CASE
        WHEN
            (v.epss > 0.5)
                OR (v.epss > 0.2 AND v.epss < 0.5 AND COUNT(CASE WHEN adtcg.category_group = 'PII' THEN 1 END) > 0)
                OR (v.epss > 0.1 AND v.exploit_exists = TRUE)
                OR (MAX(CASE WHEN f.source IN ('IAC', 'SAST', 'SECRETS') AND f.severity = 'CRITICAL' THEN 1 ELSE 0 END) = 1)
            THEN 'urgent'
        WHEN
            ((v.epss > 0.1 AND v.epss < 0.5) AND COUNT(CASE WHEN adtcg.category_group = 'PII' THEN 1 END) = 0 AND v.exploit_exists = FALSE)
                OR (v.epss < 0.1 AND v.exploit_exists = TRUE)
                OR (MAX(CASE WHEN f.source IN ('IAC', 'SAST', 'SECRETS') AND f.severity = 'HIGH' THEN 1 ELSE 0 END) = 1)
            THEN 'notable'
        ELSE NULL
        END AS urgency,
    COUNT(DISTINCT c.id) AS count,
    v.epss AS epss,
    CASE WHEN COUNT(CASE WHEN adtcg.category_group = 'PII' THEN 1 END) > 0 THEN TRUE ELSE FALSE END AS pii,
    v.exploit_exists AS exploitAvailable,
    ARRAY_AGG(DISTINCT c.name) AS projectNames,
    ARRAY_AGG(DISTINCT c.id) AS projectIds
FROM finding f
         JOIN vulnerability v ON f.vulnerability_id = v.id
         JOIN coderepo c ON f.coderepo_id = c.id
         LEFT JOIN app_data_type adt ON adt.coderepo_id = c.id
         LEFT JOIN app_data_type_category_groups adtcg ON adtcg.app_data_type_id = adt.id
WHERE f.status IN ('NEW', 'EXISTING')
GROUP BY c.id, v.name, v.epss, v.exploit_exists
HAVING
    (v.epss > 0.5)
    OR (v.epss > 0.2 AND v.epss < 0.5 AND COUNT(CASE WHEN adtcg.category_group = 'PII' THEN 1 END) > 0)
    OR (v.epss > 0.1 AND v.exploit_exists = TRUE)
    OR ((v.epss > 0.1 AND v.epss < 0.5) AND COUNT(CASE WHEN adtcg.category_group = 'PII' THEN 1 END) = 0 AND v.exploit_exists = FALSE)
    OR (v.epss < 0.1 AND v.exploit_exists = TRUE)
    OR (MAX(CASE WHEN f.source IN ('IAC', 'SAST', 'SECRETS') AND f.severity = 'CRITICAL' THEN 1 ELSE 0 END) = 1)
    OR (MAX(CASE WHEN f.source IN ('IAC', 'SAST', 'SECRETS') AND f.severity = 'HIGH' THEN 1 ELSE 0 END) = 1);

--changeset siewer:change_location
ALTER TABLE finding ALTER COLUMN location TYPE VARCHAR(600);

--changeset siewer:indexes-no
CREATE INDEX idx_coderepofindingstats_dateinserted ON code_repo_finding_stats (date_inserted);
CREATE INDEX idx_coderepofindingstats_coderepoid ON code_repo_finding_stats (coderepo_id);

--changeset siewer:change-view
drop view combined_items_view;
CREATE VIEW combined_items_view AS
SELECT
    c.id AS coderepo_id,
    v.name AS name,
    CASE
        WHEN
            v.epss > 0.5
                OR (v.epss BETWEEN 0.2 AND 0.5 AND pii_flag = TRUE)
                OR (v.epss > 0.1 AND v.exploit_exists = TRUE)
                OR has_critical = TRUE
            THEN 'urgent'
        WHEN
            ((v.epss BETWEEN 0.1 AND 0.5) AND pii_flag = FALSE AND v.exploit_exists = FALSE)
                OR (v.epss < 0.1 AND v.exploit_exists = TRUE)
                OR has_high = TRUE
            THEN 'notable'
        ELSE NULL
        END AS urgency,
    COUNT(*) AS count,
    v.epss AS epss,
    pii_flag AS pii,
    v.exploit_exists AS exploitAvailable,
    ARRAY_AGG(DISTINCT c.name) AS projectNames,
    ARRAY_AGG(DISTINCT c.id) AS projectIds
FROM (
         SELECT
             f.coderepo_id,
             f.vulnerability_id,
             MAX(CASE WHEN f.source IN ('IAC', 'SAST', 'SECRETS') AND f.severity = 'CRITICAL' THEN 1 ELSE 0 END) = 1 AS has_critical,
             MAX(CASE WHEN f.source IN ('IAC', 'SAST', 'SECRETS') AND f.severity = 'HIGH' THEN 1 ELSE 0 END) = 1 AS has_high
         FROM finding f
         WHERE f.status IN ('NEW', 'EXISTING')
         GROUP BY f.coderepo_id, f.vulnerability_id
     ) AS sub_f
         JOIN vulnerability v ON sub_f.vulnerability_id = v.id
         JOIN coderepo c ON sub_f.coderepo_id = c.id
         LEFT JOIN LATERAL (
    SELECT EXISTS (
        SELECT 1
        FROM app_data_type adt
                 JOIN app_data_type_category_groups adtcg ON adtcg.app_data_type_id = adt.id
        WHERE adt.coderepo_id = c.id AND adtcg.category_group = 'PII'
    ) AS pii_flag
    ) AS pii_sub ON TRUE
WHERE
    v.epss > 0.1
   OR v.exploit_exists = TRUE
   OR sub_f.has_critical = TRUE
   OR sub_f.has_high = TRUE
GROUP BY
    c.id,
    v.name,
    v.epss,
    v.exploit_exists,
    pii_sub.pii_flag,
    sub_f.has_critical,
    sub_f.has_high
HAVING
    CASE
        WHEN
            v.epss > 0.5
                OR (v.epss BETWEEN 0.2 AND 0.5 AND pii_sub.pii_flag = TRUE)
                OR (v.epss > 0.1 AND v.exploit_exists = TRUE)
                OR sub_f.has_critical = TRUE
            THEN 'urgent'
        WHEN
            ((v.epss BETWEEN 0.1 AND 0.5) AND pii_sub.pii_flag = FALSE AND v.exploit_exists = FALSE)
                OR (v.epss < 0.1 AND v.exploit_exists = TRUE)
                OR sub_f.has_high = TRUE
            THEN 'notable'
        ELSE NULL
        END IS NOT NULL;

--changeset siewer:ddl_remove
CREATE TABLE IF NOT EXISTS public.coderepo_languages (
    coderepo_id     BIGINT                 NOT NULL,
    percent_of_code INTEGER,
    language        VARCHAR(255)           NOT NULL,
    CONSTRAINT coderepo_languages_pkey PRIMARY KEY (coderepo_id, language),
    CONSTRAINT fkssqutspukimdtipic5ne8in6q FOREIGN KEY (coderepo_id)
    REFERENCES public.coderepo(id)
    );

--changeset siewer:change-view-redo
DROP VIEW IF EXISTS combined_items_view;
CREATE VIEW combined_items_view AS
SELECT
    c.id AS coderepo_id,
    v.name AS name,
    CASE
        WHEN
            v.epss > 0.5
                OR (v.epss BETWEEN 0.2 AND 0.5 AND pii_flag = TRUE)
                OR (v.epss > 0.1 AND v.exploit_exists = TRUE)
                OR has_critical = TRUE
            THEN 'urgent'
        WHEN
            ((v.epss BETWEEN 0.1 AND 0.5) AND pii_flag = FALSE AND v.exploit_exists = FALSE)
                OR (v.epss < 0.1 AND v.exploit_exists = TRUE)
                OR has_high = TRUE
            THEN 'notable'
        ELSE NULL
        END AS urgency,
    COUNT(*) AS count,
    v.epss AS epss,
    pii_flag AS pii,
    v.exploit_exists AS exploitAvailable,
    ARRAY_AGG(DISTINCT c.name) AS projectNames,
    ARRAY_AGG(DISTINCT c.id) AS projectIds
FROM (
         SELECT
             f.coderepo_id,
             f.vulnerability_id,
             MAX(CASE WHEN f.source IN ('IAC', 'SAST', 'SECRETS') AND f.severity = 'CRITICAL' THEN 1 ELSE 0 END) = 1 AS has_critical,
             MAX(CASE WHEN f.source IN ('IAC', 'SAST', 'SECRETS') AND f.severity = 'HIGH' THEN 1 ELSE 0 END) = 1 AS has_high
         FROM finding f
         WHERE f.status IN ('NEW', 'EXISTING')
         GROUP BY f.coderepo_id, f.vulnerability_id
     ) AS sub_f
JOIN vulnerability v ON sub_f.vulnerability_id = v.id
JOIN coderepo c ON sub_f.coderepo_id = c.id
LEFT JOIN LATERAL (
    SELECT EXISTS (
        SELECT 1
        FROM app_data_type adt
        JOIN app_data_type_category_groups adtcg ON adtcg.app_data_type_id = adt.id
        WHERE adt.coderepo_id = c.id
          AND adtcg.category_group = 'PII'
    ) AS pii_flag
) AS pii_sub ON TRUE
WHERE
    v.epss > 0.1
    OR v.exploit_exists = TRUE
    OR sub_f.has_critical = TRUE
    OR sub_f.has_high = TRUE
GROUP BY
    c.id,
    v.name,
    v.epss,
    v.exploit_exists,
    pii_sub.pii_flag,
    sub_f.has_critical,
    sub_f.has_high
HAVING
    CASE
        WHEN
            v.epss > 0.5
                OR (v.epss BETWEEN 0.2 AND 0.5 AND pii_sub.pii_flag = TRUE)
                OR (v.epss > 0.1 AND v.exploit_exists = TRUE)
                OR sub_f.has_critical = TRUE
            THEN 'urgent'
        WHEN
            ((v.epss BETWEEN 0.1 AND 0.5) AND pii_sub.pii_flag = FALSE AND v.exploit_exists = FALSE)
                OR (v.epss < 0.1 AND v.exploit_exists = TRUE)
                OR sub_f.has_high = TRUE
            THEN 'notable'
        ELSE NULL
END IS NOT NULL;

-- changeset siewer:add-comment
CREATE TABLE comment (
                         id BIGSERIAL PRIMARY KEY,
                         message TEXT NOT NULL,
                         finding_id BIGINT NOT NULL,
                         user_id BIGINT NOT NULL,
                         created_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                         updated_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                         FOREIGN KEY (finding_id) REFERENCES finding(id),
                         FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Index for faster lookups
CREATE INDEX idx_comment_finding ON comment(finding_id);
CREATE INDEX idx_comment_user ON comment(user_id);

--changeset siewer:wiz
ALTER TABLE settings
    ADD COLUMN enable_wiz BOOLEAN NOT NULL DEFAULT FALSE,
ADD COLUMN wiz_secret VARCHAR(255),
ADD COLUMN wiz_client_id VARCHAR(255);

--changeset siewer:cloud-subscription
-- SQL to create the cloud_subscription table
CREATE TABLE cloud_subscription (
                                    id SERIAL PRIMARY KEY,
                                    name VARCHAR(255) NOT NULL,
                                    team_id BIGINT NOT NULL,
                                    CONSTRAINT fk_team FOREIGN KEY (team_id) REFERENCES team(id),
                                    CONSTRAINT uk_name_team UNIQUE (name, team_id)
);

--changeset majaberej:add_cloud_subscription_to_finding
ALTER TABLE finding
    ADD COLUMN cloud_subscription_id BIGINT NULL,
    ADD CONSTRAINT fk_cloud_subscription FOREIGN KEY (cloud_subscription_id) REFERENCES cloud_subscription(id);

--changeset majaberej:coderepo_coderepo_branch_null
ALTER TABLE finding
    ALTER COLUMN coderepo_branch_id DROP NOT NULL,
    ALTER COLUMN coderepo_id DROP NOT NULL;

--changeset majaberej:add_external_project_name_to_cloud_subscription
ALTER TABLE cloud_subscription
    ADD COLUMN external_project_name VARCHAR(255) NULL;

--changeset majaberej:add_scan_status_to_cloud_subscription
ALTER TABLE cloud_subscription
    ADD COLUMN scan_status VARCHAR(20) NOT NULL DEFAULT 'NOT_PERFORMED';

--changeset majaberej:add_cloud_scan_info_table
CREATE TABLE cloud_scan_info (
                           id BIGSERIAL PRIMARY KEY,
                           cloud_subscription_id BIGINT NOT NULL,
                           inserted_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                           scan_status VARCHAR(20) NOT NULL DEFAULT 'NOT_PERFORMED',
                           high_findings INT NOT NULL DEFAULT 0,
                           critical_findings INT NOT NULL DEFAULT 0,
                           CONSTRAINT fk_scan_info_cloud_subscription FOREIGN KEY (cloud_subscription_id) REFERENCES cloud_subscription(id)
);

--changeset majaberej:add_cloud_finding_stats
CREATE TABLE cloud_subscription_finding_stats (
                                         id SERIAL PRIMARY KEY,
                                         cloud_subscription_id INTEGER NOT NULL,
                                         date_inserted TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                                         critical_findings INTEGER NOT NULL,
                                         high_findings INTEGER NOT NULL,
                                         opened_findings INTEGER NOT NULL,
                                         removed_findings INTEGER NOT NULL,
                                         average_fix_time INTEGER NOT NULL,
                                         FOREIGN KEY (cloud_subscription_id) REFERENCES coderepo(id)
);

--changeset majaberej:update_cloud_finding_stats_fk
ALTER TABLE cloud_subscription_finding_stats
DROP CONSTRAINT cloud_subscription_finding_stats_cloud_subscription_id_fkey;

ALTER TABLE cloud_subscription_finding_stats
    ADD CONSTRAINT cloud_subscription_finding_stats_cloud_subscription_id_fkey
        FOREIGN KEY (cloud_subscription_id) REFERENCES cloud_subscription(id);

--changeset siewer:add_suppress_rule_path
ALTER TABLE suppress_rule ADD COLUMN path_regex VARCHAR(255);

--changeset siewer:add_saas_support
-- Create organization entity
CREATE TABLE organization (
                              id SERIAL PRIMARY KEY,
                              name TEXT NOT NULL,
                              created_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                              plan_type VARCHAR(20) NOT NULL CHECK (plan_type IN ('FREE', 'SMALL_COMPANY', 'ENTERPRISE')),
                              active BOOLEAN NOT NULL DEFAULT TRUE
);

-- Create organization_user join table
CREATE TABLE users_organizations (
                                     user_info_id INT REFERENCES users(id),
                                     organization_id INT REFERENCES organization(id),
                                     PRIMARY KEY (user_info_id, organization_id)
);

-- Modify team table to add optional organization reference
ALTER TABLE team ADD COLUMN organization_id INT REFERENCES organization(id);

-- Create table for plan limitations
CREATE TABLE plan_limits (
                             id SERIAL PRIMARY KEY,
                             plan_type VARCHAR(20) NOT NULL UNIQUE,
                             max_teams INT NOT NULL,
                             max_repos_per_team INT NOT NULL,
                             max_users_per_team INT NOT NULL
);

-- Insert plan limits
INSERT INTO plan_limits (plan_type, max_teams, max_repos_per_team, max_users_per_team)
VALUES
    ('FREE', 1, 5, 10),
    ('SMALL_COMPANY', 5, 10, 20),
    ('ENTERPRISE', 999999, 999999, 999999);

-- Application configuration for run mode
CREATE TABLE app_config (
                            id SERIAL PRIMARY KEY,
                            config_key VARCHAR(100) NOT NULL UNIQUE,
                            config_value VARCHAR(100) NOT NULL
);

-- Set default run mode to STANDALONE
INSERT INTO app_config (config_key, config_value)
VALUES ('RUN_MODE', 'STANDALONE');

-- changeset majaberej:add_repository_allowlist
CREATE TABLE repository_allowlist (
                                      id SERIAL PRIMARY KEY,
                                      repository_domain VARCHAR(255) NOT NULL UNIQUE,
                                      description VARCHAR(255),
                                      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                                      updated_at TIMESTAMP
);

-- changeset majaberej:update_code_repo_finding_stats
ALTER TABLE code_repo_finding_stats
    ADD COLUMN gitlab_critical INT NOT NULL DEFAULT 0,
    ADD COLUMN gitlab_high INT NOT NULL DEFAULT 0,
    ADD COLUMN gitlab_medium INT NOT NULL DEFAULT 0,
    ADD COLUMN gitlab_rest INT NOT NULL DEFAULT 0;

-- changeset majaberej:update_scan_info
ALTER TABLE scan_info
    ADD COLUMN gitlab_scan_status VARCHAR(20) NOT NULL DEFAULT 'NOT_PERFORMED',
    ADD COLUMN gitlab_critical INT NOT NULL DEFAULT 0,
    ADD COLUMN gitlab_high INT NOT NULL DEFAULT 0;

-- changeset majaberej:update_coderepo
ALTER TABLE coderepo
    ADD COLUMN gitlab_scan VARCHAR(20) NOT NULL DEFAULT 'NOT_PERFORMED';

-- changeset siewer:update_coderepo_dast
ALTER TABLE coderepo
    ADD COLUMN dast_scan VARCHAR(20) NOT NULL DEFAULT 'NOT_PERFORMED';

-- changeset siewer:update_scan_info_dast
ALTER TABLE scan_info
    ADD COLUMN dast_scan_status VARCHAR(20) NOT NULL DEFAULT 'NOT_PERFORMED',
    ADD COLUMN dast_critical INT NOT NULL DEFAULT 0,
    ADD COLUMN dast_high INT NOT NULL DEFAULT 0;

-- changeset siewrgrz:update_dast_finding_stats
ALTER TABLE code_repo_finding_stats
    ADD COLUMN dast_critical INT NOT NULL DEFAULT 0,
    ADD COLUMN dast_high INT NOT NULL DEFAULT 0,
    ADD COLUMN dast_medium INT NOT NULL DEFAULT 0,
    ADD COLUMN dast_rest INT NOT NULL DEFAULT 0;

--changeset siewrgrz:add_git_integration
create table repository_providers (
    id SERIAL PRIMARY KEY,
    provider_type text not null,
    api_url text not null,
    encrypted_access_token text not null,
    default_team_id int references team(id)
);

--changeset siewrgrz:modify_repo_providers
alter table repository_providers add column last_sync_date timestamp;
alter table repository_providers add column synced_repo_count int;

--changeset bondtom:create_constraint_table
create table constraint_table (
    id              bigserial primary key,
    text            text not null,
    vulnerability_id bigint not null references vulnerability(id)
);

create index idx_constraint_table_vulnerability_id on constraint_table(vulnerability_id);