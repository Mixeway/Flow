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
                           groupid VARCHAR(60),
                           name VARCHAR(60) NOT NULL,
                           version VARCHAR(20) NOT NULL,
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
