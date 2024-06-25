import { NextResponse } from "next/server";

export async function GET(request) {
  try {

    let devices = await fetch(`${process.env.MERAKI_BASE_URL}/organizations/${process.env.HS2_ORGANISATION_ID}/inventory/devices`, {
        method: 'GET',
        headers: {
            "Content-Type": "application/json",
            'Authorization': 'Bearer ' + process.env.MERAKI_API_KEY,
        }, 
    })
    let devicesListJson = await devices.json()

    return NextResponse.json(devicesListJson);
  } catch (e) {
    console.log(e)
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
