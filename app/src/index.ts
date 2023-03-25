import express from 'express';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = 4000;

const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;
const redirectUri = process.env.REDIRECT_URI;
const state = 'seeecret';

if (!(clientId && clientSecret && redirectUri)) {
  throw Error(
    `no 42 api client env specified. CLIENT_ID=${clientId}, CLIENT_SECRET=${clientSecret}, REDIRECT_URI=${redirectUri}`
  );
}

app.get('/', (_, res) => {
  const params = new URLSearchParams();

  params.append('client_id', clientId);
  params.append('redirect_uri', redirectUri);
  params.append('response_type', 'code');
  params.append('scope', 'public projects profile elearning tig forum');
  params.append('state', state);

  res.redirect(`https://api.intra.42.fr/oauth/authorize?${params.toString()}`);
});

app.get('/redirect', async (req, res) => {
  const code = req.query['code'];
  if (typeof code !== 'string') {
    res.send(`code is wrong.\ncode: ${code}`);
    return;
  }

  const params = new URLSearchParams();

  params.append('grant_type', 'authorization_code');
  params.append('client_id', clientId);
  params.append('client_secret', clientSecret);
  params.append('code', code);
  params.append('redirect_uri', redirectUri);
  params.append('state', state);

  const response = await fetch(`https://api.intra.42.fr/oauth/token?${params.toString()}`, {
    method: 'post',
  });

  const token = await response.json();
  console.log(token);
  res.send('done');
});

app.listen(port, () => {
  console.log('start login now.');
});
