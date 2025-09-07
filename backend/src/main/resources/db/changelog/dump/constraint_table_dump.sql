--
-- PostgreSQL database dump
--

\restrict kJ8GbXNynEqTBgRQy6gQwky4RIdnnj404dceHJqZJT586IQGG0TDUSQz2rRCP7t

-- Dumped from database version 17.5 (Debian 17.5-1.pgdg120+1)
-- Dumped by pg_dump version 17.6

-- Started on 2025-09-07 18:17:44

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 273 (class 1259 OID 16897)
-- Name: constraint_table; Type: TABLE; Schema: public; Owner: flow_user
--

CREATE TABLE public.constraint_table (
    id bigint NOT NULL,
    text text NOT NULL,
    vulnerability_id bigint NOT NULL
);


ALTER TABLE public.constraint_table OWNER TO flow_user;

--
-- TOC entry 272 (class 1259 OID 16896)
-- Name: constraint_table_id_seq; Type: SEQUENCE; Schema: public; Owner: flow_user
--

CREATE SEQUENCE public.constraint_table_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.constraint_table_id_seq OWNER TO flow_user;

--
-- TOC entry 3488 (class 0 OID 0)
-- Dependencies: 272
-- Name: constraint_table_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: flow_user
--

ALTER SEQUENCE public.constraint_table_id_seq OWNED BY public.constraint_table.id;


--
-- TOC entry 3330 (class 2604 OID 16900)
-- Name: constraint_table id; Type: DEFAULT; Schema: public; Owner: flow_user
--

ALTER TABLE ONLY public.constraint_table ALTER COLUMN id SET DEFAULT nextval('public.constraint_table_id_seq'::regclass);


--
-- TOC entry 3482 (class 0 OID 16897)
-- Dependencies: 273
-- Data for Name: constraint_table; Type: TABLE DATA; Schema: public; Owner: flow_user
--

COPY public.constraint_table (id, text, vulnerability_id) FROM stdin;
3	A user account is assigned the "Maintainer" or "Owner" role.	1
4	The assigned "Maintainer" or "Owner" role is not strictly necessary for the user's responsibilities.	1
5	The system allows for actions (e.g., modifying critical configurations, deleting data, adding/removing other users) that can be performed by "Maintainer" or "Owner" roles.	1
6	There is a risk of an insider threat or account compromise where the elevated privileges could be misused.	1
7	The organization does not consistently apply the principle of least privilege in role assignments.	1
8	There are insufficient controls (e.g., auditing, multi-factor authentication) to mitigate the risks associated with highly privileged accounts.	1
9	Running on JDK 9+.	201
10	Spring MVC or Spring WebFlux application.	201
11	Application running on Tomcat.	201
12	WAR deployment.	201
13	Data binding is used.	201
14	The Dockerfile does not specify a USER instruction.	2
15	The container is run without an explicitly defined non-root user.	2
16	An attacker can execute commands within the container.	2
17	The application or system within the container performs actions that require root privileges or can be manipulated by a root user.	2
18	CMD or ENTRYPOINT uses shell form	3
19	Arguments contain untrusted or user-controlled input	3
20	Untrusted input includes shell metacharacters	3
21	Shell interprets metacharacters within the container	3
22	The container is managed by an orchestration platform (e.g., Kubernetes, Docker Swarm) that relies on health checks for automated recovery or traffic routing.	4
23	The application inside the container can enter a failed or non-responsive state while the main container process continues to run.	4
24	The container is part of a microservices architecture and other services depend on its health status to function correctly.	4
25	The application requires high availability, and there is a need to automatically restart or replace unhealthy instances.	4
26	The containerized application has external dependencies, such as databases or other services, that can fail and cause the application to malfunction.	4
27	`pip install` command is used	5
28	The command is executed within a Dockerfile	5
29	The `--no-cache-dir` flag is not specified in the `pip install` command	5
30	Hardcoded password or secret exists in a configuration file.	6
31	Hardcoded password or secret exists in the source code.	6
32	Use of default or easily guessable passwords.	6
33	Sensitive information is stored in plaintext.	6
34	Secrets are not managed using a dedicated secrets management tool.	6
35	Variable names related to secrets are easily identifiable (e.g., contain "password", "secret", "key").	6
36	Lack of automated scanning for secrets within the CI/CD pipeline.	6
37	Access to the code repository is not properly restricted.	6
38	Secrets are present in version control history.	6
39	Lack of a secret rotation mechanism.	6
40	Container is running with one or more Linux capabilities that are not required for its operation.	7
41	An attacker has gained the ability to execute code within the container.	7
42	The unnecessary capability can be abused to escalate privileges or escape the container's isolation.	7
43	The container is running as the root user.	7
44	The container has been configured with the --privileged flag.	7
45	The container has access to the host's process namespace (--pid=host).	7
46	The container has mounted sensitive host directories or the Docker socket.	7
47	The container is running with the CAP_SYS_ADMIN capability.	7
48	The container lacks a restrictive Seccomp or AppArmor profile.	7
49	Container port is published without being bound to a specific host IP address.	8
50	The host machine has multiple network interfaces.	8
51	Docker daemon is not configured to bind to a specific IP address by default.	8
52	No external firewall is configured to restrict traffic to the container from unintended network interfaces.	8
53	The container is running on a host where other services on the same network can route traffic to it.	8
54	Container is running in an orchestrated environment (e.g., Kubernetes, Docker Swarm).	9
55	Application inside the container can enter a failed or unresponsive state without the container's main process crashing.	9
56	The container is part of a service that is expected to be highly available.	9
57	There is no external monitoring system in place that can effectively determine the health of the application within the container and restart it.	9
58	The container is running a long-lived service (e.g., a web server, database).	9
59	The application within the container has dependencies on other services that can fail.	9
60	The application has complex startup procedures where it can appear to be running before it is fully functional.	9
61	Container memory limits are not defined.	10
62	The container is running on a system with finite memory resources.	10
63	The application within the container has the potential for high or unpredictable memory consumption.	10
64	No default memory limits are applied at the namespace or cluster level.	10
65	The host operating system's out-of-memory (OOM) killer is the only mechanism to reclaim memory.	10
66	The `pids_limit` is not set in the container configuration.	11
67	The value of `pids_limit` is set to -1, indicating an unlimited number of processes.	11
68	The host's kernel version is 4.3 or higher, which supports the PID cgroup limit.	11
69	The system is running in a containerized environment where a fork bomb could exhaust system resources.	11
70	An attacker has the ability to execute a process within the container that can rapidly fork new processes.	11
71	A port is mapped to the container.	12
72	The mapped port is in the privileged range 1-1023.	12
73	The container has the NET_BIND_SERVICE capability.	12
74	The code is running within a containerized environment (e.g., Docker, Podman).	13
75	The container runtime environment supports security options like SELinux, AppArmor, or seccomp.	13
76	The container is not explicitly configured with `security_opt` in its service definition (e.g., in a docker-compose.yml file) or via command-line arguments.	13
77	The container is running with the default security profile provided by the container runtime.	13
78	The application running inside the container has a vulnerability that can be leveraged for privilege escalation.	13
79	A process within the container attempts to execute a binary with setuid or setgid bits.	13
80	An attacker has found an exploitable vulnerability in the host's kernel.	13
81	The default seccomp profile of the container runtime allows the system calls necessary to exploit a kernel vulnerability.	13
82	The system is not using a security module like SELinux or AppArmor to confine the container.	13
83	The container is running as the root user.	13
84	Code is running in a containerized environment.	14
85	Container is not configured with CPU limits.	14
86	Multiple containers or processes share the same CPU resources on the host.	14
87	Container's workload is capable of consuming high CPU resources.	14
88	System has available CPU time for the container to consume.	14
89	Other services or applications are running on the same host and require CPU resources.	14
95	The API key must be exposed in a publicly accessible location (e.g., public repository, client-side code, public logs).	16
96	The API key must be valid and not revoked.	16
97	The API key must grant access to a sensitive or valuable resource or service.	16
98	The associated service or API endpoint must be accessible to the attacker.	16
99	The API key must have sufficient permissions to perform unauthorized actions.	16
100	There must be no effective rate limiting or monitoring to prevent misuse of the API key.	16
101	The API key must not be restricted to specific IP addresses or domains that the attacker cannot spoof.	16
102	An exception message is printed to the default output.	17
103	The full stack trace is printed.	17
104	Sensitive details about the application's technical setup or environment are revealed in the exception message.	17
105	User-specific data is exposed in the exception message.	17
106	Sensitive data is included in logger messages.	18
107	Dynamic data or variables containing sensitive information are included in log messages.	18
108	A logger message is generated with sensitive data.	18
109	Log files are accessible to unauthorized individuals.	18
110	Runner is configured to allow untagged jobs.	19
111	An untagged job can be submitted to the runner.	19
112	The untagged job contains malicious code or instructions.	19
113	The runner executes the untagged job.	19
114	The executed job has sufficient permissions to perform unauthorized changes or actions.	19
115	GCP API key is exposed in publicly accessible code or configuration.	20
116	GCP API key has permissions beyond the minimum required for its intended function.	20
117	GCP API key is used in client-side code without proper restrictions (e.g., IP restrictions, HTTP referrer restrictions).	20
118	GCP API key is committed to a version control system (e.g., Git) without proper protection.	20
119	GCP API key is stored in an insecure environment variable or configuration file.	20
120	GCP API key is logged or printed in application output.	20
121	GCP API key is used to access sensitive GCP services (e.g., Compute Engine, Cloud Storage, IAM).	20
122	GCP API key is not rotated regularly.	20
123	Runner is configured to allow unprotected jobs.	21
124	An unprotected job exists.	21
125	The unprotected job contains unauthorized changes or actions.	21
126	An attacker can trigger the execution of an unprotected job.	21
127	Runner is configured with an insecure executor type.	22
128	Runner is used in an environment requiring isolation (e.g., multi-tenant, untrusted code execution).	22
129	An attacker can execute arbitrary code on the runner.	22
130	The insecure executor type allows for privilege escalation or unauthorized access to resources.	22
131	1. The repository's top-level `README.md` file is missing or empty.	23
132	2. The repository's description field in its hosting platform's configuration is empty.	23
133	3. The repository's name is generic or does not clearly indicate its primary function.	23
134	4. No other prominent documentation files (e.g., `docs/`, `CONTRIBUTING.md`) within the repository provide an adequate overview of its purpose.	23
1250	Usage of `QuantizedRelu` function.	351
1251	Usage of `QuantizedRelu6` function.	351
1252	`min_features` input is nonscalar.	351
1253	`max_features` input is nonscalar.	351
1254	TensorFlow version is prior to 2.10.0.	351
1255	TensorFlow version is prior to 2.9.1 (if using 2.9.x branch).	351
135	5. The main application entry point or core module files lack introductory comments explaining the project's overall goal.	23
136	*   New users or contributors are unfamiliar with the project.	24
137	*   The project's purpose, setup, or usage is not self-evident from the code.	24
138	*   There is no alternative documentation source available.	24
139	*   The project is intended for public consumption or collaboration.	24
140	*   Developers need quick guidance on how to build, test, or deploy the code.	24
141	*   A security vulnerability exists in the project's code.	26
142	*   An external party discovers a security vulnerability in the project's code.	26
143	*   The external party attempts to report the discovered code vulnerability.	26
144	*   The absence of a SECURITY file hinders the responsible disclosure process for the code vulnerability.	26
145	The code must be deployed within or interact with the AWS ecosystem.	766
146	The code must utilize an AWS service or API.	766
147	The specific AWS service or API call must be invoked in a manner that triggers the vulnerability.	766
148	The AWS credentials used by the code must have permissions allowing the vulnerable operation.	766
149	An attacker must be able to influence the inputs or execution flow of the vulnerable code interacting with AWS.	766
150	The external repository contains malicious code.	27
151	The external repository is compromised by an attacker.	27
152	The project fetches dependencies without integrity verification.	27
153	The external repository provides vulnerable versions of dependencies.	27
154	An attacker can manipulate the dependency fetching process.	27
155	The external repository is not from a trusted source.	27
156	The project does not perform security scanning of its dependencies.	27
157	The project does not pin dependency versions, allowing vulnerable updates.	27
158	- A CI/CD pipeline is configured for the project/repository.	28
159	- A merge request is created.	28
160	- The CI/CD pipeline associated with the merge request fails.	28
161	- The system allows merging of the merge request despite the pipeline failure.	28
162	- The "Pipelines must succeed" or similar setting is not enforced.	28
163	1. The application uses random values.	31
164	2. The random values used are predictable (i.e., not cryptographically secure).	31
165	3. The predictable random values are used for security-related functions.	31
166	*   The project's `package.json` or `package-lock.json` (if not strictly enforced) specifies a dependency without a fixed version (e.g., using `^`, `~`, or no prefix).	32
167	*   A new, malicious, or vulnerable version of an unpinned dependency is published to the npm registry (or a private registry).	32
168	*   The `npm install` command (or equivalent package manager command) is executed, leading to the installation of the new, unpinned version.	32
169	*   The application's code directly or indirectly uses the functionality provided by the compromised version of the dependency.	32
170	*   The attacker has control over the published versions of a dependency or can compromise the npm registry/mirror.	32
171	Secret value is present in the source code.	34
172	Secret value is stored as a literal.	34
173	The application uses the hard-coded secret.	34
174	The source code is accessible to an attacker.	34
175	The hard-coded secret is used for sensitive operations.	34
176	Application establishes an SSL/TLS connection.	35
177	Application fails to confirm that the server's hostname matches the hostname in the server's SSL certificate.	35
178	Application uses a permissive hostname verifier.	35
179	Application uses `ALLOW_ALL_HOSTNAME_VERIFIER`.	35
180	Application uses `HttpsURLConnection.setDefaultHostnameVerifier()` with a permissive verifier.	35
181	Application logs user input.	36
182	User input is not sanitized for carriage return (`\\r`) and line feed (`\\n`) characters before logging.	36
183	Attacker can control input that is logged.	36
184	Cookie's max age is set to -1	37
185	Cookie's path is set to "/"	37
186	Usage of a logging mechanism.	38
187	Inclusion of user input in log messages.	38
188	User input is not sanitized before being included in log messages.	38
189	External input (dynamic or user-controlled) is used.	808
190	External input directly influences code generation or scripting functions.	808
191	External input is not properly sanitized.	808
192	The application executes the generated code.	808
193	Application must use Bouncy Castle for Java (bcprov or bc-fips).	801
194	Application must be processing ASN.1 data that includes Object Identifiers (OIDs).	801
195	Application must be using `org.bouncycastle.asn1.ASN1ObjectIdentifier.Java`.	801
196	Application must not implement its own resource limits or throttling for OID processing.	801
197	An attacker must be able to supply malformed or excessively large ASN.1 Object Identifier data.	801
198	The affected Bouncy Castle for Java version must be within the range: BC 1.0 through 1.77, BC-FJA 1.0.0 through 1.0.2.5, or BC-FJA 2.0.0 through 2.0.0.	801
199	Sensitive information (passwords, API keys, tokens) is stored.	29
200	GitLab CI/CD variables are used for storing sensitive information.	29
201	An attacker has access to project settings.	29
202	Sensitive information is exposed through logs or debugging output.	29
1881	Input tensor is empty	491
203	Sensitive information is not encrypted at rest.	29
204	Sensitive information is visible in plain text to project maintainers.	29
205	Project visibility is set to 'Public'	30
206	Project visibility is set to 'Internal'	30
207	Sensitive information is present in the project	30
208	Intellectual property is present in the project	30
209	Internal processes are documented/present in the project	30
210	Unauthorized users have access to the 'Public' or 'Internal' project	30
211	Container registry repository exists.	33
212	Access control for the Container registry repository is not configured.	33
213	Unauthorized users attempt to access container images.	33
214	Container images are stored in the repository.	33
215	The following constraints must be met for CVE-2024-30172 to be exploitable:	802
216	*   The application must be using Bouncy Castle Java Cryptography APIs.	802
217	*   The version of Bouncy Castle Java Cryptography APIs must be before 1.78 (specifically, versions from 1.73 up to, but not including, 1.78).	802
218	*   The application must be performing Ed25519 signature verification.	802
219	*   A crafted signature must be provided to the Ed25519 verification process.	802
220	*   A crafted public key must be provided to the Ed25519 verification process.	802
221	Bouncy Castle Java TLS API or JSSE Provider must be in use.	213
222	Version of Bouncy Castle Java TLS API or JSSE Provider must be prior to 1.78.	213
223	RSA based handshakes must be performed.	213
224	Exception processing must occur during RSA based handshakes.	213
225	An attacker must be able to measure timing differences in handshake processing.	213
226	Usage of Bouncy Castle Java (BC Java) before 1.78	214
227	Usage of BC Java LTS before 2.73.6	214
228	Usage of BC-FJA before 1.0.2.5	214
229	Usage of BC C# .Net before 2.3.1	214
230	Importing an EC certificate	214
231	The EC certificate must contain crafted F2m parameters	214
232	Endpoint identification is enabled in BCJSSE.	215
233	An SSL socket is created without an explicit hostname.	215
234	HttpsURLConnection is used.	215
235	DNS poisoning is possible.	215
236	Usage of `eval` or similar code execution functions.	809
237	Usage of unsanitized user input.	809
238	Direct use of external input in code execution functions.	809
239	Usage of `ast.literal_eval()`.	809
240	Usage of unsanitized user input with `ast.literal_eval()`.	809
241	Attacker provides deeply nested structures (for `ast.literal_eval` specific exploitation).	809
242	*   Application uses Eclipse Jetty.	803
243	*   Jetty version is between 12.0.0 and 12.0.16 (inclusive).	803
244	*   Jetty server is configured to use HTTP/2.	803
245	*   An HTTP/2 client connects to the Jetty server.	803
246	*   The HTTP/2 client specifies a very large value for the `SETTINGS_MAX_HEADER_LIST_SIZE` parameter.	803
247	Jetty must be used.	804
248	ThreadLimitHandler must be in use.	804
249	The getRemote() method within ThreadLimitHandler must be invoked by crafted requests.	804
250	Attacker must be able to send repeated crafted requests.	804
251	The attacker must be an unauthorized user.	804
252	Netplex Json-smart version 2.5.0 or 2.5.1 is used.	805
253	The application processes JSON input from an untrusted source.	805
254	The JSON input contains a large number of '{' characters.	805
255	The application is susceptible to stack exhaustion.	805
256	Usage of Spring Framework.	204
257	Application uses `disallowedFields` for data binding.	204
258	Application uses setter binding.	204
259	`declarativeBinding` flag is not turned off.	204
260	Application is using an affected version of Spring Framework (6.2.0 - 6.2.6, 6.1.0 - 6.1.19, 6.0.0 - 6.0.27, 5.3.0 - 5.3.42, or older unsupported versions).	204
261	Usage of `DataBinder`.	806
262	Configuration of `disallowedFields` patterns in `DataBinder`.	806
263	Internal use of `String.toLowerCase()` for case-insensitive matching of `disallowedFields` patterns.	806
264	Application's locale (or the locale used by `String.toLowerCase()`) must trigger locale-dependent exceptions in `String.toLowerCase()`.	806
265	An attempt to bind a field that should be disallowed but is not due to the locale-dependent `toLowerCase()` behavior.	806
266	The application is deployed as a WAR or with an embedded Servlet container.	206
267	The Servlet container does not reject suspicious sequences.	206
268	The application serves static resources with Spring resource handling.	206
269	The application parses ETags.	251
270	The application parses "If-Match" request headers.	251
271	The application parses "If-None-Match" request headers.	251
272	The application does not enforce a size limit on "If-Match" headers.	251
273	The application does not enforce a size limit on "If-None-Match" headers.	251
274	The application initiates an outgoing connection.	810
275	The connection uses the HTTP protocol (e.g., `http://`).	810
276	The connection is made to an external API or resource.	810
277	The code executes OS commands.	811
278	The OS command includes dynamic input.	811
279	The dynamic input is external or user-defined.	811
2106	Usage of TFLite	546
280	The external or user-defined input is not sanitized.	811
281	There are no constraints that must be met for the "Lack of CONTRIBUTING file" to be exploitable in the code, as this is not a code vulnerability.	25
282	Usage of UriComponentsBuilder in Spring Framework	807
283	Parsing of an externally provided URL (e.g., through a query parameter)	807
284	Performing validation checks on the host of the parsed URL	807
285	The URL is used after passing validation checks	807
286	Applications use UriComponentsBuilder	253
287	UriComponentsBuilder parses an externally provided URL	253
288	The externally provided URL is, for example, through a query parameter	253
289	Application performs validation checks on the host of the parsed URL	253
290	The URL is used after passing validation checks (for SSRF)	253
291	Usage of dynamic input (user-provided)	812
292	Direct use of dynamic input to construct file paths	812
293	Lack of proper validation or sanitization of the input	812
294	Absence of `os.path.normpath` for path normalization	812
295	Absence of absolute path checks to confirm the path is within the expected directory	812
296	The header is prepared with org.springframework.http.ContentDisposition.	254
297	The filename is set via ContentDisposition.Builder#filename(String, Charset).	254
298	The value for the filename is derived from user-supplied input.	254
299	The application does not sanitize the user-supplied input.	254
300	The downloaded content of the response is injected with malicious commands by the attacker.	254
301	Spring Framework version is 6.0.x as of 6.0.5, 6.1.x, or 6.2.x.	254
302	The charset used is non-ASCII.	254
303	Usage of the `random` module in Python.	813
304	Generation of secrets, tokens, or other security-sensitive elements.	813
305	Usage of `random` for cryptographic purposes (e.g., key generation, authentication tokens, security challenges).	813
306	Initialization of `random` with predictable seeds (e.g., timestamps, easily guessable values).	813
307	Regular expressions are constructed directly from user input.	814
308	The regular expression used exhibits exponential time complexity (is a "catastrophic" regex).	814
309	The application does not implement a timeout mechanism for regular expression processing.	814
310	Using the `adm-zip` npm library.	52
311	Version of `adm-zip` library is before 0.4.9.	52
312	Application extracts a Zip archive.	52
313	Zip archive contains an entry with `../` (dot dot slash) in its path.	52
314	`adm-zip` library mishandles the `../` sequence during extraction.	52
315	The vulnerability CVE-2021-23424 affects all versions of the `ansi-html` package. It is a Regular Expression Denial of Service (ReDoS) flaw. An attacker can exploit this by providing a specially crafted malicious string as input. This malicious string, when processed by the `ansi-html` package, will cause it to get stuck for an extremely long time, leading to a denial of service condition. The vulnerability arises from catastrophic backtracking in a regular expression used within the package.	54
316	Here are the constraints that must be met for CVE-2021-23424 to be exploitable in the code:	54
317	*   The application must be using the `ansi-html` package.	54
318	*   The application must process user-controlled input.	54
319	*   The user-controlled input must be passed to the `ansi-html` package for processing.	54
320	*   The attacker must be able to provide a specially crafted malicious string that triggers the ReDoS vulnerability in the `ansi-html` package.	54
321	The following constraints must be met for CVE-2021-3807 to be exploitable in the code:	55
322	*   The code must use the `ansi-regex` package.	55
323	*   The `ansi-regex` package must be an affected version (e.g., versions < 3.0.1, < 4.1.1, < 5.0.1, or < 6.0.1).	55
324	*   The application must process user-controlled or untrusted input through the `ansi-regex` regular expression.	55
325	*   The input must contain specially crafted invalid ANSI escape codes that trigger inefficient regular expression complexity (catastrophic backtracking).	55
326	*   Specifically, the input should leverage the vulnerable sub-patterns `[[\\\\]()#;?]*` and `(?:;[-a-zA-Z\\\\d\\\\/#&.:=?%@~_]*)*` to cause excessive backtracking.	55
327	Async library is used.	56
328	Async version is <= 2.6.4 or <= 3.2.5.	56
329	The `autoinject` function is used.	56
330	The `autoinject` function is parsing a function.	56
331	The regular expressions within the parsing function in `autoinject` are processing untrusted input.	56
332	Usage of the 'Async' library.	57
333	Async library version is before 2.6.4 (for 2.x branch) or before 3.2.2 (for 3.x branch).	57
334	The `mapValues()` method is used in the code.	57
335	A malicious user can provide untrusted input that is processed by `mapValues()`.	57
336	Vulnerable `@babel/traverse` version (prior to 7.23.2 or 8.0.0-alpha.4, or any `babel-traverse` version)	58
337	Compiling attacker-crafted code	58
338	Usage of plugins relying on `path.evaluate()` or `path.evaluateTruthy()`	58
339	Usage of `@babel/plugin-transform-runtime`	58
340	Usage of `@babel/preset-env` with `useBuiltIns` option enabled	58
341	Usage of any "polyfill provider" plugin depending on `@babel/helper-define-polyfill-provider`	58
342	Usage of `babel-plugin-polyfill-corejs3`	58
343	Usage of `babel-plugin-polyfill-corejs2`	58
344	Usage of `babel-plugin-polyfill-es-shims`	58
345	Usage of `babel-plugin-polyfill-regenerator`	58
346	Compiling untrusted code	58
347	`braces` package is used.	63
348	`braces` package version is prior to 3.0.3.	63
349	User-controlled input is passed to the `braces` package.	63
350	The input contains "imbalanced braces".	63
351	The application is running in an environment with limited memory or where memory exhaustion can lead to a denial of service.	63
352	Usage of the `browserify-sign` package.	64
353	Version of `browserify-sign` is prior to 4.2.2.	64
354	The code performs DSA verification.	64
355	The `dsaVerify` function within `browserify-sign` is called.	64
356	DSA verification involves user-input signatures.	64
357	Application uses the `browserslist` package.	65
358	`browserslist` package version is between 4.0.0 and 4.16.4 (inclusive).	65
359	Application parses user-controlled or untrusted queries using `browserslist`.	65
360	Attacker can supply a malicious regular expression as a query.	65
361	Here are the constraints that must be met for CVE-2020-7746 (Chart.js - Prototype Pollution) to be exploitable in the code:	66
362	*   The application must be using Chart.js versions prior to 2.9.4.	66
363	*   The application must process user-controlled input that is passed as the `options` parameter (or `dataset` parameter) to Chart.js.	66
364	*   The Chart.js library must perform a deep merge operation of user-defined options with existing or default options without proper sanitization of the keys being set.	66
365	*   An attacker must be able to inject properties, specifically the `__proto__` property, into the `options` (or `dataset`) object.	66
366	Package `cross-spawn` is used.	68
367	Version of `cross-spawn` is before 6.0.6 or between 7.0.0 and 7.0.5 (exclusive of 7.0.5).	68
368	User-controlled input is passed to `cross-spawn` functions.	68
369	The input string is not properly sanitized before being processed by regular expressions within `cross-spawn`.	68
370	An attacker can provide a very large and well-crafted string as input.	68
371	crypto-js library is in use	69
372	The PRNG within crypto-js is used in a security-sensitive context	69
373	The application relies on the unpredictability of the PRNG for security	69
374	An attacker can observe or influence the output of the PRNG	69
375	The version of crypto-js is affected by CVE-2020-36732	69
376	Elliptic package must be used.	78
377	Elliptic package version must be 6.5.2.	78
378	Application must be running in a Node.js environment.	78
379	Application must be performing ECDSA signature operations.	78
380	Application must rely on a single canonical signature.	78
381	crypto-js library is used.	70
382	crypto-js version is prior to 4.2.0.	70
383	PBKDF2 function is used.	70
384	PBKDF2 is configured to use SHA1 (default).	70
385	PBKDF2 is configured with one iteration (default).	70
386	PBKDF2 is used to protect passwords.	70
387	PBKDF2 is used to generate signatures.	70
388	Usage of the `css-what` package.	71
389	Version of `css-what` package is before 2.1.3.	71
390	The `parse` function of the `css-what` package is called.	71
391	Untrusted input is passed to the `parse` function.	71
392	The `re_attr` variable (containing the insecure regex) is processed during parsing.	71
393	Usage of the `decode-uri-component` library.	72
394	Version 0.2.0 of `decode-uri-component` is in use.	72
395	The application processes untrusted input through `decode-uri-component`.	72
396	The input is not properly validated before being passed to `decode-uri-component`.	72
397	The following constraints must be met for CVE-2021-1639 to be exploitable:	168
398	*   The target system must be running an affected version of Microsoft Visual Studio or Visual Studio Code.	168
399	*   User interaction is required for exploitation.	168
400	*   The attacker must have local access to the system.	168
401	*   The attack requires high complexity.	168
402	*   Package `dns-packet` is used.	73
403	*   Version of `dns-packet` is prior to 5.2.2.	73
404	*   `allocUnsafe` is used to create buffers.	73
405	*   Buffers created with `allocUnsafe` are not fully filled.	73
406	*   Network packets are formed using these unfilled buffers.	73
407	*   The application queries crafted invalid domain names.	73
408	*   Network communication is unencrypted.	73
409	*   Usage of the `dot-prop` library.	74
410	*   Processing of untrusted input that can be used to manipulate object properties.	74
411	*   Lack of proper input sanitization or validation before passing data to `dot-prop` functions.	74
412	*   Insufficient restriction on the size or amount of resources influenced by user input.	74
413	*   The application's logic allows prototype pollution to lead to excessive resource consumption (e.g., memory, CPU).	74
414	Usage of the `engine.io` package (directly or indirectly via `socket.io`)	82
415	Application is running a Node.js process	82
416	Engine.IO server is exposed to receive HTTP requests	82
417	Engine.IO version is older than 3.6.1 or 6.2.1	82
418	A specially crafted HTTP request is sent to the Engine.IO server	82
419	Engine.IO must be used	83
420	Engine.IO version must be before 4.0.0	83
421	Long polling transport must be enabled	83
422	Application must accept POST requests to the long polling transport	83
423	Presence of multiple, consecutive RUN instructions.	292
424	Presence of multiple, consecutive ADD instructions.	292
425	Presence of multiple, consecutive COPY instructions.	292
426	Presence of a mix of multiple, consecutive RUN, ADD, or COPY instructions.	292
427	Usage of the `es5-ext` library.	84
428	Usage of the `function#copy` method.	84
429	Usage of the `function#toStringTokens` method.	84
430	Passing functions with very long names to `function#copy` or `function#toStringTokens`.	84
431	Passing functions with complex default argument names to `function#copy` or `function#toStringTokens`.	84
432	The `es5-ext` version must be prior to v0.10.63.	84
433	The software in use must be eventsource/eventsource.	85
434	The version of eventsource/eventsource must be prior to v2.0.2.	85
435	Sensitive information must be processed by the eventsource library.	85
436	The eventsource library must attempt to store or transfer the sensitive information.	85
437	The sensitive information must not be properly removed before storage or transfer.	85
438	`allowPrivilegeEscalation` is set to `true` in the container's security context.	265
439	The container is running as a non-root user.	265
440	The container has access to and can execute a `setuid` or `setgid` binary.	265
441	The container's parent process has higher privileges than the container.	265
442	Using the `follow-redirects` NPM package.	90
443	Version of `follow-redirects` is prior to 1.14.8.	90
444	Sensitive information is being processed (stored or transferred) by `follow-redirects`.	90
445	The sensitive information is not properly removed before storage or transfer.	90
446	The following constraints must be met for CVE-2022-0155 to be exploitable:	91
447	*   The application uses the `follow-redirects` package.	91
448	*   The application initiates an HTTP request to a remote URL.	91
449	*   The HTTP request includes a `Cookie` header or other sensitive information in the request body.	91
450	*   The remote server responds with an HTTP redirect (a `Location` header).	91
451	*   The redirect target URL is on a different domain than the original request.	91
452	*   The `follow-redirects` package version is prior to 1.14.7.	91
453	Usage of the `glob-parent` package.	92
454	`glob-parent` package version must be less than 5.1.2.	92
455	The application processes user-controlled or untrusted input that is passed to `glob-parent`.	92
456	The input string contains path separators within an enclosure that `glob-parent` attempts to parse.	92
457	Using the `handlebars` package.	93
458	`handlebars` package version is prior to 4.7.7.	93
459	Compiling templates.	93
460	Templates originate from an untrusted source.	93
461	Specific compiling options are selected during compilation.	93
462	A sensitive host directory is mounted into the container.	266
463	The container has write access to the mounted sensitive host directory.	266
464	The mounted sensitive host directory contains critical system files (e.g., `/etc`, `/root`, `/var/lib/docker`).	266
465	The container runs with elevated privileges (e.g., `privileged: true`, `CAP_SYS_ADMIN`).	266
466	The container's application or a malicious process within the container attempts to read from or write to the mounted sensitive host directory.	266
467	The mounted sensitive host directory contains credentials or configuration files that can be leveraged for privilege escalation or unauthorized access.	266
468	Application uses Hawk library.	94
469	Hawk library version is prior to 9.0.1.	94
470	Application processes the `Host` HTTP header using `Hawk.utils.parseHost()`.	94
471	`Hawk.authenticate()` is called without `options` containing `host` and `port`.	94
472	Attacker can control the `Host` HTTP header.	94
473	Usage of the `hoek` node module.	95
474	`hoek` module version is before 4.2.0 or 5.0.x before 5.0.3.	95
475	Usage of the `merge` function from the `hoek` module.	95
476	Usage of the `applyToDefaults` function from the `hoek` module.	95
477	User-controlled input is passed to `merge` or `applyToDefaults` functions.	95
478	The user-controlled input contains `__proto__`.	95
479	- Package `http-cache-semantics` is used.	97
480	- Version of `http-cache-semantics` is before 4.1.1.	97
481	- Server reads cache policy from the request using the `http-cache-semantics` library.	97
482	- Malicious request header values are sent to the server.	97
483	Usage of the `http-proxy-middleware` package.	98
484	Version of `http-proxy-middleware` is before 2.0.7 or between 3.0.0 and 3.0.3 (exclusive of 3.0.3).	98
485	The application is running on Node.js.	98
486	The application processes requests to paths that trigger an `UnhandledPromiseRejection` error within `micromatch` via `http-proxy-middleware`.	98
487	The following constraints must be met for CVE-2018-3739 to be exploitable in the code:	99
488	The application uses the `https-proxy-agent` or `http-proxy-agent` library.	99
489	The version of `https-proxy-agent` is prior to 2.2.0 (or `http-proxy-agent` prior to 2.1.0).	99
490	The `auth` option (or `proxy.auth`) of the `https-proxy-agent` is derived from unsanitized user input.	99
491	The unsanitized user input is passed to the `Buffer()` constructor.	99
492	An attacker can provide a large numeric value to the `auth` option, causing the `Buffer()` constructor to allocate excessive memory, leading to a Denial of Service (DoS).	99
493	For uninitialized memory exposure, the Node.js runtime version must be prior to 8.x.	99
494	Usage of the `pbkdf2` library.	133
495	`pbkdf2` library version <= 3.1.2.	133
496	Application performs signature validation using `pbkdf2`.	133
497	Application is vulnerable to improper input validation when using `pbkdf2`.	133
498	Attacker can provide specially crafted input to exploit improper input validation.	133
499	*   Usage of the `ip` package for Node.js.	100
500	*   Version of the `ip` package is before 1.1.9.	100
501	*   Application performs Server-Side Request Forgery (SSRF) or similar operations involving IP address validation.	100
502	*   Application uses the `isPublic` function from the `ip` package to validate IP addresses.	100
503	*   Application processes user-controlled input that can be crafted into specific IP address formats (e.g., 0x7f.1) that are improperly categorized as public by the vulnerable `isPublic` function.	100
504	`apt-get install` command is used.	293
505	`--no-install-recommends` flag is not used with `apt-get install`.	293
506	The vulnerability description for CVE-2022-46175 outlines several conditions that must be met for the vulnerability to be exploitable. These constraints are derived directly from the text provided and confirmed by the search results.	102
507	Here is a list of constraints for CVE-2022-46175 to be exploitable:	102
508	Usage of the `JSON5.parse` method.	102
509	JSON5 library version is 1.0.1 or earlier, or 2.2.1 or earlier.	102
510	Input JSON string contains a key named `__proto__`.	102
511	The object returned by `JSON5.parse` is subsequently used in a security-sensitive operation.	102
512	The application does not adequately filter or sanitize keys from the object returned by `JSON5.parse`.	102
513	The following constraints must be met for CVE-2022-0437 to be exploitable:	103
514	*   The application must be using NPM package `karma` version prior to 6.3.14.	103
515	*   The `returnUrl` query parameter must be present and used in the application's client-side code.	103
516	*   User-controlled input from the `returnUrl` query parameter must be processed by a JavaScript sink that supports dynamic code execution (e.g., `innerHTML`, `eval()`) without proper sanitization.	103
517	*   An attacker must craft a malicious URL containing an XSS payload in the `returnUrl` parameter.	103
518	*   A user must visit the malicious URL, causing their browser to execute the injected script.	103
519	Using the 'karma' package.	104
520	'karma' package version is prior to 6.3.16.	104
521	Usage of the `return_url` query parameter.	104
522	Missing validation of the `return_url` query parameter.	104
523	kind-of library version 6.0.2 is in use.	105
524	External user input is processed by ctorName in index.js.	105
525	The external user input contains a conflicting name that can overwrite internal attributes.	105
526	A crafted payload is used to manipulate the type detection result by overwriting a builtin attribute (e.g., 'constructor': {'name':'Symbol'}).	105
527	webpack loader-utils must be used.	106
528	webpack loader-utils version must be 2.0.0.	106
529	Function interpolateName in interpolateName.js must be called.	106
530	The resourcePath variable in interpolateName.js must be controlled by an attacker.	106
531	webpack loader-utils version 2.0.0 is in use.	107
532	Function interpolateName in interpolateName.js is being used.	107
533	The 'url' variable in interpolateName.js is being processed with a malicious regular expression.	107
534	- Usage of `webpack loader-utils`	108
535	- Version of `loader-utils` is prior to 1.4.1 or prior to 2.0.3	108
536	- The `parseQuery` function in `parseQuery.js` is called	108
537	- The `name` variable in `parseQuery.js` is user-controlled	108
538	A container must be running.	267
539	The container must have a volume mount.	267
540	The mounted volume must be a sensitive folder from the host OS.	267
541	The container must have write permissions to the mounted volume.	267
542	The sensitive folder must contain critical host configurations or binaries.	267
543	lodash node module must be used.	112
544	lodash version must be before 4.17.5.	112
545	One of the functions defaultsDeep, merge, or mergeWith must be used.	112
546	A malicious user must be able to control input passed to defaultsDeep, merge, or mergeWith.	112
547	The controlled input must contain "__proto__" as a key.	112
548	The following constraints must be met for the "Container Running As Root" vulnerability to be exploitable:	268
549	The Dockerfile or container image configuration specifies `USER root` or omits the `USER` instruction.	268
550	The Kubernetes PodSpec or container runtime configuration sets `securityContext.runAsUser: 0` or does not set `securityContext.runAsNonRoot: true`.	268
551	The application code or its dependencies contain a separate vulnerability (e.g., RCE, command injection) allowing an attacker to execute arbitrary commands within the container.	268
552	The container's security context or runtime configuration grants elevated Linux capabilities (e.g., `CAP_SYS_ADMIN`, `CAP_DAC_OVERRIDE`).	268
553	The container's volume mounts include sensitive host paths (e.g., `/var/run/docker.sock`, `/proc`, `/sys`).	268
554	Affected versions of log4js-node are in use.	113
555	The 'file', 'fileSync', or 'dateFile' appenders are used.	113
556	The application is running on a Unix-like operating system.	113
557	Log files contain sensitive information.	113
558	The 'mode' parameter for file permissions is not explicitly set in the log4js-node configuration.	113
559	Usage of Marked library.	114
560	Marked library version is prior to 4.0.10.	114
561	Processing untrusted markdown input.	114
562	Not using a worker with a time limit when processing markdown.	114
563	micromatch package is used	115
564	micromatch version is prior to 4.0.8	115
565	micromatch.braces() function is called	115
566	A malicious payload is passed to micromatch.braces()	115
567	Container is running with a UID that is considered "low" (e.g., < 1000).	269
568	A user or process on the host system uses the same low UID as the container.	269
569	The container has sufficient privileges or access to interact with host resources where the UID conflict can be leveraged.	269
570	The host system is not configured with user namespace remapping or other isolation mechanisms that prevent UID conflicts from being exploitable.	269
571	Usage of moment.js library.	117
572	Using string-to-date parsing in moment.	117
573	rfc2822 parsing is tried (by default).	117
574	Passing user-provided strings to moment constructor.	117
575	Lack of sanity length checks on user-provided strings.	117
576	Input string length above 10k characters.	117
577	Moment.js version is older than 2.29.4.	117
578	*   Moment.js library is used.	118
579	*   Moment.js version is between 1.0.1 and 2.29.1 (inclusive).	118
580	*   The application is an npm (server) application.	118
581	*   A user-provided locale string is directly used to switch the Moment.js locale.	118
582	*   The code is deployed within a containerized environment (e.g., Docker, Kubernetes).	270
583	*   The container's memory limits are not explicitly defined.	270
584	*   The application running within the container consumes an uncontrolled or excessive amount of memory.	270
585	*   The container shares memory resources with other containers or the host system.	270
586	*   Excessive memory consumption by the container leads to resource exhaustion on the host or impacts other services.	270
587	Usage of the 'ms' package.	119
588	Processing of user-controlled input by the 'ms' package.	119
589	Lack of input validation or sanitization before processing by 'ms'.	119
590	The specific regular expression within 'ms' must be vulnerable to ReDoS.	119
591	node-sass must be used.	125
592	node-sass version must be between 2.0.0 and 4.14.1 (inclusive).	125
593	The application must be requesting binaries.	125
594	The following constraints must be met for CVE-2021-3803 to be exploitable:	128
595	*   The application must use the `nth-check` NodeJS module.	128
596	*   The version of `nth-check` in use must be prior to 2.0.1.	128
597	*   The application must process user-controlled or untrusted input that is passed to the `nth-check` library's parsing functionality, specifically `nth-check.parse()`.	128
598	*   The crafted input must be a specially-crafted invalid CSS nth-check string designed to trigger inefficient regular expression complexity (ReDoS).	128
599	Container is deployed without memory requests defined.	271
600	Multiple containers/pods are scheduled on the same node.	271
601	The node experiences memory resource contention.	271
602	Workloads within the container have unpredictable or burstable memory usage.	271
603	*   The `path-parse` package is used in the codebase.	130
604	*   The version of `path-parse` is vulnerable (e.g., prior to 1.0.7).	130
605	*   The application processes untrusted or user-controlled input as file paths.	130
606	*   The untrusted input is passed to functions within `path-parse` that utilize the `splitDeviceRe`, `splitTailRe`, or `splitPathRe` regular expressions.	130
607	*   An attacker can craft a malicious file path to trigger excessive backtracking in the regular expressions.	130
608	The `pbkdf2` library must be in use.	132
609	The version of `pbkdf2` must be between 3.0.10 and 3.1.2, inclusive.	132
610	The code must be performing input validation that can lead to signature spoofing.	132
611	The vulnerability is associated with the `lib/to-buffer.Js` program file.	132
612	The container is configured to retain the `NET_RAW` capability.	272
613	Malicious code is executed within the container.	272
614	The malicious code attempts to create and utilize raw sockets.	272
615	The following constraints must be met for the "Apt Get Install Lists Were Not Deleted" vulnerability to be exploitable in the code:	294
616	*   The code executes `apt-get install` or `apt install`.	294
617	*   The code does not execute `apt-get clean` or `apt-get autoclean` after `apt-get install`.	294
618	*   The code does not explicitly delete files within `/var/lib/apt/lists/` after `apt-get install`.	294
619	*   The target system where the code runs uses `apt` for package management.	294
620	1. Usage of the Socket.io js library.	147
621	2. Attachment parsing functionality must be present and utilized.	147
622	3. Attacker must be able to provide a malicious attachment.	147
623	4. The application must process the attachment in a way that allows overwriting the `_placeholder` object.	147
624	5. The application must then use the resulting query object in a context where arbitrary function references can lead to undesirable execution.	147
625	*   Application is deployed in a container orchestration environment (e.g., Kubernetes).	273
626	*   Application takes time to initialize and become ready to serve requests.	273
627	*   Service is configured to route traffic to the application instance.	273
628	*   Application relies on external dependencies that may not be immediately available upon startup.	273
629	*   Application is part of a larger system where other services depend on its availability.	273
630	*   Application instances are subject to rolling updates or scaling events.	273
631	PostCSS version is before 8.4.31	134
632	Application is a linter	134
633	Application uses PostCSS for parsing	134
634	Application parses external untrusted CSS	134
635	The application uses the `postcss` package.	135
636	The version of `postcss` is greater than or equal to 7.0.0 and less than 8.2.10.	135
637	The application processes source maps using `postcss`.	135
638	An attacker can provide malicious input that triggers the ReDoS in the source map parsing.	135
639	*   The application uses the `postcss` package.	136
640	*   The version of `postcss` used is prior to 8.2.13.	136
641	*   The application processes CSS or source maps that invoke `getAnnotationURL()` or `loadAnnotation()` functions.	136
642	*   The input data contains a string matching the vulnerable regex pattern `\\/\\*\\s* sourceMappingURL=(.*)` in a way that triggers ReDoS.	136
643	npm CLI version is prior to 6.13.3	126
644	A malicious package is being installed	126
645	The malicious package utilizes the `bin` field in `package.json`	126
646	The malicious package utilizes `install scripts`	126
647	npm CLI version is prior to 6.13.3	127
648	A malicious package with a crafted `bin` field in `package.json` is installed	127
649	A malicious package with an `install script` is installed	127
650	The vulnerability "Seccomp Profile Is Not Configured" means that a container is not configured with a secure Seccomp profile, which could allow it to make potentially dangerous system calls. For this vulnerability to be exploitable in the code, the following constraints must be met:	274
651	*   An attacker must achieve arbitrary code execution within the container.	274
652	*   The executed code must attempt to perform a system call that would be restricted by a secure Seccomp profile.	274
653	*   The container must be configured to run without a Seccomp profile or with a custom, overly permissive profile.	274
654	Usage of the `scss-tokenizer` package.	138
655	The `loadAnnotation()` function must be called.	138
656	Input processed by `loadAnnotation()` must contain a malicious regular expression pattern.	138
657	*   Usage of the `tmp` library for Node.js.	164
658	*   `tmp` library version 0.2.3 or below.	164
659	*   The `dir` parameter of the `tmp` library is user-controlled or influenced.	164
660	*   The attacker can create a symbolic link in a location that the `tmp` library will attempt to write to.	164
661	serialize-javascript package version is less than 2.1.1	141
662	Regular expression objects are serialized	141
663	Serialized data is used in an environment other than Node.js	141
664	Serialized data is rendered in a web browser context	141
665	Application uses Socket.IO.	144
666	Application runs a Socket.IO server.	144
667	Socket.IO server processes incoming Socket.IO packets.	144
668	Socket.IO version is older than 4.6.2 (for 4.x branch).	144
669	Socket.IO 2.x branch version does not include commit `d30630ba10`.	144
670	Socket.IO server does not have a listener for the "error" event.	144
671	The vulnerability CVE-2022-22976 in Spring Security is exploitable under the following conditions:	800
672	*   The application uses Spring Security versions 5.5.x prior to 5.5.7, 5.6.x prior to 5.6.4, or earlier unsupported versions.	800
673	*   The application uses the `BCrypt` class for password encoding.	800
674	*   The `BCryptPasswordEncoder` is configured with the maximum work factor (31).	800
675	*   The default settings are not in use, as they are not affected by this CVE.	800
676	- Usage of `socket.io parser`	145
677	- `socket.io parser` version is prior to 4.2.3	145
678	- Application is running a Socket.IO server	145
679	- Server is exposed to receive Socket.IO packets	145
680	- Server is running on Node.js	145
681	*   Usage of `socket.io-parser`	146
682	*   `socket.io-parser` version is before 3.4.1	146
683	*   Application is exposed to untrusted input	146
684	*   Ability to send large packets	146
685	*   `socket.io-parser` uses a concatenation approach for packet handling	146
686	serviceAccountName attribute is not defined	275
687	serviceAccountName attribute is empty	275
688	The vulnerability CVE-2020-7693 is exploitable under the following conditions:	148
689	*   The application uses the `sockjs` package.	148
690	*   The `sockjs` package version is prior to 0.3.20.	148
691	*   The application is hosted in containers.	148
692	*   An "Upgrade" header with the value "websocket" is sent to the `sockjs` application.	148
693	*   The `sockjs` application attempts to call `res.end()` instead of `res.write()` when processing the websocket upgrade request.	148
694	ssri version between 5.2.2 and 8.0.0 (inclusive)	149
695	Usage of the ssri library	149
696	Processing of Subresource Integrity (SRI) hashes	149
697	The 'strict' option must be enabled when using ssri	149
698	Processing of a maliciously crafted SRI string	149
699	TinyMCE version is 4.7.11 or 4.7.12.	163
700	The TinyMCE Media element component is in use.	163
701	The application allows user input into the Media element's embed tab.	163
702	The application does not properly neutralize input from the Media element's embed tab before rendering it.	163
703	A user pastes malicious content into the Media element's embed tab.	163
704	*   It must be a WebFlux application	248
705	*   It must be using Spring's static resources support	248
706	*   It must have a non-permitAll authorization rule applied to the static resources support	248
707	The software must be using the `node-tar` library.	150
708	The version of `node-tar` must be prior to 6.2.1.	150
709	The system must be processing a tar archive from an untrusted source (e.g., attacker-controlled).	150
710	The processed tar archive must contain a path with an excessively deep sub-folder structure.	150
711	Usage of the npm package "tar" (aka node-tar)	152
712	Version of node-tar is before 4.4.16, 5.0.8, or 6.1.7 (or any v3 release)	152
713	Extraction of a tar file containing a directory and a symlink with the same name as the directory	152
714	Symlink and directory names in the archive entry use backslashes as a path separator on POSIX systems	152
715	Target system is a POSIX system	152
716	Extraction of a tar file containing a directory at `FOO` followed by a symbolic link named `foo`	152
717	Target system has a case-insensitive filesystem	152
718	The application uses the `node-tar` (npm package "tar") library.	151
719	The version of `node-tar` is prior to 6.1.1, 5.0.6, 4.4.14, or 3.3.2.	151
720	The `preservePaths` flag is not set to `true` during tar extraction.	151
721	The tar archive being processed contains file paths with repeated path roots (e.g., `////home/user/.bashrc`).	151
722	The application extracts files from untrusted tar archives.	151
723	Usage of the npm package "tar" (aka node-tar)	153
724	Version of "tar" is before 6.1.2, 5.0.7, 4.4.15, or 3.2.3	153
725	Extraction of a tar file containing both a directory and a symlink with the same name as the directory	153
726	The directory is created and added to the `node-tar` directory cache	153
727	The directory is subsequently replaced by a symlink with the same name	153
728	An attacker must gain control of the pod.	276
729	The service account associated with the pod must have permissions that an attacker could abuse.	276
730	The application within the pod does not explicitly require the service account token for its legitimate operation.	276
731	Spring Security version 5.7.x prior to 5.7.8, 5.8.x prior to 5.8.3, or 6.0.x prior to 6.0.3 is in use.	245
732	Serialized versions of the security context are being used.	245
733	Logout support is implemented in the application.	245
734	The application uses `HttpSessionSecurityContextRepository`.	245
735	terser package is used.	154
736	terser package version is < 4.8.1.	154
737	terser package version is >= 5.0.0 and < 5.14.2.	154
738	Application processes untrusted input.	154
739	Untrusted input is evaluated against insecure regular expressions within terser.	154
740	The application must use TinyMCE.	155
741	The TinyMCE version must be prior to 6.8.1 or 7.0.0.	155
742	TinyMCE's content loading or content inserting code must be used.	155
743	TinyMCE must allow the insertion of `<object>` or `<embed>` HTML elements.	155
744	An attacker must be able to provide a malicious SVG image.	155
745	The malicious SVG image must contain an XSS payload.	155
746	TinyMCE is used.	156
747	The `noneditable_regexp` option is enabled.	156
748	Specially crafted HTML attributes containing malicious code are processed.	156
749	Content is extracted from the editor.	156
750	TinyMCE version is older than 7.2.0.	156
751	TinyMCE version is older than 6.8.4.	156
752	TinyMCE version is older than 5.11.0 LTS.	156
753	Usage of TinyMCE.	157
754	TinyMCE version is older than 7.2.0, 6.8.4, or 5.11.0 LTS.	157
755	Content containing specially crafted `noscript` elements is loaded into the editor.	157
756	The `noscript` elements contain malicious code.	157
757	Usage of TinyMCE.	158
758	TinyMCE version older than 6.8.1.	158
759	Insertion of `iframe` elements containing malicious code into the editor.	158
760	Usage of TinyMCE's content insertion code.	158
761	TinyMCE is used.	159
762	TinyMCE version is 5.2.1 or earlier.	159
763	TinyMCE is configured in classic editing mode.	159
764	TinyMCE version prior to 6.7.3 or 5.10.9 is in use.	160
765	Text nodes within specific parents are not escaped upon serialization.	160
766	Text nodes contain a special character reserved as an internal marker.	160
767	The special internal marker is removed from the content and re-parsed.	160
768	Usage of TinyMCE's core undo/redo functionality or other APIs and plugins.	160
769	TinyMCE version is before 5.10.0	161
770	Attacker can introduce crafted image or link URLs	161
771	Crafted URLs are processed in an editing user's browser	161
772	Vulnerability is a Cross-Site Scripting (XSS)	161
773	User-controllable input must be accepted by the application.	162
774	The application must fail to properly neutralize or incorrectly neutralize the user-controllable input.	162
775	The unneutralized user-controllable input must be placed into the application's output.	162
776	The output containing the unneutralized input must be served as a web page to other users.	162
777	Usage of the `trim-off-newlines` package.	167
778	Calling of the vulnerable string processing function within the `trim-off-newlines` package.	167
779	Input to the vulnerable function must be a specially crafted string designed to trigger ReDoS.	167
780	The following constraints must be met for CVE-2022-0512 to be exploitable:	169
781	The application must use the `url-parse` NPM package.	169
782	The version of `url-parse` in use must be prior to 1.5.6.	169
783	The application must process user-controlled URLs using the `url-parse` library.	169
784	The application's authorization or hostname verification logic must rely on components of the URL parsed by `url-parse`.	169
785	An attacker must be able to insert the "@" symbol at the end of the password field or manipulate the protocol field of the HREF in the user-controlled URL.	169
786	The application's authorization or hostname verification must incorrectly handle the manipulated URL, leading to a bypass.	169
787	The following constraints must be met for CVE-2022-0639 to be exploitable:	170
788	*   The application must be using the `url-parse` library.	170
789	*   The version of `url-parse` in use must be prior to 1.5.7.	170
790	*   The application must process user-controlled input that is interpreted as a URL.	170
791	*   The application must use the parsed URL (specifically, the protocol or hostname derived from it) for authorization or validation checks.	170
792	*   An attacker must be able to inject an "@" symbol into the protocol field of the user-controlled URL to bypass these authorization or validation restrictions.	170
793	*   Spring Security version is prior to 5.4.11, 5.5.7, 5.6.4, or an older unsupported version.	249
794	*   The application uses `RegexRequestMatcher`.	249
795	*   The regular expression used in `RegexRequestMatcher` contains the `.` (dot) character.	249
796	*   The application is deployed on a vulnerable servlet container.	249
797	- Usage of the `url-parse` library.	171
798	- `url-parse` library version is before 1.5.0.	171
799	- Processing of URIs containing backslashes (e.g., `http:\\/`).	171
800	- The application interprets the URI as a relative path when it should be absolute.	171
801	The following constraints must be met for CVE-2021-3664 to be exploitable in the code:	172
802	*   The application must use a vulnerable version of the `url-parse` library.	172
803	*   The application must accept user-supplied input that is intended to be a URL or part of a URL.	172
804	*   The application must use this user-supplied URL input to perform a redirection (e.g., HTTP 302/301 redirect).	172
805	*   The application must not properly validate or sanitize the user-supplied URL input before performing the redirection.	172
806	*   User interaction is required, typically by clicking a crafted link.	172
807	Usage of the `url-parse` NPM package.	173
808	The `url-parse` version must be prior to 1.5.8.	173
809	The application must be performing authorization based on a key.	173
810	The key used for authorization must be user-controlled.	173
811	Usage of the `url-parse` NPM package.	174
812	Version of `url-parse` must be prior to 1.5.9.	174
813	Application performs authorization based on a key.	174
814	The authorization key is user-controlled.	174
815	The application uses `url-parse` in a context where a user-controlled key can bypass authorization.	174
816	The vulnerability CVE-2020-26311 affects the 'useragent' library, a user agent parser for Node.js. All versions of this library, as of the time of publication, contain regular expressions susceptible to Regular Expression Denial of Service (ReDoS) attacks. This vulnerability can lead to a Denial of Service (DoS) condition when the library processes maliciously crafted user agent strings. The inefficient regular expressions cause excessive backtracking under specific input patterns, potentially leading to the application slowing down or becoming unresponsive.	175
817	Here are the constraints that must be met for CVE-2020-26311 to be exploitable in the code:	175
818	*   The code must be using the 'useragent' library.	175
819	*   The 'useragent' library must be running in a Node.js environment.	175
820	*   The 'useragent' library must be processing user agent strings.	175
821	*   The user agent strings being processed must be crafted to trigger the ReDoS vulnerability in the library's regular expressions.	175
822	*   The version of the 'useragent' library in use must be one of the affected versions (all versions as of the time of publication).	175
823	*   Software uses Webpack 5.	176
824	*   Webpack version is prior to 5.76.0.	176
825	*   `ImportParserPlugin.js` is involved in the code's processing.	176
826	*   The "magic comment feature" is used or enabled.	176
827	*   An attacker can control a property of an untrusted object.	176
828	`webpack-dev-middleware` is used.	177
829	`webpack-dev-server` is used.	177
830	`webpack-dev-middleware` version is less than 7.1.0.	177
831	`webpack-dev-middleware` version is less than 6.1.2.	177
832	`webpack-dev-middleware` version is less than 5.3.4.	177
833	The `writeToDisk` configuration option is set to `true`.	177
834	The development server is listening on a public IP address (e.g., `0.0.0.0`).	177
2410	Usage of TFLite	605
835	The development server allows access from third-party domains (e.g., due to CORS configuration).	177
836	The following constraints must be met for CVE-2020-7774 to be exploitable in the code:	183
837	*   The application must be using a vulnerable version of the `y18n` package (versions prior to 3.2.2, 4.0.1, or 5.0.5).	183
838	*   The application must utilize the `setLocale` function of the `y18n` library.	183
839	*   The application must utilize the `updateLocale` function of the `y18n` library.	183
840	*   An attacker must be able to provide untrusted input to the `setLocale` function, specifically being able to set the locale to `__proto__`.	183
841	*   An attacker must be able to control the object passed to the `updateLocale` function to inject arbitrary properties.	183
842	`webpack-dev-server` is in use.	178
843	`webpack-dev-server` version is prior to 5.2.1.	178
844	User accesses a malicious website.	178
845	User uses a non-Chromium based browser.	178
846	Malicious website is served on an IP address.	178
847	`webpack-dev-server` allows `Origin` headers from IP addresses.	178
848	Attack involves Cross-site WebSocket hijacking.	178
849	Attack aims to steal source code.	178
850	`webpack-dev-server` is in use	179
851	`webpack-dev-server` version is prior to 5.2.1	179
852	User accesses a malicious web site	179
853	Attacker knows the port of the `webpack-dev-server`	179
854	Attacker knows the output entrypoint script path	179
855	Prototype pollution is possible	179
856	`Function::toString` can be used against values in `__webpack_modules__`	179
857	Usage of 'default' namespace	277
858	Usage of 'kube-system' namespace	277
859	Usage of 'kube-public' namespace	277
860	*   Usage of `websocket-extensions` npm module.	180
861	*   Version of `websocket-extensions` npm module is prior to 0.1.4.	180
862	*   The code parses `Sec-WebSocket-Extensions` header.	180
863	*   The `Sec-WebSocket-Extensions` header contains an unclosed string parameter value.	180
864	*   The content of the unclosed string parameter value is a repeating two-byte sequence of a backslash and some other character.	180
865	*   The server processing the header is single-threaded (to be effectively exploited for DoS).	180
866	Using xml2js library.	181
867	xml2js version 0.4.23 is in use.	181
868	Application processes incoming JSON data.	181
869	Application does not properly validate incoming JSON keys.	181
870	Attacker can control incoming JSON keys (e.g., inject `__proto__`).	181
871	Usage of the `xmlhttprequest-ssl` package.	182
872	Version of `xmlhttprequest-ssl` package is before 1.6.1.	182
873	Running in a Node.js environment.	182
874	`rejectUnauthorized` property is undefined or not explicitly set to `true` when making HTTPS requests.	182
875	*   The application is running in a containerized environment.	278
876	*   CPU limits are not explicitly configured for the container.	278
877	*   Other workloads or containers are running on the same host or node, sharing CPU resources.	278
878	*   A container attempts to consume an excessive amount of CPU resources.	278
879	yargs-parser library is used.	184
880	User-controlled input is parsed by yargs-parser.	184
881	The input contains a `__proto__` payload.	184
882	The application accesses object properties that could be polluted.	184
883	The application must be using ZRender.	185
884	The ZRender version must be prior to 5.2.1.	185
885	The application must be using the `merge` or `clone` helper methods from `src/core/util.ts`.	185
886	The application must be using Apache ECharts.	185
887	The Apache ECharts version must be using ZRender prior to 5.2.1.	185
888	The application must be using `echarts.util.merge` or `setOption` if using ECharts.	185
889	The input data to the affected methods (`merge`, `clone`, `echarts.util.merge`, `setOption`) must contain `__proto__` as an object key.	185
890	The application must not be implementing the workaround of checking for and omitting `__proto__` from object keys before passing them to the affected methods.	185
891	Running in a containerized environment (e.g., Kubernetes)	279
892	CPU requests are not explicitly defined for the container	279
893	Multiple containers/pods are scheduled on the same node	279
894	The sum of actual CPU usage by containers on a node exceeds the node's capacity	279
895	The application running in the container is CPU-intensive or experiences spikes in CPU usage	279
896	*   A stale or vulnerable image is present in the local image cache.	280
897	*   A newer, patched version of the image is available in the remote registry.	280
898	*   The container's image pull policy is set to "IfNotPresent" or "Never".	280
899	*   The locally cached image contains an exploitable vulnerability.	280
900	*   The application or service running in the container is accessible to an attacker.	280
901	Image is pulled from an untrusted or compromised registry.	281
902	Image tag is mutable.	281
903	Lack of other integrity checks (e.g., image scanning, signature verification).	281
904	Attacker has control over the image registry or the image itself.	281
905	Application relies on the integrity of the image.	281
906	No image scanning or vulnerability assessment in place.	281
907	No image signing or verification.	281
908	*   The container is running on a Linux system with AppArmor enabled but without a specific profile applied to the container.	282
909	*   An attacker has gained initial access to the container.	282
910	*   The attacker attempts to perform an action that would typically be restricted by an AppArmor profile (e.g., accessing sensitive files, making specific system calls, modifying system configurations).	282
911	*   The container runtime or underlying system does not have other security mechanisms that independently prevent the malicious action.	282
912	*   The application within the container has a vulnerability that allows an attacker to perform actions that would normally be restricted by AppArmor.	282
913	*   The attacker can leverage the lack of AppArmor confinement to escalate privileges or access resources outside the intended scope of the container.	282
914	*   The container is running with capabilities that are not explicitly dropped.	283
915	*   An attacker has successfully compromised a process within the container.	283
916	*   The retained capabilities grant the attacker elevated privileges or access to sensitive resources beyond the container's intended scope.	283
917	Absence of a LimitRange policy in the namespace.	284
918	A Pod or Container attempts to consume resources (CPU, memory) without explicit individual limits.	284
919	The Kubernetes node has finite resources that can be exhausted.	284
920	Multiple Pods or Containers are competing for resources on the same node.	284
921	Lack of default resource limits for Pods or Containers in the namespace.	284
922	The namespace lacks a ResourceQuota policy.	285
923	Users or processes have permissions to create Pods, Containers, or PersistentVolumeClaims in the namespace.	285
924	Pods, Containers, or PersistentVolumeClaims created in the namespace do not have resource limits enforced by other mechanisms (e.g., LimitRanges).	285
925	A malicious or buggy application is deployed in the namespace.	285
926	The cluster has other workloads or limited resources that can be impacted by unconstrained resource consumption.	285
927	Container runs as root or highly privileged user.	286
928	Container mounts sensitive host paths.	286
929	Container has broad network access.	286
930	Container has elevated Linux capabilities.	286
931	Container has a writable root filesystem.	286
932	Pod uses hostPID.	286
933	Pod uses hostIPC.	286
934	Pod uses hostNetwork.	286
935	Container is run in privileged mode.	286
936	Default Typing is enabled (either globally or for a specific property) for an externally exposed JSON endpoint.	240
937	The service has the mysql-connector-java jar (8.0.14 or earlier) in the classpath.	240
938	An attacker can host a crafted MySQL server reachable by the victim.	240
939	An attacker can send a crafted JSON message.	240
940	Missing com.mysql.cj.jdbc.admin.MiniAdmin validation.	240
941	The container's root filesystem is mounted with write permissions.	287
942	An attacker has gained execution access within the container.	287
943	The attacker has sufficient privileges within the container to write to the root filesystem.	287
944	Sensitive files or configurations exist on the root filesystem that, if modified, would lead to a security impact (e.g., privilege escalation, persistence, data tampering, denial of service).	287
945	A new, malicious version of the unpinned package is published to the package repository.	298
946	A new version of the unpinned package introduces a critical vulnerability.	298
947	A new version of the unpinned package introduces breaking changes that lead to application failure or unexpected behavior.	298
948	The package repository or the build pipeline is compromised, allowing injection of malicious code into a new version of the unpinned package.	298
949	The application relies on a specific behavior or API of the unpinned package that changes in a newer version, leading to unexpected behavior or security bypasses.	298
950	`yum install` command is used	299
951	No specific package version is defined in the `yum install` command	299
952	Package repository content changes (e.g., new version released, dependencies updated)	299
953	The system or application has a dependency on a specific version of the package	299
954	The installation is part of an automated or repeated deployment process	299
955	Lack of post-installation validation for package versions	299
956	The vulnerability report "Liveness Probe Is Not Defined" indicates a potential availability issue rather than a traditional security vulnerability. The absence of a liveness probe means that if a container becomes unresponsive, it will not be automatically restarted, which can lead to application unavailability.	288
957	For this "vulnerability" to manifest as an issue (i.e., for the application to become unavailable due to an unresponsive container), the following constraints must be met:	288
958	*   The container running the application becomes unresponsive.	288
959	*   A liveness probe is not defined for the container.	288
960	*   Private key is stored in an unencrypted or easily decryptable format.	289
961	*   Private key is stored in a publicly accessible location (e.g., public S3 bucket, public GitHub repository).	289
962	*   Private key is hardcoded directly into the application's source code.	289
963	*   File system permissions allow unauthorized read access to the private key file.	289
964	*   Private key is exposed in application logs, error messages, or debugging output.	289
965	*   Private key is transmitted over an unencrypted channel.	289
966	*   Private key is used in a context where it can be extracted via side-channel attacks.	289
1104	The software version must be older than 3.15.0.	322
967	*   Private key is accessible through an unauthenticated or improperly authenticated API endpoint.	289
968	*   Private key is not properly protected in memory (e.g., not cleared after use).	289
969	*   Private key is generated using a weak or predictable random number generator.	289
970	*   Private key is not rotated or revoked after a potential compromise.	289
971	The `MAINTAINER` instruction is used in the Dockerfile.	300
972	The Dockerfile is used to build a Docker image.	300
973	Here are the constraints that must be met for the "Apt Get Install Pin Version Not Defined" vulnerability to be exploitable:	290
974	*   The `apt-get install` command is executed without specifying a package version.	290
975	*   A version of the package with a known security vulnerability is available in the configured APT repositories.	290
976	*   The system or application loads or executes the installed vulnerable package.	290
977	*   An attacker can influence the package version installed, for example, by compromising a repository, performing a Man-in-the-Middle attack, or by the system relying on an outdated repository.	290
978	*   The vulnerability in the unpinned package can be leveraged to achieve an attacker's objective (e.g., remote code execution, privilege escalation).	290
979	Apache Tomcat version 8.5.0 to 8.5.75 or 9.0.0.M1 to 9.0.20 is in use.	264
980	A web application sends a WebSocket message.	264
981	The WebSocket message is sent concurrently with the WebSocket connection closing.	264
982	Usage of `gem install` command.	291
983	Absence of a specified version for the gem.	291
984	Usage of `pickle` library	295
985	Usage of `_pickle` library	295
986	Usage of `cPickle` library	295
987	Deserialization of untrusted data	295
988	*   The `ADD` instruction is used in the Dockerfile.	296
989	*   The `ADD` instruction is used to load external installation scripts.	296
990	*   The external installation script is hosted on a web server.	296
991	*   The web server hosting the external installation script is compromised or malicious.	296
992	*   The attacker has control over the content of the external installation script.	296
993	The `WORKDIR` instruction uses a relative path.	297
994	Subsequent commands (e.g., `RUN`, `COPY`, `ADD`, `ENTRYPOINT`, `CMD`) rely on the `WORKDIR` to be a specific absolute path.	297
995	The build context or the current working directory during image build or container runtime differs from the assumed base for the relative `WORKDIR`.	297
996	Files or directories are created or accessed relative to the `WORKDIR`.	297
997	The resulting path of the relative `WORKDIR` leads to an unintended or insecure location within the container filesystem.	297
998	*   Action is not pinned to a full-length commit SHA.	301
999	*   A bad actor has access to modify the action's repository.	301
1000	*   The action is used without verifying the SHA is from the action's original repository (e.g., using a fork without verification).	301
1001	*   A SHA-1 collision is generated for a valid Git object payload.	301
1002	1. The Dockerfile contains a `RUN update` instruction.	302
1003	2. The `RUN update` instruction is not immediately followed by an `install` instruction within the same `RUN` statement.	302
1004	*   `yum install` command is used.	303
1005	*   `yum clean all` command is not executed after `yum install`.	303
1006	*   A container image or similar artifact is being built where the filesystem state is persisted.	303
1007	*   Cached package data exists after `yum install`.	303
1008	The application must be hosted behind a caching proxy that does not strip cookies or ignore responses with cookies.	304
1009	The application sets `session.permanent = True`.	304
1010	The application does not access or modify the session at any point during a request.	304
1011	`SESSION_REFRESH_EACH_REQUEST` enabled (the default).	304
1012	The application does not set a `Cache-Control` header to indicate that a page is private or should not be cached.	304
1013	- Usage of the `jinja2` package.	305
1014	- `jinja2` version is less than 2.11.3.	305
1015	- The `urlize` filter is used in the code.	305
1016	- User-controlled input is processed by the `urlize` filter.	305
1017	- The `_punctuation_re regex` operator is utilized internally by the `urlize` filter.	305
1018	Werkzeug version is prior to 2.2.3	306
1019	A browser allows "nameless" cookies (e.g., `=value`)	306
1020	A vulnerable browser allows a compromised application on an adjacent subdomain to set a cookie like `=__Host-test=bad`	306
1021	A Werkzeug application is running next to a vulnerable or malicious subdomain	306
1022	The malicious cookie is set in the format `=__Host-test=bad`	306
1023	Werkzeug version prior to 2.2.3 is used.	307
1024	An endpoint that accesses `request.data` is available.	307
1025	An endpoint that accesses `request.form` is available.	307
1026	An endpoint that accesses `request.files` is available.	307
1027	An endpoint that accesses `request.get_data(parse_form_data=False)` is available.	307
1028	The application parses multipart form data.	307
1029	An attacker can send crafted multipart data to the vulnerable endpoint.	307
1030	joblib version 1.4.2 must be in use.	314
1031	The `joblib.numpy_pickle::NumpyArrayWrapper().read_array()` component must be utilized.	314
1032	Untrusted content must be deserialized by the application using the vulnerable component.	314
1033	*   The application must be using a version of Certifi older than 2022.12.07.	308
1034	*   The application must be performing SSL/TLS certificate validation.	308
1035	*   The application must be connecting to a TLS host whose certificate chain relies on a TrustCor root certificate.	308
1036	*   An attacker must control a TLS host whose certificate is signed by a TrustCor root certificate (or an intermediate certificate signed by TrustCor).	308
1037	Using Certifi.	309
1038	Certifi version is prior to 2023.07.22.	309
1039	Performing SSL/TLS certificate validation.	309
1040	Connecting to a TLS host whose certificate chain relies on an "e-Tugra" root certificate.	309
1041	An attacker presents a malicious certificate signed by a compromised e-Tugra root.	309
1042	A gRPC client must be communicating with a HTTP/2 proxy.	310
1043	The gRPC version in use must be vulnerable (prior to 1.58.3, 1.59.5, 1.60.2, 1.61.3, 1.62.3, 1.63.2, 1.64.3, or 1.65.4).	310
1044	A gRPC client must send a misencoded header.	310
1045	The HPACK table must be shared between the proxy and multiple clients.	310
1046	The `kjd/idna` library must be in use.	313
1047	The version of the `kjd/idna` library must be 3.6.	313
1048	The `idna.encode()` function must be called.	313
1049	The `idna.encode()` function must process user-controlled or untrusted input.	313
1050	The input must be specifically crafted to trigger quadratic complexity.	313
1051	A client must send a request.	311
1052	An HTTP2 proxy must be used between the client and the gRPC server.	311
1053	The client must send a base64 encoding error.	311
1054	The base64 encoding error must be within a header suffixed with `-bin`.	311
1055	The gRPC server must be vulnerable to the specific base64 encoding error (i.e., not upgraded beyond the commit in https://github.com/grpc/grpc/pull/32309).	311
1056	The HTTP2 proxy must allow the malformed header.	311
1057	Usage of gRPC's HPACK parser	312
1058	Header size limit check is performed after string reading	312
1059	HPACK varints with an infinite number of leading zeros are processed	312
1060	gRPC's metadata overflow check is performed per frame	312
1061	A sequence of HEADERS and CONTINUATION frames is sent	312
1062	Per-input-block copy occurs in the HPACK parser	312
1063	A memory copy bug allows for unbounded input size 'n' in the HPACK parser	312
1064	Usage of JSON Smart library.	189
1065	JSON Smart version 1.3 or 2.4.	189
1066	Invocation of the `indexOf` function within `JSONParserByteArray`.	189
1067	Processing of web requests.	189
1068	The web request must be crafted to exploit the vulnerability.	189
1069	- Usage of the `joblib` package.	315
1070	- `joblib` package version is less than 1.2.0.	315
1071	- Usage of the `Parallel()` class from `joblib`.	315
1072	- Usage of the `pre_dispatch` flag/parameter in the `Parallel()` class.	315
1073	- The value of the `pre_dispatch` flag is controlled by an attacker or untrusted input.	315
1074	NumPy version < 1.19 must be in use.	316
1075	The `array_from_pyobj` function must be called.	316
1076	An array with negative values must be constructed.	316
1077	The attacker must be an already privileged user or have internal access to create negative dimensions.	316
1078	The vulnerability CVE-2021-41495 in NumPy's `numpy.sort` function, specifically within `PyArray_DescrNew`, is a Null Pointer Dereference issue. It is caused by missing return-value validation. For this vulnerability to be exploitable, the following constraints must be met:	317
1079	*   The affected code must be using NumPy version less than 1.19 (some sources indicate less than 1.22.2).	317
1080	*   The `numpy.sort` function, or code that internally calls `PyArray_DescrNew`, must be utilized.	317
1081	*   An exhaustion of memory must occur.	317
1082	*   The user or attacker must have the privilege to exhaust system memory.	317
1083	*   An attacker would need to repetitively create sort arrays to attempt a DoS attack.	317
1084	*   While theoretically possible, it is practically impossible to construct an attack that precisely targets memory exhaustion at this specific location in the code.	317
1085	NumPy library must be in use.	318
1086	NumPy version must be older than 1.22.0.	318
1087	The vulnerable code must involve string comparison within the `numpy.core` component.	318
1088	An attacker must be able to construct and supply specific string objects.	318
1089	*   Usage of Protobuf Pure-Python backend.	320
1090	*   Parsing of untrusted Protocol Buffers data.	320
1091	*   The untrusted data contains an arbitrary number of recursive groups.	320
1092	*   The untrusted data contains an arbitrary number of recursive messages.	320
1093	*   The untrusted data contains a series of SGROUP tags.	320
1094	*   The application's Python recursion limit is exceeded.	320
1095	Usage of ProtocolBuffers	321
1096	ProtocolBuffers version is prior to or including 3.16.1, 3.17.3, 3.18.2, 3.19.4, 3.20.1, or 3.21.5 for protobuf-cpp	321
1097	ProtocolBuffers version is prior to or including 3.16.1, 3.17.3, 3.18.2, 3.19.4, 3.20.1, or 4.21.5 for protobuf-python	321
1098	Parsing of the MessageSet type	321
1099	Receiving unsanitized input	321
1100	Input message is specially crafted with multiple key-value pairs per element	321
1101	A null character must be present in a proto symbol.	322
1102	The vulnerable code must be parsing a proto symbol containing a null character.	322
1103	The code must attempt to generate an error message related to the incorrectly parsed proto symbol.	322
1105	Requests library is used	323
1106	Requests library version is prior to 2.32.0	323
1107	A Requests `Session` object is used	323
1108	The first request to a host within a `Session` is made with `verify=False`	323
1109	Subsequent requests to the same host within the same `Session`'s connection pool lifecycle are made with `verify=True` (or without explicitly setting `verify=False`)	323
1110	Requests library is used.	324
1111	Requests library version is prior to 2.32.4.	324
1112	A maliciously-crafted URL is processed.	324
1113	The .netrc file is present and contains credentials.	324
1114	`trust_env` is not set to `False` on the Requests Session.	324
1115	Requests library must be used.	325
1116	Requests library version must be between 2.3.0 (inclusive) and 2.31.0 (exclusive).	325
1117	Proxy-Authorization header must be present in the request.	325
1118	The request must be redirected to an HTTPS endpoint.	325
1119	The request must be sent through a proxy.	325
1120	Usage of python-rsa library.	326
1121	Usage of RSA decryption API.	326
1122	Attacker can observe timing differences during RSA decryption.	326
1123	The vulnerability report for CVE-2020-13757 describes a flaw in Python-RSA where it ignores leading '\\0' bytes during ciphertext decryption. This can have security implications, such as allowing an attacker to infer the use of Python-RSA or causing excessive memory allocation if the ciphertext length affects application behavior.	327
1124	For CVE-2020-13757 to be exploitable, the following constraints must be met:	327
1125	*   The application must be using the Python-RSA library.	327
1126	*   The version of Python-RSA in use must be prior to 4.1.	327
1127	*   The application must be performing decryption of ciphertext.	327
1128	*   An attacker must be able to provide specially crafted ciphertext with leading '\\0' bytes.	327
1129	*   The application's behavior must be affected by the length of accepted ciphertext (e.g., leading to excessive memory allocation) or the attacker must be attempting to infer the use of Python-RSA.	327
1130	scikit-learn library is in use.	328
1131	TfidfVectorizer is in use.	328
1132	scikit-learn version is 1.4.1.post1 or older.	328
1133	Sensitive data is present in the training data provided to TfidfVectorizer.	328
1134	The `stop_words_` attribute of the TfidfVectorizer instance is accessed or exposed.	328
1135	- scikit-learn (aka sklearn) version 0.23.0 or earlier is in use.	329
1136	- An untrusted file is passed to the `joblib.load()` function.	329
1137	- The `__reduce__` method within the untrusted file makes an `os.system` call.	329
1138	TensorFlow version prior to 2.11.1	330
1139	Usage of the `Convolution3DTranspose` function	330
1140	Attacker must have privilege to provide input to a `Convolution3DTranspose` call	330
1141	*   A tflite model must be constructed.	331
1142	*   The `filter_input_channel` parameter must be used.	331
1143	*   The value of `filter_input_channel` must be less than 1.	331
1144	TensorFlow must be used.	332
1145	TensorFlow version must be prior to 2.12.0.	332
1146	TensorFlow version must be prior to 2.11.1.	332
1147	The `RandomShuffle` operation must be used.	332
1148	XLA must be enabled.	332
1149	TensorFlow must be used in the code.	499
1150	TensorFlow version must be prior to 2.9.0, 2.8.1, 2.7.2, or 2.6.4.	499
1151	The `tf.raw_ops.DeleteSessionTensor` function must be called or used.	499
1152	Input arguments to `tf.raw_ops.DeleteSessionTensor` must be crafted to trigger a `CHECK`-failure.	499
1153	TensorFlow is used.	333
1154	TensorFlow version is prior to 2.12.0.	333
1155	TensorFlow version is prior to 2.11.1.	333
1156	XLA is being used.	333
1157	`tf.raw_ops.Bincount` is called.	333
1158	The `weights` parameter of `tf.raw_ops.Bincount` is not the same shape as the `arr` parameter.	333
1159	The `weights` parameter of `tf.raw_ops.Bincount` is not a length-0 tensor.	333
1160	TensorFlow version prior to 2.12.0 or 2.11.1	334
1161	XLA is enabled/used	334
1162	Usage of `tf.raw_ops.ParallelConcat`	334
1163	The `shape` parameter of `tf.raw_ops.ParallelConcat` has a rank not greater than zero	334
1164	Usage of `tf.raw_ops.PyFunc`	335
1165	Input `token` is not a UTF-8 bytestring	335
1166	TensorFlow version is vulnerable (e.g., < 2.11, < 2.10.1, < 2.9.3, < 2.8.4)	335
1167	*   Usage of TensorFlow	336
1168	*   TensorFlow version is prior to 2.11, 2.10.1, 2.9.3, or 2.8.4	336
1169	*   `BCast::ToShape` function is called	336
1170	*   Input to `BCast::ToShape` is larger than an `int32`	336
1171	*   Usage of `tf.experimental.numpy.outer` with a large input for `b`	336
1172	Usage of `Conv2D` function	337
1173	`input` to `Conv2D` is empty	337
1174	`filter` size is valid	337
1175	`padding` size is valid	337
1176	TensorFlow version is less than 2.10.0	337
1177	TensorFlow version is 2.9.0 or earlier (not 2.9.1 or later)	337
1178	TensorFlow version is 2.8.0 or earlier (not 2.8.1 or later)	337
1179	TensorFlow version is 2.7.1 or earlier (not 2.7.2 or later)	337
1180	Usage of TensorFlow.	338
1181	Usage of `EmptyTensorList` function.	338
1182	`EmptyTensorList` receives an input `element_shape`.	338
1183	The `element_shape` input has more than one dimension.	338
1184	Usage of `FakeQuantWithMinMaxVarsPerChannel` function	339
1185	`min` tensor provided to `FakeQuantWithMinMaxVarsPerChannel` has a rank other than one	339
1186	`max` tensor provided to `FakeQuantWithMinMaxVarsPerChannel` has a rank other than one	339
1187	Usage of `FakeQuantWithMinMaxVars` function	340
1188	`min` tensor has a nonzero rank	340
1189	`max` tensor has a nonzero rank	340
1190	TensorFlow version is vulnerable (e.g., 2.9.0, 2.8.0, 2.7.0, or earlier unpatched versions)	340
1191	Usage of `tf.raw_ops.AvgPoolGrad`	365
1192	Stride is not positive	365
1193	Window size is not positive	365
1194	*   Usage of `FractionMaxPoolGrad` function	341
1195	*   `FractionMaxPoolGrad` is given outsize inputs `row_pooling_sequence`	341
1196	*   `FractionMaxPoolGrad` is given outsize inputs `col_pooling_sequence`	341
1197	*   TensorFlow version is prior to 2.11	341
1198	*   TensorFlow version is not 2.10.1, 2.9.3, or 2.8.4 (unless the patch has not been cherry-picked yet)	341
1199	Usage of `LRNGrad` function	342
1200	`output_image` input tensor to `LRNGrad` is not 4-D	342
1201	TensorFlow version is affected (e.g., < 2.10.0, < 2.9.1, < 2.8.1, or < 2.7.2 without the patch)	342
1202	Usage of TensorFlow.	343
1203	Usage of `LowerBound` or `UpperBound` functions.	343
1204	`sorted_inputs` argument is empty.	343
1205	TensorFlow version is affected (e.g., < 2.10.0, < 2.9.1, < 2.8.1, < 2.7.2).	343
1206	Usage of `MirrorPadGrad`	344
1207	`MirrorPadGrad` is given outsize input `paddings`	344
1208	TensorFlow must be used.	345
1209	The `QuantizeAndDequantizeV3` operation must be used.	345
1210	The `num_bits` input tensor to `QuantizeAndDequantizeV3` must be nonscalar.	345
1211	Usage of `tf.raw_ops.GetSessionTensor`	500
1212	Input arguments to `tf.raw_ops.GetSessionTensor` are not fully validated	500
1213	TensorFlow version is prior to 2.9.0	500
1214	TensorFlow version is prior to 2.8.1	500
1215	TensorFlow version is prior to 2.7.2	500
1216	TensorFlow version is prior to 2.6.4	500
1217	Usage of `QuantizeDownAndShrinkRange` function.	346
1218	`input_min` argument of `QuantizeDownAndShrinkRange` is nonscalar.	346
1219	`input_max` argument of `QuantizeDownAndShrinkRange` is nonscalar.	346
1220	TensorFlow version is prior to 2.10.0, or prior to 2.9.1, 2.8.1, or 2.7.2 without the patch.	346
1221	Usage of the `QuantizedAdd` operation.	347
1222	`min_input` tensor has a nonzero rank.	347
1223	`max_input` tensor has a nonzero rank.	347
1224	TensorFlow version is prior to 2.10.0.	347
1225	TensorFlow version is prior to 2.9.1 (if using 2.9.x).	347
1226	TensorFlow version is prior to 2.8.1 (if using 2.8.x).	347
1227	TensorFlow version is prior to 2.7.2 (if using 2.7.x).	347
1228	Usage of `QuantizedAvgPool` function	348
1229	`min_input` tensor has a nonzero rank	348
1230	`max_input` tensor has a nonzero rank	348
1231	TensorFlow version is prior to 2.10.0	348
1232	TensorFlow version is prior to 2.9.1	348
1233	TensorFlow version is prior to 2.8.1	348
1234	TensorFlow version is prior to 2.7.2	348
1235	Usage of `QuantizedBiasAdd` function	349
1236	`min_input` tensor has a nonzero rank	349
1237	`max_input` tensor has a nonzero rank	349
1238	`min_bias` tensor has a nonzero rank	349
1239	`max_bias` tensor has a nonzero rank	349
1240	TensorFlow version is affected (e.g., < 2.10.0, < 2.9.1, < 2.8.1, or < 2.7.2 without the patch)	349
1241	Usage of `QuantizedInstanceNorm`	350
1242	`x_min` tensor is provided	350
1243	`x_max` tensor is provided	350
1244	`x_min` tensor has a nonzero rank	350
1245	`x_max` tensor has a nonzero rank	350
1246	TensorFlow version is prior to 2.10.0	350
1247	TensorFlow version is 2.9.0	350
1248	TensorFlow version is 2.8.0	350
1249	TensorFlow version is 2.7.0 or 2.7.1	350
90	Containers must share a volume.	15
91	At least one container must have write access to the shared volume.	15
92	At least one container must read from the shared volume.	15
93	One of the containers accessing the shared volume must be untrusted or compromised.	15
94	The shared volume must contain sensitive data or be used for critical operations.	15
1256	TensorFlow version is prior to 2.8.1 (if using 2.8.x branch).	351
1257	TensorFlow version is prior to 2.7.2 (if using 2.7.x branch).	351
1258	*   Usage of `RaggedBincount` function	352
1259	*   `splits` input tensor to `RaggedBincount` is empty	352
1260	*   TensorFlow version is 2.9.x, 2.8.x, or 2.7.x (before patched versions 2.9.1, 2.8.1, 2.7.2 respectively), or any version prior to 2.10.0 without the patch.	352
1261	Usage of the `Requantize` function.	353
1262	`input_min` tensor must have a nonzero rank.	353
1263	`input_max` tensor must have a nonzero rank.	353
1264	`requested_output_min` tensor must have a nonzero rank.	353
1265	`requested_output_max` tensor must have a nonzero rank.	353
1266	TensorFlow version must be prior to 2.10.0 (or prior to 2.9.1, 2.8.1, 2.7.2 if those specific cherry-picks are not applied).	353
1267	Usage of `Save` function.	354
1268	Usage of `SaveSlices` function.	354
1269	Tensors with an unsupported `dtype` are passed to `Save` or `SaveSlices`.	354
1270	Vulnerable TensorFlow version (e.g., prior to 2.10.0, or unpatched 2.9.x, 2.8.x, 2.7.x).	354
1271	Usage of `SparseBincount` function.	355
1272	Inputs `indices`, `values`, and `dense_shape` are provided to `SparseBincount`.	355
1273	The provided `indices`, `values`, and `dense_shape` do not form a valid sparse tensor.	355
1274	TensorFlow version is prior to 2.10.0.	355
1275	TensorFlow version is prior to 2.9.1.	355
1276	TensorFlow version is prior to 2.8.1.	355
1277	TensorFlow version is prior to 2.7.2.	355
1278	Usage of `SparseFillEmptyRowsGrad` function	356
1279	`SparseFillEmptyRowsGrad` is given empty inputs	356
1280	TensorFlow version is prior to 2.11	356
1281	TensorFlow version is prior to 2.10.1	356
1282	TensorFlow version is prior to 2.9.3	356
1283	TensorFlow version is prior to 2.8.4	356
1284	Usage of `tf.raw_ops.TensorListConcat`	357
1285	`element_shape` argument of `tf.raw_ops.TensorListConcat` must be `[]`	357
1286	TensorFlow version must be vulnerable (e.g., prior to 2.11, 2.10.1, 2.9.3, or 2.8.4)	357
1287	Usage of `tf.raw_ops.TensorListResize` function.	358
1288	Input `size` to `tf.raw_ops.TensorListResize` must be a nonscalar value.	358
1289	Usage of `tf.sparse.cross` function	359
1290	`separator` input to `tf.sparse.cross` is not a scalar	359
1291	TensorFlow version is vulnerable (e.g., < 2.10.0, < 2.9.1, < 2.8.1, < 2.7.2)	359
1292	Usage of TensorFlow.	360
1293	Assignment of a list of quantized tensors to an attribute.	360
1294	The `pywrap` code is used to parse the tensor.	360
1295	The `nullptr` returned by `pywrap` is not caught.	360
1296	Usage of `tf.compat.v1.extract_volume_patches` with quantized tensors as input `ksizes`.	360
1297	Creation of a numpy array.	361
1298	Numpy array shape has one element equal to zero.	361
1299	Numpy array shape has other elements that sum to a large number.	361
1300	Usage of TensorFlow versions prior to 2.11, 2.10.1, 2.9.3, or 2.8.4.	361
1301	TensorFlow version prior to 2.12.0 or 2.11.1 is in use.	366
1302	The product of `num_frames * height * width * channels` is between `2^31` and `2^32 - 1` (inclusive of `2^31`, exclusive of `2^32`).	366
1303	The code processes video frames or similar multi-dimensional data where `num_frames`, `height`, `width`, and `channels` are relevant parameters.	366
1304	Lodash library must be used.	111
1305	Lodash version must be prior to 4.17.21.	111
1306	The `template` function of Lodash must be used in the code.	111
1307	An attacker must be able to control the input to the `template` function.	111
1308	The provided vulnerability report for CVE-2022-35960 details the following constraints for its exploitability:	362
1309	*   The affected code must be using `tf.raw_ops.TensorListReserve` or the underlying `TensorListReserve` kernel.	362
1310	*   The `num_elements` argument provided to `tf.raw_ops.TensorListReserve` must be a tensor with more than 1 element.	362
1311	*   The TensorFlow version in use must be affected, specifically versions prior to 2.10.0, or versions 2.9.0, 2.8.0, and 2.7.0 that have not received the cherry-picked fix (i.e., not 2.9.1, 2.8.1, or 2.7.2).	362
1312	Software must be TensorFlow	363
1313	TensorFlow version must be prior to 2.12.0 or 2.11.1	363
1314	Usage of GRUBlockCellGrad function	363
1315	An out-of-bounds read must occur within GRUBlockCellGrad	363
1316	Usage of the `DynamicStitch` function.	364
1317	The `indices` parameter of `DynamicStitch` does not match the shape of the `data` parameter.	364
1318	TensorFlow version is prior to 2.12.0.	364
1319	TensorFlow version is prior to 2.11.1.	364
1320	Software uses TensorFlow.	367
1321	TensorFlow version is prior to 2.12.0.	367
1322	TensorFlow version is prior to 2.11.1.	367
1323	The `AudioSpectrogram` function is used in the code.	367
1324	The usage of `AudioSpectrogram` leads to a floating point exception.	367
1325	Usage of `SparseSparseMaximum` function	368
1326	Input to `SparseSparseMaximum` must be invalid sparse tensors	368
1327	TensorFlow version must be prior to 2.12.0	368
1328	TensorFlow version must be prior to 2.11.1	368
1329	`ctx->step_containter()` must be a null pointer	369
1330	The `Lookup` function must be called with the null pointer from `ctx->step_containter()`	369
1331	TensorFlow must be used in the code.	508
1332	The TensorFlow version must be prior to 2.9.0, 2.8.1, 2.7.2, or 2.6.4.	508
1333	The `tf.raw_ops.TensorSummaryV2` function must be called.	508
1334	Malicious or malformed input arguments must be provided to `tf.raw_ops.TensorSummaryV2`.	508
1335	Usage of TensorFlow.	370
1336	TensorFlow version is prior to 2.12.0.	370
1337	TensorFlow version is prior to 2.11.1.	370
1338	Usage of `tf.raw_ops.Print`.	370
1339	The `summarize` parameter of `tf.raw_ops.Print` is set to zero.	370
1340	Usage of `AvgPoolOp` function	371
1341	`ksize` argument is provided	371
1342	`ksize` argument is a negative value	371
1343	Usage of `RaggedRangOp` function	372
1344	`limits` argument is a very large float	372
1345	`limits` argument is converted to `int64`	372
1346	TensorFlow version is prior to 2.10.0	372
1347	TensorFlow version is prior to 2.9.1 (if using 2.9.x branch)	372
1348	TensorFlow version is prior to 2.8.1 (if using 2.8.x branch)	372
1349	TensorFlow version is prior to 2.7.2 (if using 2.7.x branch)	372
1350	Usage of `tf.raw_ops.LookupTableImportV2`	373
1351	`values` parameter must be a scalar	373
1352	TensorFlow version is prior to 2.12.0 or 2.11.1	373
1353	Usage of `SobolSampleOp`	374
1354	`input(0)` is not scalar	374
1355	`input(1)` is not scalar	374
1356	`input(2)` is not scalar	374
1357	Usage of `AvgPool3DGradOp`	375
1358	Input `orig_input_shape` is not fully validated	375
1359	TensorFlow version is prior to 2.10.0	375
1360	TensorFlow version is prior to 2.9.1 (if using 2.9.x branch)	375
1361	TensorFlow version is prior to 2.8.1 (if using 2.8.x branch)	375
1362	TensorFlow version is prior to 2.7.2 (if using 2.7.x branch)	375
1363	Usage of `AvgPoolGrad` function	376
1364	Input `orig_input_shape` is not fully validated	376
1365	TensorFlow version is prior to 2.10.0	376
1366	TensorFlow version is prior to 2.9.1 (if using 2.9.x branch)	376
1367	TensorFlow version is prior to 2.8.1 (if using 2.8.x branch)	376
1368	TensorFlow version is prior to 2.7.2 (if using 2.7.x branch)	376
1369	Usage of TensorFlow.	377
1370	Usage of the `BlockLSTMGradV2` function.	377
1371	TensorFlow version is older than 2.10.0, 2.9.1, 2.8.1, or 2.7.2.	377
1372	The code is not patched with commit 2a458fc4866505be27c62f81474ecb2b870498fa.	377
1373	Maliciously crafted input is provided to `BlockLSTMGradV2`.	377
1374	TensorFlow must be in use.	378
1375	The `FractionalAvgPoolGrad` function must be called.	378
1376	The `orig_input_tensor_shape` input to `FractionalAvgPoolGrad` must be attacker-controlled.	378
1377	The TensorFlow version must be vulnerable (e.g., prior to 2.10.0, or unpatched 2.9.x, 2.8.x, 2.7.x versions).	378
1378	*   Usage of TensorFlow library.	379
1379	*   TensorFlow version is less than 2.12.0 (or less than 2.11.1 if using the 2.11.x branch).	379
1380	*   Code performs operations that result in out-of-bounds access due to mismatched integer type sizes within TensorFlow.	379
1381	TensorFlow version prior to 2.12.0	380
1382	TensorFlow version prior to 2.11.1	380
1383	Usage of the `EditDistance` function	380
1384	Input to `EditDistance` function causes an integer overflow	380
1385	TensorFlow must be used.	381
1386	TensorFlow version must be prior to 2.12.0.	381
1387	TensorFlow version must be prior to 2.11.1.	381
1388	The `TensorListSplit` function must be used.	381
1389	XLA (Accelerated Linear Algebra) must be in use.	381
1390	Usage of `AudioSummaryV2` function.	382
1391	`sample_rate` input to `AudioSummaryV2` must have more than one element.	382
1392	Usage of `CollectiveGather` function	383
1393	`CollectiveGather` function must receive a scalar input	383
1394	Usage of the `Conv2DBackpropInput` operation.	384
1395	The `out_backprop` input to `Conv2DBackpropInput` must be empty (e.g., a dimension of 0).	384
1396	The TensorFlow version must be vulnerable (e.g., < 2.10.0, or 2.9.x < 2.9.1 with fix, 2.8.x < 2.8.1 with fix, 2.7.x < 2.7.2 with fix).	384
1397	The code must be executed on a CPU or GPU.	384
1398	*   Usage of `MaxPool` operation.	386
1399	*   `MaxPool` operation executed on a GPU kernel.	386
1400	*   The `ksize` input array has dimensions greater than the `input` tensor.	386
1401	The following constraints must be met for CVE-2022-36003 to be exploitable:	387
1402	The code must use TensorFlow.	387
1403	The TensorFlow version must be vulnerable (e.g., prior to 2.10.0, or specifically 2.9.1, 2.8.1, or 2.7.2 without the patch).	387
1404	The `RandomPoissonV2` operation must be used in the code.	387
1405	The `RandomPoissonV2` operation must receive large input shape and rates.	387
1406	Usage of `TensorListFromTensor` function	390
1407	`element_shape` argument of `TensorListFromTensor` has a rank greater than one	390
1408	Vulnerable TensorFlow version (e.g., prior to 2.10.0, 2.9.1, 2.8.1, or 2.7.2 without the patch)	390
1409	Usage of `RangeSize` function	388
1410	Input values to `RangeSize` that do not fit into an `int64_t`	388
1411	TensorFlow version is older than 2.10.0	388
1412	TensorFlow version is older than 2.9.1	388
1413	TensorFlow version is older than 2.8.1	388
1414	TensorFlow version is older than 2.7.2	388
1415	Usage of TensorFlow	389
1416	Calling the `SetSize` function	389
1417	Input `set_shape` is not a 1D tensor	389
1418	Usage of `TensorListScatter` function.	391
1419	Usage of `TensorListScatterV2` function.	391
1420	The `element_shape` argument has a rank greater than one.	391
1421	The TensorFlow version is vulnerable (e.g., prior to 2.10.0, 2.9.1, 2.8.1, or 2.7.2 without the patch).	391
1422	Usage of the `Unbatch` operation.	392
1423	`id` input to `Unbatch` must be nonscalar.	392
1424	Usage of `mlir::tfg::ConvertGenericFunctionToFunctionDef`	393
1434	Usage of TensorFlow.	395
1425	`mlir::tfg::ConvertGenericFunctionToFunctionDef` is given empty function attributes	393
1426	TensorFlow version is less than 2.10.0	393
1427	TensorFlow version is 2.9.x (and not patched to 2.9.1 or higher)	393
1428	TensorFlow version is 2.8.x (and not patched to 2.8.1 or higher)	393
1429	TensorFlow version is 2.7.x (and not patched to 2.7.2 or higher)	393
1430	Usage of TensorFlow	394
1431	Calling `mlir::tfg::GraphDefImporter::ConvertNodeDef`	394
1432	Attempting to convert `NodeDefs`	394
1433	`NodeDefs` being converted must be without an op name	394
1435	TensorFlow version is less than 2.10.0.	395
1436	TensorFlow version is less than 2.9.1.	395
1437	TensorFlow version is less than 2.8.1.	395
1438	TensorFlow version is less than 2.7.2.	395
1439	The `tensorflow::full_type::SubstituteFromAttrs` function is called.	395
1440	The `FullTypeDef& t` argument passed to `SubstituteFromAttrs` does not have exactly three arguments.	395
1441	Usage of `tf.linalg.matrix_rank`	396
1442	Input `a` is empty	396
1443	Code runs on a GPU kernel	396
1444	Usage of `tf.quantization.fake_quant_with_min_max_vars_gradient` function.	397
1445	Input `min` to `tf.quantization.fake_quant_with_min_max_vars_gradient` is nonscalar.	397
1446	Input `max` to `tf.quantization.fake_quant_with_min_max_vars_gradient` is nonscalar.	397
1447	TensorFlow version is prior to 2.10.0.	397
1448	TensorFlow version is prior to 2.9.1 (if using 2.9.x branch).	397
1449	TensorFlow version is prior to 2.8.1 (if using 2.8.x branch).	397
1450	TensorFlow version is prior to 2.7.2 (if using 2.7.x branch).	397
1451	Usage of `tf.quantization.fake_quant_with_min_max_vars_per_channel_gradient` function.	398
1452	Input `min` or `max` to `tf.quantization.fake_quant_with_min_max_vars_per_channel_gradient` has a rank other than 1.	398
1453	TensorFlow version is prior to 2.10.0, or not patched versions 2.9.1, 2.8.1, or 2.7.2.	398
1454	Usage of `tf.random.gamma` function	399
1455	`tf.random.gamma` receives large input shape	399
1456	`tf.random.gamma` receives large rates	399
1457	TensorFlow version is older than 2.10.0	399
1458	TensorFlow version is older than 2.9.1 (if not patched)	399
1459	TensorFlow version is older than 2.8.1 (if not patched)	399
1460	TensorFlow version is older than 2.7.2 (if not patched)	399
1461	Usage of TensorFlow.	400
1462	Usage of `tf.raw_ops.ImageProjectiveTransformV2`.	400
1463	`tf.raw_ops.ImageProjectiveTransformV2` is given a large output shape.	400
1464	TensorFlow version is prior to 2.11.	400
1465	TensorFlow version is 2.10.x prior to 2.10.1.	400
1466	TensorFlow version is 2.9.x prior to 2.9.3.	400
1467	TensorFlow version is 2.8.x prior to 2.8.4.	400
1468	Usage of `tf.raw_ops.ResizeNearestNeighborGrad` function.	401
1469	Input `size` to `tf.raw_ops.ResizeNearestNeighborGrad` must be large.	401
1470	TensorFlow version must be vulnerable (e.g., prior to 2.11, 2.10.1, 2.9.3, or 2.8.4).	401
1471	Usage of TensorFlow	402
1472	Usage of the TensorFlow converter	402
1473	Conversion of transposed convolutions	402
1474	Usage of per-channel weight quantization	402
1475	Usage of an affected TensorFlow version (prior to 2.10.0, or prior to 2.9.1, 2.8.1, or 2.7.2 without the cherry-picked fix)	402
1476	Usage of TensorFlow.	403
1477	TensorFlow version is vulnerable (e.g., < 2.11.0, < 2.10.1, < 2.9.3, or < 2.8.4).	403
1478	Code involves printing a tensor.	403
1479	The tensor's element type is `bool`.	403
1480	The underlying `char` representation of the `bool` tensor's data contains values other than `0` or `1`.	403
1481	Usage of `tf.raw_ops.CompositeTensorVariantToComponents` function	412
1482	Input `encoded` is not a valid `CompositeTensorVariant` tensor	412
1483	TensorFlow version is prior to 2.11	412
1484	TensorFlow version is prior to 2.10.1	412
1485	TensorFlow version is prior to 2.9.3	412
1486	TensorFlow version is prior to 2.8.4	412
1487	*   The code must be running on GPU.	404
1488	*   The code must use the `tf.image.generate_bounding_box_proposals` function.	404
1489	*   The `scores` input to `tf.image.generate_bounding_box_proposals` must not be of rank 4.	404
1490	*   The TensorFlow version must be older than 2.11, 2.10.1, 2.9.3, or 2.8.4 (i.e., not include the patch).	404
1491	- Usage of TensorFlow library.	405
1492	- Usage of `DenseBincount` operation.	405
1493	- The `weights` input tensor to `DenseBincount` has a shape different from the `input` tensor.	405
1494	- The `weights` input tensor to `DenseBincount` is not length-0.	405
1495	Usage of TensorFlow.	406
1496	TensorFlow version is older than 2.10.0, 2.9.1, 2.8.1, or 2.7.2.	406
1497	The `FractionalMaxPoolGrad` function is called.	406
1498	The `FractionalMaxPoolGrad` function receives incorrectly sized inputs.	406
1499	The following constraints must be met for CVE-2022-35984 to be exploitable:	407
1500	*   The code must use the `ParameterizedTruncatedNormal` function.	407
1501	*   The `shape` argument passed to `ParameterizedTruncatedNormal` must be of type `int64`.	407
1502	Usage of `tf.keras.losses.poisson`	408
1503	Input tensors `y_pred` and `y_true` are processed by `functor::mul` in `BinaryOp`	408
1504	The resulting dimensions from the multiplication of `y_pred` and `y_true` overflow an `int32`	408
1505	TensorFlow version is prior to 2.11 (or prior to 2.10.1, or prior to 2.9.3, or any 2.8.x version)	408
1506	Usage of `ThreadUnsafeUnigramCandidateSampler`	409
1507	Input `filterbank_channel_count` is greater than the allowed max size	409
1508	Affected TensorFlow version (prior to 2.11, 2.10.1, 2.9.3, or 2.8.4)	409
1509	Usage of `tf.raw_ops.FusedResizeAndPadConv2D`	410
1510	Input to `tf.raw_ops.FusedResizeAndPadConv2D` is a large tensor shape	410
1511	Usage of `array_ops.upper_bound`	411
2664	Usage of TensorFlow.	653
1512	Input to `array_ops.upper_bound` is not a rank 2 tensor	411
1513	TensorFlow must be used.	413
1514	TensorFlow version must be prior to 2.12.0.	413
1515	TensorFlow version must be prior to 2.11.1.	413
1516	The `QuantizedMatMulWithBiasAndDequantize` function must be used.	413
1517	MKL (Math Kernel Library) must be enabled.	413
1518	Usage of `mlir::tfg::ConvertGenericFunctionToFunctionDef` function	414
1519	Providing empty function attributes to `mlir::tfg::ConvertGenericFunctionToFunctionDef`	414
1520	TensorFlow version is prior to 2.10.0	414
1521	TensorFlow version is 2.9.x and prior to 2.9.1	414
1522	TensorFlow version is 2.8.x and prior to 2.8.1	414
1523	TensorFlow version is 2.7.x and prior to 2.7.2	414
1524	The code must use TensorFlow.	415
1525	The TensorFlow version must be vulnerable (e.g., older than 2.11, 2.10.1, 2.9.3, or 2.8.4).	415
1526	The code must call `tf.raw_ops.SparseMatrixNNZ`.	415
1527	The input `sparse_matrix` to `tf.raw_ops.SparseMatrixNNZ` must not be a matrix with a shape with rank 0.	415
1528	Usage of `RaggedTensorToVariant` function	416
1529	`rt_nested_splits` list contains tensors	416
1530	Tensors in `rt_nested_splits` have ranks other than one	416
1531	Usage of `SdcaOptimizer`	417
1532	Input `dense_features` is not of rank 2	417
1533	Input `example_state_data` is not of rank 2	417
1534	Usage of TensorFlow.	501
1535	TensorFlow version is prior to 2.9.0, 2.8.1, 2.7.2, or 2.6.4.	501
1536	Usage of `tf.raw_ops.LoadAndRemapMatrix` function.	501
1537	The `initializing_values` argument passed to `tf.raw_ops.LoadAndRemapMatrix` is not a vector as assumed by the function.	501
1538	Usage of `UnbatchGradOp` function	418
1539	`id` argument to `UnbatchGradOp` is not a scalar	418
1540	`batch_index` argument to `UnbatchGradOp` does not contain three times the number of elements as indicated in its `batch_index.dim_size(0)`	418
1541	TensorFlow version is older than 2.10.0	418
1542	TensorFlow version is older than 2.9.1 and not patched	418
1543	TensorFlow version is older than 2.8.1 and not patched	418
1544	TensorFlow version is older than 2.7.2 and not patched	418
1545	Usage of `Conv2DBackpropInput`	419
1546	`input_sizes` is not 4-dimensional	419
1547	Usage of TensorFlow	420
1548	Usage of `tf.reshape` operation	420
1549	Input to `tf.reshape` causes an overflow in the number of elements in a tensor	420
1550	TensorFlow version is vulnerable (e.g., older than 2.10.0, 2.9.1, 2.8.1, or 2.7.2 without the patch)	420
1551	Usage of the `CONV_3D_TRANSPOSE` TensorFlow Lite operator.	423
1552	The reference kernel resolver must be used in the interpreter.	423
1553	The number of input channels (`num_channels`) must be greater than the number of output channels (`output_num_channels`).	423
1554	An attacker must be able to craft a TensorFlow Lite model with a specific number of input channels.	423
1555	The vulnerable code must be running on an affected TensorFlow version (e.g., < 2.11, < 2.10.1, < 2.9.3, < 2.8.4).	423
1556	Usage of `mlir::tfg::ConvertGenericFunctionToFunctionDef`	421
1557	Providing empty function attributes to `mlir::tfg::ConvertGenericFunctionToFunctionDef`	421
1558	Usage of TensorFlow.	422
1559	Usage of `nn_ops.fractional_avg_pool_v2` or `nn_ops.fractional_max_pool_v2`.	422
1560	The first element of the `pooling_ratio` parameter is equal to 1.0.	422
1561	The fourth element of the `pooling_ratio` parameter is equal to 1.0.	422
1562	TensorFlow version is prior to 2.12.0.	422
1563	TensorFlow version is prior to 2.11.1.	422
1564	Usage of the `GatherNd` function	424
1565	Input sizes are greater than or equal to output sizes when using `GatherNd`	424
1566	TensorFlow version is older than 2.10.0	424
1567	TensorFlow version is older than 2.9.1 (if applicable)	424
1568	TensorFlow version is older than 2.8.1 (if applicable)	424
1569	TensorFlow version is older than 2.7.2 (if applicable)	424
1570	Usage of the `GatherNd` function	425
1571	Inputs to `GatherNd` are greater than or equal to the sizes of the outputs	425
1572	TensorFlow version is prior to 2.10.0	425
1573	TensorFlow version is prior to 2.9.1 (if using 2.9.x branch)	425
1574	TensorFlow version is prior to 2.8.1 (if using 2.8.x branch)	425
1575	TensorFlow version is prior to 2.7.2 (if using 2.7.x branch)	425
1576	Usage of the `MakeGrapplerFunctionItem` function.	426
1577	Inputs given to `MakeGrapplerFunctionItem` are greater than or equal to the sizes of the outputs.	426
1578	TensorFlow version is prior to 2.11.0.	426
1579	TensorFlow version is not 2.8.4, 2.9.3, or 2.10.1.	426
1580	Usage of `BaseCandidateSamplerOp` function.	427
1581	`true_classes` input is provided to `BaseCandidateSamplerOp`.	427
1582	Value of `true_classes` is larger than `range_max`.	427
1583	Usage of the `ScatterNd` function	431
1584	An input index greater than the output tensor's bounds	431
1585	An input index less than zero	431
1586	Usage of TensorFlow.	428
1587	TensorFlow version is vulnerable (e.g., not 2.11.0 or later, and not 2.8.4, 2.9.3, or 2.10.1 with the patch).	428
1588	The `MakeGrapplerFunctionItem` function is called.	428
1736	Usage of `tf.raw_ops.RaggedTensorToVariant` function	464
1589	Inputs provided to `MakeGrapplerFunctionItem` have sizes greater than or equal to the sizes of the outputs.	428
1590	TensorFlow is used.	429
1591	TensorFlow version is prior to 2.12.0.	429
1592	TensorFlow version is 2.11.x and does not include the cherry-picked commit.	429
1593	An attacker can interact with the TensorFlow instance to trigger the vulnerability.	429
1594	TensorFlow must be used.	430
1595	TensorFlow version must be prior to 2.12.0.	430
1596	TensorFlow version must be prior to 2.11.1.	430
1597	The `TAvgPoolGrad` operation must be used.	430
1598	Usage of FractionalMax(AVG)Pool operation.	432
1599	Illegal pooling_ratio provided to FractionalMax(AVG)Pool.	432
1600	TensorFlow version is prior to 2.11.0 or 2.10.1 (unpatched).	432
1601	Usage of TensorFlow.	433
1602	TensorFlow version is prior to 2.7.0 (specifically, prior to 2.6.1, 2.5.2, or 2.4.4).	433
1603	Usage of the `ParallelConcat` operation.	433
1604	Input to `ParallelConcat` is crafted to trigger missing input validation leading to division by zero.	433
1605	Usage of `SplitV` function.	434
1606	Attacker-controlled negative arguments are supplied to `SplitV`.	434
1607	The `size_splits` argument contains more than one value.	434
1608	At least one value within the `size_splits` argument is negative.	434
1609	The TensorFlow version is affected (e.g., < 2.7.0, or specific older versions without the cherry-picked fix).	434
1610	Software uses TensorFlow.	435
1611	TensorFlow version is affected (e.g., < 2.7.0, specifically < 2.6.1, < 2.5.2, or < 2.4.4).	435
1612	Code uses TensorFlow convolution operators.	435
1613	Empty filter tensor arguments are passed to convolution operators.	435
1614	Code uses TensorFlow.	436
1615	Code uses the `tf.range` kernel.	436
1616	TensorFlow version is 2.6.0.	436
1617	TensorFlow version is between 2.5.0 and 2.5.1 (inclusive).	436
1618	TensorFlow version is between 2.4.0 and 2.4.3 (inclusive).	436
1619	TensorFlow version is an unpatched version prior to 2.7.0, not including 2.6.1, 2.5.2, or 2.4.4.	436
1620	TensorFlow is used.	437
1621	An LSTM/GRU model is being run.	437
1622	The LSTM/GRU layer receives an input with zero-length.	437
1623	The CUDA backend is being used.	437
1624	Users can control the input to the layer.	437
1625	Usage of `Conv3D` operation.	438
1626	User-controlled input for the `filter` tensor.	438
1627	The fifth element of the `filter` tensor is 0.	438
1628	Invalid shape of the two input tensors.	438
1629	Usage of the `UnsortedSegmentJoin` operation.	439
1630	Attacker control over the `num_segments` tensor argument.	439
1631	The `num_segments` tensor must be empty (have 0 elements).	439
1632	Usage of `tf.raw_ops.LoadAndRemapMatrix`	440
1633	Attacker-controlled input for the first argument (`ckpt_path`) of `LoadAndRemapMatrix`	440
1634	The attacker provides a non-scalar tensor as the first argument to `LoadAndRemapMatrix`	440
1635	The following constraints must be met for CVE-2021-29562 to be exploitable in the code:	441
1636	*   The code must be using TensorFlow.	441
1637	*   The TensorFlow version must be vulnerable (e.g., prior to 2.5.0, specifically 2.4.x before 2.4.2, 2.3.x before 2.3.3, 2.2.x before 2.2.3, or 2.1.x before 2.1.4).	441
1638	*   The code must utilize the `tf.raw_ops.IRFFT` operation.	441
1639	*   An attacker must be able to provide specific, malicious input to `tf.raw_ops.IRFFT` that causes Eigen code to operate on an empty matrix, triggering a `CHECK`-failure and program termination.	441
1640	Usage of TensorFlow.	442
1641	TensorFlow version is 2.4.2, 2.3.3, 2.2.3, 2.1.4, or any unpatched version prior to 2.5.0.	442
1642	Usage of `tf.raw_ops.RFFT`.	442
1643	`tf.raw_ops.RFFT` is called with an empty matrix.	442
1644	An attacker can provide an empty matrix as input to `tf.raw_ops.RFFT`.	442
1645	The following constraints must be met for CVE-2021-29617 to be exploitable:	443
1646	*   The code must utilize TensorFlow.	443
1647	*   The TensorFlow version in use must be vulnerable (e.g., prior to 2.5.0, or specific older patch versions such as 2.4.x before 2.4.2, 2.3.x before 2.3.3, 2.2.x before 2.2.3, or 2.1.x before 2.1.4).	443
1648	*   The code must invoke the `tf.strings.substr` function.	443
1649	*   The `tf.strings.substr` function must be called with invalid arguments, specifically where the position and length tensors have mismatched shapes.	443
1650	Usage of TensorFlow.	444
1651	TensorFlow version is older than 2.5.0, 2.4.2, 2.3.3, 2.2.3, or 2.1.4.	444
1652	Usage of `tf.raw_ops.FusedBatchNorm` function.	444
1653	Attacker can control the last dimension of the `x` tensor input to `tf.raw_ops.FusedBatchNorm`.	444
1654	Usage of `tf.raw_ops.Reverse` function.	445
1655	The first dimension of the tensor argument to `tf.raw_ops.Reverse` must be zero.	445
1656	TensorFlow version is older than 2.5.0 (specifically, 2.4.x < 2.4.2, 2.3.x < 2.3.3, 2.2.x < 2.2.3, or 2.1.x < 2.1.4).	445
1657	Usage of TensorFlow Lite (TFLite)	479
1658	Usage of pooling operations within TFLite	479
1659	Running an affected version of TensorFlow (before 2.6.0, specifically 2.5.1, 2.4.3, or 2.3.4 if not patched)	479
1660	Input data or model configuration that leads to a divisor becoming zero in a pooling operation	479
1661	Usage of TensorFlow.	446
1804	*   TensorFlow version is older than 2.1.4.	489
1662	TensorFlow version is vulnerable (e.g., < 2.5.0, specifically < 2.4.2, < 2.3.3, < 2.2.3, or < 2.1.4).	446
1663	Usage of `tf.raw_ops.SparseMatMul` function.	446
1664	The `b` tensor passed to `tf.raw_ops.SparseMatMul` is empty.	446
1665	An attacker can control the input to `tf.raw_ops.SparseMatMul` to provide an empty `b` tensor.	446
1666	Usage of `Conv2DBackpropFilter` function.	447
1667	User-provided input data.	447
1668	All shapes of the tensors provided as arguments to `Conv2DBackpropFilter` must be empty.	447
1669	Usage of `tf.raw_ops.FractionalAvgPool`	448
1670	User-controlled `input_size[i]` (via `value.shape()`)	448
1671	User-controlled `pooling_ratio_[i]` (via `pooling_ratio` argument)	448
1672	`input_size[i]` must be smaller than `pooling_ratio_[i]`	448
1673	Usage of TensorFlow.	449
1674	Usage of `tf.raw_ops.QuantizedBatchNormWithGlobalNormalization`.	449
1675	Input to `tf.raw_ops.QuantizedBatchNormWithGlobalNormalization` must result in a division by zero.	449
1676	Usage of `tf.raw_ops.QuantizedBatchNormWithGlobalNormalization`	450
1677	Input to `tf.raw_ops.QuantizedBatchNormWithGlobalNormalization` is empty	450
1678	Usage of TensorFlow library.	451
1679	Usage of TensorFlow's PNG encoding functionality (e.g., `tf.io.encode_png`).	451
1680	An attacker must be able to supply an input tensor to the PNG encoding operation.	451
1681	The supplied input tensor for PNG encoding must be empty.	451
1682	The TensorFlow version must be vulnerable (e.g., < 2.5.0, or specific older versions without the fix).	451
1683	Usage of `tf.raw_ops.DrawBoundingBoxes`	452
1684	Input `images` to `tf.raw_ops.DrawBoundingBoxes` is empty	452
1685	`height` of the input `images` is 0	452
1686	Axios version 1.5.1 is in use	47
1687	XSRF-TOKEN is stored in cookies	47
1688	Axios is used to make HTTP requests	47
1689	Requests are made to external or untrusted hosts	47
1690	An attacker can intercept HTTP traffic	47
1691	Usage of `tf.raw_ops.AddManySparseToTensorsMap`	453
1692	Input `sparse_shape` values cause an overflow when used as dimensions for the output shape	453
1693	The `TensorShape` constructor's `InitDims` method returns a non-OK status	453
1694	The legacy `TensorShape` constructor is used instead of `BuildTensorShapeBase` or `AddDimWithStatus`	453
1695	Using TensorFlow.	454
1696	TensorFlow version is vulnerable (e.g., < 2.5.0, < 2.4.2, < 2.3.3, < 2.2.3, or < 2.1.4).	454
1697	The `tf.raw_ops.CTCGreedyDecoder` operation is used in the code.	454
1698	Input provided to `tf.raw_ops.CTCGreedyDecoder` causes the `CHECK_LT` condition to be false.	454
1699	Usage of `tf.raw_ops.SparseConcat`	455
1700	Input `shapes[0]` must contain values that, when used to construct a `TensorShape`, lead to an overflow	455
1701	The TensorFlow version in use must be vulnerable (e.g., prior to 2.5.0, 2.4.2, 2.3.3, 2.2.3, or 2.1.4)	455
1702	Usage of `sparse_split_op.cc`	456
1703	Construction of a new tensor shape with dimensions that can cause an integer overflow	456
1704	Usage of the legacy `TensorShape` constructor	456
1705	The `InitDims` function returning a non-OK status due to an integer overflow	456
1706	Usage of TensorFlow library.	502
1707	TensorFlow version is prior to 2.9.0, 2.8.1, 2.7.2, or 2.6.4.	502
1708	Usage of `tf.raw_ops.QuantizeAndDequantizeV4Grad` function.	502
1709	Input arguments to `tf.raw_ops.QuantizeAndDequantizeV4Grad` are crafted to trigger a `CHECK`-failure.	502
1710	The code must be processing sparse tensors.	457
1711	The code must be converting sparse tensors to CSR Sparse matrices.	457
1712	The input `indices` tensor must contain a value `indices(i, 0)` such that `indices(i, 0) + 1` is outside the bounds of the `csr_row_ptr` array.	457
1713	The vulnerable TensorFlow kernel for sparse to CSR conversion (e.g., `tensorflow/core/kernels/sparse/kernels.cc` at line 66 in affected versions) must be executed.	457
1714	Usage of `tf.raw_ops.Conv2DBackpropFilter`	458
1715	Caller-controlled input for the divisor in a modulus operation within `tf.raw_ops.Conv2DBackpropFilter`	458
1716	The divisor value must be zero	458
1717	Usage of `tf.raw_ops.Conv2D`	459
1718	Caller-controlled input leads to a division by zero	459
1719	Usage of `tf.raw_ops.QuantizedConv2D`	460
1720	Caller must control the divisor quantity in `tf.raw_ops.QuantizedConv2D`	460
1721	Divisor quantity must be set to zero by an attacker	460
1722	Usage of `tf.raw_ops.EditDistance`	461
1723	Input parameters to `tf.raw_ops.EditDistance` are not completely validated	461
1724	The TensorFlow version is affected (e.g., < 2.5.0, < 2.4.2, < 2.3.3, < 2.2.3, < 2.1.4)	461
1725	Usage of TensorFlow	503
1726	TensorFlow version prior to 2.9.0, 2.8.1, 2.7.2, or 2.6.4	503
1727	Usage of `tf.raw_ops.QuantizedConv2D`	503
1728	`tf.raw_ops.QuantizedConv2D` is called with empty input arguments	503
1729	usage of `tf.raw_ops.SparseFillEmptyRows`	462
1730	the `dense_shape` tensor is empty	462
1731	*   Usage of `tf.raw_ops.ImmutableConst` function.	463
1732	*   The `dtype` argument of `tf.raw_ops.ImmutableConst` is set to `tf.resource`.	463
1733	*   The `dtype` argument of `tf.raw_ops.ImmutableConst` is set to `tf.variant`.	463
1734	*   TensorFlow version is prior to 2.5.0.	463
1735	*   TensorFlow nightly package is from before commit 4f663d4b8f0bec1b48da6fa091a7d29609980fa4.	463
1737	The `RaggedTensorToVariant` function is called with an invalid ragged tensor	464
1738	The ragged tensor argument is empty	464
1739	TensorFlow version is affected (e.g., < 2.5.0, < 2.4.2, < 2.3.3, < 2.2.3, < 2.1.4)	464
1740	The following constraints must be met for CVE-2021-29581 to be exploitable:	465
1741	*   The code must utilize the `tf.raw_ops.CTCBeamSearchDecoder` function.	465
1742	*   An empty input tensor must be provided to `tf.raw_ops.CTCBeamSearchDecoder`.	465
1743	*   The TensorFlow version in use must be affected (e.g., prior to 2.5.0, or specific older versions like 2.4.2, 2.3.3, 2.2.3, 2.1.4 before the cherry-picked fix).	465
1744	Usage of `tf.raw_ops.SparseDenseCwiseMul` function.	466
1745	Input arguments to `tf.raw_ops.SparseDenseCwiseMul` lack validation of constraints between dimensions.	466
1746	Input arguments with mismatched dimensions are provided to `tf.raw_ops.SparseDenseCwiseMul`.	466
1747	The TensorFlow version is prior to 2.5.0.	466
1748	The TensorFlow version is prior to 2.4.2 (if using the 2.4.x branch).	466
1749	The TensorFlow version is prior to 2.3.3 (if using the 2.3.x branch).	466
1750	The TensorFlow version is prior to 2.2.3 (if using the 2.2.x branch).	466
1751	The TensorFlow version is prior to 2.1.4 (if using the 2.1.x branch).	466
1752	The following constraints must be met for CVE-2021-37660 to be exploitable:	467
1753	*   The software must be using TensorFlow.	467
1754	*   The TensorFlow version must be affected (prior to 2.6.0, 2.5.1, 2.4.3, or 2.3.4).	467
1755	*   The code must call TensorFlow's "inplace operations".	467
1756	*   The "inplace operations" must be called with crafted arguments.	467
1757	*   Specifically, the arguments `x` and `v` for the inplace operation must be empty.	467
1758	*   The vulnerable logic in `tensorflow/core/kernels/inplace_ops.cc` (using `||` instead of `&&` when checking if `x` and `v` are empty) must be triggered.	467
1759	*   The crafted arguments must lead to a division by zero, causing a floating-point exception.	467
1760	Usage of `tf.raw_ops.NonMaxSuppressionV5`	468
1761	Usage of `CombinedNonMaxSuppression`	468
1762	Application serving models using TensorFlow	468
1763	Attacker can supply a negative value as an argument for resizing `std::vector`	468
1764	TensorFlow version is prior to 2.6.0 (specifically 2.5.x before 2.5.1, 2.4.x before 2.4.3, or 2.3.x before 2.3.4)	468
1765	Usage of TensorFlow.	469
1766	TensorFlow version is affected (prior to 2.6.0, 2.5.1, 2.4.3, or 2.3.4).	469
1767	Processing of TFLite models from untrusted sources.	469
1768	The TFLite model must be crafted by an attacker.	469
1769	The crafted TFLite model must utilize the `L2NormalizeReduceAxis` operator.	469
1770	MLIR optimization for `L2NormalizeReduceAxis` operator must be active.	469
1771	The input vector for the `L2NormalizeReduceAxis` operator must be empty.	469
1772	The vulnerability CVE-2024-39338 in axios 1.7.2 allows for Server-Side Request Forgery (SSRF) due to unexpected behavior where path-relative URLs are processed as protocol-relative URLs. This could enable an attacker to make arbitrary requests from the server, potentially accessing internal systems or exfiltrating sensitive data.	48
1773	For this vulnerability to be exploitable, the following constraints must be met:	48
1774	*   The application must be using axios version 1.7.2 or an earlier vulnerable version.	48
1775	*   The application must be making HTTP requests using the axios library.	48
1776	*   The application must be constructing axios request URLs using path-relative URLs.	48
1777	*   The path-relative URL must be influenced or controlled by an attacker.	48
1778	*   The crafted path-relative URL must be interpreted by axios as a protocol-relative URL, leading to a request to an unintended external host.	48
1779	*   The vulnerable axios instance must be running in a server-side environment where it can initiate requests to internal or external systems.	48
1780	Usage of TensorFlow.	470
1781	TensorFlow version is prior to 2.6.0, 2.5.1, 2.4.3, or 2.3.4.	470
1782	Usage of `tf.raw_ops.ResourceGather`.	470
1783	Input to `tf.raw_ops.ResourceGather` can be manipulated to cause `batch_size` to be zero.	470
1784	Usage of TensorFlow.	471
1785	TensorFlow version is prior to 2.6.0, 2.5.1, 2.4.3, or 2.3.4.	471
1786	Usage of `tf.raw_ops.MapStage` operation.	471
1787	The `key` input to `tf.raw_ops.MapStage` is an invalid or empty tensor.	471
1788	An attacker can control the `key` input to `tf.raw_ops.MapStage`.	471
1789	TensorFlow must be used.	472
1790	An affected TensorFlow version must be in use (prior to 2.6.0, 2.5.1, 2.4.3, or 2.3.4).	472
1791	Convolution operators must be utilized in the code.	472
1792	The shape inference implementation must be invoked.	472
1793	Input data must lead to division by zero or modulo by zero in shape inference.	472
1794	Lack of input validation before division or modulo operations in the shape inference implementation.	472
1795	Usage of `tf.raw_ops.TensorListReserve`	473
1796	`num_elements` argument of `tf.raw_ops.TensorListReserve` must be a negative value	473
1797	Input to `num_elements` must be controllable by a user/attacker	473
1798	TensorFlow version must be affected (prior to 2.6.0, 2.5.1, 2.4.3, or 2.3.4 without the patch)	473
1799	*   Usage of TensorFlow library.	489
1800	*   TensorFlow version is older than 2.5.0.	489
1801	*   TensorFlow version is older than 2.4.2.	489
1802	*   TensorFlow version is older than 2.3.3.	489
1803	*   TensorFlow version is older than 2.2.3.	489
1805	*   The `MatrixTriangularSolve` operation is used in the code.	489
1806	*   A validation condition within the `MatrixTriangularSolve` implementation fails.	489
1807	Usage of `tf.raw_ops.QuantizeAndDequantizeV4Grad`	474
1808	A negative value provided for the `axis` argument	474
1809	TensorFlow version is prior to 2.6.0	474
1810	TensorFlow version is 2.5.x and prior to 2.5.1	474
1811	TensorFlow version is 2.4.x and prior to 2.4.3	474
1812	Usage of `tf.raw_ops.ResourceScatterDiv`	475
1813	Division by zero occurs within `tf.raw_ops.ResourceScatterDiv`	475
1814	TensorFlow version is 2.5.0 or earlier (specifically 2.5.x, 2.4.x, 2.3.x before the patched versions)	475
1815	Usage of TensorFlow library.	476
1816	TensorFlow version is prior to 2.6.0 (specifically, prior to 2.5.1, 2.4.3, or 2.3.4).	476
1817	Usage of `tf.raw_ops.SparseDenseCwiseDiv` function.	476
1818	Input to `tf.raw_ops.SparseDenseCwiseDiv` results in a division by zero.	476
1819	Usage of `tf.raw_ops.StringNGrams`	477
1820	User-supplied negative `ngram_widths` value	477
1821	Affected TensorFlow version (e.g., < 2.6.0, < 2.5.1, < 2.4.3, or < 2.3.4)	477
1822	Usage of TensorFlow Lite (TFLite)	478
1823	Usage of fully connected layers in TFLite	478
1824	Code execution reaches `tensorflow/lite/kernels/fully_connected.cc#L226`	478
1825	TensorFlow version is prior to 2.6.0 (specifically 2.5.1, 2.4.3, or 2.3.4 without the patch)	478
1826	Usage of Go code interacting with TensorFlow	480
1827	Usage of string tensors	480
1828	String tensor garbage collected	480
1829	String tensor encoding failure (e.g., due to mismatched dimensions)	480
1830	Usage of `tf.raw_ops.CompressElement`	481
1831	Passing an invalid input to `tf.raw_ops.CompressElement`	481
1832	TensorFlow version is affected (e.g., older than 2.6.0, 2.5.1, 2.4.3, or 2.3.4)	481
1833	Usage of `tf.histogram_fixed_width`	498
1834	`values` array contains `NaN` elements	498
1835	Code is running on CPU	498
1836	TensorFlow version is prior to 2.9.0	498
1837	TensorFlow version is prior to 2.8.1	498
1838	TensorFlow version is prior to 2.7.2	498
1839	TensorFlow version is prior to 2.6.4	498
1840	Usage of `tf.transpose` function.	482
1841	Passing a complex argument to `tf.transpose`.	482
1842	Passing `conjugate=True` argument to `tf.transpose`.	482
1843	TensorFlow version is prior to 2.5.0.	482
1844	TensorFlow version is 2.4.x prior to 2.4.2.	482
1845	TensorFlow version is 2.3.x prior to 2.3.3.	482
1846	TensorFlow version is 2.2.x prior to 2.2.3.	482
1847	TensorFlow version is 2.1.x prior to 2.1.4.	482
1848	Usage of `tf.raw_ops.SparseCountSparseOutput`	483
1849	Passing invalid arguments to `tf.raw_ops.SparseCountSparseOutput`	483
1850	TensorFlow version is prior to 2.5.0	483
1851	TensorFlow version is prior to 2.4.2 (if on 2.4.x branch)	483
1852	TensorFlow version is prior to 2.3.3 (if on 2.3.x branch)	483
1853	TensorFlow version is prior to 2.2.3 (if on 2.2.x branch)	483
1854	TensorFlow version is prior to 2.1.4 (if on 2.1.x branch)	483
1855	The following constraints must be met for CVE-2021-29519 to be exploitable:	484
1856	*   The code must use the `tf.raw_ops.SparseCross` API.	484
1857	*   The `tf.raw_ops.SparseCross` API must be called with a tensor of type `tstring`.	484
1858	*   The `tstring` tensor must contain integral elements.	484
1859	*   The `tf.raw_ops.SparseCross` API must be called in a way that mixes `DT_STRING` and `DT_INT64` types.	484
1860	*   The TensorFlow version in use must be vulnerable (e.g., prior to 2.5.0, or specific unpatched versions like 2.1.x < 2.1.4, 2.2.x < 2.2.3, 2.3.x < 2.3.3, 2.4.x < 2.4.2).	484
1861	Usage of TFLite code for allocating `TFLiteIntArray`s.	485
1862	Attacker-crafted model.	485
1863	`size` multiplier in the crafted model is large enough to cause an integer overflow in the `int` datatype, resulting in a negative value.	485
1864	The negative value is passed to `malloc`.	485
1865	Dereferencing of `ret->size` occurs after the invalid `malloc` call.	485
1866	Usage of TensorFlow Lite (TFLite)	486
1867	Usage of the hashtable lookup operation in TFLite	486
1868	A crafted model where the `values`'s first dimension is 0	486
1869	The vulnerability CVE-2021-29522 in TensorFlow has the following constraints for exploitation:	487
1870	*   The code must utilize `tf.raw_ops.Conv3DBackprop*` operations.	487
1871	*   The input tensors provided to these operations must be empty.	487
1872	*   An attacker must be able to control the input sizes of these operations.	487
1873	*   The TensorFlow version in use must be vulnerable (e.g., versions prior to 2.5.0, 2.4.2, 2.3.3, 2.2.3, or 2.1.4).	487
1874	Usage of `tf.raw_ops.UncompressElement`	488
1875	Input `Variant` tensor does not contain a `CompressedElement`	488
1876	The code must be using TensorFlow.	490
1877	The TensorFlow version must be vulnerable (e.g., prior to 2.5.0, or specific older versions like 2.4.x before 2.4.2, 2.3.x before 2.3.3, 2.2.x before 2.2.3, or 2.1.x before 2.1.4).	490
1878	The `ParseAttrValue` function must be called or reachable in the code.	490
1879	The application must process specially crafted input that can trigger the recursive stack overflow in `ParseAttrValue`.	490
1880	Usage of `tf.raw_ops.FractionalMaxPoolGrad`	491
1882	Input and output tensors are not validated for emptiness	491
1883	Input and output tensors are not validated for same rank	491
1884	TensorFlow version is 2.5.0 or older (specifically 2.4.x, 2.3.x, 2.2.x, 2.1.x before the cherry-picked fixes)	491
1885	Usage of `tf.raw_ops.SdcaOptimizer`	492
1886	User-supplied arguments are not validated by the implementation	492
1887	User-supplied arguments do not satisfy all constraints expected by the op	492
1888	Usage of TensorFlow Lite (TFLite) framework.	493
1889	Usage of the `DepthwiseConv` TFLite operator.	493
1890	Ability for an attacker to craft or control the input model.	493
1891	The crafted model must set the fourth dimension of the `input` to 0.	493
1892	Usage of `tf.raw_ops.SparseTensorSliceDataset`	494
1893	User provides an invalid sparse tensor	494
1894	`indices` argument is empty	494
1895	`values` argument is provided (or not, the key is `indices` being empty while `values` state is inconsistent with `indices`)	494
1896	TensorFlow must be used.	495
1897	Affected TensorFlow version (prior to 2.7.0, specifically 2.6.x prior to 2.6.1, 2.5.x prior to 2.5.2, or 2.4.x prior to 2.4.4).	495
1898	Usage of the `AllToAll` operation.	495
1899	The `split_count` argument of `AllToAll` must be 0.	495
1900	Vulnerable TensorFlow/TFLite version is prior to 2.9.0, 2.8.1, 2.7.2, or 2.6.4.	496
1901	TFLite model was created using the TFLite model converter.	496
1902	TFLite model is loaded in the TFLite interpreter.	496
1903	Quantized TFLite model has a scale of values greater than 1.	496
1904	The `QuantizeMultiplierSmallerThanOneExp` function is called.	496
1905	The `TFLITE_CHECK_LT` assertion is triggered.	496
1906	Usage of TensorFlow.	497
1907	TensorFlow version is prior to 2.9.0, 2.8.1, 2.7.2, or 2.6.4.	497
1908	Code is running in TensorFlow's eager mode.	497
1909	An invalid (specifically, empty) resource handle is provided to a TensorFlow operation.	497
1910	TensorFlow must be used.	504
1911	TensorFlow version must be prior to 2.9.0, 2.8.1, 2.7.2, or 2.6.4.	504
1912	The `tf.raw_ops.SpaceToBatchND` function must be called.	504
1913	Input to `tf.raw_ops.SpaceToBatchND` must trigger an integer overflow during output tensor allocation.	504
1914	Usage of TensorFlow.	505
1915	TensorFlow version is prior to 2.9.0, 2.8.1, 2.7.2, or 2.6.4.	505
1916	Usage of the `tf.raw_ops.SparseTensorDenseAdd` function.	505
1917	Input arguments to `tf.raw_ops.SparseTensorDenseAdd` are crafted to exploit the insufficient validation.	505
1918	Usage of `tf.raw_ops.SparseTensorToCSRSparseMatrix`	506
1919	TensorFlow version prior to 2.9.0, 2.8.1, 2.7.2, or 2.6.4	506
1920	`dense_shape` input is not a vector	506
1921	`indices` input is not a matrix	506
1922	TensorFlow version prior to 2.9.0, 2.8.1, 2.7.2, or 2.6.4	507
1923	Usage of `tf.raw_ops.StagePeek`	507
1924	The `index` argument passed to `tf.raw_ops.StagePeek` is not a scalar	507
1925	Usage of TensorFlow.	509
1926	TensorFlow version is prior to 2.9.0, 2.8.1, 2.7.2, or 2.6.4.	509
1927	Usage of TensorFlow assertion macros (e.g., `CHECK_LT`, `CHECK_GT`).	509
1928	Comparison of `size_t` and `int` values within the assertion macros.	509
1929	TensorFlow version is prior to 2.9.0, 2.8.1, 2.7.2, or 2.6.4	510
1930	Code calls `tf.compat.v1.*` operations	510
1931	The `tf.compat.v1.*` operation does not support quantized types	510
1932	The code is running on TensorFlow 2.x	510
1933	Usage of TensorFlow.	511
1934	Usage of `tf.raw_ops.MaxPoolGrad`.	511
1935	Missing validation for `orig_input` tensor.	511
1936	Missing validation for `orig_output` tensor.	511
1937	TensorFlow version is prior to 2.6.0.	511
1938	TensorFlow version is 2.5.1.	511
1939	TensorFlow version is 2.4.3.	511
1940	TensorFlow version is 2.3.4.	511
1941	Usage of `tf.raw_ops.Dequantize`	512
1942	TensorFlow version is prior to 2.6.0, 2.5.1, 2.4.3, or 2.3.4	512
1943	An attacker can provide an invalid `axis` argument to `tf.raw_ops.Dequantize` (e.g., a value less than -1)	512
1944	Usage of `tf.raw_ops.Conv3DBackpropFilterV2`	513
1945	`filter_sizes` argument is not a vector	513
1946	TensorFlow version is prior to 2.9.0	513
1947	TensorFlow version is prior to 2.8.1	513
1948	TensorFlow version is prior to 2.7.2	513
1949	TensorFlow version is prior to 2.6.4	513
1950	TensorFlow version prior to 2.9.0	514
1951	TensorFlow version prior to 2.8.1	514
1952	TensorFlow version prior to 2.7.2	514
1953	TensorFlow version prior to 2.6.4	514
1954	Usage of `tf.raw_ops.LSTMBlockCell`	514
1955	Input arguments to `tf.raw_ops.LSTMBlockCell` are not fully validated	514
1956	Ranks of arguments to `tf.raw_ops.LSTMBlockCell` are not validated	514
1957	Elements of the tensor arguments to `tf.raw_ops.LSTMBlockCell` are accessed	514
1958	Total number of elements in a tensor exceeds the maximum value of `int64_t`.	515
1959	Usage of `MultiplyWithoutOverflow` function.	515
1960	TensorFlow version is prior to 2.7.0.	515
1961	TensorFlow version is 2.6.x prior to 2.6.1.	515
1962	TensorFlow version is 2.5.x prior to 2.5.2.	515
1963	TensorFlow version is 2.4.x prior to 2.4.4.	515
1964	Usage of `tf.image.resize`	516
1965	Input argument to `tf.image.resize` is large enough to cause an overflow in `int64_t` for the output tensor size	516
1966	TensorFlow version is prior to 2.7.0	516
1967	TensorFlow version is 2.6.x (specifically 2.6.0)	516
1968	TensorFlow version is 2.5.x (specifically 2.5.0 or 2.5.1)	516
1969	TensorFlow version is 2.4.x (specifically 2.4.0, 2.4.1, 2.4.2, or 2.4.3)	516
1970	Usage of `tf.raw_ops.EditDistance`	547
1971	Inputting negative values to `tf.raw_ops.EditDistance`	547
1972	TensorFlow version is prior to 2.9.0	547
1973	TensorFlow version is prior to 2.8.1	547
1974	TensorFlow version is prior to 2.7.2	547
1975	TensorFlow version is prior to 2.6.4	547
1976	Usage of `tf.tile` function	517
1977	Input argument to `tf.tile` is large	517
1978	Number of elements in the output tensor exceeds `int64_t` capacity	517
1979	TensorFlow version is affected (prior to 2.7.0, 2.6.1, 2.5.2, or 2.4.4)	517
1980	Usage of `tf.math.segment_*` operations	518
1981	A segment ID in `segment_ids` is large	518
1982	The number of elements in the tensor overflows an `int64_t` value	518
1983	TensorFlow version is prior to 2.7.0, 2.6.1, 2.5.2, or 2.4.4	518
1984	Keras pooling layers are used.	519
1985	The size of the pool is 0.	519
1986	A dimension of the pool is negative.	519
1987	Usage of `tf.raw_ops.UnsortedSegmentJoin`	520
1988	`num_segments` argument is a negative value	520
1989	TensorFlow version is prior to 2.9.0	520
1990	TensorFlow version is prior to 2.8.1	520
1991	TensorFlow version is prior to 2.7.2	520
1992	TensorFlow version is prior to 2.6.4	520
1993	Usage of `tf.raw_ops.UnsortedSegmentJoin` in the code.	521
1994	The `num_segments` argument provided to `tf.raw_ops.UnsortedSegmentJoin` is not a scalar.	521
1995	The TensorFlow version used is older than 2.9.0, 2.8.1, 2.7.2, or 2.6.4.	521
1996	Usage of `tf.raw_ops.QuantizedBatchNormWithGlobalNormalization`	522
1997	Input shapes must be crafted to result in `vector_num_elements` being zero	522
1998	- Usage of TensorFlow library.	523
1999	- Usage of `tf.raw_ops.QuantizedMul` operation.	523
2000	- Caller-controlled input to `tf.raw_ops.QuantizedMul` that is used as a divisor.	523
2001	- The controlled input quantity must be zero.	523
2002	Code uses `tf.raw_ops.UnravelIndex`.	524
2003	Input `dims` tensor to `tf.raw_ops.UnravelIndex` contains at least one element with a value of 0.	524
2004	Usage of TensorFlow library.	525
2005	Usage of TFLite models.	525
2006	Attacker-controlled TFLite model.	525
2007	The TFLite model must utilize the LSH projection operation.	525
2008	The TensorFlow version must be affected (e.g., < 2.6.0, < 2.5.1, < 2.4.3, < 2.3.4).	525
2009	body-parser package is used	59
2010	body-parser version is less than 1.20.3	59
2011	URL encoding is enabled in body-parser configuration	59
2012	Server is exposed to specially crafted payloads	59
2013	Usage of TensorFlow Lite (TFLite)	526
2014	Performing a division operation in TFLite	526
2015	The divisor tensor contains zero elements	526
2016	TensorFlow version is prior to 2.6.0 (specifically 2.5.x before 2.5.1, 2.4.x before 2.4.3, or 2.3.x before 2.3.4)	526
2017	Usage of TensorFlow.	527
2018	Call to `tf.raw_ops.MaxPoolGradWithArgmax`.	527
2019	The batch dimension of the input tensor to `tf.raw_ops.MaxPoolGradWithArgmax` is zero.	527
2020	This was not a security issue in Bootstrap and the CVE has been rescinded.	60
2021	Usage of `tf.raw_ops.StringNGrams`	528
2022	`data_splits` argument is not fully validated	528
2023	Output tensor is computed to have 0 or negative size	528
2024	Later writes to the output tensor occur	528
2025	Usage of TensorFlow	529
2026	Building a control flow graph for a TensorFlow model	529
2027	Presence of nodes that should be paired (e.g., `Enter` and `Exit` nodes)	529
2028	The first node in a pairing (e.g., an `Enter` node) does not exist when the second node (e.g., an `Exit` node) is encountered	529
2029	TensorFlow version is prior to 2.7.0	529
2030	TensorFlow version is prior to 2.6.1 (if using 2.6.x branch)	529
2031	TensorFlow version is prior to 2.5.2 (if using 2.5.x branch)	529
2032	TensorFlow version is prior to 2.4.4 (if using 2.4.x branch)	529
2033	Usage of `DeserializeSparse` function.	530
2034	Input `serialize_sparse` tensor to `DeserializeSparse`.	530
2035	`serialize_sparse` tensor has a positive rank.	530
2036	`serialize_sparse` tensor has `3` as its last dimension.	530
2037	TensorFlow version is prior to 2.7.0 (specifically 2.6.x prior to 2.6.1, 2.5.x prior to 2.5.2, or 2.4.x prior to 2.4.4).	530
2038	Usage of `tf.summary.create_file_writer` function.	531
2039	`tf.summary.create_file_writer` is called with non-scalar arguments.	531
2040	TensorFlow version is prior to 2.7.0.	531
2041	TensorFlow version is prior to 2.6.1.	531
2042	TensorFlow version is prior to 2.5.2.	531
2043	TensorFlow version is prior to 2.4.4.	531
2044	Usage of `tf.compat.v1.signal.rfft2d` or `tf.compat.v1.signal.rfft3d`	532
2045	TensorFlow version prior to 2.9.0	532
2046	TensorFlow version prior to 2.8.1	532
2047	TensorFlow version prior to 2.7.2	532
2048	TensorFlow version prior to 2.6.4	532
2049	Specific input conditions that trigger `CHECK`-failures	532
2050	Usage of `boosted_trees_create_quantile_stream_resource` function.	533
2051	`num_streams` argument must be a negative value.	533
2052	The TensorFlow version must be affected (e.g., < 2.6.0, < 2.5.1, < 2.4.3, or < 2.3.4).	533
2053	Usage of `tf.raw_ops.StringNGrams`	534
2054	Crafted inputs are passed to `tf.raw_ops.StringNGrams`	534
2055	`num_tokens` is 0	534
2056	`data_start_index` is 0	534
2057	Left padding is present	534
2058	Usage of `tf.raw_ops.ReverseSequence`	535
2059	`seq_dim` argument is invalid (e.g., negative)	535
2060	`batch_dim` argument is invalid (e.g., negative)	535
2061	- Usage of TensorFlow.	536
2062	- TensorFlow version is prior to 2.7.0, or prior to 2.6.1, 2.5.2, or 2.4.4 without the specific cherry-picked fixes.	536
2063	- The Grappler optimizer phase is active.	536
2064	- Constant folding is performed during the Grappler optimization.	536
2065	- Constant folding attempts to deep copy a resource tensor.	536
2066	TensorFlow is used.	537
2067	The Grappler optimizer is used.	537
2068	The `train_nodes` vector (obtained from the saved model that gets optimized) does not contain a `Dequeue` node.	537
2069	The TensorFlow version is prior to 2.7.0 (specifically 2.6.1, 2.5.2, or 2.4.4).	537
2070	Usage of TensorFlow Lite (TFLite)	538
2071	Usage of the `GatherNd` operation	538
2072	Usage of the `Gather` operation	538
2073	Model crafted with negative values in `indices` input for `GatherNd` or `Gather`	538
2074	Affected TensorFlow version (prior to 2.6.0, or specific patched versions like 2.5.1, 2.4.3, 2.3.4 without the cherry-picked commits)	538
2075	Usage of TensorFlow Lite (TFLite)	539
2076	Usage of the `expand_dims` operation	539
2077	The `axis` parameter provided to `expand_dims` must be a large negative value	539
2078	Usage of `tf.raw_ops.SdcaOptimizerV2`	540
2079	Input `example_labels` with a length different from the number of examples	540
2080	Input specially crafted illegal arguments	540
2081	Usage of `tf.raw_ops.UpperBound`	541
2082	Usage of `tf.raw_ops.LowerBound`	541
2083	Supplying specially crafted illegal arguments	541
2084	`sorted_input` argument has an invalid rank	541
2085	The following constraints must be met for CVE-2021-41227 to be exploitable:	542
2086	*   The code must be using TensorFlow.	542
2087	*   The TensorFlow version must be affected (e.g., < 2.7.0, < 2.6.1, < 2.5.2, < 2.4.4).	542
2088	*   The `ImmutableConst` operation must be used in the code.	542
2089	*   The `ImmutableConst` operation must process a `tstring` TensorFlow string class.	542
2090	*   The `tstring` must be a memory-mapped string.	542
2091	Usage of `tf.raw_ops.ImmutableConst`	543
2092	Tensor type is not an integral type	543
2093	Tensor is created from a memory-mapped file	543
2094	Memory-mapped file is large enough to accommodate the tensor	543
2095	Affected TensorFlow version (prior to 1.15.5, 2.0.4, 2.1.3, 2.2.2, 2.3.2, or 2.4.0)	543
2096	Usage of `tf.raw_ops.MatrixDiagPartOp`	544
2097	Invalid padding value provided to `tf.raw_ops.MatrixDiagPartOp`	544
2098	Input tensor to `tf.raw_ops.MatrixDiagPartOp` is empty	544
2099	Input tensor to `tf.raw_ops.MatrixDiagPartOp` is not empty but its size is not properly validated before reading the first value	544
2100	Usage of TensorFlow Lite (TFLite)	545
2101	Usage of TFLite operations that employ quantization	545
2102	`quantization.type` is `kTfLiteNoQuantization`	545
2103	`quantization.params` is accessed/used when `quantization.type` is `kTfLiteNoQuantization`	545
2104	TensorFlow version is prior to 2.6.0	545
2105	TensorFlow version is 2.5.1, 2.4.3, or 2.3.4 without the cherry-picked fixes	545
2107	Usage of the concatenation operation in TFLite	546
2108	Attacker-crafted model	546
2109	Input tensor dimensions cause an integer overflow when represented as `int`	546
2110	Model converted from TensorFlow (TF) to TFLite	546
2111	Original TF model uses dimensions that exceed `int` capacity but fit `int64`	546
2112	TFLite uses `int` for tensor dimensions	546
2113	TensorFlow version is older than 2.5.0 (or specific patched versions like 2.4.2, 2.3.3, 2.2.3, 2.1.4)	546
2114	Software must be using TensorFlow.	571
2115	TensorFlow version must be vulnerable (e.g., < 2.8.0, < 2.7.1, < 2.6.3, or < 2.5.3).	571
2116	A `SavedModel` must be used or processed by the application.	571
2117	A malicious user must be able to alter the `SavedModel`.	571
2118	The altered `SavedModel` must be loaded or executed by the TensorFlow application.	571
2119	The alteration must lead to falsified assertions in `function.cc`.	571
2120	Usage of TensorFlow.	548
2121	Usage of `tf.raw_ops.UnicodeEncode`.	548
2122	The `input_value`/`input_splits` pair provided to `tf.raw_ops.UnicodeEncode` must not specify a valid sparse tensor.	548
2123	TensorFlow version is vulnerable (e.g., < 2.5.0, or specific older versions not patched: 2.4.x < 2.4.2, 2.3.x < 2.3.3, 2.2.x < 2.2.3, 2.1.x < 2.1.4).	548
2124	Usage of `tf.raw_ops.RaggedCross` function.	549
2125	Supplying invalid tensor values to `tf.raw_ops.RaggedCross`.	549
2126	Lack of validation for user-supplied arguments within the `RaggedCross` implementation.	549
2127	The `next_*` index values exceeding the valid range for the `*_list` arrays during array element access.	549
2128	Usage of `tf.raw_ops.QuantizeAndDequantizeV3`	550
2129	User-supplied `axis` attribute	550
2130	Invalid (out-of-bounds) value for the `axis` attribute	550
2131	Usage of `tf.raw_ops.Dequantize`	551
2132	`min_range` and `max_range` tensors passed to `tf.raw_ops.Dequantize` have different shapes	551
2133	TensorFlow version is older than 2.5.0 (or 2.4.2, 2.3.3, 2.2.3, 2.1.4 without the cherry-picked fix)	551
2134	Usage of TensorFlow.	552
2135	TensorFlow version is prior to 2.6.0, 2.5.1, 2.4.3, or 2.3.4.	552
2136	The `BoostedTreesSparseCalculateBestFeatureSplit` function is called.	552
2137	Specially crafted illegal arguments are sent to `BoostedTreesSparseCalculateBestFeatureSplit`.	552
2138	Values in the `stats_summary_indices` argument are out of range.	552
2139	There are no exploitable constraints for CVE-2024-6531 because the CVE has been rejected and rescinded, as it was determined not to be a security issue within Bootstrap's security model.	61
2140	Usage of `tf.raw_ops.ResourceGather`	553
2141	User-supplied `batch_dims` value is not less than the rank of the input tensor	553
2142	The following constraints must be met for CVE-2021-37641 to be exploitable:	554
2143	*   Usage of the `tf.raw_ops.RaggedGather` function in the code.	554
2144	*   The arguments provided to `tf.raw_ops.RaggedGather` do not determine a valid ragged tensor.	554
2145	*   A tensor's first dimension is read before checking that the tensor has a rank of at least 1 (i.e., it is a scalar).	554
2146	*   The `params_nested_splits` argument is an empty list of tensors.	554
2147	*   The TensorFlow version in use is affected, specifically versions prior to 2.6.0, or versions 2.5.x before 2.5.1, 2.4.x before 2.4.3, or 2.3.x before 2.3.4.	554
2148	Usage of `AddManySparseToTensorsMap`	582
2149	Input tensors with shapes that can cause an integer overflow	582
2150	Lack of validation on the shapes of the input tensors	582
2151	Construction of a large `TensorShape` with user-provided dimensions	582
2152	Usage of `tf.raw_ops.MaxPoolGradWithArgmax`	555
2153	`input_min` tensor is empty	555
2154	`input_max` tensor is empty	555
2155	Attacker supplies specially crafted inputs	555
2156	Usage of `tf.raw_ops.MaxPoolGradWithArgmax` function	556
2157	Attacker-controlled input to `tf.raw_ops.MaxPoolGradWithArgmax`	556
2158	Specially crafted inputs that cause mismatched array sizes when indexed with the same value	556
2159	*   Usage of `Minimum` TFLite operator	557
2160	*   Usage of `Maximum` TFLite operator	557
2161	*   At least one of the two input tensor arguments is empty	557
2162	Usage of TensorFlow sparse reduction operations.	558
2163	Input data causing a reduction group to overflow.	558
2164	Input data causing an index to point outside the bounds of the input tensor.	558
2165	The vulnerability CVE-2021-29613 in TensorFlow is an out-of-bounds read from heap due to incomplete validation in `tf.raw_ops.CTCLoss`.	559
2166	Here are the constraints for its exploitability:	559
2167	*   The affected code must be using TensorFlow.	559
2168	*   The TensorFlow version must be vulnerable (e.g., < 2.5.0, specifically 2.4.2, 2.3.3, 2.2.3, or 2.1.4).	559
2169	*   The `tf.raw_ops.CTCLoss` function must be called within the code.	559
2170	*   The input provided to `tf.raw_ops.CTCLoss` must be crafted to trigger incomplete validation.	559
2171	TensorFlow must be used.	560
2172	TensorFlow version must be less than 2.7.0.	560
2173	TensorFlow version must be less than 2.6.1.	560
2174	TensorFlow version must be less than 2.5.2.	560
2175	TensorFlow version must be less than 2.4.4.	560
2176	The `FusedBatchNorm` kernel must be used.	560
2177	Heap out-of-bounds access must be possible.	560
2178	Usage of `SparseBinCount` function.	561
2179	Missing validation between the elements of the `values` argument and the shape of the sparse output.	561
2180	TensorFlow version is prior to 2.7.0 (specifically 2.6.1, 2.5.2, or 2.4.4 or earlier unsupported versions).	561
2181	Usage of `SparseFillEmptyRows` function	562
2182	Size of `indices` does not match the size of `values`	562
2183	TensorFlow version is 2.6.1 or older (specifically 2.6.1, 2.5.2, 2.4.4, or any version prior to 2.7.0)	562
2184	Usage of TensorFlow	563
2185	Usage of `tf.ragged.cross` function	563
2186	TensorFlow version is less than 2.7.0	563
2187	TensorFlow version is less than 2.6.1 (if using 2.6.x branch)	563
2188	TensorFlow version is less than 2.5.2 (if using 2.5.x branch)	563
2189	TensorFlow version is less than 2.4.4 (if using 2.4.x branch)	563
2190	Usage of TensorFlow.	564
2191	Usage of `SparseCountSparseOutput`.	564
2192	TensorFlow version is prior to 2.7.0.	564
2193	TensorFlow version is 2.6.x and prior to 2.6.1.	564
2194	TensorFlow version is 2.5.x and prior to 2.5.2.	564
2195	TensorFlow version is 2.4.x and prior to 2.4.4.	564
2196	Shape inference functions for `SparseCountSparseOutput` are triggered.	564
2197	Usage of TensorFlow	565
2198	Usage of `QuantizeAndDequantizeV*` operations	565
2199	TensorFlow version is prior to 2.7.0	565
2200	TensorFlow version is 2.6.1, 2.5.2, or 2.4.4	565
2201	Shape inference functions are triggered	565
2202	Usage of urllib3 library.	718
2203	urllib3 version is before 1.26.5.	718
2204	A URL is processed by urllib3.	718
2205	The URL contains many '@' characters.	718
2206	The '@' characters are in the authority component of the URL.	718
2207	The URL is passed as a parameter or redirected to via an HTTP redirect.	718
2208	Usage of `tf.raw_ops.RaggedTensorToTensor`	566
2209	Attacker controls the shape of input arguments to `tf.raw_ops.RaggedTensorToTensor`	566
2210	Input arguments are crafted such that `parent_output_index` is shorter than `row_split` when accessed with the same index	566
2211	Usage of TensorFlow	567
2212	Presence of an invalid graph node	567
2213	Call to `ImmutableExecutorState::Initialize`	567
2214	`item->kernel` must have been previously allocated memory	567
2215	TensorFlow version is 2.5.x (excluding 2.5.3 and later)	567
2216	TensorFlow version is 2.6.x (excluding 2.6.3 and later)	567
2217	TensorFlow version is 2.7.x (excluding 2.7.1 and later)	567
2218	Usage of `Sparse*Cwise*` ops	585
2219	Lack of validation on the shapes of input tensors	585
2220	Construction of `TensorShape` objects with user-provided dimensions	585
2221	User-provided dimensions leading to large allocations or `CHECK`-fails	585
2222	Usage of `dlpack.to_dlpack` function.	568
2223	Passing a list of strings to `dlpack.to_dlpack`.	568
2224	TensorFlow version is before 2.2.1 or 2.3.1.	568
2225	The `status` argument during validation failures is not properly checked.	568
2226	TensorFlow is used.	569
2227	A vulnerable version of TensorFlow is in use (e.g., prior to 2.8.0, or specific older versions like 2.7.1, 2.6.3, 2.5.3 if not patched).	569
2228	A `SavedModel` is used.	569
2229	A malicious user can alter the `SavedModel`.	569
2230	The Grappler optimizer is used.	569
2231	The altered `SavedModel` causes the Grappler optimizer to attempt to build a tensor using a reference `dtype`.	569
2232	The `Tensor` constructor is called with a reference `dtype`.	569
2233	The code must be using TensorFlow.	570
2234	The code must be processing a `SavedModel`.	570
2235	A malicious user must be able to alter the `SavedModel`.	570
2236	The `TensorByteSize` function must be called.	570
2237	The `TensorShape` constructor must be used.	570
2238	The shape provided to `TensorShape` must be partial or have a number of elements that would overflow the size of an `int`.	570
2239	The TensorFlow version must be older than 2.8.0, 2.7.1, 2.6.3, or 2.5.3.	570
2240	Software must be using TensorFlow.	572
2241	TensorFlow version must be vulnerable (e.g., older than 2.8.0, 2.7.1, 2.6.3, or 2.5.3).	572
2242	Code must be decoding PNG images.	572
2243	`png::CommonFreeDecode(&decode)` must be called.	572
2244	Code must access or use `decode.width` or `decode.height` after `png::CommonFreeDecode(&decode)` has been called.	572
2245	A malicious user must be able to provide a specially crafted PNG image.	572
2246	Usage of TensorFlow.	573
2247	TensorFlow version is older than 2.8.0, or not patched with 2.7.1, 2.6.3, or 2.5.3.	573
2248	Processing of TFLite models.	573
2249	An attacker can craft a TFLite model.	573
2250	The `BiasAndClamp` implementation is used.	573
2251	The crafted TFLite model sets `bias_size` to zero.	573
2252	TensorFlow must be in use.	574
2253	Vulnerable TensorFlow version (prior to 2.8.0, 2.7.1, 2.6.3, or 2.5.3).	574
2254	Attacker must have write access to a `SavedModel` on disk.	574
2255	Attacker must alter the `SavedModel` to duplicate `AttrDef`s of an operation.	574
2256	Usage of `GetInitOp` function	575
2257	TensorFlow version older than 2.8.0	575
2258	TensorFlow version 2.7.x (specifically before 2.7.1)	575
2752	Usage of TensorFlow.	670
2259	TensorFlow version 2.6.x (specifically before 2.6.3)	575
2260	TensorFlow version 2.5.x (specifically before 2.5.3)	575
2261	Dereferencing of a null pointer within `GetInitOp` implementation	575
2262	Usage of `OpLevelCostEstimator::CalculateOutputSize`	576
2263	Attacker can create an operation involving tensors with a large number of elements	576
2264	Tensors have a large enough number of dimensions in `output_shape.dim()`	576
2265	Tensors have a small number of dimensions that are large enough to cause an overflow in multiplication	576
2266	Usage of `OpLevelCostEstimator::CalculateTensorSize`	577
2267	Attacker can create an operation	577
2268	Operation involves a tensor with a large enough number of elements	577
2269	TensorFlow version is less than 2.8.0	577
2270	TensorFlow version is 2.7.1, 2.6.3, or 2.5.3 (or earlier unsupported versions)	577
2271	Usage of TensorFlow	578
2272	Usage of the Grappler component	578
2273	Processing of a maliciously altered `SavedModel` file	578
2274	Constant folding operation	578
2275	`GraphDef` missing required nodes for a binary operation	578
2276	`IsIdentityConsumingSwitch` operation	578
2277	1. Usage of TensorFlow.	581
2278	2. TensorFlow version is prior to 2.8.0, 2.7.1, 2.6.3, or 2.5.3.	581
2279	3. Decoding a resource handle tensor.	581
2280	4. Resource handle tensor is from protobuf.	581
2281	5. User-controlled arguments are used in the decoding process.	581
2282	6. User-controlled arguments invalidate a `CHECK` assertion.	581
2283	Using TensorFlow.	579
2284	Building an XLA compilation cache.	579
2285	Using default settings.	579
2286	All devices are allowed.	579
2287	Using an affected version of TensorFlow (prior to 2.8.0, 2.7.1, 2.6.3, or 2.5.3).	579
2288	Usage of TensorFlow.	580
2289	TensorFlow version is affected (e.g., < 2.8.0, or 2.7.x < 2.7.1, 2.6.x < 2.6.3, 2.5.x < 2.5.3 without cherry-picks).	580
2290	Decoding of PNG images is performed.	580
2291	The PNG image being decoded is invalid.	580
2292	The `png::CommonInitDecode` function is called.	580
2293	An error case in the function implementation invokes the `OP_REQUIRES` macro.	580
2294	The `png::CommonFreeDecode` function is not called due to `OP_REQUIRES` terminating execution.	580
2295	Usage of TensorFlow.	583
2296	Usage of `SparseCountSparseOutput` function.	583
2297	TensorFlow version is vulnerable (e.g., prior to 2.8.0, 2.7.1, 2.6.3, or 2.5.3).	583
2298	Integer overflow occurs within `SparseCountSparseOutput`.	583
2299	Result of integer overflow is used in memory allocation.	583
2300	TensorFlow library must be in use.	584
2301	Vulnerable TensorFlow version (e.g., < 2.8.0, < 2.7.1, < 2.6.3, < 2.5.3).	584
2302	The `UnravelIndex` function must be called.	584
2303	Input to `UnravelIndex` must cause an integer overflow leading to division by zero.	584
2304	Usage of TensorFlow.	586
2305	Usage of convolution operations.	586
2306	Usage of the cost estimator for convolution operations.	586
2307	The stride argument is not strictly positive (e.g., zero or negative).	586
2308	TensorFlow version is 2.7.1, 2.6.3, 2.5.3, or any version prior to 2.8.0 that does not include the fix.	586
2309	Usage of TensorFlow.	587
2310	Usage of the `FractionalMaxPool` operation.	587
2311	Input to `FractionalMaxPool` must lead to a division by zero.	587
2312	TensorFlow version must be older than 2.8.0.	587
2313	TensorFlow version must be older than 2.7.1 (if using 2.7.x branch).	587
2314	TensorFlow version must be older than 2.6.3 (if using 2.6.x branch).	587
2315	TensorFlow version must be older than 2.5.3 (if using 2.5.x branch).	587
2316	Usage of the Express `response.links` function.	88
2317	Unsanitized data is used in the `response.links` function.	88
2318	The unsanitized data allows for arbitrary resource injection in the `Link` header.	88
2319	The unsanitized data contains a combination of characters like `,`, `;`, and `<>`.	88
2320	The vulnerability is exploited through dynamic parameters.	88
2321	Usage of TensorFlow.	588
2322	Usage of the `QuantizedMaxPool` function.	588
2323	`QuantizedMaxPool` function processes user-controlled inputs.	588
2324	TensorFlow version is vulnerable (e.g., < 2.8.0, or specifically < 2.7.1, < 2.6.3, or < 2.5.3).	588
2325	Usage of `SparseTensorSliceDataset`	589
2326	Input arguments to `SparseTensorSliceDataset` represent a sparse tensor	589
2327	Input arguments to `SparseTensorSliceDataset` do not satisfy internal preconditions	589
2328	TensorFlow version is prior to 2.8.0	589
2329	TensorFlow version is prior to 2.7.1 (if using 2.7.x branch)	589
2330	TensorFlow version is prior to 2.6.3 (if using 2.6.x branch)	589
2331	TensorFlow version is prior to 2.5.3 (if using 2.5.x branch)	589
2332	Usage of TensorFlow versions prior to 1.15.5, 2.0.4, 2.1.3, 2.2.2, 2.3.2, or 2.4.0.	597
2333	Usage of the `tf.raw_ops.DataFormatVecPermute` API.	597
2334	The `src_format` and `dst_format` attributes passed to `tf.raw_ops.DataFormatVecPermute` do not define a valid permutation of NHWC.	597
2335	TensorFlow is used.	590
2336	Multiple TensorFlow operations are used.	590
2337	The TensorFlow version is prior to 2.8.0.	590
2338	The TensorFlow version is prior to 2.7.1.	590
2339	The TensorFlow version is prior to 2.6.3.	590
2340	The TensorFlow version is prior to 2.5.3.	590
2341	Input can be provided that triggers `CHECK`-fails (assertion failures) in TensorFlow operations.	590
2342	Decoding a tensor from protobuf	591
2343	Usage of user-controlled arguments	591
2344	Tensor has an invalid `dtype`	591
2345	Tensor has 0 elements	591
2346	Tensor has an invalid shape	591
2347	Usage of `*Bincount` operations	592
2348	Passing arguments that trigger a `CHECK`-fail	592
2349	Input arguments satisfying conditions not caught during shape inference	592
2350	Input arguments satisfying conditions not caught during kernel implementation	592
2351	Output tensors being allocated	592
2352	Usage of `ThreadPoolHandle`	593
2353	`num_threads` argument of `ThreadPoolHandle` is used	593
2354	`num_threads` argument is a large positive value	593
2355	TensorFlow version is affected (e.g., < 2.8.0, < 2.7.1, < 2.6.3, or < 2.5.3)	593
2356	Malicious user alters a `SavedModel`.	594
2357	Protobuf part corresponding to tensor arguments is modified.	594
2358	`dtype` of tensor arguments no longer matches the `dtype` expected by the op.	594
2359	A binary op is called.	594
2360	Templated binary operator for the binary op receives corrupted data due to type confusion.	594
2361	`Tin` and `Tout` do not match the type of data in `out` and `input_*` tensors.	594
2362	CVE-2021-41221:	600
2363	Usage of `Cudnn*` operations in TensorFlow	600
2364	Shape inference code for `Cudnn*` operations is triggered	600
2365	The ranks of `input` parameter are not validated	600
2366	The ranks of `input_h` parameter are not validated	600
2367	The ranks of `input_c` parameter are not validated	600
2368	Code assumes specific values for the ranks of `input`, `input_h`, and `input_c` parameters	600
2369	*   Usage of the `DrawBoundingBoxes` function.	385
2370	*   The `boxes` input to `DrawBoundingBoxes` must not be of dtype `float`.	385
2371	Usage of `MapStage` function.	595
2372	Key tensor provided to `MapStage` is not a scalar.	595
2373	TensorFlow version is older than 2.8.0 (specifically 2.7.x before 2.7.1, 2.6.x before 2.6.3, or 2.5.x before 2.5.3).	595
2374	Usage of TensorFlow.	596
2375	Usage of the `ConcatV2` operation.	596
2376	The `axis` argument must be crafted such that the `rank` argument becomes a negative value during the `WithRankAtLeast` check.	596
2377	The TensorFlow version must be vulnerable (e.g., < 2.8.0, < 2.7.1, < 2.6.3, or < 2.5.3).	596
2378	TensorFlow Lite is used.	598
2379	The model uses the `segment sum` operation.	598
2380	The TensorFlow Lite version is prior to 2.2.1 or 2.3.1.	598
2381	The segment IDs tensor contains a very large value.	598
2382	The last element of the segment IDs tensor is used to determine the dimensionality of the output tensor.	598
2383	A crafted TFLite model must be used.	599
2384	The TFLite model must force a node to have as input a tensor backed by a `nullptr` buffer.	599
2385	A buffer index in the flatbuffer serialization must be changed.	599
2386	A read-only tensor must be converted to a read-write one.	599
2387	The implicitly converted read-write tensor must not have anything in the model that writes to it.	599
2388	The vulnerable TensorFlow-Lite version must be prior to 1.15.4, 2.0.3, 2.1.2, 2.2.1, or 2.3.1.	599
2389	Affected TensorFlow version is used.	601
2390	A saved model is loaded and executed.	601
2391	The model uses quantized floating point types.	601
2392	Eigen library is used for quantized floating point operations.	601
2393	The code must be using TensorFlow.	602
2394	The TensorFlow version must be affected (e.g., prior to 2.6.0, 2.5.1, 2.4.3, or 2.3.4).	602
2395	The code must be running shape functions.	602
2396	The code must be using functions that produce extra output information in the form of a `ShapeAndType` struct (e.g., `MutableHashTableShape`).	602
2397	Upstream code must attempt to access the shape information embedded in the `ShapeAndType` struct.	602
2398	The inference context owning the `ShapeAndType` struct must be cleaned up before the upstream code attempts to access it.	602
2399	The following constraints must be met for CVE-2021-37655 to be exploitable:	603
2400	*   The code must use TensorFlow.	603
2401	*   The TensorFlow version must be affected (e.g., prior to 2.6.0, 2.5.1, 2.4.3, or 2.3.4).	603
2402	*   The code must call the `tf.raw_ops.ResourceScatterUpdate` operation.	603
2403	*   An attacker must be able to supply invalid arguments to `tf.raw_ops.ResourceScatterUpdate`.	603
2404	*   The `indices` and `updates` arguments to `tf.raw_ops.ResourceScatterUpdate` must be crafted such that the number of elements in `updates` is divisible by the number of elements in `indices`, but the shape of `indices` is not a prefix of the shape of `updates`.	603
2405	The vulnerability CVE-2021-29606 in TensorFlow Lite (TFLite) is an out-of-bounds (OOB) read on the heap. This vulnerability can be exploited under the following conditions:	604
2406	*   The code must be processing a specially crafted TFLite model.	604
2407	*   The TFLite model must utilize the `Split_V` operation.	604
2408	*   The `axis_value` parameter within the `Split_V` operation must be outside the valid range of 0 to `NumDimensions(input)`.	604
2409	*   The affected TensorFlow versions include 2.4.2, 2.3.3, 2.2.3, and 2.1.4.	604
2411	Usage of `ArgMin` or `ArgMax` operations	605
2412	Specially crafted TFLite model	605
2413	`axis_value` is not between 0 and `NumDimensions(input)`	605
2414	Usage of `tf.raw_ops.SparseSplit`	606
2415	User-controlled input affecting array offset within `tf.raw_ops.SparseSplit`	606
2416	TensorFlow version is prior to 2.5.0	606
2417	TensorFlow version is prior to 2.4.2 (if using 2.4.x branch)	606
2418	TensorFlow version is prior to 2.3.3 (if using 2.3.x branch)	606
2419	TensorFlow version is prior to 2.2.3 (if using 2.2.x branch)	606
2420	TensorFlow version is prior to 2.1.4 (if using 2.1.x branch)	606
2421	Usage of `tf.raw_ops.Conv2DBackpropInput`	607
2422	Caller-controlled input to `tf.raw_ops.Conv2DBackpropInput`	607
2423	Input leads to a division by zero within `tf.raw_ops.Conv2DBackpropInput`	607
2424	Usage of the `hosted-git-info` package.	96
2425	Version of `hosted-git-info` package is prior to 3.0.8.	96
2426	The `fromUrl` function in `index.js` of the `hosted-git-info` package is called.	96
2427	Input to the `fromUrl` function contains a specially crafted string that triggers the ReDoS vulnerability in the `shortcutMatch` regular expression.	96
2428	Usage of `tf.raw_ops.SparseMatrixSparseCholesky`	608
2429	Providing an invalid `permutation` argument to `tf.raw_ops.SparseMatrixSparseCholesky`	608
2430	TensorFlow version is affected (e.g., < 2.5.0, < 2.4.2, < 2.3.3, < 2.2.3, < 2.1.4)	608
2431	The `ValidateInputs` function fails a validation condition	608
2432	The caller of `ValidateInputs` does not explicitly check `context->status()`	608
2433	- Usage of TensorFlow library.	609
2434	- TensorFlow version is vulnerable (e.g., < 2.5.0, or specific older versions like 2.4.x < 2.4.2, 2.3.x < 2.3.3, 2.2.x < 2.2.3, 2.1.x < 2.1.4).	609
2435	- The `tf.raw_ops.QuantizedBiasAdd` operation is called.	609
2436	- The smaller input to `tf.raw_ops.QuantizedBiasAdd` has zero elements.	609
2437	Usage of `tf.raw_ops.Dilation2DBackpropInput` function.	610
2438	Attacker-controlled input for arguments to `tf.raw_ops.Dilation2DBackpropInput`.	610
2439	`h_in_max` and/or `w_in_max` values are not properly validated.	610
2440	TensorFlow version is older than 2.5.0, 2.4.2, 2.3.3, 2.2.3, or 2.1.4.	610
2441	Usage of `tf.raw_ops.RaggedTensorToTensor`	611
2442	Input arguments to `tf.raw_ops.RaggedTensorToTensor` are empty	611
2443	Running a TensorFlow version prior to 2.5.0, 2.4.2, 2.3.3, 2.2.3, or 2.1.4	611
2444	Running a release build of TensorFlow where `DCHECK`s are disabled	611
2445	Usage of `tf.raw_ops.Map*` or `tf.raw_ops.OrderedMap*` operations	612
2446	The `indices` parameter provided to the operation is empty	612
2447	Usage of `tf.raw_ops.RaggedTensorToSparse`	613
2448	Input `splits` values are not in increasing order	613
2449	TensorFlow version is prior to 2.6.0, 2.5.1, 2.4.3, or 2.3.4	613
2450	Usage of `tf.raw_ops.RaggedTensorToVariant`	614
2451	Incomplete validation of splits values	614
2452	Splits argument is empty	614
2453	Binding a reference to a null pointer	614
2454	Usage of `tf.raw_ops.SparseFillEmptyRows`	615
2455	Input arguments to `tf.raw_ops.SparseFillEmptyRows` are empty tensors	615
2456	TensorFlow version is prior to 2.6.0	615
2457	TensorFlow version is 2.5.0 or earlier without the cherry-picked fix	615
2458	TensorFlow version is 2.4.2 or earlier without the cherry-picked fix	615
2459	TensorFlow version is 2.3.3 or earlier without the cherry-picked fix	615
2460	Usage of `tf.raw_ops.UnicodeEncode`	616
2461	`input_splits` tensor is empty	616
2462	Reading the first dimension of the `input_splits` tensor	616
2463	Binding a reference to a null pointer	616
2464	TensorFlow must be used.	617
2465	The TensorFlow version must be prior to 2.6.0, 2.5.1, 2.4.3, or 2.3.4.	617
2466	Binary cwise operations must be performed.	617
2467	The binary cwise operations must not require broadcasting.	617
2468	The inputs to the binary cwise operations must have a different number of elements.	617
2469	The eigen functor must execute with the mismatched inputs.	617
2470	Usage of `tf.raw_ops.MatrixDiagV*` operations.	618
2471	Input `k` to `tf.raw_ops.MatrixDiagV*` must be an empty tensor.	618
2472	TensorFlow version must be affected (prior to 2.6.0, 2.5.1, 2.4.3, or 2.3.4).	618
2473	Usage of TensorFlow.	619
2474	TensorFlow version is older than 2.6.0, 2.5.1, 2.4.3, or 2.3.4.	619
2475	Usage of any operation of type `tf.raw_ops.MatrixSetDiagV*`.	619
2476	The `k` argument passed to `tf.raw_ops.MatrixSetDiagV*` must be an empty tensor.	619
2477	Usage of `tf.raw_ops.ReverseSequence` or `tf.reverse_sequence`	693
2478	`batch_dim` parameter is a negative value	693
2479	`batch_dim` is sufficiently negative to cause an out-of-bounds read (e.g., `batch_dim` < -rank of input tensor)	693
2480	Vulnerable TensorFlow version (e.g., < 2.8.0, < 2.7.1, < 2.6.3, < 2.5.3)	693
2481	Usage of `BoostedTreesCalculateBestGainsPerFeature` function.	620
2482	Usage of `BoostedTreesCalculateBestFeatureSplitV2` function.	620
2483	Input values are not validated.	620
2484	TensorFlow version is prior to 2.6.0.	620
2485	TensorFlow version is 2.5.0 or earlier (fixed in 2.5.1).	620
2486	TensorFlow version is 2.4.2 or earlier (fixed in 2.4.3).	620
2487	TensorFlow version is 2.3.3 or earlier (fixed in 2.3.4).	620
2488	Usage of TensorFlow.	621
2489	Usage of MKL (Intel Math Kernel Library) integration.	621
2490	Usage of requantization operations.	621
2491	Usage of `MklRequantizationRangePerChannelOp`.	621
2492	Usage of `MklRequantizePerChannelOp`.	621
2493	Supplying malformed input tensor dimensions to `MklRequantizationRangePerChannelOp`.	621
2494	Supplying malformed input arguments to `MklRequantizePerChannelOp`.	621
2495	Affected TensorFlow version (prior to 2.6.0, or unpatched 2.5.1, 2.4.3, 2.3.4).	621
2496	Usage of `tf.raw_ops.QuantizeV2`	622
2497	`min_range` and `max_range` do not have the same non-zero number of elements	622
2498	`axis` is provided (not -1)	622
2499	`axis` is not a value in range for the rank of `input` tensor	622
2500	Lengths of `min_range` and `max_range` inputs do not match the `axis` dimension of the `input` tensor	622
2501	The vulnerability CVE-2021-37648 in TensorFlow is exploitable under the following conditions:	623
2502	*   The code uses `tf.raw_ops.SaveV2`.	623
2503	*   Malformed inputs are provided to `tf.raw_ops.SaveV2`.	623
2504	*   The TensorFlow version is affected (e.g., versions prior to 2.6.0, 2.5.1, 2.4.3, or 2.3.4).	623
2505	*   The `ValidateInputs` function is called, but its `OP_REQUIRES` macro does not properly terminate the kernel execution, allowing subsequent code to run with an invalid state.	623
2506	Usage of `SparseAdd` function.	626
2507	Input sparse tensors are not validated for emptiness.	626
2508	The second dimension of `*_indices` does not match the size of corresponding `*_shape`.	626
2509	Attacker can provide invalid sparse tensor triples as input.	626
2510	Usage of TensorFlow Lite (TFLite)	624
2511	Usage of the SVDF operation in TFLite	624
2512	`GetVariableInput` function returns a null pointer	624
2513	`GetTensorData` is called with a null pointer argument	624
2514	`GetMutableInput` function returns a null pointer	624
2515	Accessing `tensor->is_variable` when `tensor` is a null pointer	624
2516	Usage of TensorFlow.	625
2517	TensorFlow version is 2.0 or later, and not patched (e.g., not 2.5.0+, 2.4.2+, 2.3.3+, 2.2.3+, 2.1.4+).	625
2518	TensorFlow is running in eager mode.	625
2519	The code calls raw ops associated with session operations.	625
2520	The vulnerable code path involves dereferencing `ctx->session_state()` without a null check.	625
2521	Attacker must be able to change saved checkpoints from outside of TensorFlow.	647
2522	The affected TensorFlow version must be older than 2.7.0 (specifically, before 2.6.1, 2.5.2, or 2.4.4).	647
2523	The application must be loading saved checkpoints.	647
2524	The search results confirm the information from the initial prompt and provide additional context.	627
2525	Specifically, the GitHub advisory and NVD entry reiterate the core details:	627
2526	- The vulnerability is in "Optimized pooling implementations in TFLite".	627
2527	- It's a "division by zero" error.	627
2528	- It occurs "before calling `ComputePaddingHeightWidth`".	627
2529	- It's triggered when "users can craft special models which will have `params->stride_{height,width}` be zero".	627
2530	Therefore, the constraints are directly derivable from these points.	627
2531	List of constraints:	627
2532	*   The code must be using TensorFlow Lite (TFLite).	627
2533	*   The code must be utilizing optimized pooling implementations within TFLite.	627
2534	*   The `ComputePaddingHeightWidth` function must be called.	627
2535	*   A specially crafted model must be processed where `params->stride_height` or `params->stride_width` is set to zero.	627
2536	*   The affected TensorFlow versions are 2.1.4, 2.2.3, 2.3.3, 2.4.2, and versions prior to 2.5.0.The vulnerability description clearly outlines the conditions for exploitation. I need to extract these conditions and present them as a list of constraints.	627
2537	Here's a breakdown of the information provided and how it translates into constraints:	627
2538	1.  **"TensorFlow is an end-to-end open source platform for machine learning."** - This indicates the general software affected.	627
2539	2.  **"Optimized pooling implementations in TFLite"** - This specifies the component and type of implementation.	627
2540	3.  **"fail to check that the stride arguments are not 0"** - This is the core flaw.	627
2541	4.  **"before calling `ComputePaddingHeightWidth`"** - This pinpoints the specific function call where the check is missing.	627
2542	5.  **"users can craft special models which will have `params->stride_{height,width}` be zero"** - This describes the user action required for exploitation.	627
2543	6.  **"this will result in a division by zero."** - This is the consequence of the exploitation.	627
2544	7.  **"The fix will be included in TensorFlow 2.5.0. We will also cherrypick this commit on TensorFlow 2.4.2, TensorFlow 2.3.3, TensorFlow 2.2.3 and TensorFlow 2.1.4, as these are also affected and still in supported range."** - This indicates the affected versions.	627
2545	From these points, I can formulate the constraints.	627
2546	Constraints:	627
2547	*   The code must be using TensorFlow Lite (TFLite).	627
2548	*   The code must be using optimized pooling implementations within TFLite.	627
2549	*   The `ComputePaddingHeightWidth` function must be called.	627
2550	*   A crafted model must be processed where `params->stride_height` or `params->stride_width` is set to zero.	627
2551	*   The TensorFlow version in use must be one of the affected versions (2.1.4, 2.2.3, 2.3.3, 2.4.2, or any version prior to 2.5.0 that is not patched).*   The code must be using TensorFlow Lite (TFLite).	627
2552	*   The code must be utilizing optimized pooling implementations within TFLite.	627
2553	*   The `ComputePaddingHeightWidth` function must be called.	627
2554	*   A specially crafted model must be processed where `params->stride_height` or `params->stride_width` is set to zero.	627
2555	*   The TensorFlow version in use must be one of the affected versions (2.1.4, 2.2.3, 2.3.3, 2.4.2, or any version prior to 2.5.0 that is not patched).	627
2556	Usage of the `tf.raw_ops.RaggedTensorToTensor` API.	628
2557	The `row_partition_types` argument is provided.	628
2558	The `row_partition_types` argument is an empty list or a list that causes an access to its first element without prior validation of its emptiness.	628
2559	The TensorFlow version is prior to 2.6.0 (specifically 2.5.x before 2.5.1, 2.4.x before 2.4.3, or 2.3.x before 2.3.4).	628
2560	Usage of TensorFlow Lite (TFLite)	629
2561	Usage of TFLite's convolution code	629
2562	The divisor in convolution operations must be user-controlled	629
2563	The divisor must not be checked for a non-zero value	629
2564	Usage of TensorFlow Lite.	630
2565	Call to `ComputeOutSize` function.	630
2566	`stride` argument passed to `ComputeOutSize` is 0.	630
2567	A specially crafted model is used.	630
2568	Usage of TensorFlow.	631
2569	Usage of TFLite.	631
2570	Usage of the `SpaceToDepth` operator.	631
2571	An attacker can craft a malicious model.	631
2572	The crafted model sets `params->block_size` to zero for the `SpaceToDepth` operator.	631
2573	Usage of `MatrixDiag*` operations	632
2574	Tensor arguments provided to `MatrixDiag*` operations are empty	632
2575	Usage of `tf.raw_ops.MaxPool3DGradGrad`	633
2576	At least one of the three tensor inputs to `tf.raw_ops.MaxPool3DGradGrad` must be empty	633
2577	The empty tensor input must be attacker-controlled or influenced	633
2578	The search results confirm the initial analysis of the vulnerability description. Multiple sources (NVD, CVE Record, Feedly) for CVE-2021-29571 repeat the exact same text provided in the prompt, including the initial mention of `tf.raw_ops.MaxPoolGradWithArgmax` followed by the detailed description of the `tf.raw_ops.DrawBoundingBoxesV2` vulnerability. This reinforces the idea that the detailed description for `DrawBoundingBoxesV2` is the correct one for this CVE.	634
2579	Therefore, the constraints are derived directly from the detailed description of the `DrawBoundingBoxesV2` vulnerability.	634
2580	Here are the constraints:	634
2581	*   The code must use `tf.raw_ops.DrawBoundingBoxesV2`.	634
2582	*   The `boxes` input tensor provided to `tf.raw_ops.DrawBoundingBoxesV2` must have its last dimension (the innermost dimension) with a size less than 4.	634
2583	*   The TensorFlow version in use must be affected (i.e., older than 2.5.0, or specific older versions without the cherry-picked fix: 2.4.2, 2.3.3, 2.2.3, 2.1.4).The code must call `tf.raw_ops.DrawBoundingBoxesV2`.	634
2584	The `boxes` input tensor to `tf.raw_ops.DrawBoundingBoxesV2` must have its last dimension with a size less than 4.	634
2585	The TensorFlow version must be vulnerable (e.g., older than 2.5.0, or specific older versions without the cherry-picked fix: 2.4.2, 2.3.3, 2.2.3, 2.1.4).	634
2586	Usage of TensorFlow Lite (TFLite) framework.	635
2587	Usage of the `BatchToSpaceNd` TFLite operator.	635
2588	Ability for an attacker to craft or control the input model.	635
2589	Ability for an attacker to set one dimension of the `block` input to 0.	635
2590	The vulnerability CVE-2021-29595 in TensorFlow's TFLite `DepthToSpace` operator is exploitable under the following conditions:	636
2591	*   The application uses TensorFlow Lite (TFLite).	636
2592	*   The TFLite model incorporates the `DepthToSpace` operator.	636
2593	*   The `block_size` parameter within the `DepthToSpace` operator's parameters is set to 0.	636
2594	*   An attacker can craft or supply a malicious TFLite model with `params->block_size` set to 0.	636
2595	*   The TensorFlow version in use is affected (e.g., < 2.5.0, specifically 2.4.x < 2.4.2, 2.3.x < 2.3.3, 2.2.x < 2.2.3, 2.1.x < 2.1.4).	636
2596	Usage of TensorFlow.	637
2597	TensorFlow version is vulnerable (e.g., < 2.5.0 and not patched to 2.4.2, 2.3.3, 2.2.3, or 2.1.4).	637
2598	The `EmbeddingLookup` TFLite operator is used in the code.	637
2599	An attacker can craft a malicious model.	637
2600	The crafted model sets the first dimension of the `value` input to 0.	637
2601	Usage of the `SVDF` TFLite operator	638
2602	`params->rank` must be 0	638
2603	Usage of the `SpaceToBatchNd` TFLite operator.	639
2604	An attacker can craft a model.	639
2605	One dimension of the `block` input to `SpaceToBatchNd` is 0.	639
2606	*   Usage of TensorFlow Lite (TFLite) framework.	640
2607	*   Usage of the `Split` TFLite operator.	640
2608	*   An attacker can craft or provide a malicious TFLite model.	640
2609	*   The crafted model sets `num_splits` to 0 for the `Split` operator.	640
2610	Usage of the `GatherNd` TFLite operator.	641
2611	The `params` input tensor to `GatherNd` must be empty.	641
2612	The TensorFlow version must be vulnerable (e.g., < 2.5.0, or specific older versions like 2.4.x before 2.4.2, 2.3.x before 2.3.3, 2.2.x before 2.2.3, 2.1.x before 2.1.4).	641
2613	An attacker must be able to craft and provide a malicious model.	641
2614	Usage of TensorFlow operations.	642
2615	Tensor arguments involved in the call.	642
2616	Missing validation for the shapes of the tensor arguments.	642
2617	The `saved_model_cli` tool must be used.	643
2903	Usage of `AssignOp`	701
2618	The TensorFlow version must be prior to 2.9.0, 2.8.1, 2.7.2, or 2.6.4.	643
2619	The `saved_model_cli` tool must be run manually by a user.	643
2620	The input to `saved_model_cli` must contain malicious numpy expressions that are evaluated with `safe=False`.	643
2621	Usage of sparse matrix multiplication.	644
2622	Dimensions of matrix 'a' are 0 or less.	644
2623	Dimensions of matrix 'b' are 0 or less.	644
2624	TensorFlow version is prior to 2.7.0.	644
2625	TensorFlow version is 2.6.1.	644
2626	TensorFlow version is 2.5.2.	644
2627	TensorFlow version is 2.4.4.	644
2628	The code calls `tf.raw_ops.FusedBatchNorm`.	645
2629	The `scale` tensor has a different number of elements than the number of channels of `x`.	645
2630	The `offset` tensor has a different number of elements than the number of channels of `x`.	645
2631	The `mean` tensor is required and its number of elements has a different number of elements than the number of channels of `x`.	645
2632	The `variance` tensor is required and its number of elements has a different number of elements than the number of channels of `x`.	645
2633	Usage of TensorFlow raw APIs for restoring tensors.	646
2634	The `tensor_name` input is user-controlled.	646
2635	The `preferred_shard` argument (restoration index) is user-controlled.	646
2636	The `tensor_name` is not provided, leading to an empty tensor list.	646
2637	The `tensor_name` is provided, but the corresponding tensor list does not have enough values for a successful restoration.	646
2638	The `preferred_shard` (restoration index) is outside the bounds of the retrieved tensor list.	646
2639	Usage of `tf.raw_ops.QuantizedResizeBilinear` function.	648
2640	TensorFlow version is prior to 2.5.0 (specifically 2.4.2, 2.3.3, 2.2.3, or 2.1.4).	648
2641	Input values to `tf.raw_ops.QuantizedResizeBilinear` are manipulated.	648
2642	Manipulation of input values causes float rounding errors.	648
2643	Float rounding errors result in `interpolation->upper[i]` being smaller than `interpolation->lower[i]`.	648
2644	`interpolation->upper[i]` is capped at `in_size-1`.	648
2645	Usage of TensorFlow Lite (TFLite) framework.	649
2646	Usage of the `OneHot` TFLite operator.	649
2647	Crafted model where at least one dimension of the `indices` input to `OneHot` is 0.	649
2648	The `prefix_dim_size` calculation results in 0.	649
2649	Usage of the `TransposeConv` TFLite operator.	650
2650	Using the optimized implementation of `TransposeConv`.	650
2651	`stride_h` or `stride_w` values are 0.	650
2652	Lack of input validation for `stride_h` and `stride_w` in the calling code.	650
2653	TensorFlow version is older than 2.5.0, 2.4.2, 2.3.3, 2.2.3, or 2.1.4.	650
2654	Usage of `tf.raw_ops.BoostedTreesCreateEnsemble` function.	651
2655	Supplying specially crafted arguments to `tf.raw_ops.BoostedTreesCreateEnsemble`.	651
2656	TensorFlow version is affected (e.g., 2.5.0, 2.4.0-2.4.2, 2.3.0-2.3.3, or earlier unsupported versions).	651
2657	Usage of `tf.raw_ops.ParameterizedTruncatedNormal`	652
2658	The `shape` argument passed to `tf.raw_ops.ParameterizedTruncatedNormal` must be empty	652
2659	TensorFlow version is prior to 2.5.0	652
2660	TensorFlow version is prior to 2.4.2	652
2661	TensorFlow version is prior to 2.3.3	652
2662	TensorFlow version is prior to 2.2.3	652
2663	TensorFlow version is prior to 2.1.4	652
2665	TensorFlow version is older than 2.5.0 (specifically, 2.4.x < 2.4.2, 2.3.x < 2.3.3, 2.2.x < 2.2.3, or 2.1.x < 2.1.4).	653
2666	The `TrySimplify` function in `tensorflow/core/grappler/optimizers/arithmetic_optimizer.cc` is called.	653
2667	The `TrySimplify` function attempts to optimize a node with no inputs.	653
2668	Usage of TensorFlow's boosted trees APIs.	654
2669	Missing validation in the boosted trees code.	654
2670	Specific API usage and arguments passed to the call.	654
2671	A TensorFlow operation must be called.	655
2672	The TensorFlow operation must expect numeric tensors.	655
2673	Non-numeric tensors must be provided as input to the TensorFlow operation.	655
2674	The conversion from Python array to C++ array must be triggered.	655
2675	The code uses TensorFlow Lite (TFlite).	656
2676	The TFlite model contains a graph with a loop between nodes.	656
2677	The TFlite model is crafted by an attacker.	656
2678	The TFlite model is evaluated.	656
2679	The `While` operation is used in a way where the body and loop subgraphs are the same.	656
2680	Usage of TensorFlow	657
2681	Nesting of `tf.map_fn` calls	657
2682	Input tensor to `tf.map_fn` is a `RaggedTensor`	657
2683	No function signature provided for `tf.map_fn`	657
2684	TensorFlow version is affected (e.g., < 2.6.0, or specific unpatched versions like 2.5.0, 2.4.2, 2.3.3)	657
2685	Usage of the `QuantizedMul` operation.	658
2686	Input tensors for quantization thresholds are empty.	658
2687	TensorFlow version is 2.4.2, 2.3.3, 2.2.3, or 2.1.4.	658
2688	Usage of the `QuantizedReshape` operation.	659
2689	Attacker must be able to control the input "thresholds for the quantization" to `QuantizedReshape`.	659
2690	The `QuantizedReshape` operation is called with arguments expected to be scalars.	659
2691	One or both of the "threshold" tensors passed to `QuantizedReshape` must be empty.	659
2692	The code attempts to access the 0th element of an empty tensor.	659
2693	Usage of the `QuantizedResizeBilinear` operation.	660
2694	Passing invalid thresholds for quantization to `QuantizedResizeBilinear`.	660
2695	The arguments for quantization thresholds are not validated as valid scalars.	660
2696	The user wants a list of constraints for CVE-2021-29540 to be exploitable. I will extract these directly from the provided vulnerability description.	661
2697	Here are the constraints:	661
2698	1.  The software must be using TensorFlow.	661
2699	2.  The `Conv2DBackpropFilter` operation must be used in the code.	661
2700	3.  The TensorFlow version must be affected (prior to 2.5.0, or specifically 2.4.x prior to 2.4.2, 2.3.x prior to 2.3.3, 2.2.x prior to 2.2.3, or 2.1.x prior to 2.1.4).	661
2701	4.  An attacker must be able to provide input such that the computed size of the filter tensor does not match the number of elements in `filter_sizes`.	661
2702	5.  The code must then attempt to read/write to the buffer using the incorrectly computed size, leading to a heap buffer overflow.The following constraints must be met for CVE-2021-29540 to be exploitable:	661
2703	The code must be using TensorFlow.	661
2704	The `Conv2DBackpropFilter` operation must be utilized.	661
2705	The TensorFlow version in use must be affected (e.g., prior to 2.5.0, or specific older versions like 2.4.x before 2.4.2, 2.3.x before 2.3.3, 2.2.x before 2.2.3, or 2.1.x before 2.1.4).	661
2706	An attacker must be able to provide input where the computed size of the filter tensor does not match the number of elements in `filter_sizes`.	661
2707	The vulnerable code must then attempt to read from or write to the buffer using the incorrectly computed size, leading to a heap buffer overflow.	661
2708	Usage of the `SparseAdd` function.	673
2709	Input sparse tensors to `SparseAdd` are not validated for emptiness.	673
2710	The second dimension of `*_indices` input to `SparseAdd` does not match the size of the corresponding `*_shape`.	673
2711	Attacker can provide malformed sparse tensor inputs to the `SparseAdd` function.	673
2712	The code relies on assumptions about sparse tensor validity that are not explicitly validated by `SparseAdd`.	673
2713	The TensorFlow version is prior to 2.5.0, 2.4.2, 2.3.3, 2.2.3, or 2.1.4.	673
2714	Usage of `tf.raw_ops.BandedTriangularSolve`	662
2715	Input tensors to `tf.raw_ops.BandedTriangularSolve` are empty	662
2716	The `ctx->status()` is not checked after `ValidateInputTensors` returns	662
2717	Usage of `tf.raw_ops.ExperimentalDatasetToTFRecord` or `tf.raw_ops.DatasetToTFRecord`	663
2718	Input dataset contains non-string types (e.g., numeric types)	663
2719	TensorFlow version is prior to 2.6.0, or prior to 2.5.1, or prior to 2.4.3, or prior to 2.3.4 without the patch e0b6e58c328059829c3eb968136f17aa72b6c876	663
2720	The code must be written in Java.	719
2721	The code must attempt to create an SSL socket.	719
2722	The creation of the SSL socket must use `new Socket()` directly.	719
2723	The `SSLSocketFactory` must not be used for creating the SSL socket.	719
2724	Usage of `tf.raw_ops.FractionalAvgPoolGrad`	664
2725	Input tensor to `tf.raw_ops.FractionalAvgPoolGrad` must be empty	664
2726	Usage of `tf.raw_ops.Conv3DBackprop*` operations.	665
2727	The `input`, `filter_sizes`, and `out_backprop` tensors provided to `tf.raw_ops.Conv3DBackprop*` operations do not have the same shape.	665
2728	TensorFlow version is older than 2.5.0.	665
2729	TensorFlow version is 2.4.x (specifically 2.4.2 or earlier) without the cherry-picked fix.	665
2730	TensorFlow version is 2.3.x (specifically 2.3.3 or earlier) without the cherry-picked fix.	665
2731	TensorFlow version is 2.2.x (specifically 2.2.3 or earlier) without the cherry-picked fix.	665
2732	TensorFlow version is 2.1.x (specifically 2.1.4 or earlier) without the cherry-picked fix.	665
2733	Usage of `tf.io.decode_raw`	666
2734	Combining `fixed_length` and wider datatypes	666
2735	The `fixed_length` argument is used	666
2736	The TensorFlow version is prior to 2.5.0	666
2737	The TensorFlow version is prior to 2.4.2	666
2738	The TensorFlow version is prior to 2.3.3	666
2739	The TensorFlow version is prior to 2.2.3	666
2740	The TensorFlow version is prior to 2.1.4	666
2741	Usage of `tf.raw_ops.AvgPool3DGrad` function.	667
2742	`orig_input_shape` and `grad` tensors must have dissimilar first and/or last dimensions.	667
2743	The following constraints must be met for CVE-2021-29578 to be exploitable:	668
2744	*   The code must be using TensorFlow.	668
2745	*   The code must call the `tf.raw_ops.FractionalAvgPoolGrad` operation.	668
2746	*   The TensorFlow version in use must be affected (e.g., older than 2.5.0, or specific older versions not patched like 2.4.x < 2.4.2, 2.3.x < 2.3.3, 2.2.x < 2.2.3, 2.1.x < 2.1.4).	668
2747	*   The pooling sequence arguments provided to `tf.raw_ops.FractionalAvgPoolGrad` must not have enough elements as required by the `out_backprop` tensor shape.	668
2748	Usage of `tf.raw_ops.MaxPool3DGradGrad`	669
2749	`Pool3dParameters` initialization fails	669
2750	`OP_REQUIRES` in `Pool3dParameters` constructor fails	669
2751	`params` contains invalid data after failed initialization	669
2753	TensorFlow version is vulnerable (e.g., not 2.5.0 or later, and not patched versions like 2.4.2, 2.3.3, 2.2.3, 2.1.4).	670
2754	Usage of `tf.raw_ops.MaxPoolGrad` function.	670
2755	Input to `tf.raw_ops.MaxPoolGrad` contains invalid indices.	670
2756	Invalid indices lead to out-of-bounds access in `out_backprop_flat`.	670
2757	Usage of `tf.raw_ops.QuantizeAndDequantizeV2`	671
2758	`axis` argument must be less than -1	671
2759	TensorFlow version is affected (e.g., < 2.5.0, < 2.4.2, < 2.3.3, < 2.2.3, < 2.1.4)	671
2760	TensorFlow is used.	672
2761	The `Transpose` operation is used.	672
2762	The `perm` argument of the `Transpose` operation contains negative elements.	672
2763	The TensorFlow version is prior to 2.7.0 (specifically 2.6.1, 2.5.2, or 2.4.4 are explicitly mentioned as affected).	672
2764	HTTP Only attribute is not set to true for the cookie.	720
2765	Website is susceptible to Cross-Site Scripting (XSS) attacks.	720
2766	Client-side JavaScript attempts to access the cookie.	720
2767	Usage of TensorFlow.	674
2768	TensorFlow version is prior to 2.7.0 (specifically 2.6.x before 2.6.1, 2.5.x before 2.5.2, or 2.4.x before 2.4.4).	674
2769	The `EinsumHelper::ParseEquation()` function is called.	674
2770	The caller of `EinsumHelper::ParseEquation()` assumes that `input_has_ellipsis` and `*output_has_ellipsis` flags are always set by the function.	674
2771	The `EinsumHelper::ParseEquation()` function is called in a context where the ellipsis flags are not explicitly set to `true`, leading to uninitialized variable access.	674
2772	Usage of the `saved_model_cli` tool.	675
2773	The `eval` function is called on user-supplied strings.	675
2774	The `safe` flag is set to `False` (or the TensorFlow version is older than 2.7.0, 2.6.1, 2.5.2, or 2.4.4, where the flag is not present or defaults to `False`).	675
2775	An attacker can supply arbitrary strings to the `saved_model_cli` tool.	675
2776	Usage of TensorFlow or Keras.	676
2777	Deserialization of a Keras model.	676
2778	Model deserialized from YAML format.	676
2779	The `yaml.unsafe_load` function is used for deserialization.	676
2780	TensorFlow version is prior to 2.6.0.	676
2781	TensorFlow version is prior to 2.5.1 (if using 2.5.x branch).	676
2782	TensorFlow version is prior to 2.4.3 (if using 2.4.x branch).	676
2783	TensorFlow version is prior to 2.3.4 (if using 2.3.x branch).	676
2784	Usage of `SparseFillEmptyRowsGrad` function.	677
2785	TensorFlow version is prior to 1.15.4, 2.0.3, 2.1.2, 2.2.1, or 2.3.1.	677
2786	An attacker can control the input `grad_values_t`.	677
2787	The `grad_values_t` input has an improperly shaped tensor.	677
2788	Usage of `tf.raw_ops.Switch` operation	678
2789	TensorFlow version is before 1.15.4, 2.0.3, 2.1.2, 2.2.1, or 2.3.1	678
2790	Code is executed in eager runtime	678
2791	TensorFlow version is prior to 1.15.4, 2.0.3, 2.1.2, 2.2.1, or 2.3.1	679
2792	Code is running in eager mode	679
2793	`tf.raw_ops.GetSessionHandle` is called	679
2794	`tf.raw_ops.GetSessionHandleV2` is called	679
2795	Usage of TensorFlow.	680
2796	TensorFlow version is prior to 2.2.1 or 2.3.1.	680
2797	The `dlpack.to_dlpack` function is called.	680
2798	An invalid argument is passed to `dlpack.to_dlpack`.	680
2799	The `status` argument returned by `dlpack.to_dlpack` (or the validation logic within it) is not properly checked.	680
2800	Subsequent code attempts to dereference a variable that was bound to `nullptr` as a result of the unchecked status.	680
2801	TensorFlow must be in use.	681
2802	Vulnerable TensorFlow version (prior to 2.8.0, 2.7.1, 2.6.3, or 2.5.3).	681
2803	Grappler optimizer must be enabled/in use.	681
2804	A `SavedModel` must be processed.	681
2805	The `SavedModel` must be alterable by an attacker.	681
2806	The alteration must specifically target `IsSimplifiableReshape` to trigger `CHECK` failures.	681
2807	Software must be using TensorFlow.	682
2808	TensorFlow version must be vulnerable (e.g., < 2.8.0, specifically 2.7.1, 2.6.3, 2.5.3, or earlier).	682
2809	The Grappler optimizer must be in use.	682
2810	A `SavedModel` must be altered.	682
2811	The alteration of the `SavedModel` must be crafted to trigger `CHECK` failures in `SafeToRemoveIdentity`.	682
2812	TensorFlow is being used.	683
2813	Shape inference is being performed.	683
2814	A user-controlled tensor is used to determine the size of a vector allocation.	683
2815	Cookie is used in the application.	721
2816	The "Secure" attribute is not set to true for the cookie.	721
2817	The application is accessed over HTTP.	721
2818	An attacker can intercept network traffic.	721
2819	Usage of `StringNGrams` function	684
2820	Input to `StringNGrams` allows for a `pad_width` value that is not properly validated	684
2821	Lack of validation on `pad_width` leads to an integer overflow	684
2822	Integer overflow results in a negative value for `ngram_width`	684
2823	The negative `ngram_width` is used in memory allocation	684
2824	The memory allocation with a negative `ngram_width` causes an out-of-memory condition	684
2825	Usage of TensorFlow Lite (TFLite)	685
2826	Processing of a user-controlled TFLite model	685
2827	TFLite model must contain depthwise convolution operations	685
2980	Using urllib3	716
2828	Attacker must be able to control the parameters of the depthwise convolution	685
2829	The divisor used in the padding calculation for depthwise convolution must be zero or negative	685
2830	The vulnerability CVE-2020-15265 in TensorFlow can be exploited under the following conditions:	686
2831	*   The application uses TensorFlow.	686
2832	*   The TensorFlow version is prior to 2.4.0.	686
2833	*   The `tf.quantization.quantize_and_dequantize` function is called within the code.	686
2834	*   An attacker can provide an invalid `axis` value to the `tf.quantization.quantize_and_dequantize` function.	686
2835	*   The invalid `axis` value causes an out-of-bounds access to the input tensor's dimensions in the C++ kernel implementation.	686
2836	TensorFlow version is prior to 1.15.4, 2.0.3, 2.1.2, 2.2.1, or 2.3.1	687
2837	The `SavedModel` protocol buffer is being changed	687
2838	The name of required keys within the `SavedModel` protocol buffer is being altered	687
2839	The altered `SavedModel` is being loaded	687
2840	The application uses `tensorflow-serving` or another inference-as-a-service installment	687
2841	Tensorflow version is prior to 2.4.0	688
2842	The `tf.image.crop_and_resize` function is used	688
2843	The `boxes` argument of `tf.image.crop_and_resize` receives a very large value	688
2844	The very large value for `boxes` is interpreted as a C++ `nan` floating point value	688
2845	The vulnerability report describes CVE-2020-15203, a format string vulnerability in TensorFlow. To be exploitable, the following conditions must be met:	689
2846	*   The code must be using TensorFlow.	689
2847	*   The TensorFlow version must be vulnerable (i.e., before 1.15.4, 2.0.3, 2.1.2, 2.2.1, or 2.3.1).	689
2848	*   The `tf.strings.as_string` function must be used in the code.	689
2849	*   The `fill` argument of `tf.strings.as_string` must be controllable by a malicious attacker.	689
2850	*   A malicious attacker must be able to provide a format string as the `fill` argument.	689
2851	Usage of TensorFlow.	690
2852	Usage of `GraphDef` format.	690
2853	`GraphDef` contains a self-recursive function.	690
2854	Loading a `SavedModel` that contains the malicious `GraphDef`.	690
2855	Execution of the `SavedModel`.	690
2856	TensorFlow version is prior to 2.8.0.	690
2857	TensorFlow version is prior to 2.7.1 (if using 2.7.x branch).	690
2858	TensorFlow version is prior to 2.6.3 (if using 2.6.x branch).	690
2859	TensorFlow version is prior to 2.5.3 (if using 2.5.x branch).	690
2860	Usage of `dlpack.to_dlpack`	691
2861	Passing a non-tensor Python object as an argument to `dlpack.to_dlpack`	691
2862	TensorFlow version is before 2.2.1 or 2.3.1	691
2863	The following constraints must be met for CVE-2022-21730 to be exploitable:	692
2864	*   The software must be using TensorFlow.	692
2865	*   The TensorFlow version must be vulnerable (e.g., older than 2.8.0, 2.7.1, 2.6.3, or 2.5.3).	692
2866	*   The `FractionalAvgPoolGrad` operation must be utilized in the code.	692
2867	*   Invalid input tensors must be provided to the `FractionalAvgPoolGrad` operation.	692
2868	TFLite saved model is used	694
2869	The TFLite saved model uses the same tensor as both input and output of an operator	694
2870	The tensorflow-lite version is before 1.15.4, 2.0.3, 2.1.2, 2.2.1, or 2.3.1	694
2871	TensorFlow Lite version is prior to 1.15.4, 2.0.3, 2.1.2, 2.2.1, or 2.3.1.	695
2872	The model is in the flatbuffer format.	695
2873	The flatbuffer model uses a negative `-1` value as a tensor index.	695
2874	The `-1` tensor index is used for operators that do not expect optional inputs.	695
2875	The `-1` tensor index is used for output tensors.	695
2876	A specially crafted flatbuffer model is loaded.	695
2877	TensorFlow version is 2.5.0 or earlier	696
2878	`tf.keras.utils.get_file` function is used	696
2879	`extract` parameter of `tf.keras.utils.get_file` is set to `True`	696
2880	An attacker can provide a crafted archive	696
2881	The archive is untrusted	696
2882	Usage of TensorFlow.	697
2883	TensorFlow version is older than 2.8.0 (or specifically 2.7.x before 2.7.1, 2.6.x before 2.6.3, or 2.5.x before 2.5.3).	697
2884	Processing of a TFLite model.	697
2885	The TFLite model is crafted by an attacker.	697
2886	The TFLite model involves conversion from sparse tensors to dense tensors.	697
2887	The application must use TensorFlow Lite (TFLite).	698
2888	The application must load and process a TFLite model.	698
2889	The loaded TFLite model must be crafted by an attacker.	698
2890	The TensorFlow version must be vulnerable (e.g., older than 2.8.0, or specific older versions like 2.7.0, 2.6.x before 2.6.3, 2.5.x before 2.5.3).	698
2891	Crafted TFLite model	699
2892	Usage of `TfLiteIntArrayCreate`	699
2893	`TfLiteIntArrayGetSizeInBytes` is used and returns an `int`	699
2894	Attacker controls model inputs	699
2895	`computed_size` overflows the size of `int` datatype	699
2896	Usage of TensorFlow.	700
2897	Usage of the Grappler component.	700
2898	Usage of the `set_output` function within Grappler.	700
2899	TensorFlow version is less than 2.8.0.	700
2900	TensorFlow version is 2.7.x and less than 2.7.1.	700
2901	TensorFlow version is 2.6.x and less than 2.6.3.	700
2902	TensorFlow version is 2.5.x and less than 2.5.3.	700
2904	Right-hand side of `AssignOp` contains uninitialized data	701
2905	TensorFlow version is older than 2.8.0	701
2906	TensorFlow version is older than 2.7.1 (if using 2.7.x branch)	701
2907	TensorFlow version is older than 2.6.3 (if using 2.6.x branch)	701
2908	TensorFlow version is older than 2.5.3 (if using 2.5.x branch)	701
2909	Usage of TensorFlow	702
2910	Usage of the `Range` function in TensorFlow	702
2911	TensorFlow version is 2.7.0 or earlier	702
2912	TensorFlow version is 2.6.x prior to 2.6.3	702
2913	TensorFlow version is 2.5.x prior to 2.5.3	702
2914	Usage of the `Dequantize` operation.	703
2915	The `axis` argument of `Dequantize` must be provided.	703
2916	The value of the `axis` argument must be greater than or equal to the number of dimensions of the input tensor.	703
2917	Usage of TensorFlow Lite (TFLite)	704
2918	Ability to craft a malicious TFLite model	704
2919	The TFLite model must contain embedding lookup operations	704
2920	`embedding_size` or `lookup_size` must be products of user-provided values	704
2921	User-provided values must cause an integer overflow during multiplication for `embedding_size` or `lookup_size`	704
2922	The integer overflow must lead to a heap out-of-bounds read/write	704
2923	TensorFlow must be used.	705
2924	The `Dequantize` operation must be used.	705
2925	The `axis` argument of the `Dequantize` operation must be controllable by an attacker.	705
2926	The value of the `axis` argument must be such that `axis + 1` results in an integer overflow.	705
2927	The TensorFlow version must be vulnerable (e.g., older than 2.8.0, 2.7.1, 2.6.3, or 2.5.3).	705
2928	TensorFlow is used.	706
2929	TensorFlow version is prior to 1.15.4, 2.0.3, 2.1.2, 2.2.1, or 2.3.1.	706
2930	The `SparseFillEmptyRowsGrad` function is called.	706
2931	Input to `SparseFillEmptyRowsGrad` causes `reverse_index_map(i)` to generate an out-of-bounds index for `grad_values`.	706
2932	The following constraints must be met for CVE-2022-21740 to be exploitable:	707
2933	*   The code must be using the TensorFlow machine learning framework.	707
2934	*   The TensorFlow version in use must be vulnerable (e.g., 2.5.0, or any version prior to 2.5.3, 2.6.3, 2.7.1, or 2.8.0).	707
2935	*   The code must call the `SparseCountSparseOutput` function.	707
2936	*   The input provided to `SparseCountSparseOutput` must trigger the heap overflow vulnerability, specifically related to the conversion from a Variant tensor to a RaggedTensor where inner shapes do not match.	707
2937	CVE-2020-15214:	708
2938	Usage of TensorFlow Lite.	708
2939	Usage of models employing the "segment sum" operation.	708
2940	Segment IDs provided to the "segment sum" operation are not sorted in increasing order.	708
2941	TensorFlow Lite version is prior to 2.2.1 or 2.3.1.	708
2942	TensorFlow version is prior to 1.15.4, 2.0.3, 2.1.2, 2.2.1, or 2.3.1	709
2943	The `Shard` API is used in the code	709
2944	The last argument to the `Shard` API is a lambda function	709
2945	The lambda function takes `int` or `int32` arguments	709
2946	The amount of work to be parallelized is large enough to cause integer truncation	709
2947	The code must be using tensorflow-lite.	710
2948	The tensorflow-lite version must be prior to 1.15.4, 2.0.3, 2.1.2, 2.2.1, or 2.3.1.	710
2949	The `ResolveAxis` function must be called.	710
2950	Negative values must be provided as indices to `ResolveAxis`.	710
2951	The application must not be running in a debug build where `DCHECK` is active.	710
2952	TensorFlow Lite is used.	711
2953	TensorFlow Lite version is before 2.2.1 or 2.3.1.	711
2954	The model uses segment sum.	711
2955	The segment ids tensor contains negative elements.	711
2956	An attacker has access to `segment_ids_data`.	711
2957	*   The application uses urllib3.	717
2958	*   The application sends a `Cookie` HTTP header in its requests.	717
2959	*   HTTP redirects are enabled (not explicitly disabled) in the urllib3 configuration.	717
2960	*   A redirect occurs to a different origin.	717
2961	The software in use is tensorflow-lite.	712
2962	The tensorflow-lite version is prior to 1.15.4, 2.0.3, 2.1.2, 2.2.1, or 2.3.1.	712
2963	The code is compiled in a release mode where `DCHECK` is a no-op.	712
2964	An attacker can craft a malicious input (e.g., a TensorFlow Lite model).	712
2965	The crafted input involves two tensors where their common dimension size is determined.	712
2966	The dimension of the first tensor is crafted to be larger than that of the second tensor.	712
2967	The interpreter attempts to read or write data based on the incorrectly assumed larger dimension.	712
2968	*   Application uses Spring Security 5.4.x prior to 5.4.4, 5.3.x prior to 5.3.8.RELEASE, 5.2.x prior to 5.2.9.RELEASE, or older unsupported versions.	250
2969	*   Application code changes the `SecurityContext` more than once within a single request.	250
2970	*   Application's intent is to allow elevated privileges only in a small portion of the application within a single request.	250
2971	Usage of `tf.raw_ops.StringNGrams` function	714
2972	`data_splits` argument of `tf.raw_ops.StringNGrams` is used	714
2973	`data_splits` argument is not validated	714
2974	TensorFlow version is before 1.15.4, 2.0.3, 2.1.2, 2.2.1, or 2.3.1	714
2975	The code uses the `urllib3` library.	715
2976	The `urllib3` version is less than 2.5.0.	715
2977	A `urllib3.PoolManager` instance is instantiated in the code.	715
2978	The `PoolManager` is configured with `retries` in a way that attempts to disable redirects (e.g., `urllib3.Retry(redirect=False)` is passed to `PoolManager`).	715
2979	The application relies on the `PoolManager` to disable redirects for security purposes (e.g., to mitigate SSRF or open redirect vulnerabilities).	715
2981	Submitting sensitive information in the HTTP request body (such as form data or JSON)	716
2982	The origin service is compromised and starts redirecting using 301, 302, or 303 to a malicious peer	716
2983	The redirected-to service becomes compromised	716
2984	Using serve-static.	142
2985	serve-static version is older than 1.16.0.	142
2986	Untrusted user input is passed to `redirect()`.	142
2987	Jinja version is on the 3.x branch prior to 3.1.5	39
2988	Attacker controls the content of a template	39
2989	Attacker controls the filename of a template	39
2990	Application executes untrusted templates	39
2991	Template author can choose the template filename	39
2992	Jinja version is prior to 3.1.5	40
2993	Attacker controls the content of a template	40
2994	Application executes untrusted templates	40
2995	Application uses custom filters that call `str.format`	40
2996	Application uses Ajv version 6.12.2 or earlier.	53
2997	The `ajv.validate()` function is used in the code.	53
2998	The application processes untrusted JSON schemas.	53
2999	An untrusted, carefully crafted JSON schema is provided as input.	53
3000	The environment allows prototype pollution to lead to code execution.	53
3001	The application uses Jinja.	41
3002	The Jinja version is prior to 3.1.6.	41
3003	The application executes untrusted templates.	41
3004	An attacker can control the content of a template.	41
3005	The `|attr` filter is used to access a string's plain `format` method.	41
3006	Usage of the Jinja `xmlattr` filter.	42
3007	Python version less than 3.11	43
3008	Operating system is Windows	43
3009	Usage of Werkzeug library	43
3010	Usage of Werkzeug's safe_join() function	43
3011	Application processes UNC paths (e.g., //server/share)	43
3012	Werkzeug version is older than 3.0.6	43
3013	- Werkzeug debugger must be enabled.	44
3014	- Attacker must get the developer to interact with a domain and subdomain they control.	44
3015	- Developer must enter the debugger PIN.	44
3016	- Attacker must guess a URL in the developer's application that will trigger the debugger.	44
3017	- Werkzeug version must be older than 3.0.3.	44
3018	Usage of `werkzeug.formparser.MultiPartParser`	45
3019	Werkzeug version prior to 3.0.6	45
3020	Application parses `multipart/form-data` requests	45
3021	Application is a Flask application (as Flask uses Werkzeug)	45
3022	Application uses Werkzeug.	46
3023	Application uses a version of Werkzeug prior to 3.0.1.	46
3024	Application processes multipart data.	46
3025	An endpoint parses uploaded files.	46
3026	Uploaded file starts with a Carriage Return (CR) or Line Feed (LF) character.	46
3027	Uploaded file contains megabytes of data without CR or LF characters following the initial CR/LF.	46
3028	*   The code must use the `juliangruber/brace-expansion` library.	62
3029	*   The version of `juliangruber/brace-expansion` must be 1.1.11 or older, 2.0.1 or older, 3.0.0 or older, or 4.0.0 or older.	62
3030	*   The `expand` function of the `index.js` file within the `brace-expansion` library must be called.	62
3031	*   The input provided to the `expand` function must be a specially crafted string designed to cause inefficient regular expression complexity.	62
3032	*   The attacker must be able to supply remote input that is processed by the vulnerable `expand` function.	62
3033	Usage of the `cookie` library.	67
3034	Version of the `cookie` library is prior to 0.7.0.	67
3035	Application parses or serializes HTTP cookies.	67
3036	User-controlled input is used for the cookie name.	67
3037	User-controlled input is used for the cookie path.	67
3038	User-controlled input is used for the cookie domain.	67
3039	The user-controlled input for name, path, or domain contains characters that can alter other cookie fields.	67
3040	1. Usage of the Elliptic package.	75
3041	2. Elliptic package version 6.5.6 or earlier.	75
3042	3. Usage of ECDSA signatures.	75
3043	4. Missing check for whether the leading bit of r and s is zero in ECDSA signature validation.	75
3044	5. Running in a Node.js environment.	75
3045	*   Usage of the Elliptic package.	76
3046	*   Elliptic package version 6.5.6 or earlier.	76
3047	*   Execution in a Node.js environment.	76
3048	*   Usage of EDDSA signatures.	76
3049	*   Reliance on strict signature length for validation or processing.	76
3050	Usage of Elliptic package 6.5.7 for Node.js	77
3051	Usage of ECDSA implementation within the Elliptic package	77
3052	The hash contains at least four leading 0 bytes	77
3053	The order of the elliptic curve's base point is smaller than the hash	77
3054	1. Usage of the Elliptic package.	79
3055	2. Elliptic package version 6.5.6 or earlier.	79
3056	3. Running in a Node.js environment.	79
3057	4. Performing ECDSA signature verification.	79
3058	5. Allowing or processing BER-encoded signatures.	79
3059	Usage of the Elliptic package.	80
3060	Elliptic package version is before 6.5.6.	80
3061	The `verify` function in `lib/elliptic/eddsa/index.js` is called.	80
3062	The `sig.S().gte(sig.eddsa.curve.n)` validation is omitted.	80
3063	The `sig.S().isNeg()` validation is omitted.	80
3064	The code is running in a Node.js environment.	80
3065	Usage of the `elliptic` package.	81
3066	`elliptic` package version must be prior to 6.5.4.	81
3067	Usage of the `secp256k1` curve implementation.	81
3068	The `derive` function must be called.	81
3069	An invalid public key point must be passed to the `derive` function.	81
3070	Multiple ECDH operations must be performed.	81
3071	Express.js is used in the application.	86
3072	Express.js version is prior to 4.19.0 or a pre-release alpha/beta version of 5.0.	86
3073	The application performs a redirect using a user-provided URL.	86
3074	The application uses `res.location()` or `res.redirect()`.	86
3075	The application's redirect allow list implementation can be bypassed by malformed URLs.	86
3076	*   Usage of Express.js	87
3077	*   Express.js version less than 4.20.0	87
3078	*   Usage of `response.redirect()` function	87
3079	*   Passing untrusted user input to `response.redirect()`	87
3080	- Usage of the `follow-redirects` library.	49
3081	- `follow-redirects` version is older than 1.15.6.	49
3082	- Application makes requests involving cross-domain redirects.	49
3083	- The `proxy-authentication` header is present in the initial request.	49
3084	- The `proxy-authentication` header contains credentials.	49
3085	*   The application uses the `follow-redirects` package.	50
3086	*   The version of `follow-redirects` package is prior to 1.15.4.	50
3087	*   The application processes URLs that are subject to redirection.	50
3088	*   The `url.parse()` function is used to handle URLs.	50
3089	*   An attacker can craft a malicious URL that causes `new URL()` to throw an error.	50
3090	*   The error handling or subsequent processing of the URL allows for misinterpretation of the hostname.	50
3091	Usage of the `form-data` library.	51
3092	`form-data` version is < 2.5.4, 3.0.0 - 3.0.3, or 4.0.0 - 4.0.3.	51
3093	The application processes HTTP parameters.	51
3094	The application uses `form-data` in a context susceptible to HTTP Parameter Pollution (HPP).	51
3095	The application relies on random values generated by `form-data` that are insufficiently random.	51
3096	The vulnerable code path is within `lib/form_data.Js`.	51
3097	The following constraints must be met for CVE-2020-28282 to be exploitable:	722
3098	The application must use the `getobject` library.	722
3099	The application must use version 0.1.0 of the `getobject` library.	722
3100	The `set()` function of the `getobject` library must be called within the application.	722
3101	An attacker must be able to control the `parts` argument passed to the `set()` function.	722
3102	An attacker must be able to inject `__proto__` into the `parts` argument.	722
3103	The application must later access properties that are affected by the polluted `Object.prototype`.	722
3104	The following constraints must be met for CVE-2022-0144 to be exploitable:	143
3105	*   The application must use the `shelljs` library.	143
3106	*   The `shelljs` version must be prior to 0.8.5.	143
3107	*   The application must use the synchronous `shell.exec()` function, specifically `shell.execSync()`.	143
3108	*   The `shelljs` script must be running with elevated privileges (e.g., as root).	143
3109	*   An attacker must have low-level privileges on the system where the `shelljs` script is executed.	143
3110	*   The vulnerability can lead to information leakage if sensitive data is output to stdout by the privileged process.	143
3111	*   The vulnerability can lead to a denial of service by triggering `EACCESS` errors, for example, by pre-creating temporary files like `stdoutFile`.	143
3112	The following constraints must be met for CVE-2022-0436 to be exploitable:	723
3113	*   The `gruntjs/grunt` package version in use must be prior to 1.5.2.	723
3114	*   The application must process external input that is used to construct a file or directory pathname.	723
3115	*   The external input must contain path traversal sequences (e.g., `../`, `..%2f`, or absolute file paths).	723
3116	*   The application must perform file system operations (e.g., reading, writing, creating, or accessing files/directories) using the unvalidated or unsanitized pathname.	723
3117	*   The application must not properly neutralize special elements within the pathname that can cause it to resolve to a location outside of the intended restricted directory.	723
3118	*   For the specific symlink vulnerability mentioned, a local attacker must have write access to the source directory of `file.copy` to create a symlink to a restricted file.	723
3119	grunt package is used.	724
3120	grunt package version is prior to 1.3.0.	724
3121	grunt.file.readYAML function is used in the code.	724
3122	The vulnerable load() function from js-yaml is used internally by grunt.file.readYAML.	724
3123	The following constraints must be met for CVE-2021-3918 to be exploitable in the code:	101
3124	*   The application must use the `json-schema` library.	101
3125	*   The version of the `json-schema` library in use must be prior to 0.4.0 (e.g., versions 0.2.0 through 0.3.0 are vulnerable).	101
3126	*   The application must process user-controlled JSON input through the `json-schema` validation process.	101
3127	*   The user-controlled JSON input must contain specially crafted properties (e.g., `__proto__`, `constructor`, `prototype`) designed to modify `Object.prototype`.	101
3128	*   The application must call the `validate` function (or internally, the `checkObj` function) of the `json-schema` library with the malicious input.	101
3129	*   For Remote Code Execution (RCE), the application must subsequently use a polluted prototype property in an unsafe context, such as an `eval()` call or other dynamic code execution.	101
3130	*   For Denial of Service (DoS), the application must rely on a polluted prototype property (e.g., `toString()`, `valueOf()`) which is then altered to an unexpected value, causing application failure.	101
3131	*   For data tampering or privilege escalation, the application must rely on a polluted prototype property for informative or security-sensitive values (e.g., `isAdmin`).	101
3132	`jsonwebtoken` library version is `<= 8.5.1`	735
3133	A poorly implemented key retrieval function referring to the `secretOrPublicKey` argument is used	735
3134	The application supports usage of both symmetric key and asymmetric key in `jwt.verify()` implementation	735
3135	The same key retrieval function is used for both symmetric and asymmetric keys	735
3136	Lodash version prior to 4.17.21 is in use.	109
3137	The `toNumber` function is used.	109
3138	The `trim` function is used.	109
3139	The `trimEnd` function is used.	109
3140	Untrusted input is passed to `toNumber`, `trim`, or `trimEnd` functions.	109
3141	*   `jsonwebtoken` library version is `<=8.5.1`	736
3142	*   `jwt.verify()` function is used	736
3143	*   `algorithms` are not explicitly specified in the `jwt.verify()` function options	736
3144	`jsonwebtoken` library version is `<=8.5.1`.	737
3145	Legacy, insecure key types are used for signature verification.	737
3146	An algorithm and a key type combination is used that is not listed as unaffected in the GitHub Security Advisory.	737
3147	The `allowInvalidAsymmetricKeyTypes` option is not explicitly set to `false` (or not set at all, implying default secure behavior) when using `jsonwebtoken` version `9.0.0` or higher with invalid key type/algorithm combinations.	737
3148	The following constraints must be met for CVE-2020-8203 to be exploitable in the code:	110
3149	*   The application must use a vulnerable version of lodash (prior to 4.17.19 or 4.17.20).	110
3150	*   The application must use one of the affected lodash functions: `zipObjectDeep`, `pick`, `set`, `setWith`, `update`, or `updateWith`.	110
3151	*   The property identifiers (keys or paths) passed to these lodash functions must be derived from unsanitized or untrusted user-supplied input.	110
3152	*   The application's logic must rely on properties of `Object.prototype` that can be manipulated by an attacker.	110
3153	*   For Denial of Service (DoS), the application must implicitly call generic functions of `Object` (e.g., `toString`, `valueOf`) which can be polluted to an unexpected value.	110
3154	*   For Remote Code Execution (RCE), the codebase must evaluate a specific attribute of an object and then execute that evaluation (e.g., `eval(someobject.someattr)`).	110
3155	*   The application must not be using `Object.freeze(Object.prototype)` or `Object.create(null)` to prevent prototype pollution.	110
3156	*   The application must not have robust schema validation for JSON input or other user-provided data structures.	110
3157	The following constraints must be met for CVE-2020-7598 to be exploitable in the code:	116
3158	*   The application must be using the `minimist` library.	116
3159	*   The version of `minimist` in use must be prior to 1.2.2.	116
3160	*   The application must process user-controlled input (e.g., command-line arguments) using `minimist`.	116
3161	*   The user-controlled input must contain a "constructor" or "__proto__" payload.	116
3162	*   The application must subsequently access or use properties that are inherited from `Object.prototype`, which would have been polluted by the attacker's payload.	116
3163	Usage of `node-forge` library.	121
3164	`node-forge` version is prior to 1.3.0.	121
3165	Code performs RSA PKCS#1 v1.5 signature verification.	121
3166	Signature contains an invalid ASN.1 structure in `DigestInfo`.	121
3167	Signature contains a valid digest.	121
3168	Usage of `node-forge` library.	122
3169	`node-forge` version is prior to 1.3.0.	122
3170	RSA PKCS#1 v1.5 signature verification is performed.	122
3171	A low public exponent is being used for RSA.	122
3172	The `DigestInfo` ASN.1 structure is being decoded without checking for trailing garbage bytes.	122
3173	Usage of `node-forge` (or Forge) library.	123
3174	`node-forge` version must be prior to 1.3.0.	123
3175	RSA PKCS#1 v1.5 signature verification must be used.	123
3176	A low public exponent must be used in the RSA key.	123
3177	The following constraints must be met for CVE-2022-0122 to be exploitable in the code:	124
3178	*   The application must be using the `node-forge` package.	124
3179	*   The version of `node-forge` in use must be prior to 1.0.0.	124
3180	*   The application must utilize the `forge.util.parseUrl` function, or functions that internally call it (e.g., `createClient`, `withinCookieDomain`), with user-supplied input.	124
3181	*   The user-supplied input to `forge.util.parseUrl` must be a specially crafted URL string that exploits the broken regular expression.	124
3182	*   The application must then use the incorrectly parsed URL components (specifically the `host` or `path`) in a redirection mechanism without further validation or sanitization.	124
3183	*   A victim must be enticed to click on a malicious link containing the crafted URL.	124
3184	1. The application must use the `node-forge` package.	120
3185	2. The version of `node-forge` must be less than 0.10.0.	120
3186	3. The `util.setPath` function from `node-forge` must be called within the application's code.	120
3347	Using Castor.	746
3187	4. Untrusted input must be passed to the `util.setPath` function.	120
3188	`node-jose` version is prior to 2.2.0	738
3189	The "fallback" crypto back-end is being used	738
3190	ECC operations are being performed	738
3191	WebCrypto is not available in the JS environment	738
3192	Node `crypto` module is not available in the JS environment	738
3193	*   The `on-headers` package is used in the code.	129
3194	*   The version of `on-headers` is less than `1.1.0`.	129
3195	*   The `response.writeHead()` function is called.	129
3196	*   An array is passed as an argument to `response.writeHead()`.	129
3197	Usage of path-to-regexp library.	131
3198	Two parameters within a single segment.	131
3199	Parameters separated by something that is not a period (.).	131
3200	path-to-regexp version 0.1.x (specifically 0.1 prior to 0.1.10).	131
3201	path-to-regexp version 1.x through 7.x (prior to 8.0.0).	131
3202	The application must use the 'qs' library.	89
3203	The 'qs' library version must be older than 6.10.3.	89
3204	The 'qs' library version must not be 6.9.7, 6.8.3, 6.7.3, 6.6.1, 6.5.3, 6.4.1, 6.3.3, or 6.2.4 or newer.	89
3205	The application must be a Node.js process.	89
3206	The application must be an Express application or another product that uses 'qs' for query string parsing.	89
3207	The application must process query string parameters from the URL.	89
3208	An unauthenticated remote attacker must be able to place an attack payload in the query string of the URL.	89
3209	The application must not sanitize or validate query string parameters to prevent the use of the `__proto__` key.	89
3210	*   The application uses the Node.js `request` package version 2.88.1 or earlier.	137
3211	*   The application makes requests to external, potentially untrusted, servers.	137
3212	*   An attacker can control a server that the application makes a request to.	137
3213	*   The attacker-controlled server performs a cross-protocol redirect (HTTP to HTTPS, or HTTPS to HTTP).	137
3214	*   The product using the vulnerable `request` package is no longer supported by its maintainer.	137
3215	- Usage of the `semver` package.	139
3216	- `semver` package version is before 7.5.2.	139
3217	- The `new Range` function is called.	139
3218	- Untrusted user data is provided as a range to the `new Range` function.	139
3219	1. Usage of the `send` library.	140
3220	2. `send` library version is older than 0.19.0.	140
3221	3. Untrusted user input is passed to `SendStream.redirect()`.	140
3222	4. The application uses `send` to stream files from the file system as an HTTP response.	140
3223	Spring Framework version 6.0.0 - 6.0.6 or 5.3.0 - 5.3.25 is in use.	728
3224	"**" is used as a pattern in Spring Security configuration.	728
3225	`mvcRequestMatcher` is used in the Spring Security configuration.	728
3226	Thymeleaf version through 3.1.1.RELEASE is used.	729
3227	The product is spring-boot-admin (aka Spring Boot Admin) through 3.1.1 or other products using affected Thymeleaf versions.	729
3228	Crafted HTML is used.	729
3229	MailNotifier is enabled.	729
3230	There is write access to environment variables via the UI.	729
3231	The vulnerability CVE-2021-43466 affects `thymeleaf-spring5:3.0.12` and can lead to remote code execution through template injection. To be exploitable, several conditions must be met:	730
3232	*   The application must be using `thymeleaf-spring5` version 3.0.12 or earlier.	730
3233	*   Thymeleaf must be combined with specific scenarios in template injection.	730
3234	*   User-controlled input must be directly embedded into a Thymeleaf template without proper sanitization.	730
3235	*   The application must dynamically generate templates or allow user input to influence template names or content.	730
3236	*   The `render` function in `AjaxThymeleafView.java` is explicitly referenced as an injection point where unvalidated user input flows into template resolution.	730
3237	*   The application must not properly sanitize or validate the injected data.	730
3238	*   The attacker must be able to inject malicious input through the `render` function in `AjaxThymeleafView.java`.	730
3239	*   The application must be using Thymeleaf's expression language features (e.g., Spring EL or OGNL) in a way that allows for code execution.	730
3240	*   The application must not have a patched version (e.g., 3.0.13.RELEASE or later) of `thymeleaf-spring5`.	730
3241	Here is the list of constraints:	730
3242	Usage of thymeleaf-spring5 component version 3.0.12 or earlier.	730
3243	Thymeleaf is combined with specific scenarios in template injection.	730
3244	User-controlled input is embedded directly into a Thymeleaf template.	730
3245	Lack of proper sanitization or validation of user-controlled input.	730
3246	Dynamic generation of templates or user input influencing template names/content.	730
3247	The `render` function in `AjaxThymeleafView.java` is used with unvalidated user input.	730
3248	The application utilizes Thymeleaf's expression language (Spring EL or OGNL) in an exploitable manner.	730
3249	The application has not been upgraded to a patched version (e.g., 3.0.13.RELEASE or later).	730
3250	JsonErrorReportValve is in use.	731
3251	Apache Tomcat version is 8.5.83, 9.0.40 to 9.0.68, or 10.1.0-M1 to 10.1.1.	731
3252	The `type`, `message`, or `description` values in the error report are constructed from user-provided data.	731
3253	Apache Tomcat version must be 10.1.0-M1 to 10.1.0-M5, 10.0.0-M1 to 10.0.11, 9.0.40 to 9.0.53, or 8.5.60 to 8.5.71.	732
3254	The application must be handling HTTP upgrade connections.	732
3255	The application must be handling WebSocket connections.	732
3256	WebSocket connections must be established and subsequently closed.	732
3257	Sufficient WebSocket connections must be opened and closed over time to exhaust available memory.	732
3258	tough-cookie package must be used.	165
3259	tough-cookie package version must be before 4.1.3.	165
3260	CookieJar must be used.	165
3261	CookieJar must be used in rejectPublicSuffixes=false mode.	165
3262	Usage of the `trim-newlines` package.	166
3263	Version of `trim-newlines` package is before 3.0.1 or 4.x before 4.0.1.	166
3264	The `.end()` method of the `trim-newlines` package is being used.	166
3265	The input to the `.end()` method can be controlled by an attacker.	166
3266	Application uses the `ws` library.	734
3267	`ws` library version is less than 7.4.6.	734
3268	Application acts as a `ws` server.	734
3269	Server processes `Sec-Websocket-Protocol` headers.	734
3270	An attacker can send a specially crafted `Sec-Websocket-Protocol` header.	734
3271	*   Usage of Hibernate-Validator.	232
3272	*   Usage of the `SafeHtml` validator annotation.	232
3273	*   Input data contains HTML comments or processing instructions.	232
3274	*   Malicious code is embedded within HTML comments or processing instructions in the input.	232
3275	*   The unsanitized (or improperly sanitized) output is rendered directly in a web browser.	232
3276	Apache HttpClient library is used.	742
3277	Apache HttpClient version is prior to 4.5.13.	742
3278	Apache HttpClient version is prior to 5.0.3.	742
3279	Request URIs are passed to the library as `java.net.URI` objects.	742
3280	Request URIs contain a malformed authority component.	742
3281	1. Usage of Jakarta Expression Language (EL)	743
3282	2. Jakarta Expression Language version 3.0.3 or earlier	743
3283	3. Evaluation of EL expressions in the code	743
3284	4. Interaction with the ELParserTokenManager component	743
3285	5. Processing of invalid EL expressions that are subsequently evaluated as valid	743
3286	Using Woodstox to parse XML data	745
3287	DTD support is enabled	745
3288	Parser is running on user supplied input	745
3289	H2 Database Engine version is before 2.2.220	224
3290	H2 web-based admin console is started	224
3291	H2 web-based admin console is started via the CLI	224
3292	The `-webAdminPassword` argument is used when starting the console	224
3293	The password for the web admin console is specified in cleartext using the `-webAdminPassword` argument	224
3294	An attacker has local access to the system where H2 is running	224
3295	Usage of h2database.	223
3296	File access operation is performed using a user-controlled or influenced filename/path.	223
3297	Existence of a symbolic link, hard link, or shortcut pointing to an unintended resource.	223
3298	The h2database's file access mechanism resolves the link/shortcut without proper validation.	223
3299	The process running h2database has permissions to resolve the link and access the unintended resource.	223
3300	Vulnerable package `com.h2database:h2` must be version `1.4.198` or earlier, or between `2.0.202` (exclusive) and `1.4.198` (inclusive).	225
3301	Usage of `org.h2.jdbc.JdbcSQLXML` class.	225
3302	`org.h2.jdbc.JdbcResultSet.getSQLXML()` method must be used to receive parsed string data.	225
3303	The `getSource()` method of `org.h2.jdbc.JdbcSQLXML` must be executed.	225
3304	The parameter for the `getSource()` method must be `DOMSource.class`.	225
3305	1. Apache Commons IO library version is before 2.7.	221
3306	2. The `FileNameUtils.normalize` method is invoked.	221
3307	3. The input string to `FileNameUtils.normalize` is an improper value such as "//../foo" or "\\\\..\\foo".	221
3308	4. The calling code uses the result of `FileNameUtils.normalize` to construct a path value.	221
3309	5. The application attempts to access files based on the constructed path.	221
3310	*   Usage of `org.h2.util.JdbcUtils.getConnection` method.	226
3311	*   The application allows an attacker to control the `driverClassName` parameter passed to `getConnection`.	226
3312	*   The application allows an attacker to control the `url` parameter passed to `getConnection`.	226
3313	*   The attacker provides a JNDI driver name (e.g., `javax.naming.InitialContext`).	226
3314	*   The attacker provides a URL pointing to a malicious LDAP or RMI server.	226
3315	*   The H2 Console is exposed and accessible to the attacker (if exploiting via H2 Console).	226
3316	*   The application's environment allows outbound connections to attacker-controlled LDAP/RMI servers.	226
3317	*   The application's classpath contains JNDI-related classes and a JNDI provider.	226
3318	H2 Console is in use.	227
3319	H2 Console version is before 2.1.210.	227
3320	Remote attacker can provide a JDBC URL.	227
3321	JDBC URL contains "jdbc:h2:mem".	227
3322	JDBC URL contains "IGNORE_UNKNOWN_SETTINGS=TRUE".	227
3323	JDBC URL contains "FORBID_CREATION=FALSE".	227
3324	JDBC URL contains "INIT=RUNSCRIPT".	227
3325	JGit version <= 6.6.0.202305301015-r (or affected backport versions) is used.	242
3326	A specially crafted git repository containing a symbolic link is used.	242
3348	Castor version is before 1.3.3.	746
3327	The repository is cloned or a checkout is performed on a case-insensitive filesystem (e.g., Windows, macOS).	242
3328	The user performing the clone or checkout has the rights to create symbolic links.	242
3329	Symbolic links are enabled in the git configuration (core.symlinks = true or not explicitly set to false).	242
3330	One of the following operations is performed: checkout (DirCacheCheckout), merge (ResolveMerger via its WorkingTreeUpdater), pull (PullCommand using merge), or applying a patch (PatchApplier).	242
3331	The software must be Eclipse JGit.	243
3332	The JGit version must be 7.2.0.202503040940-r or older.	243
3333	The `ManifestParser` class must be used.	243
3334	The `repo` command must be used.	243
3335	The `AmazonS3` class must be used.	243
3336	The experimental `amazons3` git transport protocol must be used.	243
3337	The application must be parsing XML files.	243
3338	The XML files being parsed must contain external entities.	243
3339	FasterXML Jackson Databind must be used.	239
3340	XML data must be processed.	239
3341	XML entity expansion must be enabled or not properly secured.	239
3342	The application must process untrusted XML input.	239
3343	The application/service must be running as the root user.	752
3344	An attacker must successfully gain unauthorized access to the system or container.	752
3345	The attacker must be able to execute arbitrary code or commands within the compromised environment.	752
3346	The attacker must be able to leverage root privileges to perform malicious actions.	752
3349	Using Xerces SAX Parser.	746
3350	Xerces SAX Parser is in its default configuration.	746
3351	Processing XML documents from untrusted sources.	746
3352	XML document is crafted to include external entities.	746
3353	Usage of `org.apache.commons.io.input.XmlStreamReader`	220
3354	Processing of maliciously crafted input by `XmlStreamReader`	220
3355	Apache Commons IO version is between 2.0 (inclusive) and 2.14.0 (exclusive)	220
3356	jackson-databind version 2.10.x through 2.12.x before 2.12.6 or 2.13.x before 2.13.1 is in use.	726
3357	JsonNode JDK serialization is being performed.	726
3358	The `ADD` instruction is used in the build process.	753
3359	The `ADD` instruction is used to fetch packages from a remote URL.	753
3360	The remote URL is untrusted or compromised.	753
3361	The fetched package is malicious or contains unexpected content.	753
3362	No integrity checks (e.g., checksums) are performed on the fetched package.	753
3363	No explicit TLS/SSL certificate validation is performed for the remote URL.	753
3364	The `ADD` instruction is used with an archive that could contain malicious files that are automatically unpacked.	753
3365	The remote server redirects `ADD` to a malicious source.	753
3366	*   A `RUN` instruction is present in the Dockerfile.	754
3367	*   The `RUN` instruction contains a `cd` command.	754
3368	*   The `cd` command within the `RUN` instruction uses a relative path.	754
3369	Apache Xerces2 Java Parser must be in use.	748
3370	Apache Xerces2 Java Parser version must be prior to 2.12.0.	748
3371	The application must expose an XML service.	748
3372	The XML service must process messages from remote attackers.	748
3373	The crafted message must be able to trigger hash table collisions.	748
3374	*   The application must be using Apache Xerces2 Java.	749
3375	*   The application must be processing XML input.	749
3376	*   The XML input must be malformed.	749
3377	*   The application must be running on Sun Java Runtime Environment (JRE) in JDK and JRE 6 before Update 15 or JDK and JRE 5.0 before Update 20, or another product using the vulnerable Xerces2 Java version.	749
3378	The code uses `apt`.	755
3379	The usage of `apt` is in an unattended or scripted context.	755
3380	The `apt` interface changes between different versions.	755
3381	The script relies on a specific `apt` interface or output that is subject to change.	755
3382	The following constraints must be met for CVE-2013-4002 to be exploitable:	750
3383	*   The application must be using Apache Xerces2 Java Parser.	750
3384	*   The version of Apache Xerces2 Java Parser must be prior to 2.12.0.	750
3385	*   Alternatively, the application must be running on a vulnerable Java Runtime Environment (JRE) such as IBM Java 5.0 before 5.0 SR16-FP3, 6 before 6 SR14, 6.0.1 before 6.0.1 SR6, and 7 before 7 SR5; Oracle Java SE 7u40 and earlier, Java SE 6u60 and earlier, Java SE 5.0u51 and earlier; JRockit R28.2.8 and earlier, JRockit R27.7.6 and earlier; or Java SE Embedded 7u40 and earlier.	750
3386	*   The application must process XML input.	750
3387	*   The XML input must contain specially crafted XML attribute names or pseudo-attribute names.	750
3388	*   The attacker must be able to provide untrusted and/or user-created XML to the application.	750
3389	Usage of Apache Xerces Java (XercesJ) XML parser.	751
3390	XercesJ version 2.12.1 or previous versions are in use.	751
3391	The application processes XML documents from untrusted sources.	751
3392	The application processes specially crafted XML document payloads.	751
3393	The vulnerability CVE-2022-42004 in FasterXML jackson-databind is exploitable under the following conditions:	236
3394	*   The application uses FasterXML jackson-databind.	236
3395	*   The version of jackson-databind is before 2.13.4 (or before 2.12.7.1 for 2.12.x branch).	236
3396	*   The `BeanDeserializer._deserializeFromArray` method is used during deserialization.	236
3397	*   The deserialization process involves deeply nested arrays.	236
3398	*   The `DeserializationFeature.UNWRAP_SINGLE_VALUE_ARRAYS` feature is explicitly enabled.	236
3399	*   A POJO (Plain Old Java Object) is the target for deserialization.	236
3400	- pandas version 1.0.3 or earlier is in use.	319
3401	- An untrusted file is passed to the `read_pickle()` function.	319
3402	- The untrusted file contains a pickled object whose `__reduce__` method makes an `os.system` call.	319
3403	- PyTorch must be used.	756
3404	- PyTorch version must be 2.6.0+cu124.	756
3405	- The `nnq_Sigmoid` function must be used.	756
3406	- The Quantized Sigmoid Module must be in use.	756
3407	- The `scale` argument of `nnq_Sigmoid` must be manipulated.	756
3408	- The `zero_point` argument of `nnq_Sigmoid` must be manipulated.	756
3409	- Local access to the system is required for the attack.	756
3410	*   Affected software must be PyTorch version 2.6.0.	757
3411	*   The `torch.cuda.memory.caching_allocator_delete` function must be used.	757
3412	*   The vulnerability requires local access to the system.	757
3413	*   The code must be running on a CUDA-enabled device.	757
3414	- PyTorch version 2.6.0+cu124 must be in use.	758
3415	- The `torch.cuda.nccl.reduce` function must be called.	758
3416	- The attack must be launched on the local host.	758
3417	Usage of PyTorch version 2.6.0	759
3418	Usage of the `torch.jit.script` function	759
3419	Attack must be launched on the local host	759
3420	PyTorch version 2.6.0 must be in use.	760
3421	The `torch.lstm_cell` function must be used.	760
3422	Local access to the system is required for the attack.	760
3423	The system must be using PyTorch version 2.6.0.	761
3424	The `torch.nn.utils.rnn.pad_packed_sequence` function must be used in the code.	761
3425	An attacker must have local access to the system.	761
3426	PyTorch version 2.6.0 must be in use.	762
3427	The `torch.nn.utils.rnn.unpack_sequence` function must be used.	762
3428	Local access to the system is required for exploitation.	762
3429	- Affected software must be PyTorch version 2.6.0.	763
3430	- The `torch.jit.jit_module_from_flatbuffer` function must be used in the code.	763
3431	- Local access to the system is required.	763
3432	PyTorch version 2.6.0+cu124 must be in use.	764
3433	The `torch.ops.profiler._call_end_callbacks_on_jit_fut` function must be called.	764
3434	The `Tuple Handler` component must be involved in the execution path.	764
3435	The `None` argument passed to `torch.ops.profiler._call_end_callbacks_on_jit_fut` must be manipulated.	764
3436	*   Usage of PyTorch	765
3437	*   PyTorch version 2.5.1 or prior	765
3438	*   Loading a model	765
3439	*   Usage of `torch.load` function	765
3440	*   `weights_only` parameter of `torch.load` set to `True`	765
3441	The vulnerability CVE-2025-8916 affects Bouncy Castle for Java, specifically the `bcpkix`, `bcprov`, and `bcpkix-fips` modules. It is an "Allocation of Resources Without Limits or Throttling" vulnerability (CWE-770) that can lead to "Excessive Allocation". The core of the issue lies within the `PKIXCertPathReviewer` class, which lacks an established limit on the size of name constraints objects.	212
3442	For this vulnerability to be exploitable, the following constraints must be met:	212
3443	*   The application must be using Bouncy Castle for Java.	212
3444	*   The Bouncy Castle for Java version must be within the affected ranges: BC 1.44 through 1.78, BCPKIX FIPS 1.0.0 through 1.0.7, or BCPKIX FIPS 2.0.0 through 2.0.7.	212
3445	*   The application must be utilizing the `PKIXCertPathReviewer` class.	212
3446	*   The `PKIXCertPathReviewer` class must be processing certificate paths of unknown origin.	212
3447	*   The processed certificate paths must contain large name constraint structures.	212
3448	*   The application must not have other forms of validation or resource allocation limits in place for these certificate paths.	212
3449	Bouncy Castle For Java version is before 1.74	216
3450	Application uses an LDAP CertStore from Bouncy Castle	216
3451	LDAP CertStore is used to validate X.509 certificates	216
3452	Certificate's Subject Name is inserted into an LDAP search filter without escaping	216
3453	Bouncy Castle for Java version is before 1.73.	217
3454	The `org.bouncycastle.openssl.PEMParser` class is used in the code.	217
3455	The application parses OpenSSL PEM encoded streams.	217
3456	The PEM encoded stream contains crafted ASN.1 data.	217
3457	The Bouncy Castle FIPS Java API (BC-FJA) version is 1.0.2.3 or earlier.	217
3458	*   The vulnerable code must be running on Android 10.	218
3459	*   The application must be using `BaseBlockCipher.java`.	218
3460	*   The `engineSetMode` method within `BaseBlockCipher.java` must be called or its logic otherwise engaged.	218
3461	*   The cryptographic algorithm selection process within `engineSetMode` must involve an incomplete comparison.	218
3462	*   The attacker must have local access to the device.	218
3463	*   Usage of Bouncy Castle library (BC) version prior to 1.61 or BC-FJA prior to 1.0.1.2.	219
3464	*   Application uses `org.bouncycastle.crypto.encodings.OAEPEncoding` for decryption.	219
3465	*   The application performs RSA private key decryption using OAEP.	219
3466	*   An attacker can send invalid ciphertext to the OAEP decoder.	219
3467	*   The invalid ciphertext decrypts to a short payload.	219
3468	*   The attacker can observe differences in error behavior (e.g., early exception throwing) during decryption.	219
3469	*   Application uses Spring Framework.	208
3470	*   Spring Framework version is 6.0.0 - 6.0.6, 5.3.0 - 5.3.25, 5.2.0.RELEASE - 5.2.22.RELEASE, or an older unsupported version.	208
3471	*   Application processes user-provided input as a SpEL expression.	208
3472	*   User can provide a specially crafted SpEL expression.	208
3473	Usage of Apache Commons Compress library.	767
3474	Apache Commons Compress version must be between 1.3 and 1.25.0 (inclusive).	767
3475	The vulnerable code path containing the infinite loop within Apache Commons Compress must be executed.	767
3476	Usage of the Compress library.	768
3477	Usage of the Compress' zip package.	768
3478	Processing of specially crafted ZIP archives.	768
3479	Application is susceptible to out-of-memory errors from large memory allocations.	768
3480	*   The application must be processing 7Z archives.	769
3481	*   The 7Z archive must be specially crafted.	769
3482	*   The application must be using the `Compress` library, specifically its `sevenz` package.	769
3483	*   The application must be susceptible to out-of-memory errors due to large memory allocations.	769
3484	*   An attacker must be able to provide a specially crafted 7Z archive to the service.	769
3485	*   Usage of Hibernate Validator.	233
3486	*   Hibernate Validator version 6.1.2.Final is in use.	233
3487	*   Message interpolation is being used.	233
3488	*   User-controlled data is incorporated into error messages.	233
3489	*   The user-controlled data contains an invalid EL expression.	233
3490	Usage of the Compress library.	770
3491	Usage of the tar package within the Compress library.	770
3492	Processing of TAR archives.	770
3493	Processing of specially crafted TAR archives.	770
3494	Exposure to untrusted or malicious TAR archives.	770
3495	Apache Commons Compress versions 1.15 to 1.18 must be in use.	771
3496	The application must be processing archives created by Apache Commons Compress.	771
3497	An attacker must be able to choose or control the file names within the archive.	771
3498	The file names must be specially crafted to trigger the infinite loop.	771
3499	Applications use UriComponentsBuilder.	252
3500	UriComponentsBuilder parses an externally provided URL.	252
3501	The external URL is provided through a query parameter.	252
3502	Validation checks are performed on the host of the parsed URL.	252
3503	The URL is used after passing validation checks.	252
3504	*   The system must be processing a 7Z archive.	772
3505	*   The 7Z archive must be specially crafted.	772
3506	*   The vulnerability occurs during the construction of the list of codecs that decompress an entry.	772
3507	*   The code must be using the `Compress' sevenz package`.	772
3508	*   The application uses Apache Commons Lang library.	739
3509	*   The Apache Commons Lang version is between 2.0 and 2.6 (inclusive) for `commons-lang:commons-lang`.	739
3510	*   The Apache Commons Lang version is between 3.0 and 3.17.x (inclusive) for `org.apache.commons:commons-lang3`.	739
3511	*   The application calls the `ClassUtils.getClass(...)` method.	739
3512	*   The `ClassUtils.getClass(...)` method is called with "very long inputs".	739
3513	Application uses Apache Commons Net.	773
3514	Apache Commons Net version is prior to 3.9.0.	773
3515	Application uses the FTP client functionality of Apache Commons Net.	773
3516	FTP client connects to a malicious FTP server.	773
3517	Malicious FTP server sends a PASV response with a redirected host.	773
3518	The default behavior of trusting the host from the PASV response is not explicitly overridden to `false`.	773
3519	*   The application must be using dom4j.	222
3520	*   The dom4j version must be prior to 2.0.3 or 2.1.x prior to 2.1.3.	222
3521	*   The application must process XML that includes external DTDs.	222
3522	*   The application must process XML that includes External Entities.	222
3523	*   The application must not have explicitly disabled external DTDs and External Entities.	222
3524	Usage of Connect2id Nimbus JOSE + JWT library.	740
3525	Version of Connect2id Nimbus JOSE + JWT library is before 10.0.2.	740
3526	The application processes JWTs.	740
3527	A remote attacker can supply a JWT with a deeply nested JSON object in its claim set.	740
3528	Application uses Spring MVC.	255
3529	Controller method exists.	255
3530	Controller method has a parameter annotated with @RequestBody.	255
3531	The @RequestBody parameter type is byte[].	255
3532	- Usage of `com.google.code.gson:gson` package	741
3533	- `gson` version is before 2.8.9	741
3534	- Deserialization of untrusted data is performed	741
3535	- `writeReplace()` method in internal classes is used during deserialization	741
3536	Google Guava version is between 1.0 and 31.1 (inclusive)	774
3537	The `FileBackedOutputStream` class is used	774
3538	The application is running on a Unix system or Android Ice Cream Sandwich	774
3539	Files are created using Java's default temporary directory	774
3540	Other users or applications on the machine have access to the default Java temporary directory	774
3541	Usage of `com.google.common.io.Files.createTempDir()`	775
3542	Attacker has access to the machine	775
3543	System is unix-like	775
3544	Created directory is world-readable (default on unix-like systems)	775
3545	Guava version is older than 30.0 (where the method was deprecated)	775
3546	Application uses Hibernate ORM.	228
3547	Hibernate ORM version is before 5.3.18, 5.4.18, or 5.5.0.Beta1.	228
3548	Application uses JPA Criteria API.	228
3549	A literal is used in the SELECT part of the query within the JPA Criteria API.	228
3550	A literal is used in the GROUP BY part of the query within the JPA Criteria API.	228
3551	The literal used in SELECT or GROUP BY parts of the query is unsanitized.	228
3552	- The application uses hibernate-core.	229
3553	- The hibernate-core version is prior to or including 5.4.23.Final.	229
3554	- The application uses the JPA Criteria API.	229
3555	- A literal is used in the SQL comments of the query.	229
3556	- The literal used in the SQL comments is unsanitized.	229
3557	Usage of `hibernate-validator`.	230
3558	Usage of `org.hibernate.validator.internal.constraintvalidators.hv.SafeHtmlValidator` class.	230
3559	Calling the `isValid` method of `SafeHtmlValidator`.	230
3560	User-controlled input is passed to the `isValid` method.	230
3561	The input omits the tag ending in a less-than character.	230
3562	The validated (or unvalidated) output is rendered in a web browser.	230
3563	Using Hibernate Validator versions prior to 6.2.0 or 7.0.0.	231
3564	User-supplied input is included in a constraint violation message.	231
3637	TensorFlow is used.	713
3565	Expression Language (EL) interpolation is active for constraint violation messages.	231
3566	Jackson-core version is between 2.0.0 and 2.12.x (inclusive).	234
3567	Parsing JSON from a byte array with an offset and length.	234
3568	An exception occurs during JSON parsing.	234
3569	The `JsonLocation._appendSourceDesc` method is called as part of exception message generation.	234
3570	The system uses pooled or reused buffers (e.g., Netty or Vert.x).	234
3571	Exception messages are exposed to clients.	234
3572	Source inclusion in exceptions is enabled.	234
3573	*   The application uses `jackson-core`.	235
3574	*   The version of `jackson-core` is prior to 2.15.0.	235
3575	*   The application parses input files.	235
3576	*   The input file contains deeply nested data.	235
3577	*   The depth of the nested data is particularly large, exceeding typical stack limits.	235
3578	*   The input file originates from an untrusted source.	235
3579	1. The application uses FasterXML jackson-databind.	237
3580	2. The jackson-databind version is prior to 2.13.4.1 or 2.12.17.1.	237
3581	3. The `UNWRAP_SINGLE_VALUE_ARRAYS` feature is enabled in the jackson-databind configuration.	237
3582	4. Primitive value deserializers are used.	237
3583	5. The application processes untrusted input that can contain deeply nested wrapper arrays.	237
3584	Here are the constraints that must be met for CVE-2020-36518 to be exploitable in the code:	238
3585	*   The application must use the `jackson-databind` library.	238
3586	*   The version of `jackson-databind` in use must be prior to 2.13.0.	238
3587	*   The application must process (deserialize) JSON input.	238
3588	*   The JSON input must contain a large depth of nested objects.	238
3589	*   The application must be susceptible to a Java `StackOverflowException` when processing such deeply nested objects, leading to a Denial of Service.	238
3590	Here are the constraints that must be met for CVE-2019-10172 to be exploitable in the code:	776
3591	*   The application must be using `org.codehaus.jackson:jackson-mapper-asl` library version 1.9.x.	776
3592	*   The application must be processing XML input.	776
3593	*   The vulnerable code path involves `DOMDeserializer.class` or its inner classes (`DocumentDeserializer.class` and `NodeDeserializer.class`).	776
3594	*   The `_parserFactory` instance used by these classes must not be configured to restrict the processing of external XML entities when parsing user input.	776
3595	*   XML External Entity (XXE) processing, including DTDs, must be enabled or not explicitly disabled in the XML parser configuration.	776
3596	*   The application must process XML input from an untrusted source, allowing an attacker to inject malicious DTDs.	776
3597	*   No corresponding mitigations or sanitation methods are in place on the target system.	776
3598	jackson-databind version is before 2.6.7.1	777
3599	jackson-databind version is before 2.7.9.1	777
3600	jackson-databind version is before 2.8.9	777
3601	Application uses the jackson-databind library	777
3602	An unauthenticated user can send input to the application	777
3603	The application uses the `readValue` method of `ObjectMapper`	777
3604	The application deserializes untrusted input	777
3605	The input can be maliciously crafted	777
3606	Usage of Jettison library for parsing.	779
3607	Parsing of untrusted XML or JSON data.	779
3608	Parser is running on user-supplied input.	779
3609	Attacker can supply malicious content.	779
3610	The vulnerability report states that CVE-2022-45693 affects Jettison before v1.5.2 and is a stack overflow via the `map` parameter, leading to a Denial of Service (DoS) via a crafted string. Further details indicate that the vulnerability occurs when creating a new `JSONObject` from a map where the map contains a self-reference as a value, triggering a stack overflow during object creation.	780
3611	Here are the constraints for CVE-2022-45693 to be exploitable:	780
3612	*   The application must be using Jettison.	780
3613	*   The version of Jettison must be prior to 1.5.2.	780
3614	*   The application must process input that is parsed by Jettison as a `map` parameter.	780
3615	*   The `map` parameter must be controllable by an attacker.	780
3616	*   The attacker must be able to provide a crafted string that creates a self-referencing map within the `JSONObject` creation process.	780
3617	Usage of Jettison library for parsing	781
3618	Parsing of untrusted XML or JSON data	781
3619	Parser is running on user-supplied input	781
3620	Spring Framework version must be prior to 5.2.24, 5.3.27, or 6.0.8.	209
3621	Application must allow user-provided input to be interpreted as a SpEL expression.	209
3622	User must provide a specially crafted SpEL expression.	209
3623	Usage of Eclipse Jetty.	783
3624	Usage of the `HttpURI` class for URI/URL parsing.	783
3625	Processing of a URI with an insufficiently validated authority segment by `HttpURI`.	783
3626	Interaction with a browser that handles invalid URIs differently than `HttpURI`.	783
3627	A difference in the extracted host value from an invalid URI between `HttpURI` and the browser.	783
3628	The URI being used after passing initial validation checks within the application.	783
3629	Spring Framework version 5.3.0 - 5.3.16 or older unsupported versions are in use.	210
3630	Application processes user-provided input as a SpEL expression.	210
3631	A specially crafted SpEL expression is provided by a user.	210
3632	Jetty version is prior to 9.4.52, 10.0.16, 11.0.16, or 12.0.1.	784
3633	Jetty accepts the `+` character preceding the content-length value in a HTTP/1 header field.	784
3634	Jetty is used in combination with another server.	784
3635	The other server does not close the connection after sending a 400 response.	784
3636	A request smuggling scenario is conceivable.	784
3638	Grappler component of TensorFlow is used.	713
3639	Cost estimation for crop and resize is performed.	713
3640	Cropping parameters are user-controlled.	713
3641	GruntJS version prior to 1.5.3 is used.	725
3642	`file.copy` operations are performed.	725
3643	A TOCTOU race condition is present during `file.copy` operations.	725
3644	A lower-privileged user has write access to both source and destination directories.	725
3645	A lower-privileged user can create a symlink to the GruntJS user's `.bashrc` file.	725
3646	The GruntJS user is root and a lower-privileged user can replace `/etc/shadow` file.	725
3647	The application uses the `ws` library.	733
3648	The `ws` library version is older than 8.17.1, 7.5.10, 6.2.3, or 5.2.4.	733
3649	The `server.maxHeadersCount` option is set to a value greater than 0.	733
3650	An attacker can send a request with a number of headers exceeding the `server.maxHeadersCount` threshold.	733
3651	The maximum allowed length of request headers (controlled by `--max-http-header-size` or `maxHeaderSize`) does not prevent sending more headers than `server.maxHeadersCount`.	733
3652	The following constraints must be met for CVE-2017-10355 to be exploitable:	747
3653	The application uses the vulnerable `xerces:xercesImpl` library.	747
3654	The application parses XML documents.	747
3655	The XML parser is configured to resolve external entities, including FTP URLs.	747
3656	The `XMLEntityManager.setupCurrentEntity()` method or underlying connection mechanism lacks a connection timeout.	747
3657	An attacker can supply an XML document containing a URL pointing to a controlled FTP server.	747
3658	The target server does not prevent fetching of FTP URI resources.	747
3659	The attack requires multiple threads or repeated requests to exhaust resources.	747
3660	The following constraints must be met for CVE-2014-3643 to be exploitable:	778
3661	*   The application must use the Jersey library.	778
3662	*   The application must process XML input using the Jersey SAX parser.	778
3663	*   The XML input must be untrusted and controllable by an attacker.	778
3664	*   The attacker must be able to send crafted XML requests to a Jersey endpoint.	778
3665	*   The crafted XML must contain external parameter entities within a Document Type Definition (DTD).	778
3666	*   The Jersey SAX parser must not have external parameter entities explicitly disabled.	778
3667	Jetty version is between 9.4.0 and 9.4.46 (inclusive)	782
3668	Jetty version is between 10.0.0 and 10.0.9 (inclusive)	782
3669	Jetty version is between 11.0.0 and 11.0.9 (inclusive)	782
3670	The code uses the Jetty HttpURI class	782
3671	The code parses the authority segment of an http scheme URI	782
3672	The code is used in a Proxy scenario	782
3673	The following constraints must be met for CVE-2020-27223 to be exploitable:	786
3674	*   The application uses Eclipse Jetty.	786
3675	*   The Jetty version is 9.4.6.v20170531 to 9.4.36.v20210114 (inclusive), 10.0.0, or 11.0.0.	786
3676	*   Jetty handles a request.	786
3677	*   The request contains multiple `Accept`, `Accept-Encoding`, or `Accept-Language` headers.	786
3678	*   These headers contain a large number of "quality" (i.e., q) parameters.	786
3679	*   One of the following Jetty features is in use: Default Error Handling, StatisticsServlet, HttpServletRequest.getLocale(), HttpServletRequest.getLocales(), or DefaultServlet handling pre-compressed static content.	786
3680	Eclipse Jetty must be in versions 7.2.2 to 9.4.38, 10.0.0.alpha0 to 10.0.1, or 11.0.0.alpha0 to 11.0.1.	787
3681	The system must receive a TLS frame.	787
3682	The received TLS frame must be large.	787
3683	The received TLS frame must be invalid.	787
3684	Jetty is used as the web server.	785
3685	The application uses a Java-based web server.	785
3686	A servlet with multipart support is deployed.	785
3687	The servlet is annotated with `@MultipartConfig`.	785
3688	The servlet calls `HttpServletRequest.getParameter()`.	785
3689	The servlet calls `HttpServletRequest.getParts()`.	785
3690	The client sends a multipart request.	785
3691	The multipart request contains a part with a name.	785
3692	The multipart request contains a part with no filename.	785
3693	The multipart part has very large content.	785
3694	The Jetty version is older than 9.4.51.	785
3695	The Jetty version is older than 10.0.14.	785
3696	The Jetty version is older than 11.0.14.	785
3697	The `maxRequestSize` multipart parameter is not set to a non-negative value.	785
3698	*   Application uses JJWT (Java JWT).	788
3699	*   JJWT version is 0.12.5 or earlier.	788
3700	*   The `setSigningKey()` method within the `DefaultJwtParser` class is used.	788
3701	*   The `signWith()` method within the `DefaultJwtBuilder` class is used.	788
3702	*   There is a user error in how JJWT is used.	788
3703	*   A key containing "certain characters" that are ignored is used, leading to a false conclusion of a strong key.	788
3704	Usage of json-path library	186
3705	json-path version 2.8.0 is in use	186
3706	The `Criteria.parse()` method is called	186
3707	Maliciously crafted input is passed to `Criteria.parse()`	186
3708	Usage of the `json-smart` library.	187
3709	Input JSON contains deeply nested arrays.	187
3710	Input JSON contains deeply nested objects.	187
3711	The `json-smart` library is used to parse the malicious JSON input.	187
3712	The parsing process involves recursive calls for nested structures.	187
3713	*   Usage of netplex json-smart-v1 (through 2015-10-23) or json-smart-v2 (through 2.4) library.	188
3714	*   A function within the json-smart library throws an exception (e.g., NumberFormatException).	188
3715	*   The thrown exception is not caught by the consuming application code.	188
3716	Here are the constraints that must be met for CVE-2022-0839 to be exploitable:	744
3717	*   The application uses Liquibase.	744
3718	*   The Liquibase version is prior to 4.8.0.	744
3719	*   The application processes XML input via the `XMLChangeLogSAXParser()` function.	744
3720	*   The XML parser used by Liquibase (specifically `SAXParser` in `XMLChangeLogSAXParser()`) does not have the `FEATURE_SECURE_PROCESSING` setting enabled.	744
3721	*   The XML input processed by Liquibase is controlled by an attacker.	744
3722	*   The attacker crafts a malicious XML file containing external entity references.	744
3723	Usage of jsoup library.	789
3724	jsoup version is older than 1.15.3.	789
3725	`SafeList.preserveRelativeLinks` option is enabled.	789
3726	HTML input contains `javascript:` URL expressions crafted with control characters.	789
3727	The crafted link is presented to a user.	789
3728	A user clicks the crafted link.	789
3729	The site where the HTML is published does not set an appropriate Content Security Policy (CSP).	789
3730	Unsanitized input from a vulnerable version of jsoup has been persisted.	789
3731	Using jsoup library.	790
3732	jsoup version prior to 1.14.2.	790
3733	Parsing untrusted HTML or XML.	790
3734	Parser is run on user-supplied input.	790
3735	The code uses JUnit4 from version 4.7 and before 4.13.1.	241
3736	The code uses the `TemporaryFolder` test rule.	241
3737	The code is executed on a Unix-like operating system.	241
3738	The JUnit tests write sensitive information (e.g., API keys, passwords) into the temporary folder.	241
3739	The JUnit tests execute in an environment where the OS has other untrusted users.	241
3740	Usage of logback.	190
3741	Logback version 1.4.11 is in use.	190
3742	Logback receiver component is enabled/in use.	190
3743	Application processes untrusted serialized data via the logback receiver.	190
3744	Logback version 1.2.7 or prior is used.	191
3745	Attacker has privileges to edit configuration files.	191
3746	A malicious configuration is crafted.	191
3747	Arbitrary code is loaded from LDAP servers.	191
3748	Usage of JaninoEventEvaluator	192
3749	logback-core version 0.1 to 1.3.14 or 1.4.0 to 1.5.12	192
3750	Attacker can compromise an existing logback configuration file	192
3751	Attacker can inject an environment variable before program execution	192
3752	Attacker has write access to a configuration file	192
3753	Attacker can inject a malicious environment variable pointing to a malicious configuration file	192
3754	Attacker has existing privilege	192
3755	- Usage of SaxEventRecorder	193
3756	- Usage of logback versions 0.1 to 1.3.14 or 1.4.0 to 1.5.12	193
3757	- Running on the Java platform	193
3758	- Attacker must be able to compromise logback configuration files in XML	193
3759	- Attacker must be able to modify the DOCTYPE declaration in XML configuration files	193
3760	Usage of pgjdbc.	791
3761	Usage of `PreparedStatement.setText(int, InputStream)` or `PreparedStatemet.setBytea(int, InputStream)`.	791
3762	The `InputStream` provided to the function is larger than 2KB.	791
3763	The application is running on a Unix-like operating system (excluding macOS).	791
3764	The pgjdbc version is older than 4.5.0 (if using JDK 1.7 or higher).	791
3765	The application is running on Java 1.6 or lower and `java.io.tmpdir` is not set to a directory exclusively owned by the executing user.	791
3766	The application uses the PostgreSQL JDBC Driver (PgJDBC).	792
3767	The application invokes the `ResultSet.refreshRow()` method.	792
3768	The underlying database being queried may be under the control of an attacker.	792
3769	The attacker can control column names in the database.	792
3770	The attacker can trick the user into executing SQL against a table with malicious column names.	792
3771	The application's JDBC user is privileged and queries database schemas owned by potentially malicious less-privileged users.	792
3772	Usage of pgjdbc, the PostgreSQL JDBC Driver.	793
3773	PreferQueryMode=SIMPLE must be enabled.	793
3774	A placeholder for a numeric value must be immediately preceded by a minus.	793
3775	There must be a second placeholder for a string value after the first placeholder.	793
3776	Both placeholders must be on the same line.	793
3777	The pgjdbc version must be before 42.7.2, 42.6.1, 42.5.5, 42.4.4, 42.3.9, or 42.2.28.	793
3778	The following constraints must be met for CVE-2020-13692 to be exploitable:	794
3779	*   The application must use the PostgreSQL JDBC Driver (PgJDBC).	794
3780	*   The version of the PostgreSQL JDBC Driver must be prior to 42.2.13.	794
3781	*   The application must process XML data using the `PgSQLXML` class.	794
3782	*   The `getSource()` method of `PgSQLXML` must be invoked with a `null` or `DOMSource.class` parameter for `sourceClass`.	794
3856	*   Application directly uses AuthenticatedVoter#vote	247
3783	*   The XML data processed by the `PgSQLXML` class must be supplied from an untrusted source or be controllable by an attacker.	794
3784	*   The XML data must contain a malicious external entity declaration.	794
3785	*   Usage of `postgresql-jdbc` library.	795
3786	*   `postgresql-jdbc` version is prior to 42.2.5.	795
3787	*   An SSL Factory is explicitly provided to the driver.	795
3788	*   A host name verifier is *not* provided to the driver.	795
3789	*   A man-in-the-middle attack is possible.	795
3790	*   The attacker possesses a certificate signed by a trusted Certificate Authority (CA).	795
3791	*   The application must be using the snakeYAML library.	195
3792	*   The application must be parsing YAML files.	195
3793	*   The YAML files being parsed must originate from an untrusted source or contain user-supplied input.	195
3794	*   The untrusted YAML content must be crafted to induce a stack-overflow in the snakeYAML parser.	195
3795	*   Application uses pgjdbc driver.	796
3796	*   pgjdbc version is before 42.3.3.	796
3797	*   Attacker controls the JDBC URL or connection properties.	796
3798	*   Attacker can set `loggerFile` connection property.	796
3799	*   Attacker can set `loggerLevel` connection property.	796
3800	*   Application uses `java.util.logging.FileHandler`.	796
3801	*   Application uses the pgjdbc driver with untrusted connection properties.	796
3802	System uses pgjdbc (PostgreSQL JDBC Driver) library.	797
3803	Attacker controls the JDBC URL or connection properties.	797
3804	Usage of `authenticationPluginClassName` connection property.	797
3805	Usage of `sslhostnameverifier` connection property.	797
3806	Usage of `socketFactory` connection property.	797
3807	Usage of `sslfactory` connection property.	797
3808	Usage of `sslpasswordcallback` connection property.	797
3809	Driver instantiates a plugin instance based on a class name provided via one of the mentioned connection properties.	797
3810	The instantiated class does not implement the expected interface.	797
3811	*   The application must use the snakeYAML library.	194
3812	*   The application must parse untrusted YAML files.	194
3813	*   The snakeYAML parser must be processing user-supplied input.	194
3814	*   An attacker must be able to supply malicious YAML content.	194
3815	1. The application must be using the snakeYAML library.	196
3816	2. The application must be parsing YAML files.	196
3817	3. The YAML files being parsed must originate from an untrusted source or user-supplied input.	196
3818	4. The parsing process must be susceptible to a stack overflow when processing specially crafted YAML content.	196
3819	1. The application must be using the snakeYAML library.	197
3820	2. The application must be parsing YAML files.	197
3821	3. The YAML files being parsed must be untrusted or user-supplied input.	197
3822	4. The parser must be vulnerable to a stack overflow when processing malicious YAML content.	197
3823	Usage of Snakeyaml library.	198
3824	Parsing of untrusted YAML files.	198
3825	Parser is running on user-supplied input.	198
3826	Attacker supplies malicious YAML content.	198
3827	Usage of `org.yaml:snakeyaml` library.	199
3828	`org.yaml:snakeyaml` version is between 0 and 1.30 (inclusive).	199
3829	Application processes untrusted YAML input.	199
3830	YAML input contains deeply nested collections.	199
3831	Usage of SnakeYaml's `Constructor()` class (or default deserialization behavior).	200
3832	Deserialization of untrusted/attacker-controlled YAML content.	200
3833	SnakeYaml version is prior to 2.0.	200
3834	Not using SnakeYaml's `SafeConstructor` or equivalent secure deserialization.	200
3835	SnakeYAML library must be in use.	244
3836	SnakeYAML version must be prior to 1.26.	244
3837	The application must be loading YAML data from an untrusted source.	244
3838	The loaded YAML data must contain YAML aliases.	244
3839	The loaded YAML data must be specifically crafted to trigger entity expansion.	244
3840	Application uses Spring Boot	203
3841	Spring Boot version is 3.0.0 - 3.0.6, 2.7.0 - 2.7.11, 2.6.0 - 2.6.14, 2.5.0 - 2.5.14 or older unsupported versions	203
3842	Application uses Spring MVC	203
3843	Application is used together with a reverse proxy cache	203
3844	Spring Boot version prior to v2.2.11.RELEASE is in use.	202
3845	The `org.springframework.boot.web.server.AbstractConfigurableWebServerFactory.createTempDir` method is being utilized.	202
3846	The application is running on an unsupported version of Spring Boot.	202
3847	Usage of Spring Framework.	205
3848	Spring Framework version is 5.3.0 - 5.3.18, 5.2.0 - 5.2.20, or an older unsupported version.	205
3849	Usage of DataBinder.	205
3850	`disallowedFields` are configured on a DataBinder.	205
3851	`disallowedFields` patterns do not include both upper and lower case for the first character of the field.	205
3852	`disallowedFields` patterns do not include both upper and lower case for the first character of all nested fields within the property path.	205
3853	An attacker can provide input that targets a field that is intended to be disallowed but is not effectively protected due to case sensitivity.	205
3854	*   Spring Framework version is between 5.3.0 and 5.3.38 (inclusive) or an older unsupported version.	207
3855	*   The application evaluates user-supplied SpEL expressions.	207
3857	*   AuthenticatedVoter#vote is called with a null Authentication parameter	247
3858	*   Spring Security version is 5.7.x prior to 5.7.12	247
3859	*   Spring Security version is 5.8.x prior to 5.8.11	247
3860	*   Spring Security version is 6.0.x prior to 6.0.9	247
3861	*   Spring Security version is 6.1.x prior to 6.1.8	247
3862	*   Spring Security version is 6.2.x prior to 6.2.3	247
3863	Usage of `BCryptPasswordEncoder`.	798
3864	Invocation of `BCryptPasswordEncoder.matches(CharSequence, String)`.	798
3865	The provided password (first argument) must be longer than 72 characters.	798
3866	The first 72 characters of the provided password must match the stored hash.	798
3867	Spring Security version is 5.3.x prior to 5.3.2, 5.2.x prior to 5.2.4, 5.1.x prior to 5.1.10, 5.0.x prior to 5.0.16 or 4.2.x prior to 4.2.16.	799
3868	The application uses the queryable text encryptor.	799
3869	The queryable text encryptor uses CBC Mode with a fixed null initialization vector.	799
3870	A malicious user has access to the data encrypted by this encryptor.	799
3871	The malicious user can perform a dictionary attack.	799
3872	*   Application uses Spring Security.	246
3873	*   Application uses Spring WebFlux.	246
3874	*   Spring Security configuration uses "**" as a pattern.	246
3875	Spring Framework version is 5.2.0 - 5.2.8, 5.1.0 - 5.1.17, 5.0.0 - 5.0.18, 4.3.0 - 4.3.28, or older unsupported versions.	257
3876	Application is susceptible to RFD attacks (CVE-2015-5211 protections are bypassed).	257
3877	A `jsessionid` path parameter is used.	257
3878	Exploitability depends on the browser used.	257
3879	The vulnerability CVE-2021-22096, a log injection flaw in Spring Framework, has the following constraints for exploitation:	258
3880	*   The application must be using Spring Framework.	258
3881	*   The Spring Framework version must be within the affected ranges: 5.3.0 - 5.3.10, 5.2.0 - 5.2.17, or older unsupported versions.	258
3882	*   The application must process user-provided input.	258
3883	*   The user-provided input must be used in a logging operation.	258
3884	*   The user-provided input must not be properly neutralized or sanitized before being logged (CWE-117: Improper Output Neutralization for Logs).	258
3885	*   The attacker requires low privileges.	258
3886	*   The vulnerability is exploitable over a network (Attack Vector: Network).	258
3887	*   No user interaction is necessary for exploitation.	258
3888	*   Spring Framework version 5.2.x prior to 5.2.15 or 5.3.x prior to 5.3.7 is in use.	259
3889	*   The application is a WebFlux application.	259
3890	*   A locally authenticated malicious user has access to the system.	259
3891	*   The attacker can (re)create the temporary storage directory used by the WebFlux application.	259
3892	*   The application handles file uploads via multipart requests.	259
3893	Pivotal Spring Framework version 5.3.16 or earlier must be in use.	256
3894	Java deserialization must be performed by the application.	256
3895	The data being deserialized must be untrusted.	256
3896	The specific implementation of the Spring Framework within the product must allow for this exploitation.	256
3897	Authentication may be required.	256
3898	Application uses Spring Framework.	260
3899	Spring Framework version is 5.2.x prior to 5.2.3, 5.1.x prior to 5.1.13, or 5.0.x prior to 5.0.16.	260
3900	Application sets a "Content-Disposition" header in the response.	260
3901	The filename attribute in the "Content-Disposition" header is derived from user-supplied input.	260
3902	*   Spring Framework version is 5.2.x prior to 5.2.3	261
3903	*   Application uses Spring MVC (spring-webmvc module) or Spring WebFlux (spring-webflux module)	261
3904	*   Targeted endpoints are non-authenticated	261
3905	*   CORS preflight requests are enabled	261
3906	*   Client is using a Chrome-based browser (if client certificates are used for authentication)	261
3907	*   Application uses Spring Framework.	262
3908	*   Spring Framework version is 5.3.0 - 5.3.13, 5.2.0 - 5.2.18, or an older unsupported version.	262
3909	*   Application processes user-provided input.	262
3910	*   User-provided input is used in logging operations without proper sanitization.	262
3911	The web application uses RouterFunctions to serve static resources	727
3912	Resource handling is explicitly configured with a FileSystemResource location	727
3913	The Spring Security HTTP Firewall is not in use	727
3914	The application does not run on Tomcat	727
3915	The application does not run on Jetty	727
3916	The following constraints must be met for CVE-2024-31573 to be exploitable in the code:	211
3917	*   The application uses `org.xmlunit:xmlunit-core` version prior to 2.10.0.	211
3918	*   The application performs XSLT transformations using `xmlunit-core`.	211
3919	*   The XSLT stylesheet used for transformation is sourced from an untrusted external input.	211
3920	*   The XSLT processor used allows XSLT extension functions to be executed.	211
3921	The Apache Tomcat server is running an affected version (11.0.0-M1 through 11.0.7, 10.1.0-M1 through 10.1.41, 9.0.0.M1 through 9.0.105, or 8.5.0 through 8.5.100).	263
3922	The Apache Tomcat server is configured to accept incoming connections/requests from untrusted sources.	263
3923	The Apache Tomcat server's internal resource allocation mechanisms (e.g., for threads, connections, sessions, memory) are not configured with explicit limits or are configured with excessively high limits.	263
3924	An attacker can send a sufficient volume or type of requests to trigger the uncontrolled resource allocation within the Tomcat server.	263
3925	No external network or system-level controls (e.g., firewalls, load balancers, OS resource limits) are in place to prevent or mitigate excessive resource consumption by the Tomcat process.	263
\.


--
-- TOC entry 3489 (class 0 OID 0)
-- Dependencies: 272
-- Name: constraint_table_id_seq; Type: SEQUENCE SET; Schema: public; Owner: flow_user
--

SELECT pg_catalog.setval('public.constraint_table_id_seq', 3925, true);


--
-- TOC entry 3332 (class 2606 OID 16904)
-- Name: constraint_table constraint_table_pkey; Type: CONSTRAINT; Schema: public; Owner: flow_user
--

ALTER TABLE ONLY public.constraint_table
    ADD CONSTRAINT constraint_table_pkey PRIMARY KEY (id);


--
-- TOC entry 3333 (class 1259 OID 16910)
-- Name: idx_constraint_table_vulnerability_id; Type: INDEX; Schema: public; Owner: flow_user
--

CREATE INDEX idx_constraint_table_vulnerability_id ON public.constraint_table USING btree (vulnerability_id);


--
-- TOC entry 3334 (class 2606 OID 16905)
-- Name: constraint_table constraint_table_vulnerability_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: flow_user
--

ALTER TABLE ONLY public.constraint_table
    ADD CONSTRAINT constraint_table_vulnerability_id_fkey FOREIGN KEY (vulnerability_id) REFERENCES public.vulnerability(id);


-- Completed on 2025-09-07 18:17:44

--
-- PostgreSQL database dump complete
--

\unrestrict kJ8GbXNynEqTBgRQy6gQwky4RIdnnj404dceHJqZJT586IQGG0TDUSQz2rRCP7t

