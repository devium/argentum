import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { RestService } from '../../common/rest-service/rest.service';
import { Statistics } from '../../common/model/statistics';
import { MessageComponent } from '../../common/message/message.component';
import { Product } from '../../common/model/product';
import { Chart } from 'chart.js';
import palette from 'google-palette';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  stats: Statistics;
  products: Map<number, Product> = new Map<number, Product>();

  @ViewChild(MessageComponent)
  message: MessageComponent;

  @ViewChild('salesCanvas')
  salesCanvas: ElementRef;

  salesChart: Chart;

  constructor(private restService: RestService) {
  }

  ngOnInit() {
    this.refresh();
  }

  refresh(): void {
    const pStats = this.restService.getStatistics();
    const pProducts = this.restService.getAllProducts();

    Promise.all([pStats, pProducts])
      .then((response: [Statistics, Product[]]) => {
        this.stats = response[0];
        const products = response[1];
        this.products = new Map<number, Product>(products.map(
          (product: Product) => [product.id, product] as [number, Product]
        ));

        this.redrawCharts();
      })
      .catch(reason => this.message.error(reason));
  }

  redrawCharts() {
    const salesContext = this.salesCanvas.nativeElement.getContext('2d');
    const quantitySalesData = this.stats.quantitySales.map(
      (productQuantity: [number, number]) => productQuantity[1]
    );
    const sumQuantitySales = quantitySalesData.reduce((a: number, b: number) => a + b, 0);
    const valueSalesData = this.stats.quantitySales.map(
      (productQuantity: [number, number]) => productQuantity[1] * this.products.get(productQuantity[0]).price
    );
    const sumValueSales = valueSalesData.reduce((a: number, b: number) => a + b, 0);
    const labels = this.stats.quantitySales.map(
      (productQuantity: [number, number]) => this.products.get(productQuantity[0]).name
    );
    const colorPalette = palette('qualitative', this.stats.quantitySales.length).map((hex: string) => '#' + hex);

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
                return `${label}: ${value} (${(percentage * 100).toFixed(1)}%)`;
              } else {
                const label = labels[tooltipModel.index];
                const value = valueSalesData[tooltipModel.index];
                const percentage = value / sumValueSales;
                return `${label}: €${value.toFixed(2)} (${(percentage * 100).toFixed(1)}%)`;
              }
            }
          }
        }
      }
    })
  }

}
