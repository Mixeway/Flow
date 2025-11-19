## How to Run:

```shell
git clone https://github.com/mixeway/flow
cd flow
npm install
npm start
```

### Communication to backend
- in current release all communication to backend is done via src/app/service*
- all Services have hardcoded line: `private loginUrl = 'http://lh1:8080'; // Replace with your backend URL`
- make sure to add lh1 in `/etc/hosts` pointing for backend address (in most of dev cases it would be 127.0.0.1)


### ARM
arm image is with `latest-arm` tag

