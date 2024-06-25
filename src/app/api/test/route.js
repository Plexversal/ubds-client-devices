import { NextResponse } from "next/server";

export async function GET(request) {
  try {

    let deviceListResponse = await fetch(`${process.env.MERAKI_BASE_URL}/networks/L_706502191543754166/devices`, {
        method: 'GET',
        headers: {
            "Content-Type": "application/json",
            'Authorization': 'Bearer ' + process.env.MERAKI_API_KEY,
        },
    });
    let deviceListJson = await deviceListResponse.json();

    return NextResponse.json(deviceListJson);
  } catch (e) {
    console.log(e)
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
