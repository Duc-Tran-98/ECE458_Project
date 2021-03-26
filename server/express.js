const axios = require('axios');
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const Stream = require('stream');
const { Client } = require('ssh2');
const SSH2Promise = require('ssh2-promise');

const runBarcode = require('./datasources/barcodeGenerator');

const {
  // eslint-disable-next-line max-len
  oauthClientId, oauthClientSecret, oauthRedirectURI, sshHostName, sshPassword, sshUserName, sshPort,
} = require('./config');

// SSH Information
const sshConfig = {
  host: sshHostName,
  port: sshPort,
  username: sshUserName,
  password: sshPassword,
};
console.log('Using SSHConfig: ');
console.log(sshConfig);
const conn = new Client();
const ssh = new SSH2Promise(sshConfig);

const app = express();
app.use(cors());
app.use(express.json());
const expressPort = 4001;
const whichRoute = process.env.NODE_ENV.includes('dev') ? '/api' : '/express/api';

app.post(`${whichRoute}/oauthConsume`, (req, res) => {
  const { code } = req.body;
  const authString = Buffer.from(
    `${oauthClientId}:${oauthClientSecret}`,
  ).toString('base64');
  const url = process.env.OAUTH_TOKEN_URL ? process.env.OAUTH_TOKEN_URL : 'https://oauth.oit.duke.edu/oidc/token';

  const options = {
    url,
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${authString}`,
    },
    data: `grant_type=authorization_code&redirect_uri=${encodeURI(
      oauthRedirectURI,
    )}&code=${code}`,
  };

  axios(options)
    .then((response) => {
      res.json({
        success: true,
        result: response.data,
      });
    })
    .catch((err) => {
      res.json({
        error: err,
        success: false,
      });
    });
});

app.get(`${whichRoute}/userinfo`, (req, res) => {
  const url = 'https://oauth.oit.duke.edu/oidc/userinfo';
  const { accessToken } = req.query;

  const options = {
    url,
    method: 'post',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  };

  console.log('calling userInfo API with options: ');
  console.log(options);

  axios(options)
    .then((response) => {
      console.log(response);
      res.json({
        success: true,
        result: response.data,
      });
    })
    .catch((err) => {
      console.log(err);
      res.json({
        error: err,
        success: false,
      });
    });
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, '/usr/src/app/uploads');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const filter = function (req, file, cb) {
  // accept image only
  // if (1 === 2) {
  // if (!file.originalname.match(/\.(jpg|jpeg|png|gif|pdf|xlsx)$/)) {
  // eslint-disable-next-line max-len
  //   return cb(new Error('Only files of the format JPG, PNG, GIF, PDF, or XLSX are allowed!'), false);
  // }
  return cb(null, true);
};

const upload = multer({
  storage,
  limits: {
    fileSize: 32 * 1024 * 1024,
  },
  fileFilter: filter,
});

app.post(`${whichRoute}/upload`, upload.any(), (req, res) => {
  // req.file is the `avatar` file
  // req.body will hold the text fields, if there were any
  res.send({
    assetName: req.files[0].filename,
    fileName: req.files[0].originalname,
  });
});

app.post(`${whichRoute}/uploadExcel`, (req, res) => {
  // Do some things
  res.send('Hello World');
});

app.get(`${whichRoute}/barcodes`, async (req, res) => {
  const assetTags = [];
  for (let i = 0; i < req.query.tags.length; i += 1) {
    assetTags.push(parseInt(req.query.tags[i], 10));
  }
  const pdf = await runBarcode({ data: assetTags });
  const filename = 'asset_labels.pdf';
  const readStream = new Stream.PassThrough();
  readStream.end(pdf);

  res.set('Content-disposition', `attachment; filename=${filename}`);
  res.set('Content-Type', 'application/pdf');

  readStream.pipe(res);
});

app.post(`${whichRoute}/klufeOn`, (req, res) => {
  res.send('Turning Klufe On');
  const cmd = 'on\n';
  conn.on('ready', () => {
    console.log('Client :: ready');
    conn.shell((err, stream) => {
      if (err) throw err;
      stream.write(cmd);
      stream.on('close', () => {
        console.log('Stream :: close');
        conn.end();
      }).on('data', (data) => {
        // TODO: Parse data for validation
        if (data.includes('admin3@k5700:')) {
          console.log(`${data}`);
        }
      });
    });
  }).connect(sshConfig);
});

app.post(`${whichRoute}/klufeOff`, (req, res) => {
  res.send('Turning Klufe Off');
  const cmd = 'off\n';
  conn.on('ready', () => {
    console.log('Client :: ready');
    conn.shell((err, stream) => {
      if (err) throw err;
      stream.write(cmd);
      stream.on('close', () => {
        console.log('Stream :: close');
        conn.end();
      }).on('data', (data) => {
        // TODO: Parse data for validation (or send back to frontend?)
        if (data.includes('admin3@k5700:')) {
          console.log(`${data}`);
        }
      });
    });
  }).connect(sshConfig);
});

/* STEP MAP:
1. set dc 0
3. set dc 3.5
6. set ac 3.513 50
8. set ac 100 20 kHz
10. set ac 3.5 10 kHz
12. set ac 3 10 kHz
*/
app.post(`${whichRoute}/klufeStep`, (req, res) => {
  const { stepNum, stepStart } = req.body;
  const message = `Klufe Step with stepNum: ${stepNum} and stepStart: ${stepStart}`;
  console.log(message);

  const validStepNumbers = [1, 3, 6, 8, 10, 12];
  const validStartValues = [true, false];

  if (!validStepNumbers.includes(stepNum) || !validStartValues.includes(stepStart)) {
    return res.status(403).send('Invalid requeset');
  }

  const start = validStartValues === true ? 'on\n' : 'off\n';

  let cmd = '';
  switch (stepNum) {
    case 1:
      cmd = 'set dc 0\n';
      break;
    case 3:
      cmd = 'set dc 3.5\n';
      break;
    case 6:
      cmd = 'set ac 3.513 50\n';
      break;
    case 8:
      cmd = 'set ac 100 20000\n';
      break;
    case 10:
      cmd = 'set ac 3.5 10000\n';
      break;
    case 12:
      cmd = 'set ac 3 10000\n';
      break;
    default:
      cmd = '\n';
  }

  cmd += start;

  console.log(`Sending cmd: ${cmd}`);
  conn.on('ready', () => {
    console.log('Client :: ready');
    conn.shell((err, stream) => {
      if (err) throw err;
      stream.write(cmd);
      stream.on('close', () => {
        console.log('Stream :: close');
        conn.end();
      }).on('data', (data) => {
        // TODO: Parse data for validation (or send back to frontend?)
        if (data.includes('admin3@k5700:')) {
          console.log(`${data}`);
        }
      });
    });
  }).connect(sshConfig);

  return res.send(message);
});

const parseResponse = (promp) => {
  const split = promp.split(/\s+/);
  const voltage = split[0];
  const current = split[1];
  let status = split[2];
  let frequency = null;
  if (current === 'AC') {
    [, , frequency, status] = split;
  }

  return {
    voltage,
    current,
    frequency,
    status,
  };
};

app.get(`${whichRoute}/klufeStatus`, async (req, res) => {
  const shell = await ssh.shell();
  await shell.on('data', (data) => {
    if (data.includes('admin3@k5700:')) {
      const regex = new RegExp('\\\x1B[[0-9;]*m');
      const split = data.toString().split(regex);
      const prompt = split[2];
      console.log(`prompt: ${prompt}`);
      const responseObj = parseResponse(prompt);
      res.send(responseObj);
    }
  });
});

app.listen({ port: expressPort }, () => console.log(`🚀 Express Server ready at http://localhost:${expressPort}, whichRoute = ${whichRoute}`));
