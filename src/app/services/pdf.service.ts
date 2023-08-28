import { Injectable } from '@angular/core';
import { ReceiptViewModel } from '../models/receipt.model';
import { Permit } from '../models/permit.model';

@Injectable({
  providedIn: 'root'
})
export class PdfService {
  pdfMake: any;

  constructor() {
   }

  async loadPdfMaker() {
    if (!this.pdfMake) {
      const pdfMakeModule = await import("pdfmake/build/pdfmake");
      const pdfFontsModule = await import("pdfmake/build/vfs_fonts");
      this.pdfMake = pdfMakeModule.default;
      this.pdfMake.vfs = pdfFontsModule.default.pdfMake.vfs;
    }
  }

   async generaReceiptPDF(action: string, permit: Permit){
    await this.loadPdfMaker();

    let docDefinition = {
      content: [
      //  {
        //    image: 'companyLogo',
        //    alignment: 'center',
          //  width: 80,
          //  height: 80
     //   },
        {
          text: 'Receipt',
          style: 'purchaseTitle'
        },
        {
          table: {
            heights: [ 20, 20 ],
            widths: [300],
            body: [
              [
                { text: permit.monerisReceipt?.companyName },
              ],
              [
                { text: permit.monerisReceipt?.companyAddress },
              ],
              [
                { text: permit.monerisReceipt?.companyCity + ', '+ permit.monerisReceipt?.companyPostalCode },
              ],  
              [
                { text: permit.monerisReceipt?.companyEmail },
              ], 
            ]
          },
          layout: {
            defaultBorder: false,
          }
        },
        {
          text: 'Purchase Info:',
          style: 'purchaseTitle'
        },
        {
          table: {
            heights: [ 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20 ],
            widths: [200, 400],
            body: [
              [
                { text: 'Order No.:'},
                { text: permit.monerisReceipt?.orderNo }
              ],       
              [
                { text: 'Permit Type:'},
                { text: permit.permitType }
              ],              
              [
                { text: 'Tariff Name:'},
                { text: permit.tariff }
              ],             
              [
                { text: 'Start Date:'},
                { text:  permit.startDateUtc}
              ],
              [
                { text: 'End Date:'},
                { text: permit.expirationDateUtc }
              ],
              [
                { text: 'Quantity:'},
                { text: permit.quantity }
              ],
              [
                { text: 'Payment Amount:'},
                { text: 'CAD '+ permit.monerisReceipt?.transAmount }
              ],
              [
                { text: 'Payment Date:'},
                { text: permit.monerisReceipt?.transDate }
              ],
              [
                { text: 'Authorization Code:'},
                { text: permit.monerisReceipt?.approvalCode }
              ],
              [
                { text: 'CC Number:'},
                { text: permit.monerisReceipt?.first6last4 }
              ],
              [
                { text: 'CC Name:'},
                { text: permit.monerisReceipt?.cardHolder }
              ],
              [
                { text: 'CC Exp:'},
                { text: permit.monerisReceipt?.cardExpiry }
              ]
            ]
          },
          layout: {
            defaultBorder: false,
          }
        },
      ],
      images: {
       // companyLogo: receipt.companyLogo + '2.png'
      },    
      styles: {
         invoiceItem: {
          fontSize: 9,
          margin: [0, 4,0, 4]          
        },
        purchaseTitle: {
          bold: true,
          fontSize: 20,
          margin: [0, 15,0, 15]   
        },
        tableItem:{
          fontSize: 9,
          margin: [0, 4,0, 4]   
        }
      }
    };

    if(action == 'P' ){
      this.pdfMake.createPdf(docDefinition).open();   

    }
    else{
      this.pdfMake.createPdf(docDefinition).download('ReceiptPermit.pdf');
    }
  }

}