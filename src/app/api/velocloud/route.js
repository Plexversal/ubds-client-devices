import { NextResponse } from "next/server";

export async function GET(request) {

    let params = request.nextUrl.searchParams
    let customer = params.get('customer')
    const organizationIds = {
        'HS2': process.env.HS2_LOGICAL_ID,
        'EVELYN': process.env.EVELYN_LOGICAL_ID,
        'UBDS': process.env.UBDS_LOGICAL_ID,
        'UHS': process.env.UHS_LOGICAL_ID
    };
    
    let orgID = organizationIds[customer] || null;
    
    try {
        if(!orgID) return NextResponse.json({ error: 'No customer provided or invalid customer. Supported values are HS2, UBDS, UHS and EVELYN' }, { status: 400 });
        let edgeList = await fetch(`${customer == 'UHS' ? process.env.BASE_URL2 : process.env.BASE_URL1}/api/sdwan/v2/enterprises/${orgID}/edges/`, {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                'Authorization': 'Token ' + `${customer == 'UHS' ? process.env.VELO_API_KEY2 : process.env.VELO_API_KEY1}`,
            }
        });
        if(!edgeList.ok) {
             return NextResponse.json(edgeList.statusText);

        }
        let edgeListJson = await edgeList.json()
        return NextResponse.json(edgeListJson);
    } catch (e) {
        console.log(e);
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
