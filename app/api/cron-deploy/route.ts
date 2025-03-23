import { NextApiRequest, NextApiResponse } from 'next';
import { exec } from 'child_process';
import * as crypto from 'crypto';


interface WebhookPayload {
  ref: string;
  repository: {
    name: string;
    owner: {
      name: string;
    };
  };
  
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const secret = process.env.GITHUB_WEBHOOK_SECRET;  
    const receivedSignature = req.headers['x-hub-signature'] as string;

    if (!secret) {
      return res.status(500).json({ message: 'Webhook secret is not set' });
    }

  
    const hmac = crypto.createHmac('sha1', secret);
    hmac.update(JSON.stringify(req.body));
    const signature = `sha1=${hmac.digest('hex')}`;

    if (receivedSignature !== signature) {
      return res.status(400).json({ message: 'Invalid signature' });
    }

    
    try {
   
      await execPromise('git pull origin main');  

     
    //   const testResult = await execPromise('npm test'); 
    //   if (testResult.includes('Failed')) {
    //     return res.status(500).json({ message: 'Tests failed, deployment canceled' });
    //   }

      // Build the Next.js app
      await execPromise('npm run build');

      // Restart the server (e.g., with PM2)
      await execPromise('pm2 restart next-app');

      return res.status(200).json({ message: 'Deployment successful' });
    } catch (error) {
      console.error('Error during deployment:', error);
      return res.status(500).json({ message: 'Deployment failed', error: (error as Error).message });
    }
  } else {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }
}

// Helper function to wrap exec in a Promise with proper typing
function execPromise(command: string): Promise<string> {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        reject(`exec error: ${error}`);
        return;
      }
      resolve(stdout || stderr);
    });
  });
}
