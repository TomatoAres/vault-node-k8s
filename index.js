const express = require('express');
const Vault = require('node-vault');
const fs = require('fs');

const app = express();
const port = process.env.SERVICE_PORT || 8080;
const vaultUrl = process.env.VAULT_ADDR || 'http://vault:8200';
const vaultToken = 'root';
const jwtPath = process.env.JWT_PATH;
const secretsPath = process.env.SECRET_PATH || 'secret/data/webapp/config';
const role = process.env.ROLE || 'webapp';


const vault = Vault({
  apiVersion: 'v1',
  endpoint: vaultUrl,
  token: vaultToken
});

app.get('/', async (req, res) => {
  console.log('Received Request - Port forwarding is working.');

  // 默认使用 k8s jwt token 路径
  if (jwtPath) {
    try {
      const jwt = await fs.promises.readFile(jwtPath, 'utf8');
      console.log('Read JWT:', jwt);

      // 登录;
      const loginResponse = await vault.kubernetesLogin({
        role: role,
        jwt
      });

      vault.token = loginResponse.auth.client_token;
      console.log('Retrieved token:', vault.token);
    } catch (err) {
      console.error('Error getting response from Vault k8s login:', err);
      return res.status(500).send('Error getting response from Vault k8s login');
    }
  }

  // 读取密码、秘钥
  try {
    const secretResponse = await vault.read(secretsPath);
    const secretData = secretResponse.data.data;

    let output = '';
    for (const [key, value] of Object.entries(secretData)) {
      output += `${key}:${value} `;
    }
    res.send(output);
  } catch (err) {
    console.error('Error getting secret from Vault:', err);
    return res.status(500).send('Error getting secret from Vault');
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
