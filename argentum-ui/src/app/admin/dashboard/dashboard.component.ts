import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {QuantitySales, Statistics} from '../../common/model/statistics';
import {MessageComponent} from '../../common/message/message.component';
import {Product} from '../../common/model/product';
import {Chart} from 'chart.js';
import palette from 'google-palette';
import {StatisticsService} from '../../common/rest-service/statistics.service';
import {formatCurrency} from '../../common/utils';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  statistics: Statistics;
  products: Map<number, Product> = new Map<number, Product>();

  @ViewChild(MessageComponent)
  message: MessageComponent;

  @ViewChild('salesCanvas')
  salesCanvas: ElementRef;

  salesChart: Chart;

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
    const quantitySalesData = quantitySalesSorted.map((qs: QuantitySales) => qs.quantity);
    const sumQuantitySales = quantitySalesData.reduce((a: number, b: number) => a + b, 0);
    const valueSalesData = quantitySalesSorted.map((qs: QuantitySales) => qs.quantity * qs.product.price);
    const sumValueSales = valueSalesData.reduce((a: number, b: number) => a + b, 0);
    const labels = quantitySalesSorted.map((qs: QuantitySales) => qs.product.name);
    const colorPalette = palette('qualitative', quantitySalesSorted.length).map((hex: string) => '#' + hex);

    this.salesChart = new Chart(salesContext, {
      type: 'doughnut',
      data: {
        datasets: [
          {
            data: quantitySalesData,
            backgroundColor: colorPalette
          },
          {
            data: valueSalesData,
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
                const label = labels[tooltipModel.index];
                const value = quantitySalesData[tooltipModel.index];
                const percentage = value / sumQuantitySales;
                return `${label}: ${value} (${formatCurrency(percentage * 100)}%)`;
              } else {
                const label = labels[tooltipModel.index];
                const value = valueSalesData[tooltipModel.index];
                const percentage = value / sumValueSales;
                return `${label}: €${formatCurrency(value)} (${formatCurrency(percentage * 100)}%)`;
              }
            }
          }
        }
      }
    });
  }

}
