"use client"
import styles from "../../styles/Home.module.css"
import { useState } from "react";
import { ThreeDots } from 'react-loading-icons'
import * as XLSX from 'xlsx';
export default function Home() {

  const [advancedView, setAdvancedView] = useState(false)
  const [HS2Data, setHS2Data] = useState(null)
  const [FSAData, setFSAData] = useState(null)
  const [UBDSData, setUBDSData] = useState(null)
  const [HS2VeloData, setHS2VeloData] = useState(null)
  const [UBDSVeloData, setUBDSVeloData] = useState(null)
  const [EvelynVeloData, setEvelynVeloData] = useState(null)
  const [UHSVeloData, setUHSVeloData] = useState(null)


  const [HS2DataLoading, setHS2DataLoading] = useState(false)
  const [FSADataLoading, setFSADataLoading] = useState(false)
  const [UBDSDataLoading, setUBDSDataLoading] = useState(false)
  const [HS2VeloDataLoading, setHS2VeloDataLoading] = useState(false)
  const [UBDSVeloDataLoading, setUBDSVeloDataLoading] = useState(false)
  const [EvelynVeloDataLoading, setEvelynVeloDataLoading] = useState(false)
  const [UHSVeloDataLoading, setUHSVeloDataLoading] = useState(false)


  const [loading, setLoading] = useState(false)

function downloadExcel(clientGroups) {
    var wb = XLSX.utils.book_new();

    clientGroups.forEach(group => {
        let worksheetData = [];
        const headerStyle = {
          fill: { fgColor: { rgb: "CCCCCC" } }, // Grey background
          border: {
              bottom: { style: "thin", color: { rgb: "000000" } } // Black bottom border
          },
          alignment: { horizontal: "center", vertical: "center", wrapText: true }
      };

      // Add styled headers to the worksheet data
      const header = ["Type", "Name", "Model", "Firmware Version", "Serial", "MAC", "IP", "Claimed At Date", "Vendor"].map(cell => ({v: cell, s: headerStyle}));
      const additionalHeader = ["Type", "Name", "Model", "Firmware Version", "Serial", "MAC", "Created", "Service State", "Vendor"].map(cell => ({v: cell, s: headerStyle}));

        // Titles for sections
        // Add primary device data
        if(group.data) {
          worksheetData.push(header);  // Adding primary header

          group.data.forEach(network => {
            network.devices.forEach(device => {
                worksheetData.push([
                    device.productType || 'N/A',
                    device.name || 'N/A',
                    device.model || 'N/A',
                    device.firmware || 'N/A',
                    device.serial || 'N/A',
                    device.mac || 'N/A',
                    device.lanIp || 'N/A',
                    device.claimedAt ? device.claimedAt.substring(0, 10) : 'N/A',
                    'Cisco' // Assuming Cisco as default
                ]);
            });
        });
        }

        if(group.data && group.additionalData) { 
            // Add separation (blank row)
            worksheetData.push([]);
        }

        // Add additional device data
          if(group.additionalData) {
            

            worksheetData.push(additionalHeader);  // Adding additional data header
            group.additionalData.data.forEach(additional => {
                worksheetData.push([
                    additional.deviceFamily || 'N/A',
                    additional.name || 'N/A',
                    additional.modelNumber || 'N/A',
                    additional.softwareVersion || 'N/A',
                    additional.serialNumber || 'N/A',
                    additional.selfMacAddress || 'N/A',
                    additional.created ? additional.created.substring(0, 10) : 'N/A',
                    additional.serviceState || 'N/A',
                    'Cisco' // Assuming Cisco as default
                ]);
            });
          }

        // Convert worksheetData to a worksheet
        var ws = XLSX.utils.aoa_to_sheet(worksheetData);
        XLSX.utils.book_append_sheet(wb, ws, group.name);
    });

    XLSX.writeFile(wb, 'ClientData.xlsx');
}

  // Example usage: you would call this function when the user clicks the 'Download Excel' button


  async function fetchDevices() {
    setLoading(true);
  

  
    // Handle fetching UBDS data
    try {
      setUBDSDataLoading(true)
      let UBDSResponse = await fetch('api/meraki?customer=UBDS');
      let jsonUBDSResponse = await UBDSResponse.json();
  
      if (!UBDSResponse.ok) throw new Error(`Error fetching data: ${jsonUBDSResponse?.error}`);
      setUBDSData(jsonUBDSResponse);
    } catch (e) {
      console.error(e.message);
      setUBDSData(null);
    } finally {
      setUBDSDataLoading(false)
    }
  
    // Handle fetching HS2 VeloCloud data
    try {
      setHS2VeloDataLoading(true)
      let HS2VeloResponse = await fetch('api/velocloud?customer=HS2');
      let jsonHS2VeloResponse = await HS2VeloResponse.json();
  
      if (!HS2VeloResponse.ok) throw new Error(`Error fetching data: ${jsonHS2VeloResponse?.error}`);
      setHS2VeloData(jsonHS2VeloResponse);
    } catch (e) {
      console.error(e.message);
      setHS2VeloData(null);
    } finally {
      setHS2VeloDataLoading(false)
    }

    // Handle fetching UBDS VeloCloud data
    try {
      setUBDSVeloDataLoading(true)
      let UBDSVeloResponse = await fetch('api/velocloud?customer=UBDS');
      let jsonUBDSVeloResponse = await UBDSVeloResponse.json();
  
      if (!UBDSVeloResponse.ok) throw new Error(`Error fetching data: ${jsonUBDSVeloResponse?.error}`);
      setUBDSVeloData(jsonUBDSVeloResponse);
    } catch (e) {
      console.error(e.message);
      setUBDSVeloData(null);
    } finally {
      setUBDSVeloDataLoading(false)
    }

    // Handle fetching Evelyn VeloCloud data
    try {
      setEvelynVeloDataLoading(true)
      let EvelynVeloResponse = await fetch('api/velocloud?customer=EVELYN');
      let jsonEvelynVeloResponse = await EvelynVeloResponse.json();
  
      if (!EvelynVeloResponse.ok) throw new Error(`Error fetching data: ${jsonEvelynVeloResponse?.error}`);
      setEvelynVeloData(jsonEvelynVeloResponse);
    } catch (e) {
      console.error(e.message);
      setEvelynVeloData(null);
    } finally {
      setEvelynVeloDataLoading(false)
    }
    

    // Handle fetching UHS VeloCloud data
    try {
      setUHSVeloDataLoading(true)
      let UHSVeloResponse = await fetch('api/velocloud?customer=UHS');
      let jsonUHSVeloResponse = await UHSVeloResponse.json();
  
      if (!UHSVeloResponse.ok) throw new Error(`Error fetching data: ${jsonUHSVeloResponse?.error}`);
      setUHSVeloData(jsonUHSVeloResponse);
    } catch (e) {
      console.error(e.message);
      setUHSVeloData(null);
    } finally {
      setUHSVeloDataLoading(false)
    }
      
      // Handle fetching HS2 data
    try {
      setHS2DataLoading(true)
      let HS2Response = await fetch('api/meraki?customer=HS2');
      let jsonHS2Response = await HS2Response.json();
  
      if (!HS2Response.ok) throw new Error(`Error fetching data: ${jsonHS2Response?.error}`);
      setHS2Data(jsonHS2Response);
    } catch (e) {
      console.error(e.message);
      setHS2Data(null);
    } finally {
      setHS2DataLoading(false)
    }

      // Handle fetching FSA data
    try {
      setFSADataLoading(true)
      let HS2Response = await fetch('api/meraki?customer=FSA');
      let jsonHS2Response = await HS2Response.json();
  
      if (!HS2Response.ok) throw new Error(`Error fetching data: ${jsonHS2Response?.error}`);
      setFSAData(jsonHS2Response);
    } catch (e) {
      console.error(e.message);
      setFSAData(null);
    } finally {
      setFSADataLoading(false)
    }
    // Finally, reset loading state
    setLoading(false);
  }
  

  function displayMerakiData(customerData) {
    if (!Array.isArray(customerData)) {
      return <div>No valid data available</div>;
    }
    if(!customerData) return (
      <div>No data fetched, see logs for more info</div>
    )
    return (<>
      {
        customerData && customerData.map(e => (
          <div key={e.networkID}>
            <h3 className={styles['network-name']}>{e.networkName}</h3>
            {
              (e.devices && e.devices.length > 0) ?

                <table>
                  <tbody>
                    <tr>
                      {advancedView ? <>
                        <th>Type</th>
                        <th>Name</th>
                        <th>Model</th>
                        <th>Firmware Version</th>
                        <th>Serial</th>
                        <th>MAC</th>
                        <th>IP</th>
                        <th>Claimed At Date</th>
                        <th>Vendor</th>
                      </> : <>
                        <th>Type</th>
                        <th>Name</th>
                        <th>Model</th>
                        <th>Firmware Version</th>
                        <th>Vendor</th>
                      </>}
                    </tr>
                    {e.devices.map((e, i) => (
                      advancedView ? 
                        <tr key={i}>
                          <td>{e?.productType || 'N/A'}</td>
                          <td>{e?.name || 'N/A'}</td>
                          <td>{e?.model || 'N/A'}</td>
                          <td>{e?.firmware || 'N/A'}</td>
                          <td>{e?.serial || 'N/A'}</td>
                          <td>{e?.mac || 'N/A'}</td>
                          <td>{e?.lanIp || 'N/A'}</td>
                          <td>{e?.claimedAt && e?.claimedAt.substring(0, 10) || 'N/A'}</td>
                          <td>Cisco</td>
                        </tr>
                       :
                        <tr key={i}>
                          <td>{e?.productType || 'N/A'}</td>
                          <td>{e?.name || 'N/A'}</td>
                          <td>{e?.model || 'N/A'}</td>
                          <td>{e?.firmware || 'N/A'}</td>
                          <td>Cisco</td>
                        </tr>
                      
                    ))}

                  </tbody>
                </table>

                : <div>No Devices Found</div>
            }

          </div>
        ))
      }
    </>)
  }


  function displayEdgeData(customerData) {
    if(!customerData || !customerData.data) return (
      <div>No data fetched, see logs for more info</div>
    )
    return (<>
      {
        customerData && customerData?.data.map(e => (
          <div key={e.name}>
            <h3 className={styles['network-name']}>{e.name}</h3>
            {
              

                <table>
                  <tbody>
                    <tr>
                      {advancedView ? <>
                        <th>Type</th>
                        <th>Name</th>
                        <th>Model</th>
                        <th>Firmware Version</th>
                        <th>Serial</th>
                        <th>MAC</th>
                        <th>Created</th>
                        <th>Service State</th>
                        <th>Vendor</th>
                      </> : <>
                        <th>Type</th>
                        <th>Name</th>
                        <th>Firmware Version</th>
                        <th>Service State</th>
                        <th>Vendor</th>
                      </>}
                    </tr>
                    {
                      advancedView ? 
                        <tr>
                          <td>{e?.deviceFamily || 'N/A'}</td>
                          <td>{e?.name || 'N/A'}</td>
                          <td>{e?.modelNumber || 'N/A'}</td>
                          <td>{e?.softwareVersion || 'N/A'}</td>
                          <td>{e?.serialNumber || 'N/A'}</td>
                          <td>{e?.selfMacAddress || 'N/A'}</td>
                          <td>{e?.created && e?.created.substring(0, 10) || 'N/A'}</td>
                          <td>{e?.serviceState || 'N/A'}</td>

                          <td>Cisco</td>
                        </tr>
                       :
                        <tr>
                          <td>{e?.deviceFamily || 'N/A'}</td>
                          <td>{e?.name || 'N/A'}</td>
                          <td>{e?.softwareVersion || 'N/A'}</td>
                          <td>{e?.serviceState || 'N/A'}</td>
                          <td>Cisco</td>
                        </tr>
                      
                    }

                  </tbody>
                </table>

            }

          </div>
        ))
      }
    </>)
  }

  return (
    <main className={styles.main}>

      <header className={styles['header-container']}>
        <h1>UBDS Managed Client Device list</h1>
        <img width={'200px'} src="/logo2.png"></img>
      </header>
      <div className={styles['container']}>
        <div className={styles['top-container']}>
          <p>This tool can be used to fetch a list of devices for each client and their relevant attributes. Information depends on API access allowed by each client so certain clients may not have a full list of everything.</p>
          <p>There is a known issue with Meraki whereby AP firmware versions will not be given by the API. When Meraki resolve it, these versions will come through.</p>
          <p><strong>Due to API rate limits, the fetch of data may take a while (about 5-10 minutes). Do not refresh the page once requested.</strong></p>

          <div className={styles['btn-container']}>
            {loading ? <ThreeDots fill="purple" stroke="black" strokeOpacity={.25} /> :
              <>
                {!(HS2Data || UBDSData || HS2VeloData || UHSVeloData || EvelynVeloData || UBDSVeloData || FSAData) && <button onClick={fetchDevices}>Start fetch</button>}
                {
                  (HS2Data || UBDSData || HS2VeloData || UHSVeloData || EvelynVeloData || UBDSVeloData || FSAData) && <>
                    <button onClick={() => setAdvancedView(true)}>Advanced view</button>
                    <button onClick={() => setAdvancedView(false)}>Simple view</button>
                    <button onClick={() => downloadExcel([
                      {name: 'HS2', data: HS2Data, additionalData: HS2VeloData},
                      {name: 'Evelyn', additionalData: EvelynVeloData},
                      {name: 'FSA', data: FSAData},
                      {name: 'UHS', additionalData: UHSVeloData},
                      {name: 'UBDS', data: UBDSData,  additionalData: UBDSVeloData}

                      ])}>Download Excel File</button>

                  </>
                }
              </>}
          </div>

        </div>
        {
         <div className={styles['client-container']}>
              <div className={styles['client-info-container']}>
                <h2>HS2</h2>
                {
                  HS2DataLoading ? <ThreeDots fill="purple" stroke="black" strokeOpacity={.25} />  : <>{
                    HS2Data && <>
                      <h3><u>Meraki devices</u></h3>
                      {displayMerakiData(HS2Data)}
                      <br></br>
                      <br></br>
  
                    </>
                  }</>
                }
                {
                  HS2VeloDataLoading ? <ThreeDots fill="purple" stroke="black" strokeOpacity={.25} />  : <> {
                    HS2VeloData && <>
                      <h3><u>Edge devices</u></h3>
                      {displayEdgeData(HS2VeloData)}
                      <br></br>
                      <br></br>
  
                  </>
                  }</>
                }
               


              </div>
              <div className={styles['client-info-container']}>
                <h2>UBDS Test Environment</h2>
                {
                  UBDSDataLoading ? <ThreeDots fill="purple" stroke="black" strokeOpacity={.25} /> : <>{
                    UBDSData && <>
                      <h3><u>Meraki devices</u></h3>
                      {displayMerakiData(UBDSData)}
                      <br></br>
                      <br></br>
  
                    </>
                  }</>
                }
                {
                  UBDSVeloDataLoading ? <ThreeDots fill="purple" stroke="black" strokeOpacity={.25} /> : <>{
                    UBDSVeloData && <>
                      <h3><u>Edge devices</u></h3>
                      {displayEdgeData(UBDSVeloData)}
                      <br></br>
                      <br></br>
  
                  </>
                  }</>
                }

              </div>
              <div className={styles['client-info-container']}>
                <h2>Evelyn</h2>
                {
                  EvelynVeloDataLoading ? <ThreeDots fill="purple" stroke="black" strokeOpacity={.25} /> : <>{
                    EvelynVeloData && <>
                      <h3><u>Edge devices</u></h3>
                      {displayEdgeData(EvelynVeloData)}
                      <br></br>
                      <br></br>
  
                  </>
                  }</>
                }

              </div>
              <div className={styles['client-info-container']}>
                <h2>University Hospitals Sussex</h2>
                {
                  UHSVeloDataLoading ? <ThreeDots fill="purple" stroke="black" strokeOpacity={.25} /> : <>{
                    UHSVeloData && <>
                      <h3><u>Edge devices</u></h3>
                      {displayEdgeData(UHSVeloData)}
                      <br></br>
                      <br></br>
  
                  </>
                  }</>
                }
              </div>
              <div className={styles['client-info-container']}>
                <h2>Food Standards Agency</h2>
                {
                  FSADataLoading ? <ThreeDots fill="purple" stroke="black" strokeOpacity={.25} />  : <>{
                    FSAData && <>
                      <h3><u>Meraki devices</u></h3>
                      {displayMerakiData(FSAData)}
                      <br></br>
                      <br></br>
  
                    </>
                  }</>
                }
              </div>
              <div className={styles['client-info-container']}>
                <h2>Barrett Steel</h2>
                <p>Has internally hosted Aruba, access is limited.</p>
              </div>
            </div>
        }


      </div>

    </main>
  );
}