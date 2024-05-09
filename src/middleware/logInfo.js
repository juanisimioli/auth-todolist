import { NextResponse } from "next/server";
import { isTest } from "../api/is";

/**
 * Middleware for logging info: ip and geo data
 * Info provided by Vercel: 'ip' and 'geo':
 * https://nextjs.org/docs/app/api-reference/functions/next-request
 */

const logInfoPathnames = ["/home"];

export const logInfo = async (request) => {
  // if (process.env.NODE_ENV === 'development') return;
  const pathname = request.nextUrl.pathname;

  console.log({ pathname });

  if (logInfoPathnames.includes(pathname)) {
    const body = {
      section: `TEST JUANI 3`,
      ip: "192.168.1.7",
      country: "ARG",
      state: `BUE`,
    };

    try {
      console.log("try");
      const res = await isTest(body);
      console.log("RES!!!", res);
    } catch (error) {
      console.error("loginInfo middleware ERROR", error?.message);
    } finally {
      console.log("FINALLY");
      return NextResponse.next();
    }
  }
};
