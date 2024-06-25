import { NextResponse } from "next/server";

// Helper function to delay execution
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Function to fetch serial data in controlled batches
async function fetchSerialData(devices, maxInitial, maxStandard, orgID) {
    const results = [];
    let initialBurst = true;

    for (let i = 0; i < devices.length; i++) {
        if (i === maxInitial) {
            initialBurst = false;  // Once initial burst is done, switch to standard rate
            await delay(1100);  // Wait for the first second to pass
        } else if (!initialBurst && (i - maxInitial) % maxStandard === 0) {
            await delay(1100);  // Delay after every maxStandard requests
        }

        if (devices[i].serial) {
            let attempts = 0;
            let success = false;
            while (!success && attempts < 5) {  // Retry up to 5 times
                const response = await fetch(`${process.env.MERAKI_BASE_URL}/organizations/${orgID}/inventory/devices/${devices[i].serial}`, {
                    method: 'GET',
                    headers: {
                        "Content-Type": "application/json",
                        'Authorization': 'Bearer ' + process.env.MERAKI_API_KEY,
                    },
                });
                if (response.status === 429) {  // If rate limit is hit
                    attempts++;
                    await delay(1000 * Math.pow(2, attempts));  // Exponential backoff
                    continue;  // Retry the request
                }

                if (response.ok) {  // If response is successful
                    const serialJson = await response.json();
                    results.push({ ...devices[i], ...serialJson });  // Merge device with serial data
                    success = true;
                } else {
                    break;  // Break the loop on other types of errors
                }
            }
        } else {
            results.push(devices[i]);  // If no serial, just return the device as is
        }
    }

    return results;
}


export async function GET(request) {

    let params = request.nextUrl.searchParams
    let customer = params.get('customer')
    const organizationIds = {
        'HS2': process.env.HS2_ORGANISATION_ID,
        'FSA': process.env.FSA_ORGANISATION_ID,
        'UBDS': process.env.UBDS_ORGANISATION_ID
    };
    
    let orgID = organizationIds[customer] || null;
    
    try {
        if(!orgID) return NextResponse.json({ error: 'No customer provided or invalid customer. Supported values are HS2, FSA and UBDS' }, { status: 400 });
        let deviceList = [];

        let networkList = await fetch(`${process.env.MERAKI_BASE_URL}/organizations/${orgID}/networks`, {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                'Authorization': 'Bearer ' + process.env.MERAKI_API_KEY,
            },
        });
        let networkListJson = await networkList.json();
        let networksListedByIds = networkListJson.map(e => ({id: e.id, name: e.name}));

        await Promise.all(networksListedByIds.map(async (network) => {
            try {
                let deviceListResponse = await fetch(`${process.env.MERAKI_BASE_URL}/networks/${network.id}/devices`, {
                    method: 'GET',
                    headers: {
                        "Content-Type": "application/json",
                        'Authorization': 'Bearer ' + process.env.MERAKI_API_KEY,
                    },
                });
                let deviceListJson = await deviceListResponse.json();

                let devicesWithSerialInfo = await fetchSerialData(deviceListJson, 19, 10, orgID);

                deviceList.push({ networkName: network.name, networkID: network.id, devices: devicesWithSerialInfo });
            } catch (e) {
                console.log(e);
            }
        }));

        return NextResponse.json(deviceList);
    } catch (e) {
        console.log(e);
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
