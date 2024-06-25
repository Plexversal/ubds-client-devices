import { NextResponse } from "next/server";

export async function GET(request) {

   let params = request.nextUrl.searchParams
   let serial = params.get('serial')

  try {
    
    if(!serial) return NextResponse.json({ error: 'no serial provided to check' }, { status: 400 });

    let serialRequest = await fetch(`${process.env.MERAKI_BASE_URL}/organizations/${process.env.ORGANISATION_ID}/inventory/devices/${serial}`, {
        method: 'GET',
        headers: {
            "Content-Type": "application/json",
            'Authorization': 'Bearer ' + process.env.MERAKI_API_KEY,
        }, 
    })
    let serialJson = await serialRequest.json()

    return NextResponse.json(serialJson);
  } catch (e) {
    console.log(e)
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
