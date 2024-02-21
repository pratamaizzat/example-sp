import CustomeDateInput from "@/components/CustomDateInput";

export default function Home() {

  async function getSalesOrder(formData: FormData) {
    'use server'

    const rawFormData = {
      startDate: formData.get('start-date'),
      endDate: formData.get('end-date')
    }

    const response = await fetch(`http://45.112.126.34:7048/DynamicsNAV100/ODataV4/Company(%27Surya%20Palacejaya%27)/PostedSalesShipment?$filter=Shipment_Date ge ${rawFormData.startDate} and Shipment_Date le ${rawFormData.endDate}`, {
      method: 'GET',
      headers: {
        Authorization: 'Basic ' + btoa('solog:Solog12345')
      }
    })

    const rawData = await response.json()

    const data = rawData.value.map((data: any) => ({
      soCode: data.No,
      customerNo: data.Sell_to_Customer_No,
      ship: {
        city: data.Ship_to_City,
        address1: data.Ship_to_Address,
        address2: data.Ship_to_Address_2,
        contact: data.Ship_to_Contact
      }
    }))

    const dataWithItem = await Promise.all(data.map(async (data: any) => {
      const res = await fetch(`http://45.112.126.34:7048/DynamicsNAV100/ODataV4/Company(%27Surya%20Palacejaya%27)/PostedSalesShipmentSalesShipmLines?$filter=Document_No eq '${data.soCode}'`, {
      method: 'GET',
      headers: {
        Authorization: 'Basic ' + btoa('solog:Solog12345')
      }
    })

      const resItem = await res.json()

      return {
        ...data,
        item: resItem.value.map((data: any) => ({
          location: data.Location_Code,
          desc: data.Description,
          qty: data.Quantity,
          qtyBase: data.Quantity_Base,
          uom: data.Unit_of_Measure_Code
        }))
      }
    }))

    console.log(JSON.stringify(dataWithItem, null, 4))

  }

  return (
    <main>
      <div className="border-2 border-black p-4">

      <h1 className="text-2xl mb-8">Sales Order</h1>
      <form action={getSalesOrder} className="flex items-end gap-2">
        <label className="flex flex-col" htmlFor="start-date">
          <span className="text-sm">
            Start Date
          </span>
          <input id="start-date" name="start-date" className="border" type="date" />
        </label>
        <label htmlFor="end-date" className="flex flex-col">
          <span className="text-sm">
            End Date
          </span>
          <input id="end-date" name="end-date" className="border" type="date" />
        </label>
        <button className="bg-slate-200 px-4 py-2 rounded-md">Get Sales Order</button>
      </form>
      </div>
    </main>
  );
}
