import { NextRequest, NextResponse } from "next/server"; // Use NextRequest and NextResponse in the app directory
import { exec } from "child_process";
import * as crypto from "crypto";

export async function POST(req: NextRequest) {
  const secret = process.env.GITHUB_WEBHOOK_SECRET;
  const receivedSignature = req.headers.get("x-hub-signature") as string;

  if (!secret) {
    return NextResponse.json(
      { message: "Webhook secret is not set" },
      { status: 500 }
    );
  }

  const hmac = crypto.createHmac("sha1", secret);
  hmac.update(await req.text());
  const signature = `sha1=${hmac.digest("hex")}`;

  if (receivedSignature !== signature) {
    return NextResponse.json({ message: "Invalid signature" }, { status: 400 });
  }

  try {
    await execPromise("git pull origin master");
    console.log("Pulling from git");

    await execPromise("npm install --legacy-peer-deps");
    console.log("Installing dependencies");

    await execPromise("npm run build");
    console.log("Building the app");

    await execPromise("pm2 restart crafto-admin");
    console.log("Restarting the app")

    return NextResponse.json(
      { message: "Deployment successful" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error during deployment:", error);
    return NextResponse.json(
      { message: "Deployment failed", error: (error as Error).message },
      { status: 500 }
    );
  }
}

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
