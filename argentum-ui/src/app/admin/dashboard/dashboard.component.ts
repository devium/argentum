import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {QuantitySales, Statistics} from '../../common/model/statistics';
import {MessageComponent} from '../../common/message/message.component';
import {Product} from '../../common/model/product';
import {Chart} from 'chart.js';
import palette from 'google-palette';
import {StatisticsService} from '../../common/rest-service/statistics.service';
import {formatCurrency} from '../../common/utils';
import {saveAs} from 'file-saver';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  statistics: Statistics;
  products: Map<number, Product> = new Map<number, Product>();

  @ViewChild(MessageComponent, { static: true })
  message: MessageComponent;

  @ViewChild('salesCanvas', { static: true })
  salesCanvas: ElementRef;

  salesChart: Chart;

  salesLabels: string[];
  salesQuantities: number[];
  salesQuantitiesTotal: number;
  salesValues: number[];
  salesValuesTotal: number;

  constructor(private statisticsService: StatisticsService) {
  }

  ngOnInit() {
    this.refresh();
  }

  refresh(): void {
    this.statisticsService.list().subscribe(
      (statistics: Statistics) => {
        this.statistics = statistics;
        this.redrawCharts();
      },
      (error: any) => this.message.error(error)
    );
  }

  redrawCharts() {
    const salesContext = this.salesCanvas.nativeElement.getContext('2d');

    const quantitySalesSorted = this.statistics.quantitySales.sort((qs1: QuantitySales, qs2: QuantitySales) => qs1.quantity - qs2.quantity);
    this.salesQuantities = quantitySalesSorted.map((qs: QuantitySales) => qs.quantity);
    this.salesQuantitiesTotal = this.salesQuantities.reduce((a: number, b: number) => a + b, 0);

    this.salesValues = quantitySalesSorted.map((qs: QuantitySales) => qs.value);
    this.salesValuesTotal = this.salesValues.reduce((a: number, b: number) => a + b, 0);

    this.salesLabels = quantitySalesSorted.map((qs: QuantitySales) => qs.product.name);
    const colorPalette = palette('qualitative', quantitySalesSorted.length).map((hex: string) => '#' + hex);

    this.salesChart = new Chart(salesContext, {
      type: 'doughnut',
      data: {
        datasets: [
          {
            data: this.salesQuantities,
            backgroundColor: colorPalette
          },
          {
            data: this.salesValues,
            backgroundColor: colorPalette
          }
        ]
      },
      options: {
        title: {
          text: 'Product sales by quantity (outer ring) and value (inner ring)',
          display: true
        },
        tooltips: {
          callbacks: {
            label: tooltipModel => {
              if (tooltipModel.datasetIndex === 0) {
                const label = this.salesLabels[tooltipModel.index];
                const value = this.salesQuantities[tooltipModel.index];
                const percentage = value / this.salesQuantitiesTotal;
                return `${label}: ${value} (${formatCurrency(percentage * 100)}%)`;
              } else {
                const label = this.salesLabels[tooltipModel.index];
                const value = this.salesValues[tooltipModel.index];
                const percentage = value / this.salesValuesTotal;
                return `${label}: €${formatCurrency(value)} (${formatCurrency(percentage * 100)}%)`;
              }
            }
          }
        }
      }
    });
  }

  downloadSales(): void {
    const rows = Array(this.salesLabels.length).fill(0).map((_, i) => {
      return [
        this.salesLabels[i],
        this.salesQuantities[i],
        this.salesQuantities[i] / this.salesQuantitiesTotal,
        this.salesValues[i],
        this.salesValues[i] / this.salesValuesTotal
      ].join(',');
    });
    rows.unshift(['Product', 'Quantity', 'Quantity %', 'Value', 'Value %'].join(','));
    const blob = new Blob([rows.join('\n')], {type: 'text/csv'});
    saveAs(blob, 'sales.csv');
  }

}
