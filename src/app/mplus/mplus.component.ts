import { Component } from '@angular/core';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { NgToastService } from 'ng-angular-popup';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-mplus',
  templateUrl: './mplus.component.html',
  styleUrls: ['./mplus.component.scss']
})
export class MplusComponent {
  mplusForm!: FormGroup;

  marketList = [
    { name: 'Malaysia (MY)', value: 'MY', currency: 'MYR' },
    { name: 'Unites States (US)', value: 'US', currency: 'USD' },
    { name: 'Hong Kong (HK)', value: 'HK', currency: 'HKD' },
  ]

  transactionList = [
    { name: 'Buy', value: 'Buy' },
    { name: 'Sell', value: 'Sell' }

  ]

  feesRate = {
    malaysia: {
      highBrokerageFee: 0.0008,
      lowBrokerageFee: 0.0005,
      minBrokerageFee: 8,
      intraDayFee: 0.0005,
      clearingFee: 0.0003,
      stampDuty: 0.001,
      stampDutyRate: "RM1.00 for every RM1,000.00 contract value, maximum RM 1000.00."
    },
    hongKong: {
      brokerageFee: 0.001,
      minBrokerageFee: 18,
      malaysiaContractStamp: 0.001,
      malaysiaStampDutyRate: "RM1.00 for every RM1,000.00 contract value, maximum RM 1000.00.",
      hkStampDuty: 0.001,
      tradingFee: 0.0000565,
      minTradingFee: 0.01,
      settlementFee: 0.00002,
      minSettlementFee: 2,
      maxSettlementFee: 100,
      sfcLevyFee: 0.000027,
      minSfcLevyFee: 0.01,
      frcLevyFee: 0.0000015
    },
    unitedStates: {
      brokerageFee: 0.001,
      minBrokerageFee: 3,
      malaysiaContractStamp: 0.001,
      malaysiaStampDutyRate: "RM1.00 for every RM1,000.00 contract value, maximum RM 1000.00.",
      regulatoryFee: 0.0000278,
      minRegulatoryFee: 0.01,
      regulatoryFeeRate: "0.00278% (Sell only) (Min USD 0.01)",
      tradingActivityFee: 0.000166,
      minTradingActivityFee: 0.01,
      maxTradingActivityFee: 8.30,
      tradingActivityRate: "USD 0.000166 per share (Sell only)",
      settlementFee: 0.003,
      minSettlementFee: 0.01,
      settlementFeeRate: "USD 0.003 per share",
      withholdingTax: 0.3
    }
  }

  feesList: any[] = [];

  ngOnInit(): void {
    this.mplusForm = this.formBuilder.group({
      marketName: [''],
      exchangeRate: 1,
      transaction: ['Buy'],
      numbersOfShares: [''],
      pricePerUnit: [''],
      intraDayTrade: false
    });
  }

  constructor(
    private formBuilder: FormBuilder,
    private toastService: NgToastService,
    private http: HttpClient
  ) { }

  assetPath(path: string): string {
    return `./${path}`;
  }

  onSubmit() {
    if (this.mplusForm.invalid) {
      this.toastService.error({ detail: 'ERROR', summary: 'Please fill all the fields' })
      return;
    } else {
      this.calculateFees(this.mplusForm);
    }
  }

  stampDutyCalculation(contractValue: number) {
    const stampDuty = contractValue * this.feesRate.malaysia.stampDuty;
    return Math.min(1000, Math.max(1, stampDuty));
  }


  calculateFees(mplusForm: FormGroup) {
    const stockInfo = mplusForm.value;
    const market = stockInfo.marketName;

    if (market === 'MY') {
      const malaysiaFees = this.feesRate.malaysia;

      const contractValue = stockInfo.pricePerUnit * stockInfo.numbersOfShares;
      let brokerageFee = 8;
      let intraDayFee = 0;
      let brokerageRate = malaysiaFees.highBrokerageFee;
      const clearingFee = (contractValue * malaysiaFees.clearingFee) + 0.01;
      const stampDuty = this.stampDutyCalculation(contractValue);

      if (contractValue <= 50000) {
        brokerageFee = contractValue * malaysiaFees.highBrokerageFee;
        if (brokerageFee < malaysiaFees.minBrokerageFee) {
          brokerageFee = malaysiaFees.minBrokerageFee;
        }
      } else if (contractValue > 50000) {
        brokerageFee = contractValue * malaysiaFees.lowBrokerageFee;
        brokerageRate = malaysiaFees.lowBrokerageFee;
      }

      if (stockInfo.intraDayTrade) {
        intraDayFee = contractValue * malaysiaFees.intraDayFee;
      }

      const totalFees = brokerageFee + intraDayFee + clearingFee + stampDuty;

      if(stockInfo.transaction === 'Buy') {
        this.feesList = [
          {
            marketName: 'Malaysia (MY)',
            currency: 'MYR',
            contractValue: contractValue,
            feesBreakdown: [
              { name: 'Brokerage Fee', value: brokerageFee, rate: this.convertToPercentage(brokerageRate) },
              { name: 'Intra Day Fee', value: intraDayFee, rate: this.convertToPercentage(malaysiaFees.intraDayFee) },
              { name: 'Clearing Fee', value: clearingFee, rate: this.convertToPercentage(malaysiaFees.clearingFee) },
              { name: 'Stamp Duty', value: stampDuty, rate: malaysiaFees.stampDutyRate }
            ],
            totalFees: totalFees,
            netTotal: contractValue + totalFees
          }
        ]
      } else if(stockInfo.transaction === 'Sell') {
        this.feesList = [
          {
            marketName: 'Malaysia (MY)',
            currency: 'MYR',
            contractValue: contractValue,
            feesBreakdown: [
              { name: 'Brokerage Fee', value: brokerageFee, rate: this.convertToPercentage(brokerageRate) },
              { name: 'Intra Day Fee', value: intraDayFee, rate: this.convertToPercentage(malaysiaFees.intraDayFee) },
              { name: 'Clearing Fee', value: clearingFee, rate: this.convertToPercentage(malaysiaFees.clearingFee) },
              { name: 'Stamp Duty', value: stampDuty, rate: malaysiaFees.stampDutyRate }
            ],
            totalFees: totalFees,
            netTotal: contractValue - totalFees
          }
        ]
      }
    } else if (market === 'HK') {
      const hkFees = this.feesRate.hongKong;

      const contractValue = stockInfo.pricePerUnit * stockInfo.numbersOfShares;
      let brokerageFee = contractValue * hkFees.brokerageFee;
      if (brokerageFee < hkFees.minBrokerageFee) {
        brokerageFee = hkFees.minBrokerageFee;
      }

      const tradingFee = Math.max(hkFees.minTradingFee, contractValue * hkFees.tradingFee);
      const settlementFee = Math.min(hkFees.maxSettlementFee, Math.max(hkFees.minSettlementFee, contractValue * hkFees.settlementFee));
      const sfcLevyFee = Math.max(hkFees.minSfcLevyFee, contractValue * hkFees.sfcLevyFee);
      const frcLevyFee = contractValue * hkFees.frcLevyFee;
      const hkStampDuty = Math.ceil(contractValue * hkFees.hkStampDuty);
      const malaysiaStampDuty = (Math.ceil(this.stampDutyCalculation(contractValue * stockInfo.exchangeRate))) / stockInfo.exchangeRate;

      const totalFees = brokerageFee + tradingFee + settlementFee + sfcLevyFee + frcLevyFee + hkStampDuty + malaysiaStampDuty;

      if(stockInfo.transaction === 'Buy') {
        this.feesList = [
          {
            marketName: 'Hong Kong (HK)',
            currency: 'HKD',
            contractValue: contractValue,
            feesBreakdown: [
              { name: 'Brokerage Fee', value: brokerageFee, rate: this.convertToPercentage(hkFees.brokerageFee) },
              { name: 'Trading Fee', value: tradingFee, rate: this.convertToPercentage(hkFees.tradingFee) },
              { name: 'Settlement Fee', value: settlementFee, rate: this.convertToPercentage(hkFees.settlementFee) },
              { name: 'SFC Levy Fee', value: sfcLevyFee, rate: this.convertToPercentage(hkFees.sfcLevyFee) },
              { name: 'FRC Levy Fee', value: frcLevyFee, rate: this.convertToPercentage(hkFees.frcLevyFee) },
              { name: 'HK Stamp Duty', value: hkStampDuty, rate: this.convertToPercentage(hkFees.hkStampDuty) },
              { name: 'Malaysia Stamp Duty', value: malaysiaStampDuty, rate: hkFees.malaysiaStampDutyRate }
            ],
            totalFees: totalFees,
            netTotal: contractValue + totalFees
          }
        ]
      } else if(stockInfo.transaction === 'Sell') {
        this.feesList = [
          {
            marketName: 'Hong Kong (HK)',
            currency: 'HKD',
            contractValue: contractValue,
            feesBreakdown: [
              { name: 'Brokerage Fee', value: brokerageFee, rate: this.convertToPercentage(hkFees.brokerageFee) },
              { name: 'Trading Fee', value: tradingFee, rate: this.convertToPercentage(hkFees.tradingFee) },
              { name: 'Settlement Fee', value: settlementFee, rate: this.convertToPercentage(hkFees.settlementFee) },
              { name: 'SFC Levy Fee', value: sfcLevyFee, rate: this.convertToPercentage(hkFees.sfcLevyFee) },
              { name: 'FRC Levy Fee', value: frcLevyFee, rate: this.convertToPercentage(hkFees.frcLevyFee) },
              { name: 'HK Stamp Duty', value: hkStampDuty, rate: this.convertToPercentage(hkFees.hkStampDuty) },
              { name: 'Malaysia Stamp Duty', value: malaysiaStampDuty, rate: hkFees.malaysiaStampDutyRate }
            ],
            totalFees: totalFees,
            netTotal: contractValue - totalFees
          }
        ]
      }
    } else if (market === 'US') {
      const usFees = this.feesRate.unitedStates;

      const contractValue = stockInfo.pricePerUnit * stockInfo.numbersOfShares;
      let brokerageFee = contractValue * usFees.brokerageFee;
      if (brokerageFee < usFees.minBrokerageFee) {
        brokerageFee = usFees.minBrokerageFee;
      }

      let regulatoryFee = 0;
      let tradingActivityFee = 0;
      if (stockInfo.transaction === 'Sell') {
        regulatoryFee = stockInfo.numbersOfShares * usFees.regulatoryFee;
        if (regulatoryFee < usFees.minRegulatoryFee) {
          regulatoryFee = usFees.minRegulatoryFee;
        }

        tradingActivityFee = stockInfo.numbersOfShares * usFees.tradingActivityFee;
        if (tradingActivityFee < usFees.minTradingActivityFee) {
          tradingActivityFee = usFees.minTradingActivityFee;
        } else if (tradingActivityFee > usFees.maxTradingActivityFee) {
          tradingActivityFee = usFees.maxTradingActivityFee;
        }
      }

      let settlementFee = stockInfo.numbersOfShares * usFees.settlementFee;
      if(settlementFee < usFees.minSettlementFee) {
        settlementFee = usFees.minSettlementFee;
      }

      const withholdingTax = 0
      const malaysiaStampDuty = (Math.ceil(this.stampDutyCalculation(contractValue * stockInfo.exchangeRate))) / stockInfo.exchangeRate;

      const totalFees = brokerageFee + regulatoryFee + tradingActivityFee + settlementFee + withholdingTax + malaysiaStampDuty;

      if(stockInfo.transaction === 'Buy') {
        this.feesList = [
          {
            marketName: 'United States (US)',
            currency: 'USD',
            contractValue: contractValue,
            feesBreakdown: [
              { name: 'Brokerage Fee', value: brokerageFee, rate: this.convertToPercentage(usFees.brokerageFee) },
              { name: 'Regulatory Fee', value: regulatoryFee, rate: usFees.regulatoryFeeRate },
              { name: 'Trading Activity Fee', value: tradingActivityFee, rate: usFees.tradingActivityRate },
              { name: 'Settlement Fee', value: settlementFee, rate: usFees.settlementFeeRate },
              { name: 'Withholding Tax', value: withholdingTax, rate: this.convertToPercentage(usFees.withholdingTax) },
              { name: 'Malaysia Stamp Duty', value: malaysiaStampDuty, rate: usFees.malaysiaStampDutyRate }
            ],
            totalFees: totalFees,
            netTotal: contractValue + totalFees
          }
        ]
      } else if(stockInfo.transaction === 'Sell') {
        this.feesList = [
          {
            marketName: 'United States (US)',
            currency: 'USD',
            contractValue: contractValue,
            feesBreakdown: [
              { name: 'Brokerage Fee', value: brokerageFee, rate: this.convertToPercentage(usFees.brokerageFee) },
              { name: 'Regulatory Fee', value: regulatoryFee, rate: usFees.regulatoryFeeRate },
              { name: 'Trading Activity Fee', value: tradingActivityFee, rate: usFees.tradingActivityRate },
              { name: 'Settlement Fee', value: settlementFee, rate: usFees.settlementFeeRate },
              { name: 'Withholding Tax', value: withholdingTax, rate: this.convertToPercentage(usFees.withholdingTax) },
              { name: 'Malaysia Stamp Duty', value: malaysiaStampDuty, rate: usFees.malaysiaStampDutyRate }
            ],
            totalFees: totalFees,
            netTotal: contractValue - totalFees
          }
        ]
      }
      
    }

    this.toastService.success({ detail: 'SUCCESS', summary: 'Fees calculated successfully' });
  }

  getExchangeRate() {
    const marketName = this.mplusForm.get('marketName')?.value;
    let currency = 'MYR';

    if (marketName === 'HK') {
      currency = 'HKD'
    }
    if (marketName === 'US') {
      currency = 'USD'
    }

    this.http.get(`https://open.er-api.com/v6/latest/${currency}`)
      .subscribe((data: any) => {
        this.mplusForm.patchValue({ exchangeRate: data.rates.MYR });
      });
  }

  refreshPage() {
    window.location.reload();
  }

  convertToPercentage(value: number): string {
    return `${value * 100}%`;
  }
}
